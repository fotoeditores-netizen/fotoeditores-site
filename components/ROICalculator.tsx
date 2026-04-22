"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingDown, TrendingUp, Clock, DollarSign, ArrowRight } from "lucide-react";

// Cost constants (USD)
const COSTS = {
  photographer_per_session: 800,       // avg photographer fee
  photos_per_session: 25,              // avg photos per session
  video_agency_per_video: 350,         // avg agency per video
  fotoeditores_monthly: 99,            // our price
  fotoeditores_photos: 40,             // photos included
  fotoeditores_videos: 10,             // videos included
  hours_traditional_per_photo: 0.5,    // hours to coordinate + edit
  hours_fotoeditores_per_photo: 0.05,  // hours needed with our service
};

function formatCurrency(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export default function ROICalculator() {
  const [photosPerMonth, setPhotosPerMonth] = useState(40);
  const [videosPerMonth, setVideosPerMonth] = useState(8);

  const results = useMemo(() => {
    // Traditional cost
    const photoSessions = Math.ceil(photosPerMonth / COSTS.photos_per_session);
    const traditionalPhotoCost = photoSessions * COSTS.photographer_per_session;
    const traditionalVideoCost = videosPerMonth * COSTS.video_agency_per_video;
    const traditionalTotal = traditionalPhotoCost + traditionalVideoCost;

    // Fotoeditores cost (scale monthly package for volume)
    const extraPhotoPackages = Math.max(0, Math.ceil((photosPerMonth - COSTS.fotoeditores_photos) / 20));
    const extraVideoPackages = Math.max(0, Math.ceil((videosPerMonth - COSTS.fotoeditores_videos) / 5));
    const fotoedTotal = COSTS.fotoeditores_monthly + (extraPhotoPackages * 49) + (extraVideoPackages * 39);

    // Savings
    const moneySaved = Math.max(0, traditionalTotal - fotoedTotal);
    const percentSaved = traditionalTotal > 0 ? Math.round((moneySaved / traditionalTotal) * 100) : 0;
    const annualSavings = moneySaved * 12;

    // Time savings
    const traditionalHours = (photosPerMonth * COSTS.hours_traditional_per_photo) +
      (videosPerMonth * 3);
    const fotoeditoresHours = (photosPerMonth * COSTS.hours_fotoeditores_per_photo) +
      (videosPerMonth * 0.5);
    const hoursSaved = Math.max(0, traditionalHours - fotoeditoresHours);

    return {
      traditionalTotal,
      fotoedTotal,
      moneySaved,
      percentSaved,
      annualSavings,
      hoursSaved: Math.round(hoursSaved),
    };
  }, [photosPerMonth, videosPerMonth]);

  return (
    <section id="roi" className="py-24 relative overflow-hidden" style={{ background: "#050D1A" }}>
      {/* Background accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #0066FF, #00D4FF, transparent)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,102,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-5"
            style={{
              color: "#00D4FF",
              borderColor: "rgba(0,212,255,0.3)",
              background: "rgba(0,212,255,0.06)",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            <DollarSign size={13} />
            Calculadora de ROI
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            ¿Cuánto estás perdiendo
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              sin gestión IA?
            </span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}
          >
            Mueve los sliders según el volumen de contenido que necesitas y
            descubre en tiempo real cuánto ahorras con Fotoeditores.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Sliders */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl p-8"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3
              className="text-lg font-bold text-white mb-8"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Tu volumen mensual de contenido
            </h3>

            {/* Photos slider */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <label
                  className="text-sm font-semibold"
                  style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-montserrat)" }}
                >
                  📸 Fotos de producto por mes
                </label>
                <span
                  className="text-2xl font-extrabold"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {photosPerMonth}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={photosPerMonth}
                onChange={(e) => setPhotosPerMonth(Number(e.target.value))}
                className="w-full"
                aria-label="Fotos por mes"
              />
              <div
                className="flex justify-between text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-inter)" }}
              >
                <span>10</span>
                <span>100</span>
                <span>200</span>
              </div>
            </div>

            {/* Videos slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label
                  className="text-sm font-semibold"
                  style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-montserrat)" }}
                >
                  🎬 Videos/Reels por mes
                </label>
                <span
                  className="text-2xl font-extrabold"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {videosPerMonth}
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={40}
                step={1}
                value={videosPerMonth}
                onChange={(e) => setVideosPerMonth(Number(e.target.value))}
                className="w-full"
                aria-label="Videos por mes"
              />
              <div
                className="flex justify-between text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-inter)" }}
              >
                <span>2</span>
                <span>20</span>
                <span>40</span>
              </div>
            </div>

            {/* Cost breakdown traditional */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,77,109,0.06)",
                border: "1px solid rgba(255,77,109,0.15)",
              }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "#FF4D6D", fontFamily: "var(--font-montserrat)" }}
              >
                Costo tradicional (agencia/fotógrafo)
              </p>
              <p
                className="text-3xl font-extrabold"
                style={{ color: "#FF4D6D", fontFamily: "var(--font-montserrat)" }}
              >
                {formatCurrency(results.traditionalTotal)}
                <span className="text-base font-normal opacity-60"> /mes</span>
              </p>
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {/* Main savings card */}
            <div
              className="rounded-2xl p-8 flex-1"
              style={{
                background: "linear-gradient(135deg, rgba(0,102,255,0.12) 0%, rgba(0,212,255,0.06) 100%)",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
            >
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: "#00D4FF", fontFamily: "var(--font-montserrat)" }}
              >
                Con Fotoeditores pagas solo
              </p>
              <p
                className="text-5xl font-extrabold text-white mb-1"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {formatCurrency(results.fotoedTotal)}
                <span className="text-xl font-normal text-white/40"> /mes</span>
              </p>
              <p
                className="text-sm mb-6"
                style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
              >
                gestión experta incluida
              </p>

              <div
                className="h-px mb-6"
                style={{ background: "rgba(0,212,255,0.15)" }}
              />

              {/* Savings highlight */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,212,255,0.12)" }}
                >
                  <TrendingDown size={22} style={{ color: "#00D4FF" }} />
                </div>
                <div>
                  <p
                    className="text-3xl font-extrabold"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {formatCurrency(results.moneySaved)}
                    <span
                      className="text-lg ml-2"
                      style={{ color: "#00D4FF", WebkitTextFillColor: "#00D4FF" }}
                    >
                      ({results.percentSaved}% menos)
                    </span>
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
                  >
                    que ahorras cada mes
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-xl p-5"
                style={{
                  background: "rgba(255,184,0,0.06)",
                  border: "1px solid rgba(255,184,0,0.15)",
                }}
              >
                <TrendingUp size={18} style={{ color: "#FFB800" }} className="mb-3" />
                <p
                  className="text-2xl font-extrabold"
                  style={{ color: "#FFB800", fontFamily: "var(--font-montserrat)" }}
                >
                  {formatCurrency(results.annualSavings)}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
                >
                  ahorro anual proyectado
                </p>
              </div>

              <div
                className="rounded-xl p-5"
                style={{
                  background: "rgba(0,102,255,0.08)",
                  border: "1px solid rgba(0,102,255,0.2)",
                }}
              >
                <Clock size={18} style={{ color: "#0066FF" }} className="mb-3" />
                <p
                  className="text-2xl font-extrabold"
                  style={{ color: "#0066FF", fontFamily: "var(--font-montserrat)" }}
                >
                  {results.hoursSaved}h
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
                >
                  horas liberadas al mes
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/contacto"
              className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #0066FF, #00D4FF)",
                fontFamily: "var(--font-montserrat)",
                boxShadow: "0 8px 30px rgba(0,102,255,0.35)",
              }}
            >
              Quiero estos resultados
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <p
          className="text-center text-xs mt-8"
          style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-inter)" }}
        >
          * Estimaciones basadas en tarifas promedio del mercado colombiano y latinoamericano.
          Resultados reales pueden variar según el tipo de proyecto y alcance.
        </p>
      </div>
    </section>
  );
}
