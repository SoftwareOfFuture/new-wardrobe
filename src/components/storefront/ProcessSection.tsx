"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ClipboardList, Ruler, Factory, Truck } from "lucide-react";

/* ─── Step data ───────────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Keşif & Tasarım",
    tag: "Ücretsiz",
    desc: "Ücretsiz keşif ziyaretimizde ihtiyaçlarınızı analiz eder, ölçüm alır ve size özel tasarım dosyası hazırlarız.",
  },
  {
    number: "02",
    icon: Ruler,
    title: "Proje Geliştirme",
    tag: "3 İş Günü",
    desc: "Teknik çizimler, malzeme seçimi ve fiyat teklifini 3 iş günü içinde teslim ederiz. Onayınızla üretime geçeriz.",
  },
  {
    number: "03",
    icon: Factory,
    title: "CNC Üretim",
    tag: "Entegre Tesis",
    desc: "Antalya tesisimizde CNC freze, boyahane ve demir hane süreçleri entegre yönetilerek üretim tamamlanır.",
  },
  {
    number: "04",
    icon: Truck,
    title: "Teslimat & Montaj",
    tag: "Tüm Türkiye",
    desc: "Profesyonel montaj ekibimiz tüm Türkiye ve yurt dışına kurulum gerçekleştirir. Garanti kapsamındayız.",
  },
];

const CONN = 44; // connector height in px (rail centre → card top)

/* ═══════════════════════════════════════════════════════════════
   Component
═══════════════════════════════════════════════════════════════ */
export function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const isDesktop = window.innerWidth >= 1024;

    const ctx = gsap.context(() => {
      if (isDesktop) setupDesktop(el);
      else setupMobile(el);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,168,83,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase mb-4"
            style={{
              background: "rgba(212,168,83,0.08)",
              border: "1px solid rgba(212,168,83,0.2)",
              color: "#D4A853",
            }}
          >
            Nasıl Çalışıyoruz
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            Projeden{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(120deg,#c8973a 0%,#f0c97a 50%,#c8973a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Teslimata
            </span>
          </h2>
          <p
            className="mt-3 text-sm"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            4 adımda hayalinizdeki mobilyayı gerçeğe dönüştürüyoruz.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════
            DESKTOP — horizontal truck track
            Layout: rail row (height 64px) + 4-col card grid below
            All cards are BELOW the rail — zero overlap with header.
        ════════════════════════════════════════════════════ */}
        <div className="d-track hidden lg:block">

          {/* Rail row */}
          <div className="relative mb-14" style={{ height: 64 }}>

            {/* Rail base */}
            <div
              className="absolute left-0 right-0"
              style={{
                top: "50%", transform: "translateY(-50%)",
                height: 5, borderRadius: 3,
                background: "rgba(212,168,83,0.08)",
              }}
            >
              <div
                className="d-fill absolute inset-0 rounded-full"
                style={{ background: "linear-gradient(90deg,#D4A853,rgba(212,168,83,0.4))" }}
              />
            </div>

            {/* Truck — CSS-centered on rail, GSAP animates x only */}
            <div
              className="d-truck absolute z-20"
              style={{
                top: "50%", left: 0,
                transform: "translateY(-50%)",
                width: 48, height: 48,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "#D4A853",
                  boxShadow: "0 0 0 6px rgba(212,168,83,0.15),0 0 24px rgba(212,168,83,0.45)",
                }}
              >
                <Truck className="w-5 h-5 text-black" />
              </div>
            </div>

            {/* Dots + connectors pointing DOWN to cards */}
            {steps.map((_, i) => (
              <div key={i}>
                <div
                  className="d-dot absolute z-10 rounded-full"
                  style={{
                    left: `${(i / (steps.length - 1)) * 100}%`,
                    top: "50%", marginLeft: -7, marginTop: -7,
                    width: 14, height: 14,
                    background: "rgba(212,168,83,0.2)",
                    border: "2px solid rgba(212,168,83,0.35)",
                  }}
                />
                <div
                  className="d-conn absolute"
                  style={{
                    left: `${(i / (steps.length - 1)) * 100}%`,
                    marginLeft: -0.5,
                    width: 1, height: CONN,
                    top: "calc(50% + 7px)",
                    background: "rgba(212,168,83,0.4)",
                    transformOrigin: "top center",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Cards row — all below the rail */}
          <div className="grid grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="d-card">
                <StepCard step={step} />
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            MOBILE — vertical truck rail
        ════════════════════════════════════════════════════ */}
        <div className="lg:hidden relative flex gap-5">
          {/* Left rail column */}
          <div className="relative shrink-0" style={{ width: 40 }}>
            {/* Track line */}
            <div
              className="m-rail absolute rounded-full"
              style={{
                left: "50%",
                marginLeft: -2,
                width: 4,
                top: 20,
                bottom: 20,
                background: "rgba(212,168,83,0.08)",
              }}
            >
              <div
                className="m-fill absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, #D4A853, rgba(212,168,83,0.4))",
                }}
              />
            </div>

            {/* Truck */}
            <div
              className="m-truck absolute z-20"
              style={{ top: 20, left: 0, width: 40, height: 40 }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "#D4A853",
                  boxShadow:
                    "0 0 0 5px rgba(212,168,83,0.15), 0 0 18px rgba(212,168,83,0.45)",
                }}
              >
                <Truck className="w-4 h-4 text-black rotate-90" />
              </div>
            </div>

            {/* Dots */}
            {steps.map((_, i) => (
              <div
                key={i}
                className="m-dot absolute rounded-full"
                style={{
                  left: "50%",
                  marginLeft: -7,
                  width: 14,
                  height: 14,
                  top: i === 0
                    ? 13
                    : i === steps.length - 1
                      ? "calc(100% - 27px)"
                      : `calc(20px + (100% - 40px) * ${i} / ${steps.length - 1} - 7px)`,
                  background: "rgba(212,168,83,0.2)",
                  border: "2px solid rgba(212,168,83,0.3)",
                  zIndex: 5,
                }}
              />
            ))}
          </div>

          {/* Cards */}
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
                    style={{
                      background: "rgba(212,168,83,0.1)",
                      border: "1px solid rgba(212,168,83,0.2)",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#D4A853" }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3
                        className="text-sm font-bold"
                        style={{ color: "rgba(255,255,255,0.9)" }}
                      >
                        {step.title}
                      </h3>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(212,168,83,0.1)",
                          border: "1px solid rgba(212,168,83,0.18)",
                          color: "#D4A853",
                        }}
                      >
                        {step.tag}
                      </span>
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.42)" }}
                    >
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

/* ═══════════════════════════════════════════════════════════════
   DESKTOP animation setup
   No pin, no timeline, no scrub — just scroll progress → gsap.set
═══════════════════════════════════════════════════════════════ */
function setupDesktop(el: HTMLElement) {
  // The rail row is inside .d-track; measure its actual rendered width
  const railRow = el.querySelector<HTMLElement>(".d-track > div");
  const truck   = el.querySelector<HTMLElement>(".d-truck");
  const fill    = el.querySelector<HTMLElement>(".d-fill");
  const dots    = el.querySelectorAll<HTMLElement>(".d-dot");
  const cards   = el.querySelectorAll<HTMLElement>(".d-card");
  const conns   = el.querySelectorAll<HTMLElement>(".d-conn");

  if (!railRow || !truck || !fill) return;

  const maxX = railRow.offsetWidth - 48;
  if (maxX <= 0) return;

  // Truck is already CSS-centered (top:50% + translateY(-50%)); GSAP only drives x.
  gsap.set(truck, { x: 0 });
  gsap.set(fill,  { scaleX: 0, transformOrigin: "left center" });
  dots.forEach(d  => gsap.set(d, { scale: 0.5,  autoAlpha: 0.25 }));
  cards.forEach(c => gsap.set(c, { autoAlpha: 0.12, y: 18 }));
  conns.forEach(c => gsap.set(c, { scaleY: 0,  autoAlpha: 0.25, transformOrigin: "top center" }));

  const moveX = gsap.quickTo(truck, "x", { duration: 0.25, ease: "power2.out" });

  ScrollTrigger.create({
    trigger: el,
    start: "top 75%",
    end: "bottom 25%",
    onUpdate(self) {
      const p = self.progress;
      moveX(p * maxX);
      gsap.set(fill, { scaleX: p });

      cards.forEach((card, i) => {
        const on = p >= (i + 0.3) / steps.length;
        gsap.set(card,    { autoAlpha: on ? 1 : 0.12, y: on ? 0 : 18 });
        gsap.set(dots[i], { scale: on ? 1.2 : 0.5, autoAlpha: on ? 1 : 0.25 });
        if (conns[i]) gsap.set(conns[i], { scaleY: on ? 1 : 0, autoAlpha: on ? 0.6 : 0.25 });
      });
    },
  });
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE animation setup
═══════════════════════════════════════════════════════════════ */
function setupMobile(el: HTMLElement) {
  const rail  = el.querySelector<HTMLElement>(".m-rail");
  const truck = el.querySelector<HTMLElement>(".m-truck");
  const fill  = el.querySelector<HTMLElement>(".m-fill");
  const dots  = el.querySelectorAll<HTMLElement>(".m-dot");
  const cards = el.querySelectorAll<HTMLElement>(".m-card");

  if (!rail || !truck || !fill) return;

  // Rail height is determined by the flex layout (same as cards column height)
  const maxY = rail.offsetHeight - 40;
  if (maxY <= 0) return;

  gsap.set(truck, { y: 0 });
  gsap.set(fill,  { scaleY: 0, transformOrigin: "top center" });
  dots.forEach(d  => gsap.set(d, { scale: 0.5,  autoAlpha: 0.25 }));
  cards.forEach(c => gsap.set(c, { autoAlpha: 0.12, x: 16 }));

  const moveY = gsap.quickTo(truck, "y", { duration: 0.25, ease: "power2.out" });

  ScrollTrigger.create({
    trigger: el,
    start: "top 75%",
    end: "bottom 25%",
    onUpdate(self) {
      const p = self.progress;
      moveY(p * maxY);
      gsap.set(fill, { scaleY: p });

      cards.forEach((card, i) => {
        const on = p >= (i + 0.3) / steps.length;
        gsap.set(card,    { autoAlpha: on ? 1 : 0.12, x: on ? 0 : 16 });
        gsap.set(dots[i], { scale: on ? 1.2 : 0.5, autoAlpha: on ? 1 : 0.25 });
      });
    },
  });
}

/* ─── Desktop step card ───────────────────────────────────────── */
function StepCard({ step }: { step: (typeof steps)[number] }) {
  const Icon = step.icon;
  return (
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
          style={{
            background: "rgba(212,168,83,0.1)",
            border: "1px solid rgba(212,168,83,0.2)",
          }}
        >
          <Icon className="w-4 h-4" style={{ color: "#D4A853" }} />
        </div>
        <span
          className="font-bold tabular-nums"
          style={{
            fontSize: "2rem",
            color: "rgba(212,168,83,0.1)",
            letterSpacing: "-0.05em",
          }}
        >
          {step.number}
        </span>
      </div>
      <div
        className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider mb-2"
        style={{
          background: "rgba(212,168,83,0.1)",
          border: "1px solid rgba(212,168,83,0.18)",
          color: "#D4A853",
        }}
      >
        {step.tag}
      </div>
      <h3
        className="text-sm font-bold mb-1.5"
        style={{ color: "rgba(255,255,255,0.9)" }}
      >
        {step.title}
      </h3>
      <p
        className="text-[11px] leading-relaxed"
        style={{ color: "rgba(255,255,255,0.42)" }}
      >
        {step.desc}
      </p>
    </div>
  );
}
