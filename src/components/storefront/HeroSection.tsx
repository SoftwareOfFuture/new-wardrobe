"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const HeroScene3D = dynamic(
  () => import("@/components/storefront/HeroScene3D").then((m) => m.HeroScene3D),
  { ssr: false }
);

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  bgImage?: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function Particle({ index }: { index: number }) {
  const size     = 1.5 + seededRandom(index * 7) * 2.5;
  const duration = 10  + seededRandom(index * 13) * 14;
  const delay    = seededRandom(index * 3) * 8;
  const startX   = seededRandom(index * 5) * 100;
  const startY   = 40  + seededRandom(index * 11) * 60;
  const opacity  = 0.3 + seededRandom(index * 17) * 0.5;
  const driftY   = -90 - seededRandom(index * 19) * 60;
  const driftX   = (seededRandom(index * 23) - 0.5) * 50;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: `${startX}%`, top: `${startY}%`,
        background: `rgba(212,168,83,${opacity})`,
        filter: `blur(${size > 3 ? 1 : 0}px)`,
      }}
      animate={{ y: [0, driftY, 0], x: [0, driftX, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const STATS = [
  { val: "500+",     label: "Tamamlanan Proje" },
  { val: "12",       label: "Yıllık Tecrübe"   },
  { val: "5★",       label: "Otel Standartı"   },
  { val: "5.000 m²", label: "Üretim Tesisi"    },
];

export function HeroSection({
  title    = "Otel Mobilyasında 12 Yıllık Tecrübe",
  subtitle = "Antalya merkezli üretim tesisimizde CNC teknolojisi ve deneyimli ekibimizle 5 yıldızlı otellere özel mobilya üretiyoruz.",
  bgImage,
}: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef  = useRef<HTMLDivElement>(null);
  const line1Ref      = useRef<HTMLSpanElement>(null);
  const line2Ref      = useRef<HTMLSpanElement>(null);
  const line3Ref      = useRef<HTMLSpanElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const badgeRef      = useRef<HTMLDivElement>(null);
  const statsRef      = useRef<HTMLDivElement>(null);
  const bgImgRef      = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current,
                subtitleRef.current, ctaRef.current, badgeRef.current, statsRef.current],
        { opacity: 1, y: 0 });
      return;
    }

    /* line3 ("Tecrübe") gets char-by-char — plain white, safe for SplitType */
    if (line3Ref.current) {
      const split = new SplitType(line3Ref.current, { types: "chars" });
      gsap.set(split.chars || [], { y: 60, opacity: 0 });
      gsap.to(split.chars || [], {
        y: 0, opacity: 1,
        duration: 0.7, ease: "power4.out",
        stagger: 0.04, delay: 0.85,
      });
    }

    /* lines 1 & 2 animate as whole blocks — gradient-safe */
    gsap.set(line1Ref.current, { y: 20, opacity: 0 });
    gsap.to(line1Ref.current,  { y: 0, opacity: 1, duration: 0.6, delay: 0.3,  ease: "power3.out" });

    gsap.set(line2Ref.current, { y: 40, opacity: 0 });
    gsap.to(line2Ref.current,  { y: 0, opacity: 1, duration: 0.8, delay: 0.55, ease: "power3.out" });

    gsap.from(badgeRef.current,    { y: -20, opacity: 0, duration: 0.6, delay: 0.15, ease: "power3.out" });
    gsap.from(subtitleRef.current, { y: 20,  opacity: 0, duration: 0.7, delay: 1.3,  ease: "power3.out" });
    gsap.from(ctaRef.current,      { y: 16,  opacity: 0, duration: 0.6, delay: 1.5,  ease: "power3.out" });
    gsap.from(statsRef.current,    { y: 16,  opacity: 0, duration: 0.6, delay: 1.7,  ease: "power3.out" });

    if (bgImgRef.current) {
      gsap.to(bgImgRef.current, {
        yPercent: 25, ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", end: "bottom top", scrub: true,
        },
      });
    }
  }, { scope: containerRef });

  useEffect(() => { setMounted(true); }, []);

  /* ── title display lines ─────────────────────────────────────
     line1: "Otel Mobilyasında" (small, muted)
     line2: "12 Yıllık"         (huge gold — the hero number)
     line3: "Tecrübe"           (large white)
  ──────────────────────────────────────────────────────────── */
  const words = title.split(" ");
  const line1 = words.slice(0, 2).join(" ");      // "Otel Mobilyasında"
  const line2 = words.slice(2, 4).join(" ");      // "12 Yıllık"
  const line3 = words.slice(4).join(" ");         // "Tecrübe"

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── Background ───────────────────────────────────────── */}
      <div ref={bgImgRef} className="absolute inset-0 scale-110">
        {bgImage ? (
          <>
            <Image
              src={bgImage} alt="Urban Mobilya" fill priority sizes="100vw"
              className="object-cover" style={{ opacity: 0.28 }}
            />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(180deg,rgba(9,9,11,.6) 0%,rgba(9,9,11,.2) 40%,rgba(9,9,11,.5) 70%,rgba(9,9,11,1) 100%)" }} />
          </>
        ) : (
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 35%,rgba(212,168,83,.07) 0%,transparent 65%)" }} />
        )}
      </div>

      {/* ── Dot grid ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle,rgba(212,168,83,.15) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 65% 55% at 50% 42%,black 25%,transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 42%,black 25%,transparent 72%)",
        }}
      />

      {/* ── Particles ────────────────────────────────────────── */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => <Particle key={i} index={i} />)}
        </div>
      )}

      <HeroScene3D />

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT  — centered, works identically on all sizes
      ══════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 pt-20 pb-10">
        <div className="w-full max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2.5 mb-8 sm:mb-10">
            <div className="h-px w-10" style={{ background: "#D4A853" }} />
            <span className="text-[10px] font-bold tracking-[0.28em] uppercase" style={{ color: "#D4A853" }}>
              Otel Mobilyası Uzmanı
            </span>
            <div className="h-px w-10" style={{ background: "#D4A853" }} />
          </div>

          {/* Title — editorial 3-line hierarchy */}
          <h1 className="font-black tracking-tight leading-none mb-6 sm:mb-8">

            {/* Line 1 — small muted label */}
            <span
              ref={line1Ref}
              className="block font-medium tracking-widest uppercase mb-3"
              style={{
                fontSize: "clamp(.7rem, 2.5vw, 1rem)",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.22em",
              }}
            >
              {line1}
            </span>

            {/* Line 2 — the BIG gold number/keyword (no SplitType — gradient-safe) */}
            <span
              ref={line2Ref}
              className="block"
              style={{
                fontSize: "clamp(4.5rem, 14vw, 11rem)",
                lineHeight: 0.9,
                backgroundImage: "linear-gradient(135deg,#F0D070 0%,#D4A853 45%,#C49640 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {line2}
            </span>

            {/* Line 3 — white word, gets char-by-char SplitType animation */}
            {line3 && (
              <span
                ref={line3Ref}
                className="block"
                style={{
                  fontSize: "clamp(2.2rem, 6.5vw, 5.5rem)",
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 1.05,
                }}
              >
                {line3}
              </span>
            )}
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-sm sm:text-base leading-relaxed mx-auto mb-9 sm:mb-10"
            style={{ color: "rgba(255,255,255,0.45)", maxWidth: "480px" }}
          >
            {subtitle}
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/projelerimiz"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center"
              style={{ background: "#D4A853", color: "#09090b" }}
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Projelerimizi Keşfet
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>

            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center"
              style={{
                border: "1px solid rgba(212,168,83,0.25)",
                color: "rgba(255,255,255,0.65)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)",
              }}
            >
              Teklif Al
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          STATS BAR  — desktop only (hidden on mobile)
      ══════════════════════════════════════════════════════ */}
      <div
        ref={statsRef}
        className="relative z-10 hidden sm:block"
        style={{ borderTop: "1px solid rgba(212,168,83,0.12)" }}
      >
        <div
          className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4"
          style={{ backdropFilter: "blur(12px)" }}
        >
          {STATS.map(({ val, label }, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 py-5 px-6 sm:py-6 sm:px-8"
              style={{
                borderRight: i < 3 ? "1px solid rgba(212,168,83,0.10)" : "none",
                /* on mobile 2-col: add bottom border to first row */
                borderBottom: i < 2 ? "1px solid rgba(212,168,83,0.10)" : "none",
              }}
            >
              <span
                className="font-black leading-none"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  backgroundImage: "linear-gradient(135deg,#F0D070,#D4A853)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {val}
              </span>
              <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────── */}
      <div className="absolute bottom-[88px] sm:bottom-[92px] left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 pointer-events-none">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[8px] tracking-[0.32em] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>Scroll</span>
          <ChevronDown className="w-3.5 h-3.5" style={{ color: "rgba(212,168,83,0.45)" }} />
        </motion.div>
      </div>
    </section>
  );
}
