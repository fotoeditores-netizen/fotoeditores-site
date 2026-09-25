"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Send } from "lucide-react";
import FileUploader from "@/components/pedido/FileUploader";
import Turnstile from "@/components/pedido/Turnstile";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ChoiceCard, Field, Input, Textarea } from "@/components/ui/Field";
import { GOALS, USAGES } from "@/lib/orders/brief";
import { api, ApiError, type PublicOrder } from "@/lib/orders/client";

/*
 * Asistente de pedido (Fase 3): 1 paquete → 2 archivos → 3 detalles → 4 confirmar.
 * El pedido se crea en borrador al pasar del paso 1 (con Turnstile). El token
 * queda en la URL (?pedido=) y en localStorage; lo escrito en el paso 3 se
 * guarda en localStorage: una recarga no pierde nada.
 */

export type WizardPackage = {
  slug: string;
  name: string;
  description: string;
  price_usd: number;
  max_files: number;
  max_file_mb: number;
  accepts_video: boolean;
  turnaround_label: string;
  revisions_included: number;
  segment: "producto" | "recuerdos" | "ambos";
};

type FormState = {
  goals: string[];
  usage: string;
  references: string;
  notes: string;
  externalLink: string;
  name: string;
  email: string;
  whatsapp: string;
  consent: boolean;
};

const EMPTY_FORM: FormState = {
  goals: [],
  usage: "",
  references: "",
  notes: "",
  externalLink: "",
  name: "",
  email: "",
  whatsapp: "",
  consent: false,
};

const STEPS = ["Paquete", "Archivos", "Detalles", "Confirmar"] as const;
const TOKEN_KEY = "fe_pedido";
const formKey = (token: string) => `fe_pedido_form:${token}`;

const store = {
  get(key: string) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* modo privado o almacenamiento lleno: se sigue sin guardar */
    }
  },
  remove(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* idem */
    }
  },
};

const usd = (n: number) => `USD ${Number.isInteger(n) ? n : n.toFixed(2)}`;

export default function OrderWizard({
  packages,
  initialSlug,
  turnstileSiteKey,
  quoteWhatsappHref,
  helpWhatsappHref,
  paymentsEnabled,
  fxRate,
}: {
  packages: WizardPackage[];
  initialSlug: string | null;
  turnstileSiteKey: string;
  quoteWhatsappHref: string;
  helpWhatsappHref: string;
  /** Wompi configurado en este ambiente: el paso 4 lleva directo al pago. */
  paymentsEnabled: boolean;
  /** TRM del día para mostrar el valor aproximado en pesos (null si no hay). */
  fxRate: number | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [slug, setSlug] = useState<string | null>(initialSlug && packages.some((p) => p.slug === initialSlug) ? initialSlug : null);
  const [token, setToken] = useState<string | null>(null);
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0); // los tokens son de un solo uso: se reinicia el widget tras un fallo
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [restoring, setRestoring] = useState(true);

  const selected = packages.find((p) => p.slug === slug) ?? null;

  // ── Retomar un borrador (URL ?pedido= o localStorage) ─────────────────────
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("pedido");
    const saved = fromUrl ?? store.get(TOKEN_KEY);
    if (!saved) {
      setRestoring(false);
      return;
    }
    api<PublicOrder>(`/api/orders/${saved}`)
      .then((existing) => {
        if (existing.status !== "draft") {
          store.remove(TOKEN_KEY);
          router.replace(`/pedido/${saved}`);
          return;
        }
        setToken(saved);
        setOrder(existing);
        setSlug(existing.package.slug);
        const savedForm = store.get(formKey(saved));
        if (savedForm) {
          try {
            const parsed = JSON.parse(savedForm) as { form?: FormState; step?: number };
            if (parsed.form) setForm({ ...EMPTY_FORM, ...parsed.form });
            if (typeof parsed.step === "number") setStep(Math.min(Math.max(parsed.step, 1), 3));
            else setStep(1);
          } catch {
            setStep(1);
          }
        } else setStep(1);
      })
      .catch(() => store.remove(TOKEN_KEY))
      .finally(() => setRestoring(false));
  }, [router]);

  // Guarda lo escrito y el paso actual.
  useEffect(() => {
    if (token) store.set(formKey(token), JSON.stringify({ form, step }));
  }, [token, form, step]);

  // Sube al inicio del asistente al cambiar de paso (en móvil el botón queda abajo).
  useEffect(() => {
    if (!restoring) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, restoring]);

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!Object.keys(prev).some((k) => k.endsWith(key))) return prev;
      const next = { ...prev };
      for (const k of Object.keys(next)) if (k.endsWith(key)) delete next[k];
      return next;
    });
  }, []);

  const goals = useMemo(() => {
    const segment = order?.package.segment ?? selected?.segment ?? "ambos";
    if (segment === "ambos") {
      const seen = new Set<string>();
      return [...GOALS.recuerdos, ...GOALS.producto].filter((g) => (seen.has(g.id) ? false : (seen.add(g.id), true)));
    }
    return [...GOALS[segment]];
  }, [order, selected]);

  // ── Acciones ────────────────────────────────────────────────────────────────
  async function continueFromPackage() {
    if (!selected) return setError("Elige un paquete para continuar.");
    setBusy(true);
    setError(null);
    try {
      if (!token) {
        if (!turnstileToken) {
          setError("Estamos verificando tu conexión, espera un segundo e intenta de nuevo.");
          return;
        }
        const draft = await api<{ code: string; public_token: string }>("/api/orders", {
          method: "POST",
          json: { packageSlug: selected.slug, turnstileToken },
        });
        store.set(TOKEN_KEY, draft.public_token);
        window.history.replaceState(null, "", `/pedido/nuevo?pedido=${draft.public_token}`);
        setToken(draft.public_token);
        setOrder(await api<PublicOrder>(`/api/orders/${draft.public_token}`));
      } else if (order && order.package.slug !== selected.slug) {
        setOrder(await api<PublicOrder>(`/api/orders/${token}`, { method: "PATCH", json: { packageSlug: selected.slug } }));
      }
      setStep(1);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No pudimos crear tu pedido. Intenta de nuevo.");
      setTurnstileToken(null);
      setTurnstileKey((k) => k + 1);
    } finally {
      setBusy(false);
    }
  }

  function continueFromFiles() {
    if (!order) return;
    if (order.files.length === 0 && !form.externalLink.trim()) {
      return setError("Sube al menos un archivo o pega un enlace con tus archivos.");
    }
    setError(null);
    setStep(2);
  }

  function continueFromDetails() {
    const errs: Record<string, string> = {};
    if (form.goals.length === 0) errs["brief.goals"] = "Elige al menos una opción";
    if (!form.usage) errs["brief.usage"] = "Elige para qué lo usarás";
    if (form.name.trim().length < 2) errs["customer.name"] = "Escribe tu nombre";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs["customer.email"] = "Revisa tu correo";
    if (form.whatsapp.replace(/\D/g, "").length < 10) errs["customer.whatsapp"] = "Escribe tu WhatsApp con indicativo";
    if (!form.consent) errs.consent = "Debes aceptar para continuar";
    setFieldErrors(errs);
    if (Object.keys(errs).length) return setError("Revisa los campos marcados.");
    setError(null);
    setStep(3);
  }

  async function submit() {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/api/orders/${token}/submit`, {
        method: "POST",
        json: {
          brief: {
            goals: form.goals,
            usage: form.usage,
            references: form.references,
            notes: form.notes,
            externalLink: form.externalLink.trim(),
          },
          customer: { name: form.name, email: form.email, whatsapp: form.whatsapp },
          consent: form.consent,
        },
      });
      store.remove(TOKEN_KEY);
      store.remove(formKey(token));
      if (paymentsEnabled) {
        // Pedido guardado: directo al pago. Si el pago no se puede iniciar (p. ej. sin
        // tasa del dólar), la página del pedido ofrece reintentar o seguir por WhatsApp.
        try {
          const { url } = await api<{ url: string }>(`/api/orders/${token}/checkout`, { method: "POST" });
          window.location.assign(url);
          return;
        } catch {
          /* se cae a la página del pedido */
        }
      }
      router.push(`/pedido/${token}`);
    } catch (e) {
      if (e instanceof ApiError && e.fields) {
        setFieldErrors(e.fields);
        setStep(e.fields.files ? 1 : 2);
      }
      setError(e instanceof ApiError ? e.message : "No pudimos enviar tu pedido. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  if (restoring) {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-white/60">
        <Loader2 className="animate-spin" size={20} /> Cargando tu pedido…
      </div>
    );
  }

  const limits = order?.package;

  return (
    <div>
      {/* Progreso */}
      <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Pasos del pedido">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${i <= step ? "bg-gradient-energy" : "bg-white/10"}`} />
            <span
              className={`mt-2 flex items-center gap-1 text-[11px] sm:text-xs font-semibold ${i === step ? "text-white" : "text-white/45"}`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {i < step && <Check size={12} className="text-cyan-digital" />}
              {i + 1}. {label}
            </span>
          </li>
        ))}
      </ol>

      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-coral/40 bg-coral/10 p-4 text-sm text-white/90">
          {error}
        </p>
      )}

      {/* ── Paso 1: paquete ─────────────────────────────────────────── */}
      {step === 0 && (
        <section aria-labelledby="paso-1">
          <h2 id="paso-1" className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
            ¿Qué necesitas?
          </h2>
          <p className="text-white/60 mb-6">Elige el paquete. Podrás hablar con tu editor por WhatsApp en todo momento.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup">
            {packages.map((p) => (
              <ChoiceCard
                key={p.slug}
                type="radio"
                name="paquete"
                value={p.slug}
                checked={slug === p.slug}
                onChange={() => setSlug(p.slug)}
                label={
                  <span className="flex items-baseline justify-between gap-3">
                    {p.name}
                    <span className="gradient-text font-extrabold">{usd(p.price_usd)}</span>
                  </span>
                }
                description={`${p.description} · ${p.max_files === 1 ? "1 archivo" : `hasta ${p.max_files} archivos`} · entrega en ${p.turnaround_label}`}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-white/55">
            ¿Quieres algo a la medida o crear desde cero?{" "}
            <a href={quoteWhatsappHref} target="_blank" rel="noopener noreferrer" className="text-cyan-digital underline">
              Cotízalo por WhatsApp
            </a>
            .
          </p>

          {!token && (
            <div className="mt-6">
              <Turnstile key={turnstileKey} siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button size="lg" onClick={continueFromPackage} disabled={!selected || busy || (!token && !turnstileToken)}>
              {busy ? <Loader2 className="animate-spin" size={18} /> : null}
              Continuar
              <ArrowRight size={18} />
            </Button>
          </div>
        </section>
      )}

      {/* ── Paso 2: archivos ────────────────────────────────────────── */}
      {step === 1 && token && limits && order && (
        <section aria-labelledby="paso-2">
          <h2 id="paso-2" className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
            Sube tus {limits.accepts_video ? "fotos o videos" : "fotos"}
          </h2>
          <p className="text-white/60 mb-6">
            Pedido <strong className="text-white">{order.code}</strong> · {limits.name}. Sirven fotos de celular, escaneos o
            fotos de fotos impresas.
          </p>
          <FileUploader
            token={token}
            limits={limits}
            files={order.files}
            onFilesChange={(files) => setOrder((prev) => (prev ? { ...prev, files } : prev))}
            onBusyChange={setUploading}
          />
          <div className="mt-6">
            <Field
              id="externalLink"
              label="¿Archivos muy pesados? Pega un enlace"
              hint="Google Drive, WeTransfer, Dropbox… Asegúrate de que el enlace sea público o compartido."
              error={fieldErrors["brief.externalLink"]}
            >
              <Input
                id="externalLink"
                type="url"
                inputMode="url"
                placeholder="https://drive.google.com/…"
                value={form.externalLink}
                onChange={(e) => update("externalLink", e.target.value)}
                error={fieldErrors["brief.externalLink"]}
              />
            </Field>
          </div>
          <div className="mt-8 flex justify-between gap-3">
            <Button variant="secondary" onClick={() => setStep(0)} disabled={uploading}>
              <ArrowLeft size={18} /> Atrás
            </Button>
            <Button size="lg" onClick={continueFromFiles} disabled={uploading}>
              {uploading ? "Subiendo…" : "Continuar"}
              <ArrowRight size={18} />
            </Button>
          </div>
        </section>
      )}

      {/* ── Paso 3: detalles ────────────────────────────────────────── */}
      {step === 2 && (
        <section aria-labelledby="paso-3" className="space-y-8">
          <div>
            <h2 id="paso-3" className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
              Cuéntanos qué necesitas
            </h2>
            <p className="text-white/60">No necesitas saber de fotografía: elige lo que quieres lograr y tu editor se encarga.</p>
          </div>

          <fieldset>
            <legend className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/55" style={{ fontFamily: "var(--font-montserrat)" }}>
              ¿Qué quieres lograr? <span className="text-cyan-digital">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goals.map((g) => (
                <ChoiceCard
                  key={g.id}
                  label={g.label}
                  checked={form.goals.includes(g.id)}
                  onChange={(e) =>
                    update("goals", e.target.checked ? [...form.goals, g.id] : form.goals.filter((x) => x !== g.id))
                  }
                />
              ))}
            </div>
            {fieldErrors["brief.goals"] && <p className="mt-2 text-xs text-coral">{fieldErrors["brief.goals"]}</p>}
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/55" style={{ fontFamily: "var(--font-montserrat)" }}>
              ¿Para qué lo usarás? <span className="text-cyan-digital">*</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {USAGES.map((u) => (
                <ChoiceCard
                  key={u.id}
                  type="radio"
                  name="usage"
                  label={u.label}
                  checked={form.usage === u.id}
                  onChange={() => update("usage", u.id)}
                  className="py-3"
                />
              ))}
            </div>
            {fieldErrors["brief.usage"] && <p className="mt-2 text-xs text-coral">{fieldErrors["brief.usage"]}</p>}
          </fieldset>

          <Field id="references" label="Referencias (opcional)" hint="Enlaces o descripción de un estilo que te guste." error={fieldErrors["brief.references"]}>
            <Textarea id="references" rows={2} maxLength={1000} value={form.references} onChange={(e) => update("references", e.target.value)} />
          </Field>

          <Field id="notes" label="Algo más que debamos saber (opcional)" error={fieldErrors["brief.notes"]}>
            <Textarea
              id="notes"
              rows={3}
              maxLength={2000}
              placeholder="Ej.: es la foto de la boda de mis abuelos, quiero que se vea nítida y a color."
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="name" label="Tu nombre" required error={fieldErrors["customer.name"]}>
              <Input id="name" autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} error={fieldErrors["customer.name"]} />
            </Field>
            <Field id="whatsapp" label="WhatsApp" required hint="Con indicativo, ej. +57 300 123 4567" error={fieldErrors["customer.whatsapp"]}>
              <Input
                id="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+57 300 123 4567"
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                error={fieldErrors["customer.whatsapp"]}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field id="email" label="Correo" required error={fieldErrors["customer.email"]}>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  error={fieldErrors["customer.email"]}
                />
              </Field>
            </div>
          </div>

          <div>
            <label className="flex items-start gap-3 text-sm text-white/75 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-[#0066FF]"
                checked={form.consent}
                onChange={(e) => update("consent", e.target.checked)}
                aria-invalid={fieldErrors.consent ? true : undefined}
              />
              <span>
                Acepto los{" "}
                <a href="/terminos" target="_blank" className="text-cyan-digital underline">
                  términos y condiciones
                </a>{" "}
                y autorizo a Fotoeditores a tratar mis datos personales y las imágenes que envío para realizar este
                pedido, según la{" "}
                <a href="/privacidad" target="_blank" className="text-cyan-digital underline">
                  política de tratamiento de datos
                </a>
                . <span className="text-cyan-digital">*</span>
              </span>
            </label>
            {fieldErrors.consent && <p className="mt-2 text-xs text-coral">{fieldErrors.consent}</p>}
          </div>

          <div className="flex justify-between gap-3">
            <Button variant="secondary" onClick={() => setStep(1)}>
              <ArrowLeft size={18} /> Atrás
            </Button>
            <Button size="lg" onClick={continueFromDetails}>
              Revisar pedido
              <ArrowRight size={18} />
            </Button>
          </div>
        </section>
      )}

      {/* ── Paso 4: confirmar ───────────────────────────────────────── */}
      {step === 3 && order && (
        <section aria-labelledby="paso-4">
          <h2 id="paso-4" className="text-2xl font-extrabold text-white mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
            Revisa tu pedido
          </h2>
          <dl className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] text-sm">
            {[
              ["Paquete", `${order.package.name} · ${usd(order.amount_usd)}`],
              [
                "Archivos",
                `${order.files.length} subido${order.files.length === 1 ? "" : "s"}${form.externalLink.trim() ? " + enlace externo" : ""}`,
              ],
              ["Quieres", form.goals.map((id) => goals.find((g) => g.id === id)?.label ?? id).join(", ")],
              ["Para", USAGES.find((u) => u.id === form.usage)?.label ?? ""],
              ["Contacto", `${form.name} · ${form.whatsapp} · ${form.email}`],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-3 p-4">
                <dt className="text-white/50">{k}</dt>
                <dd className="text-white break-words">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm text-white/85">
            <p className="flex items-baseline justify-between gap-3">
              <span>Total</span>
              <strong className="text-lg text-white">{usd(order.amount_usd)}</strong>
            </p>
            {paymentsEnabled && fxRate && (
              <p className="mt-1 text-white/70">
                Pagas en pesos: aprox. <strong className="text-white">COP {Math.ceil(order.amount_usd * fxRate).toLocaleString("es-CO")}</strong>{" "}
                (TRM del día). Verás el valor exacto antes de confirmar el pago.
              </p>
            )}
            <p className="mt-2 text-white/70">
              {paymentsEnabled
                ? "Al continuar vas al pago seguro de Wompi: tarjeta, PSE, Nequi o Bancolombia."
                : "Al enviar, tu editor revisa el material y te escribe por WhatsApp para coordinar el pago y empezar."}
            </p>
          </div>
          <div className="mt-8 flex justify-between gap-3">
            <Button variant="secondary" onClick={() => setStep(2)} disabled={busy}>
              <ArrowLeft size={18} /> Atrás
            </Button>
            <Button size="lg" onClick={submit} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {paymentsEnabled ? "Enviar y pagar" : "Enviar pedido"}
            </Button>
          </div>
        </section>
      )}

      <p className="mt-10 text-center text-sm text-white/50">
        ¿Dudas?{" "}
        <ButtonLink href={helpWhatsappHref} variant="secondary" className="!inline-flex !px-3 !py-1.5 text-xs">
          <WhatsAppIcon size={14} /> Escríbenos
        </ButtonLink>
      </p>
    </div>
  );
}
