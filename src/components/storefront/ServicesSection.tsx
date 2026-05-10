"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BedDouble, UtensilsCrossed, Armchair, Briefcase, ArrowRight,
} from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    icon: BedDouble,
    title: "Otel Odası Mobilyaları",
    desc: "Yatak başlıkları, komodiner, TV üniteleri, sandıklar ve tüm oda mobilyası çözümleri.",
    items: ["Yatak Başlığı & Karyola", "Komodin & Sandık", "TV Ünitesi", "Bagaj Sehpası"],
  },
  {
    num: "02",
    icon: UtensilsCrossed,
    title: "Restoran & Lobi",
    desc: "Lobi girişlerinden restoran içlerine kadar bütünleşik tasarım ve üretim hizmeti.",
    items: ["Resepsiyon Tezgahı", "Lobi Koltukları", "Restoran Masa-Sandalye", "Bar Ünitesi"],
  },
  {
    num: "03",
    icon: Armchair,
    title: "Özel Bölge & SPA",
    desc: "SPA, wellness, toplantı odaları ve ortak alanlara özel tasarım mobilya koleksiyonları.",
    items: ["SPA Şezlong", "Toplantı Odası", "Fitness Alanı", "Açık Alan Mobilyaları"],
  },
  {
    num: "04",
    icon: Briefcase,
    title: "Kurumsal & Ofis",
    desc: "Otel back-office, yönetim binaları ve kurumsal mekanlar için ergonomik çözümler.",
    items: ["Yönetici Ofisleri", "Açık Ofis Sistemleri", "Toplantı Masaları", "Depolama Üniteleri"],
  },
];

/* ─── shared card style helpers ─────────────────────────── */
const cardBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.028)",
  border: "1px solid rgba(212,168,83,0.1)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
};

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0); // mobile carousel index

  useGSAP(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* header */
    gsap.from(".svc-header-line", {
      scaleX: 0, opacity: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
    });
    gsap.from(".svc-heading", {
      y: 30, opacity: 0, duration: 0.7, delay: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
    });

    /* desktop bento cards */
    gsap.from(".bento-card", {
      y: 45, opacity: 0, duration: 0.75, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: ".bento-grid", start: "top 80%" },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="svc-header-line h-px w-8 origin-left"
              style={{ background: "#D4A853" }}
            />
            <p className="text-[10px] font-bold tracking-[0.28em] uppercase" style={{ color: "#D4A853" }}>
              Hizmetlerimiz
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2
              className="svc-heading text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold leading-[1.1]"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              Her Alana{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(120deg, #c8973a 0%, #f0c97a 50%, #c8973a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Özel Çözümler
              </span>
            </h2>
            <p className="text-sm leading-relaxed lg:max-w-[17rem] lg:text-right" style={{ color: "rgba(255,255,255,0.38)" }}>
              5 yıldızlı otelden butik tesislere, her konsept ve bütçeye uygun üretim.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            DESKTOP — Bento grid (hidden on mobile/tablet)
        ═══════════════════════════════════════════════════ */}
        <div className="bento-grid hidden lg:grid grid-cols-3 grid-rows-2 gap-4 h-[640px]">

          {/* Card 01 — tall left hero card (row-span-2) */}
          <BentoCard svc={services[0]} className="row-span-2 col-span-1" hero />

          {/* Card 02 — top-right */}
          <BentoCard svc={services[1]} className="col-span-2" />

          {/* Cards 03 & 04 — bottom row split */}
          <BentoCard svc={services[2]} />
          <BentoCard svc={services[3]} />
        </div>

        {/* ═══════════════════════════════════════════════════
            MOBILE / TABLET — Snap-scroll carousel
        ═══════════════════════════════════════════════════ */}
        <div className="lg:hidden">
          {/* Carousel track */}
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: "none" }}
            onScroll={(e) => {
              const el = e.currentTarget;
              const cardW = el.scrollWidth / services.length;
              setActiveCard(Math.round(el.scrollLeft / cardW));
            }}
          >
            {services.map((svc, i) => (
              <MobileCard key={i} svc={svc} />
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {services.map((_, i) => (
              <button
                key={i}
                aria-label={`Kart ${i + 1}`}
                onClick={() => {
                  const track = document.querySelector(".snap-x") as HTMLElement | null;
                  if (!track) return;
                  const cardW = track.scrollWidth / services.length;
                  track.scrollTo({ left: i * cardW, behavior: "smooth" });
                  setActiveCard(i);
                }}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: activeCard === i ? "24px" : "6px",
                  height: "6px",
                  background: activeCard === i ? "#D4A853" : "rgba(212,168,83,0.25)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <div className="mt-10 sm:mt-12">
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3.5 group"
            style={{ color: "#D4A853" }}
          >
            Projeniz için görüşelim
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}

/* ─── Desktop bento card ─────────────────────────────────── */
function BentoCard({
  svc,
  className = "",
  hero = false,
}: {
  svc: typeof services[0];
  className?: string;
  hero?: boolean;
}) {
  const Icon = svc.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`bento-card relative overflow-hidden rounded-2xl flex flex-col justify-between p-7 transition-all duration-500 cursor-default ${className}`}
      style={{
        ...cardBase,
        border: hovered ? "1px solid rgba(212,168,83,0.35)" : "1px solid rgba(212,168,83,0.1)",
        boxShadow: hovered
          ? "0 24px 64px rgba(212,168,83,0.07), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "inset 0 1px 0 rgba(255,255,255,0.04)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Watermark number */}
      <span
        className="absolute bottom-0 right-2 font-bold leading-none select-none pointer-events-none"
        style={{
          fontSize: hero ? "11rem" : "8rem",
          color: "rgba(212,168,83,0.055)",
          letterSpacing: "-0.05em",
          lineHeight: 0.85,
        }}
      >
        {svc.num}
      </span>

      {/* Top: icon + number badge */}
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            background: hovered ? "rgba(212,168,83,0.18)" : "rgba(212,168,83,0.09)",
            border: "1px solid rgba(212,168,83,0.2)",
          }}
        >
          <Icon className="w-5 h-5" style={{ color: "#D4A853" }} />
        </div>
        <span
          className="text-[10px] font-bold tracking-[0.2em] tabular-nums"
          style={{ color: "rgba(212,168,83,0.5)" }}
        >
          {svc.num}
        </span>
      </div>

      {/* Middle: title + desc */}
      <div className={hero ? "flex-1 flex flex-col justify-center py-8" : "py-5"}>
        <h3
          className={`font-bold leading-snug mb-3 ${hero ? "text-xl xl:text-2xl" : "text-base xl:text-lg"}`}
          style={{ color: "rgba(255,255,255,0.88)" }}
        >
          {svc.title}
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
          {svc.desc}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px mb-5" style={{ background: "rgba(212,168,83,0.1)" }} />

      {/* Items */}
      <div className={`grid ${hero ? "grid-cols-1 gap-3" : "grid-cols-2 gap-x-4 gap-y-2.5"}`}>
        {svc.items.map((item) => (
          <div key={item} className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
              style={{
                background: hovered ? "rgba(212,168,83,0.16)" : "rgba(212,168,83,0.08)",
                border: "1px solid rgba(212,168,83,0.15)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#D4A853" }} />
            </div>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Mobile carousel card ───────────────────────────────── */
function MobileCard({ svc }: { svc: typeof services[0] }) {
  const Icon = svc.icon;

  return (
    <div
      className="snap-center shrink-0 relative overflow-hidden rounded-2xl flex flex-col"
      style={{
        width: "82vw",
        maxWidth: "340px",
        minHeight: "420px",
        ...cardBase,
      }}
    >
      {/* Gold top stripe */}
      <div
        className="h-[3px] w-full shrink-0"
        style={{ background: "linear-gradient(90deg, #D4A853, rgba(212,168,83,0.2))" }}
      />

      <div className="flex flex-col flex-1 p-6 gap-0">
        {/* Number + icon row */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(212,168,83,0.1)",
              border: "1px solid rgba(212,168,83,0.2)",
            }}
          >
            <Icon className="w-5 h-5" style={{ color: "#D4A853" }} />
          </div>
          <span
            className="font-bold tabular-nums leading-none"
            style={{ fontSize: "4.5rem", color: "rgba(212,168,83,0.1)", letterSpacing: "-0.05em" }}
          >
            {svc.num}
          </span>
        </div>

        {/* Title + desc */}
        <h3
          className="text-lg font-bold leading-snug mb-2"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          {svc.title}
        </h3>
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "rgba(255,255,255,0.42)" }}
        >
          {svc.desc}
        </p>

        {/* Divider */}
        <div className="h-px mb-5" style={{ background: "rgba(212,168,83,0.12)" }} />

        {/* Items as pill chips */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {svc.items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
              style={{
                background: "rgba(212,168,83,0.08)",
                border: "1px solid rgba(212,168,83,0.18)",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "#D4A853" }}
              />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
