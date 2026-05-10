"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Ruler, Factory, Truck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Keşif & Tasarım",
    tag: "Ücretsiz",
    desc: "Ücretsiz keşif ziyaretimizde ihtiyaçlarınızı analiz eder, ölçüm alır ve size özel tasarım dosyası hazırlarız.",
    color: "from-amber-500/10 to-transparent",
  },
  {
    number: "02",
    icon: Ruler,
    title: "Proje Geliştirme",
    tag: "3 İş Günü",
    desc: "Teknik çizimler, malzeme seçimi ve fiyat teklifini 3 iş günü içinde teslim ederiz. Onayınızla üretime geçeriz.",
    color: "from-yellow-500/10 to-transparent",
  },
  {
    number: "03",
    icon: Factory,
    title: "CNC Üretim",
    tag: "Entegre Tesis",
    desc: "Antalya tesisimizde CNC freze, boyahane ve demir hane süreçleri entegre yönetilerek üretim tamamlanır.",
    color: "from-orange-500/10 to-transparent",
  },
  {
    number: "04",
    icon: Truck,
    title: "Teslimat & Montaj",
    tag: "Tüm Türkiye",
    desc: "Profesyonel montaj ekibimiz tüm Türkiye ve yurt dışına kurulum gerçekleştirir. Garanti kapsamındayız.",
    color: "from-amber-400/10 to-transparent",
  },
];

export function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── Header ── */
    gsap.from(".proc-badge, .proc-title, .proc-sub", {
      y: 25, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
    });

    if (!reduced) {
      /* ── Desktop: animated line (scrub) ── */
      gsap.fromTo(
        ".proc-line-fill",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: ".proc-desktop",
            start: "top 65%",
            end: "bottom 55%",
            scrub: 0.8,
          },
        }
      );

      /* ── Desktop: cards stagger ── */
      gsap.from(".proc-card", {
        y: 55, opacity: 0, duration: 0.75, stagger: 0.14, ease: "power3.out",
        scrollTrigger: { trigger: ".proc-desktop", start: "top 75%" },
      });

      /* ── Desktop: number watermarks scale in ── */
      gsap.from(".proc-watermark", {
        scale: 1.4, opacity: 0, duration: 1, stagger: 0.14, ease: "expo.out",
        scrollTrigger: { trigger: ".proc-desktop", start: "top 75%" },
      });

      /* ── Mobile: vertical fill ── */
      gsap.fromTo(
        ".proc-vline-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: ".proc-mobile",
            start: "top 60%",
            end: "bottom 70%",
            scrub: 0.8,
          },
        }
      );

      /* ── Mobile: steps slide in from right ── */
      gsap.from(".proc-mobile-step", {
        x: 40, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ".proc-mobile", start: "top 75%" },
      });
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(212,168,83,0.04) 0%, transparent 65%)" }}
      />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14 sm:mb-20 space-y-4">
          <div className="proc-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase"
            style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}>
            Nasıl Çalışıyoruz
          </div>
          <h2 className="proc-title text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
            Projeden{" "}
            <span style={{
              backgroundImage: "linear-gradient(120deg,#c8973a 0%,#f0c97a 50%,#c8973a 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Teslimata
            </span>
          </h2>
          <p className="proc-sub text-sm leading-relaxed max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
            4 adımda hayalinizdeki mobilyayı gerçeğe dönüştürüyoruz.
          </p>
        </div>

        {/* ══════════════════════════════════════
            DESKTOP horizontal timeline
        ══════════════════════════════════════ */}
        <div className="proc-desktop hidden lg:block relative">

          {/* Track line (faded base) */}
          <div
            className="absolute top-[56px] left-[12.5%] right-[12.5%] h-px"
            style={{ background: "rgba(212,168,83,0.1)" }}
          >
            {/* Animated fill */}
            <div
              className="proc-line-fill absolute inset-0"
              style={{ background: "linear-gradient(90deg,#D4A853,rgba(212,168,83,0.4))", transformOrigin: "left" }}
            />
          </div>

          {/* Step dots on the line */}
          {steps.map((_, i) => (
            <div
              key={i}
              className="absolute top-[48px] w-4 h-4 rounded-full z-10 border-2"
              style={{
                left: `calc(12.5% + ${i * 25}% + 10%)`,
                background: "#09090b",
                borderColor: "#D4A853",
                boxShadow: "0 0 8px rgba(212,168,83,0.4)",
              }}
            />
          ))}

          {/* Cards */}
          <div className="grid grid-cols-4 gap-5 mt-16">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeStep === i;

              return (
                <motion.div
                  key={i}
                  className="proc-card relative overflow-hidden rounded-2xl flex flex-col p-7 cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.028)",
                    border: `1px solid ${isActive ? "rgba(212,168,83,0.35)" : "rgba(212,168,83,0.1)"}`,
                    boxShadow: isActive ? "0 20px 50px rgba(212,168,83,0.08), inset 0 1px 0 rgba(255,255,255,0.06)" : "inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  onHoverStart={() => setActiveStep(i)}
                  onHoverEnd={() => setActiveStep(null)}
                >
                  {/* Watermark number */}
                  <span
                    className="proc-watermark absolute -bottom-2 -right-1 font-bold leading-none select-none pointer-events-none"
                    style={{ fontSize: "7rem", color: "rgba(212,168,83,0.06)", letterSpacing: "-0.05em", lineHeight: 0.85 }}
                  >
                    {step.number}
                  </span>

                  {/* Top: tag */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase"
                      style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}
                    >
                      {step.tag}
                    </span>
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: "rgba(212,168,83,0.35)" }}>
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      background: isActive ? "rgba(212,168,83,0.18)" : "rgba(212,168,83,0.09)",
                      border: "1px solid rgba(212,168,83,0.25)",
                    }}
                    animate={{ rotate: isActive ? [0, -8, 8, 0] : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#D4A853" }} />
                  </motion.div>

                  {/* Content */}
                  <h3
                    className="text-base font-bold mb-2 transition-colors duration-300"
                    style={{ color: isActive ? "#D4A853" : "rgba(255,255,255,0.88)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
                    {step.desc}
                  </p>

                  {/* Active glow bottom bar */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: "linear-gradient(90deg, #D4A853, transparent)" }}
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════
            MOBILE vertical timeline
        ══════════════════════════════════════ */}
        <div className="proc-mobile lg:hidden relative pl-12">

          {/* Vertical base line */}
          <div
            className="absolute left-4 top-3 bottom-3 w-px"
            style={{ background: "rgba(212,168,83,0.1)" }}
          >
            {/* Animated fill */}
            <div
              className="proc-vline-fill absolute inset-0 w-full origin-top"
              style={{ background: "linear-gradient(180deg, #D4A853 0%, rgba(212,168,83,0.3) 100%)" }}
            />
          </div>

          <div className="space-y-5">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="proc-mobile-step relative">

                  {/* Timeline dot */}
                  <div
                    className="absolute -left-[34px] top-5 w-4 h-4 rounded-full border-2 z-10"
                    style={{
                      background: "#09090b",
                      borderColor: "#D4A853",
                      boxShadow: "0 0 10px rgba(212,168,83,0.5)",
                    }}
                  />

                  {/* Card */}
                  <div
                    className="rounded-2xl p-5 flex gap-4 relative overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.028)",
                      border: "1px solid rgba(212,168,83,0.12)",
                    }}
                  >
                    {/* Watermark */}
                    <span
                      className="absolute -bottom-1 -right-1 font-bold leading-none select-none pointer-events-none"
                      style={{ fontSize: "5rem", color: "rgba(212,168,83,0.055)", letterSpacing: "-0.05em" }}
                    >
                      {step.number}
                    </span>

                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.22)" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "#D4A853" }} />
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
                          {step.title}
                        </h3>
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider"
                          style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}
                        >
                          {step.tag}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
