"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClipboardList, Ruler, Factory, Truck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Keşif & Tasarım",
    tag: "Ücretsiz",
    desc: "Ücretsiz keşif ziyaretimizde ihtiyaçlarınızı analiz eder, ölçüm alır ve size özel tasarım dosyası hazırlarız.",
    above: true,
  },
  {
    number: "02",
    icon: Ruler,
    title: "Proje Geliştirme",
    tag: "3 İş Günü",
    desc: "Teknik çizimler, malzeme seçimi ve fiyat teklifini 3 iş günü içinde teslim ederiz. Onayınızla üretime geçeriz.",
    above: false,
  },
  {
    number: "03",
    icon: Factory,
    title: "CNC Üretim",
    tag: "Entegre Tesis",
    desc: "Antalya tesisimizde CNC freze, boyahane ve demir hane süreçleri entegre yönetilerek üretim tamamlanır.",
    above: true,
  },
  {
    number: "04",
    icon: Truck,
    title: "Teslimat & Montaj",
    tag: "Tüm Türkiye",
    desc: "Profesyonel montaj ekibimiz tüm Türkiye ve yurt dışına kurulum gerçekleştirir. Garanti kapsamındayız.",
    above: false,
  },
];

/** Card x-offset per index to prevent overflow at left/right edges */
const CARD_X: Record<number, string> = {
  0: "translateX(0)",
  1: "translateX(-50%)",
  2: "translateX(-50%)",
  3: "translateX(-100%)",
};

const CONN_H = 60;   // connector height px
const CARD_H = 150;  // approximate card height px

export function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.innerWidth < 1024;

    /* ══════════════════════════════════
       DESKTOP — horizontal truck rail
    ══════════════════════════════════ */
    if (!isMobile) {
      const trackEl = sectionRef.current.querySelector<HTMLElement>(".d-track");
      const truckEl = sectionRef.current.querySelector<HTMLElement>(".d-truck");
      const fillEl  = sectionRef.current.querySelector<HTMLElement>(".d-fill");
      const dotEls  = sectionRef.current.querySelectorAll<HTMLElement>(".d-dot");
      const cardEls = sectionRef.current.querySelectorAll<HTMLElement>(".d-card");
      const connEls = sectionRef.current.querySelectorAll<HTMLElement>(".d-conn");

      if (!trackEl || !truckEl || !fillEl) return;

      // ── Key fix: GSAP owns ALL transforms on the truck ──────────────────
      // Truck CSS has top:0 left:0 (no css transform).
      // We position it vertically via GSAP y so there's no transform conflict
      // when we later animate x.
      const centerY = trackEl.offsetHeight / 2 - 24; // half track - half truck (24px)
      gsap.set(truckEl, { x: 0, y: centerY });

      // Initial states
      gsap.set(fillEl,  { scaleX: 0, transformOrigin: "left center" });
      gsap.set(cardEls, { opacity: 0.1, y: 20 });
      gsap.set(dotEls,  { scale: 0.5, opacity: 0.25 });
      connEls.forEach((conn, i) => {
        gsap.set(conn, {
          scaleY: 0,
          opacity: 0.25,
          transformOrigin: steps[i]?.above ? "bottom center" : "top center",
        });
      });

      // maxX via function so GSAP recalculates on refresh
      const getMaxX = () => trackEl.offsetWidth - 48;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2200",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress;
            cardEls.forEach((card, i) => {
              const thresh = i / steps.length + 0.01;
              const on = p >= thresh;
              gsap.to(card,    { opacity: on ? 1 : 0.1, y: on ? 0 : 20, duration: 0.3, overwrite: true });
              gsap.to(dotEls[i], { scale: on ? 1.15 : 0.5, opacity: on ? 1 : 0.25, duration: 0.3, overwrite: true });
              if (connEls[i]) {
                gsap.to(connEls[i], { scaleY: on ? 1 : 0, opacity: on ? 0.55 : 0.25, duration: 0.3, overwrite: true });
              }
            });
          },
        },
      });

      tl.to(truckEl, { x: getMaxX, ease: "none" }, 0)
        .to(fillEl,   { scaleX: 1, ease: "none"  }, 0);
    }

    /* ══════════════════════════════════
       MOBILE — vertical truck rail
    ══════════════════════════════════ */
    else {
      const trackEl = sectionRef.current.querySelector<HTMLElement>(".m-track-inner");
      const truckEl = sectionRef.current.querySelector<HTMLElement>(".m-truck");
      const fillEl  = sectionRef.current.querySelector<HTMLElement>(".m-fill");
      const dotEls  = sectionRef.current.querySelectorAll<HTMLElement>(".m-dot");
      const cardEls = sectionRef.current.querySelectorAll<HTMLElement>(".m-card");

      if (!trackEl || !truckEl || !fillEl) return;

      // Truck CSS has top:20px left:0 (no transform).
      // Animate y from 0 → (trackHeight - truckHeight).
      gsap.set(fillEl,  { scaleY: 0, transformOrigin: "top center" });
      gsap.set(cardEls, { opacity: 0.1, x: 20 });
      gsap.set(dotEls,  { scale: 0.5, opacity: 0.25 });

      const getMaxY = () => trackEl.offsetHeight - 40;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1800",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress;
            cardEls.forEach((card, i) => {
              const thresh = i / steps.length + 0.01;
              const on = p >= thresh;
              gsap.to(card,    { opacity: on ? 1 : 0.1, x: on ? 0 : 20, duration: 0.3, overwrite: true });
              gsap.to(dotEls[i], { scale: on ? 1.15 : 0.5, opacity: on ? 1 : 0.25, duration: 0.3, overwrite: true });
            });
          },
        },
      });

      tl.to(truckEl, { y: getMaxY, ease: "none" }, 0)
        .to(fillEl,   { scaleY: 1, ease: "none"  }, 0);
    }
  }, { scope: sectionRef });

  /* ─────────────────────────────────── JSX ─────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,168,83,0.04) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase mb-4"
            style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}
          >
            Nasıl Çalışıyoruz
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
            Projeden{" "}
            <span style={{
              backgroundImage: "linear-gradient(120deg,#c8973a 0%,#f0c97a 50%,#c8973a 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Teslimata
            </span>
          </h2>
          <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
            4 adımda hayalinizdeki mobilyayı gerçeğe dönüştürüyoruz.
          </p>
        </div>

        {/* ════════════════════════════════════════
            DESKTOP — horizontal track
        ════════════════════════════════════════ */}
        <div
          className="d-track hidden lg:block relative"
          style={{ height: "460px" }}
        >
          {/* Track road line — centered with calc, no transform */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: "calc(50% - 2px)",
              height: "5px",
              background: "rgba(212,168,83,0.08)",
              borderRadius: "3px",
            }}
          >
            {/* Gold fill — GSAP animates scaleX */}
            <div
              className="d-fill absolute inset-0 rounded-full"
              style={{ background: "linear-gradient(90deg, #D4A853, rgba(212,168,83,0.4))" }}
            />
          </div>

          {/* ── Truck ──────────────────────────────────────────────────────────
              IMPORTANT: top:0, left:0, NO CSS transform.
              GSAP positions it with y = centerY and animates x → maxX.
              This avoids any CSS ↔ GSAP transform conflict.
          ────────────────────────────────────────────────────────────────── */}
          <div
            className="d-truck absolute z-20"
            style={{ top: 0, left: 0, width: "48px", height: "48px" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "#D4A853",
                boxShadow: "0 0 0 6px rgba(212,168,83,0.15), 0 0 24px rgba(212,168,83,0.45)",
              }}
            >
              <Truck className="w-5 h-5 text-black" />
            </div>
          </div>

          {/* ── Step nodes ─────────────────────────────────────────────────── */}
          {steps.map((step, i) => {
            const Icon = step.icon;
            const leftPct = `${(i / (steps.length - 1)) * 100}%`;
            const above   = step.above;

            return (
              <div key={i}>

                {/* Dot — margin centering (no CSS transform → no GSAP scale conflict) */}
                <div
                  className="d-dot absolute z-10 rounded-full"
                  style={{
                    left: leftPct,
                    top: "50%",
                    marginLeft: "-7px",
                    marginTop: "-7px",
                    width: "14px",
                    height: "14px",
                    background: "rgba(212,168,83,0.2)",
                    border: "2px solid rgba(212,168,83,0.35)",
                  }}
                />

                {/* Connector — transformOrigin set once by GSAP init */}
                <div
                  className="d-conn absolute"
                  style={{
                    left: leftPct,
                    marginLeft: "-0.5px",
                    width: "1px",
                    height: `${CONN_H}px`,
                    background: "rgba(212,168,83,0.4)",
                    ...(above
                      ? { top: `calc(50% - ${CONN_H}px)` }
                      : { top: "50%" }),
                  }}
                />

                {/* Card */}
                <div
                  className="d-card absolute"
                  style={{
                    left: leftPct,
                    transform: CARD_X[i],
                    width: "210px",
                    ...(above
                      ? { top: `calc(50% - ${CONN_H + CARD_H}px)` }
                      : { top: `calc(50% + ${CONN_H}px)` }),
                  }}
                >
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: "rgba(255,255,255,0.032)",
                      border: "1px solid rgba(212,168,83,0.12)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)" }}
                      >
                        <Icon className="w-4 h-4" style={{ color: "#D4A853" }} />
                      </div>
                      <span
                        className="font-bold tabular-nums"
                        style={{ fontSize: "2rem", color: "rgba(212,168,83,0.1)", letterSpacing: "-0.05em" }}
                      >
                        {step.number}
                      </span>
                    </div>
                    <div
                      className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider mb-2"
                      style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.18)", color: "#D4A853" }}
                    >
                      {step.tag}
                    </div>
                    <h3 className="text-sm font-bold mb-1.5" style={{ color: "rgba(255,255,255,0.9)" }}>
                      {step.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
                      {step.desc}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ════════════════════════════════════════
            MOBILE — vertical track
        ════════════════════════════════════════ */}
        <div className="lg:hidden relative flex gap-5">

          {/* Left rail column */}
          <div className="relative shrink-0" style={{ width: "40px" }}>

            {/* Track inner line */}
            <div
              className="m-track-inner absolute rounded-full"
              style={{
                left: "50%",
                marginLeft: "-2px",
                width: "4px",
                top: "20px",
                bottom: "20px",
                background: "rgba(212,168,83,0.08)",
              }}
            >
              <div
                className="m-fill absolute inset-0 rounded-full"
                style={{ background: "linear-gradient(180deg, #D4A853, rgba(212,168,83,0.4))" }}
              />
            </div>

            {/* ── Mobile truck ───────────────────────────────────────────────────
                top:20px (aligned with track start), left:0, NO CSS transform.
                GSAP animates y from 0 to (trackHeight - 40).
            ─────────────────────────────────────────────────────────────────── */}
            <div
              className="m-truck absolute z-20"
              style={{ top: "20px", left: 0, width: "40px", height: "40px" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "#D4A853",
                  boxShadow: "0 0 0 5px rgba(212,168,83,0.15), 0 0 18px rgba(212,168,83,0.45)",
                }}
              >
                <Truck className="w-4 h-4 text-black rotate-90" />
              </div>
            </div>

            {/* Step dots — margin centering, no CSS transform */}
            {steps.map((_, i) => (
              <div
                key={i}
                className="m-dot absolute rounded-full"
                style={{
                  left: "50%",
                  marginLeft: "-7px",
                  width: "14px",
                  height: "14px",
                  top: `calc(20px + ${(i / (steps.length - 1)) * 100}% - 7px)`,
                  background: "rgba(212,168,83,0.2)",
                  border: "2px solid rgba(212,168,83,0.3)",
                  zIndex: 5,
                }}
              />
            ))}
          </div>

          {/* Cards column */}
          <div className="flex-1 flex flex-col gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="m-card rounded-2xl p-4 flex gap-3 items-start"
                  style={{
                    background: "rgba(255,255,255,0.028)",
                    border: "1px solid rgba(212,168,83,0.1)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#D4A853" }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
                        {step.title}
                      </h3>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.18)", color: "#D4A853" }}
                      >
                        {step.tag}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
                      {step.desc}
                    </p>
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
