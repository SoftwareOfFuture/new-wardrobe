"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Box, Layout, Award, Wrench, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = { Box, Layout, Award, Wrench };

const NUMS = ["01", "02", "03", "04"];

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

export function FeaturesSection({
  title = "Neden Urban Mobilya?",
  subtitle = "12 yıldır otelcilerin güvendiği marka — kalitemizi fark eden sayısız referansla.",
  features = [],
}: FeaturesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(".feat-left", {
      x: -40, opacity: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
    });
    gsap.from(".feat-tile", {
      y: 35, opacity: 0, duration: 0.65, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: ".feat-grid", start: "top 80%" },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">

      {/* Radial ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,168,83,0.035) 0%, transparent 65%)" }}
      />

      <div className="max-w-7xl mx-auto">

        {/* ═══════════ DESKTOP layout (lg+) ═══════════ */}
        <div className="hidden lg:grid grid-cols-5 gap-12 xl:gap-20 items-start">

          {/* Left col — sticky heading block */}
          <div className="feat-left col-span-2 sticky top-24 space-y-8">

            {/* Badge */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8" style={{ background: "#D4A853" }} />
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase" style={{ color: "#D4A853" }}>
                Neden Biz?
              </span>
            </div>

            {/* Heading */}
            <h2
              className="text-4xl xl:text-5xl font-bold leading-[1.1]"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              {title.split("?")[0]}
              <span
                style={{
                  backgroundImage: "linear-gradient(120deg,#c8973a 0%,#f0c97a 50%,#c8973a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >?</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
              {subtitle}
            </p>

            {/* Decorative number watermark */}
            <div
              className="font-bold leading-none select-none pointer-events-none"
              style={{
                fontSize: "10rem",
                color: "rgba(212,168,83,0.06)",
                letterSpacing: "-0.06em",
                lineHeight: 1,
              }}
            >
              WHY
            </div>

            {/* CTA */}
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 text-sm font-semibold group transition-all duration-300 hover:gap-3"
              style={{ color: "#D4A853" }}
            >
              Bizimle çalışın
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right col — 2×2 tile grid */}
          <div className="feat-grid col-span-3 grid grid-cols-2 gap-0">
            {features.map((f, i) => (
              <DesktopTile key={i} feature={f} num={NUMS[i]} isFirst={i === 0} isTop={i < 2} />
            ))}
          </div>
        </div>

        {/* ═══════════ MOBILE / TABLET layout ═══════════ */}
        <div className="lg:hidden space-y-10">

          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: "#D4A853" }} />
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase" style={{ color: "#D4A853" }}>
                Neden Biz?
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 leading-[1.1]"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              {title.split("?")[0]}
              <span
                style={{
                  backgroundImage: "linear-gradient(120deg,#c8973a 0%,#f0c97a 50%,#c8973a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >?</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
              {subtitle}
            </p>
          </div>

          {/* Feature list */}
          <div className="divide-y" style={{ borderTop: "1px solid rgba(212,168,83,0.12)", borderColor: "rgba(212,168,83,0.12)" }}>
            {features.map((f, i) => (
              <MobileRow key={i} feature={f} num={NUMS[i]} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── Desktop tile ───────────────────────────────────────── */
function DesktopTile({
  feature, num, isFirst, isTop,
}: {
  feature: Feature;
  num: string;
  isFirst: boolean;
  isTop: boolean;
}) {
  const Icon = iconMap[feature.icon] || Box;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="feat-tile relative p-8 xl:p-10 flex flex-col gap-6 cursor-default transition-all duration-400"
      style={{
        borderTop: isTop ? "1px solid rgba(212,168,83,0.12)" : "none",
        borderLeft: !isFirst && isTop ? "1px solid rgba(212,168,83,0.12)" : "none",
        borderBottom: "1px solid rgba(212,168,83,0.12)",
        borderRight: isFirst || !isTop ? "1px solid rgba(212,168,83,0.12)" : "none",
        background: hovered ? "rgba(212,168,83,0.04)" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Number + icon row */}
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
          className="font-bold tabular-nums"
          style={{ fontSize: "3.5rem", color: "rgba(212,168,83,0.1)", letterSpacing: "-0.05em", lineHeight: 1 }}
        >
          {num}
        </span>
      </div>

      {/* Text */}
      <div>
        <h3
          className="text-base xl:text-lg font-bold mb-2 transition-colors duration-300"
          style={{ color: hovered ? "#D4A853" : "rgba(255,255,255,0.88)" }}
        >
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
          {feature.description}
        </p>
      </div>

      {/* Hover indicator line — bottom */}
      <div
        className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
        style={{
          width: hovered ? "100%" : "0%",
          background: "linear-gradient(90deg, #D4A853, transparent)",
        }}
      />
    </div>
  );
}

/* ─── Mobile row ─────────────────────────────────────────── */
function MobileRow({ feature, num }: { feature: Feature; num: string }) {
  const Icon = iconMap[feature.icon] || Box;
  const [open, setOpen] = useState(false);

  return (
    <button
      className="w-full text-left py-5 cursor-pointer"
      style={{ borderBottomColor: "rgba(212,168,83,0.12)" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center gap-4">
        {/* Number */}
        <span
          className="font-bold tabular-nums shrink-0 w-8"
          style={{ fontSize: "0.65rem", color: "rgba(212,168,83,0.5)", letterSpacing: "0.1em" }}
        >
          {num}
        </span>

        {/* Icon */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(212,168,83,0.09)", border: "1px solid rgba(212,168,83,0.2)" }}
        >
          <Icon className="w-4 h-4" style={{ color: "#D4A853" }} />
        </div>

        {/* Title */}
        <span className="flex-1 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.88)" }}>
          {feature.title}
        </span>

        {/* Chevron */}
        <svg
          className="w-4 h-4 shrink-0 transition-transform duration-300"
          style={{
            color: "rgba(212,168,83,0.5)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expandable description */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "120px" : "0px", opacity: open ? 1 : 0 }}
      >
        <p className="text-sm leading-relaxed pt-4 pl-[72px]" style={{ color: "rgba(255,255,255,0.42)" }}>
          {feature.description}
        </p>
      </div>
    </button>
  );
}
