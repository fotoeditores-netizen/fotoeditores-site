"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  ChevronDown,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Tipado para la Web Speech API (no incluida por defecto en TypeScript)
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "¡Hola! Soy el Asesor Virtual de Fotoeditores. Estoy aquí para mostrarte cómo podemos multiplicar tu producción de contenido con IA, reduciendo costos hasta un 55%. ¿En qué puedo ayudarte hoy?",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrl = useRef<string | null>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Foco en el input al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasUnread(false);
    }
  }, [isOpen]);

  // Indicador de mensaje no leído cuando está cerrado
  useEffect(() => {
    if (!isOpen && messages.length > 1) setHasUnread(true);
  }, [messages, isOpen]);

  // Limpiar blob URL al desmontar
  useEffect(() => {
    return () => {
      if (audioBlobUrl.current) URL.revokeObjectURL(audioBlobUrl.current);
    };
  }, []);

  /* ── Reconocimiento de voz ── */
  const startRecording = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.");
      return;
    }
    const recognition = new SR();
    recognition.lang = "es-CO";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    isRecording ? stopRecording() : startRecording();
  }, [isRecording, startRecording, stopRecording]);

  /* ── Envío de mensajes ── */
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 1. Obtener respuesta del chat
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      const { response } = await chatRes.json();
      const assistantMsg: Message = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMsg]);

      // 2. Sintetizar voz con ElevenLabs (falla silenciosamente si no hay API key)
      if (!isMuted) {
        try {
          const ttsRes = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: response }),
          });

          if (ttsRes.ok && ttsRes.status !== 204) {
            const blob = await ttsRes.blob();
            if (audioBlobUrl.current) URL.revokeObjectURL(audioBlobUrl.current);
            audioBlobUrl.current = URL.createObjectURL(blob);

            if (!audioRef.current) audioRef.current = new Audio();
            audioRef.current.src = audioBlobUrl.current;
            audioRef.current.play().catch(() => {});
          }
        } catch {
          // TTS falla silenciosamente — el chat sigue funcionando
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Disculpa, tuve un problema técnico. Escríbenos directamente a editorgeneral@fotoeditores.com",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isMuted, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ── Render ── */
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="w-[340px] sm:w-[380px] rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: "#080F1E",
              border: "1px solid rgba(0,212,255,0.18)",
              boxShadow:
                "0 30px 70px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,102,255,0.08)",
              maxHeight: "min(560px, calc(100vh - 120px))",
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                background: "#0A1628",
                borderBottom: "1px solid rgba(0,212,255,0.18)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                    boxShadow: "0 0 16px rgba(0,212,255,0.4)",
                  }}
                >
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <p
                    className="text-white text-sm font-bold leading-tight"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    Asesor Virtual
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span
                      className="text-xs"
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      Fotoeditores IA · En línea
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Toggle voz */}
                <button
                  onClick={() => {
                    setIsMuted((m) => !m);
                    if (!isMuted) audioRef.current?.pause();
                  }}
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                  title={isMuted ? "Activar voz" : "Silenciar voz"}
                  style={{ color: isMuted ? "rgba(255,255,255,0.25)" : "#00D4FF" }}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                {/* Minimizar */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  <ChevronDown size={17} />
                </button>
              </div>
            </div>

            {/* ── Mensajes ── */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#0066FF #080F1E" }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                      style={{
                        background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                      }}
                    >
                      <Bot size={12} className="text-white" />
                    </div>
                  )}
                  <div
                    className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={{
                      fontFamily: "var(--font-inter)",
                      ...(msg.role === "user"
                        ? {
                            background: "linear-gradient(135deg, #0066FF, #004FCC)",
                            color: "#FFFFFF",
                            borderBottomRightRadius: "4px",
                          }
                        : {
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.88)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderBottomLeftRadius: "4px",
                          }),
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Indicador de escritura */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #0066FF, #00D4FF)" }}
                  >
                    <Bot size={12} className="text-white" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: "#00D4FF",
                          animation: "bounce 1.2s infinite",
                          animationDelay: `${i * 0.2}s`,
                          display: "inline-block",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ── */}
            <div
              className="px-3 py-3 flex items-center gap-2 flex-shrink-0"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(0,0,0,0.25)",
              }}
            >
              {/* Micrófono */}
              <button
                onClick={toggleRecording}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                title={isRecording ? "Detener grabación" : "Hablar con el asesor"}
                style={{
                  background: isRecording
                    ? "rgba(255,77,109,0.2)"
                    : "rgba(0,102,255,0.12)",
                  border: `1px solid ${isRecording ? "rgba(255,77,109,0.5)" : "rgba(0,102,255,0.25)"}`,
                  color: isRecording ? "#FF4D6D" : "#0066FF",
                  boxShadow: isRecording
                    ? "0 0 12px rgba(255,77,109,0.3)"
                    : "none",
                }}
              >
                {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
              </button>

              {/* Campo de texto */}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isRecording ? "Escuchando..." : "Escribe tu consulta..."
                }
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-30 disabled:opacity-50"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-inter)",
                }}
              />

              {/* Enviar */}
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                style={{
                  background: "#0066FF",
                  boxShadow: input.trim()
                    ? "0 4px 14px rgba(0,102,255,0.5)"
                    : "none",
                }}
              >
                <Send size={14} className="text-white" />
              </button>
            </div>

            {/* ── Footer ── */}
            <div
              className="py-1.5 text-center"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.04)",
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <p
                className="text-xs"
                style={{
                  color: "rgba(255,255,255,0.18)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Fotoeditores IA · 20 años de experiencia editorial
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Botón flotante ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((o) => !o)}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
        style={{
          background: "linear-gradient(135deg, #0066FF, #00D4FF)",
          boxShadow: "0 8px 30px rgba(0,102,255,0.55)",
        }}
        aria-label="Abrir asesor virtual"
      >
        {/* Anillo pulsante */}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              background: "linear-gradient(135deg, #0066FF, #00D4FF)",
              animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
        )}

        {/* Indicador de mensaje no leído */}
        {hasUnread && !isOpen && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "#FF4D6D", fontFamily: "var(--font-montserrat)" }}
          >
            1
          </span>
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} className="text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Bot size={24} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
