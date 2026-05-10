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

export function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.innerWidth < 1024;

    /* ─────────────── DESKTOP ─────────────── */
    if (!isMobile) {
      const truckEl  = sectionRef.current.querySelector<HTMLElement>(".d-truck");
      const fillEl   = sectionRef.current.querySelector<HTMLElement>(".d-fill");
      const trackEl  = sectionRef.current.querySelector<HTMLElement>(".d-track");
      const dotEls   = sectionRef.current.querySelectorAll<HTMLElement>(".d-dot");
      const cardEls  = sectionRef.current.querySelectorAll<HTMLElement>(".d-card");
      const connEls  = sectionRef.current.querySelectorAll<HTMLElement>(".d-conn");
      if (!truckEl || !fillEl || !trackEl) return;

      // Initial state — everything faded
      gsap.set(fillEl,  { scaleX: 0, transformOrigin: "left center" });
      gsap.set(cardEls, { opacity: 0.15, y: 18 });
      gsap.set(dotEls,  { scale: 0.5, opacity: 0.3 });
      gsap.set(connEls, { scaleY: 0, transformOrigin: "top center", opacity: 0.3 });

      const maxX = trackEl.offsetWidth - truckEl.offsetWidth - 8;

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2000",
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          onUpdate(self) {
            const p = self.progress;
            // Unlock each step as truck crosses its threshold
            cardEls.forEach((card, i) => {
              const thresh = (i / steps.length) + 0.01;
              const on = p >= thresh;
              gsap.to(card, { opacity: on ? 1 : 0.15, y: on ? 0 : 18, duration: 0.25, overwrite: true });
              gsap.to(dotEls[i], {
                scale: on ? 1.1 : 0.5,
                opacity: on ? 1 : 0.3,
                duration: 0.25, overwrite: true,
              });
              gsap.to(connEls[i], {
                scaleY: on ? 1 : 0,
                opacity: on ? 0.5 : 0.3,
                duration: 0.25, overwrite: true,
              });
            });
          },
        },
      })
        .to(truckEl, { x: maxX, ease: "none" }, 0)
        .to(fillEl,  { scaleX: 1, ease: "none" }, 0);
    }

    /* ─────────────── MOBILE ─────────────── */
    else {
      const truckEl  = sectionRef.current.querySelector<HTMLElement>(".m-truck");
      const fillEl   = sectionRef.current.querySelector<HTMLElement>(".m-fill");
      const trackEl  = sectionRef.current.querySelector<HTMLElement>(".m-track");
      const dotEls   = sectionRef.current.querySelectorAll<HTMLElement>(".m-dot");
      const cardEls  = sectionRef.current.querySelectorAll<HTMLElement>(".m-card");
      if (!truckEl || !fillEl || !trackEl) return;

      gsap.set(fillEl,  { scaleY: 0, transformOrigin: "top center" });
      gsap.set(cardEls, { opacity: 0.15, x: 18 });
      gsap.set(dotEls,  { scale: 0.5, opacity: 0.3 });

      const maxY = trackEl.offsetHeight - truckEl.offsetHeight - 4;

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1800",
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          onUpdate(self) {
            const p = self.progress;
            cardEls.forEach((card, i) => {
              const thresh = (i / steps.length) + 0.01;
              const on = p >= thresh;
              gsap.to(card, { opacity: on ? 1 : 0.15, x: on ? 0 : 18, duration: 0.25, overwrite: true });
              gsap.to(dotEls[i], {
                scale: on ? 1.15 : 0.5,
                opacity: on ? 1 : 0.3,
                duration: 0.25, overwrite: true,
              });
            });
          },
        },
      })
        .to(truckEl, { y: maxY, ease: "none" }, 0)
        .to(fillEl,  { scaleY: 1, ease: "none" }, 0);
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,168,83,0.04) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-14">
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

        {/* ═══════════════ DESKTOP horizontal track ═══════════════ */}
        <div className="d-track hidden lg:block relative" style={{ height: "320px" }}>

          {/* Track road base */}
          <div
            className="absolute"
            style={{
              left: 0, right: 0,
              top: "50%",
              height: "6px",
              transform: "translateY(-50%)",
              background: "rgba(212,168,83,0.08)",
              borderRadius: "3px",
            }}
          >
            {/* Gold fill — animated by GSAP */}
            <div
              className="d-fill absolute inset-0 rounded-full"
              style={{ background: "linear-gradient(90deg, #D4A853, rgba(212,168,83,0.5))" }}
            />
          </div>

          {/* Truck — absolutely on the track */}
          <div
            className="d-truck absolute z-20 flex items-center justify-center"
            style={{
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
            }}
          >
            {/* Truck icon in a glowing circle */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "#D4A853",
                boxShadow: "0 0 0 6px rgba(212,168,83,0.15), 0 0 20px rgba(212,168,83,0.4)",
              }}
            >
              <Truck className="w-5 h-5 text-black" />
            </div>
          </div>

          {/* Step nodes */}
          {steps.map((step, i) => {
            const Icon = step.icon;
            const leftPct = `${(i / (steps.length - 1)) * 100}%`;

            return (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{
                  left: leftPct,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              >
                {/* Connector to card (above or below) */}
                <div
                  className={`d-conn absolute w-px`}
                  style={{
                    background: "rgba(212,168,83,0.4)",
                    height: "80px",
                    ...(step.above
                      ? { bottom: "24px", top: "auto" }
                      : { top: "24px", bottom: "auto" }),
                  }}
                />

                {/* Step dot */}
                <div
                  className="d-dot rounded-full"
                  style={{
                    width: "16px", height: "16px",
                    background: "rgba(212,168,83,0.2)",
                    border: "2px solid rgba(212,168,83,0.4)",
                    transition: "box-shadow 0.3s, transform 0.3s",
                  }}
                />

                {/* Step card */}
                <div
                  className="d-card absolute"
                  style={{
                    width: "200px",
                    ...(step.above
                      ? { bottom: "calc(50% + 60px)" }
                      : { top: "calc(50% + 60px)" }),
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: "rgba(255,255,255,0.032)",
                      border: "1px solid rgba(212,168,83,0.12)",
                    }}
                  >
                    {/* Number + icon */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)" }}
                      >
                        <Icon className="w-4 h-4" style={{ color: "#D4A853" }} />
                      </div>
                      <span
                        className="font-bold tabular-nums"
                        style={{ fontSize: "2rem", color: "rgba(212,168,83,0.12)", letterSpacing: "-0.05em" }}
                      >
                        {step.number}
                      </span>
                    </div>

                    <div
                      className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider mb-2"
                      style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}
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

        {/* ═══════════════ MOBILE vertical track ═══════════════ */}
        <div className="lg:hidden relative flex gap-6">

          {/* Left: vertical track */}
          <div
            className="m-track relative flex-shrink-0"
            style={{ width: "40px" }}
          >
            {/* Base line */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-[4px] rounded-full"
              style={{ background: "rgba(212,168,83,0.08)" }}
            >
              {/* Gold fill */}
              <div
                className="m-fill absolute inset-0 rounded-full"
                style={{ background: "linear-gradient(180deg, #D4A853, rgba(212,168,83,0.4))" }}
              />
            </div>

            {/* Truck — moves down */}
            <div
              className="m-truck absolute left-1/2 -translate-x-1/2 top-0 z-20"
              style={{ width: "40px", height: "40px" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "#D4A853",
                  boxShadow: "0 0 0 5px rgba(212,168,83,0.15), 0 0 16px rgba(212,168,83,0.4)",
                }}
              >
                {/* Rotated truck for vertical movement */}
                <Truck className="w-4 h-4 text-black rotate-90" />
              </div>
            </div>

            {/* Dots at each step */}
            {steps.map((_, i) => (
              <div
                key={i}
                className="m-dot absolute left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: "14px", height: "14px",
                  top: `calc(${(i / (steps.length - 1)) * 100}% - 7px)`,
                  background: "rgba(212,168,83,0.2)",
                  border: "2px solid rgba(212,168,83,0.3)",
                  transition: "box-shadow 0.3s",
                  zIndex: 5,
                }}
              />
            ))}
          </div>

          {/* Right: cards */}
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
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
