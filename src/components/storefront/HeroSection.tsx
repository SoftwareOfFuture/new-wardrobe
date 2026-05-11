"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Phone, CheckCircle2 } from "lucide-react";
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
  const size = 1.5 + seededRandom(index * 7) * 2.5;
  const duration = 10 + seededRandom(index * 13) * 14;
  const delay = seededRandom(index * 3) * 8;
  const startX = seededRandom(index * 5) * 100;
  const startY = 40 + seededRandom(index * 11) * 60;
  const opacity = 0.3 + seededRandom(index * 17) * 0.5;
  const driftY = -90 - seededRandom(index * 19) * 60;
  const driftX = (seededRandom(index * 23) - 0.5) * 50;

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

/* ── stats shown on ALL viewports ───────────────────────────── */
const STATS = [
  { val: "500+",     label: "Tamamlanan Proje"  },
  { val: "12",       label: "Yıllık Tecrübe"    },
  { val: "5★",       label: "Otel Standartı"    },
  { val: "5.000 m²", label: "Üretim Tesisi"     },
];

/* ── desktop card features ──────────────────────────────────── */
const CARD_FEATURES = [
  "CNC Teknolojisi ile Üretim",
  "5 Yıldızlı Otel Standardı",
  "Tüm Türkiye'ye Montaj",
  "Garanti & Teknik Destek",
];

export function HeroSection({
  title = "Otel Mobilyasında 12 Yıllık Tecrübe",
  subtitle = "Antalya merkezli üretim tesisimizde CNC teknolojisi ve deneyimli ekibimizle 5 yıldızlı otellere özel mobilya üretiyoruz.",
  bgImage,
}: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef  = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLHeadingElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const badgeRef      = useRef<HTMLDivElement>(null);
  const bgImgRef      = useRef<HTMLDivElement>(null);
  const lineRef       = useRef<HTMLDivElement>(null);
  const statsRef      = useRef<HTMLDivElement>(null);
  const floatCardRef  = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(
        [titleRef.current, subtitleRef.current, ctaRef.current,
         badgeRef.current, statsRef.current, floatCardRef.current],
        { opacity: 1, y: 0, x: 0 }
      );
      return;
    }

    /* ── title char animation ── */
    if (titleRef.current) {
      const split = new SplitType(titleRef.current, { types: "chars,words" });
      gsap.from(split.chars || [], {
        y: 100, opacity: 0, rotateX: -80,
        duration: 0.85, ease: "power4.out",
        stagger: 0.02, delay: 0.6,
        transformOrigin: "0% 50% -40",
      });
    }

    gsap.from(badgeRef.current,     { y: -16, opacity: 0, duration: 0.6,  delay: 0.35, ease: "power3.out" });
    gsap.from(lineRef.current,      { scaleX: 0, duration: 1.4, delay: 1.35, ease: "power3.inOut", transformOrigin: "center" });
    gsap.from(subtitleRef.current,  { y: 24,  opacity: 0, duration: 0.9,  delay: 1.3,  ease: "power3.out" });
    gsap.from(ctaRef.current,       { y: 20,  opacity: 0, duration: 0.8,  delay: 1.55, ease: "power3.out" });
    gsap.from(statsRef.current,     { y: 20,  opacity: 0, duration: 0.8,  delay: 1.8,  ease: "power3.out" });
    gsap.from(floatCardRef.current, { x: 40,  opacity: 0, duration: 1.0,  delay: 1.9,  ease: "power3.out" });

    /* ── parallax bg ── */
    if (bgImgRef.current) {
      gsap.to(bgImgRef.current, {
        yPercent: 28, ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", end: "bottom top", scrub: true,
        },
      });
    }
  }, { scope: containerRef });

  useEffect(() => { setMounted(true); }, []);

  /* title split — first 3 words get the gold gradient */
  const words = title.split(" ");
  const line1 = words.slice(0, 3).join(" ");
  const line2 = words.slice(3).join(" ");

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Background ─────────────────────────────────────────── */}
      <div ref={bgImgRef} className="absolute inset-0 scale-110">
        {bgImage ? (
          <>
            <Image
              src={bgImage} alt="Urban Mobilya Üretim" fill
              className="object-cover" style={{ opacity: 0.35 }}
              priority sizes="100vw"
            />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(180deg,rgba(9,9,11,.55) 0%,rgba(9,9,11,.25) 35%,rgba(9,9,11,.45) 65%,rgba(9,9,11,.98) 100%)" }} />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(90deg,rgba(9,9,11,.5) 0%,transparent 50%,rgba(9,9,11,.3) 100%)" }} />
          </>
        ) : (
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 60% 40%,rgba(212,168,83,.08) 0%,transparent 60%)" }} />
        )}
      </div>

      {/* ── Decorative layers ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[38%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px]"
          style={{ background: "radial-gradient(ellipse,rgba(212,168,83,.09) 0%,transparent 65%)", filter: "blur(4px)" }} />
        <div className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle,rgba(212,168,83,.18) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%,black 30%,transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%,black 30%,transparent 75%)",
          }} />
        {[500, 700, 900].map((w) => (
          <div key={w} className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: w, height: w * 0.6, border: "1px solid rgba(212,168,83,.06)" }} />
        ))}
      </div>

      {/* ── Particles ──────────────────────────────────────────── */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 28 }).map((_, i) => <Particle key={i} index={i} />)}
        </div>
      )}

      <HeroScene3D />

      {/* ── Main content ───────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 lg:gap-14 items-center">

          {/* ════ LEFT column — text ════════════════════════════ */}
          <div>

            {/* Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-2 mb-6 sm:mb-8">
              <div className="w-6 h-px" style={{ background: "#D4A853" }} />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: "#D4A853" }}>
                Otel Mobilyası Uzmanı
              </span>
              <div className="w-6 h-px" style={{ background: "#D4A853" }} />
            </div>

            {/* Title */}
            <h1
              ref={titleRef}
              className="font-black leading-[0.9] tracking-tight overflow-hidden mb-5"
              style={{ fontSize: "clamp(2.5rem, 6.5vw, 88px)", perspective: "1000px" }}
            >
              <span className="block"
                style={{
                  background: "linear-gradient(135deg,#F0D070 0%,#D4A853 45%,#C49640 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                {line1}
              </span>
              {line2 && <span className="block text-white/90">{line2}</span>}
            </h1>

            {/* Gold line */}
            <div ref={lineRef} className="mb-6"
              style={{ width: 80, height: 2, background: "linear-gradient(90deg,#D4A853,rgba(212,168,83,.2))" }} />

            {/* Subtitle */}
            <p ref={subtitleRef}
              className="text-sm sm:text-base lg:text-[1.05rem] leading-relaxed mb-8 sm:mb-10 max-w-xl"
              style={{ color: "rgba(255,255,255,.55)" }}>
              {subtitle}
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-10 sm:mb-12">
              <Link
                href="/projelerimiz"
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-105"
                style={{ background: "#D4A853", color: "#09090b" }}
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  Projelerimizi Keşfet
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
              </Link>

              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.7)", background: "rgba(255,255,255,.04)", backdropFilter: "blur(10px)" }}
              >
                <Phone className="w-4 h-4" />
                Teklif Al
              </Link>
            </div>

            {/* Stats strip — visible on ALL viewport sizes */}
            <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {STATS.map(({ val, label }, i) => (
                <div
                  key={i}
                  className="rounded-2xl px-4 py-3.5"
                  style={{
                    background: i % 2 === 0 ? "rgba(212,168,83,.07)" : "rgba(255,255,255,.03)",
                    border: "1px solid rgba(212,168,83,.14)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    className="text-2xl sm:text-[1.65rem] font-black leading-none mb-1"
                    style={{
                      background: "linear-gradient(135deg,#F0D070,#D4A853)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}
                  >
                    {val}
                  </div>
                  <div className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,.38)" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ════ RIGHT column — glassmorphism card (desktop only) */}
          <div ref={floatCardRef} className="hidden lg:block">
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "rgba(9,9,11,.65)",
                backdropFilter: "blur(28px) saturate(160%)",
                WebkitBackdropFilter: "blur(28px) saturate(160%)",
                border: "1px solid rgba(255,255,255,.09)",
                boxShadow: "0 30px 80px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.07)",
              }}
            >
              {/* Card header */}
              <div className="px-6 py-5 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#D4A853" }}>
                    Urban Mobilya
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,.8)" }}>Projeye Hazır</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#D4A853" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "rgba(212,168,83,.7)" }}>Aktif</span>
                </div>
              </div>

              {/* Feature list */}
              <div className="px-6 py-5 space-y-3.5">
                {CARD_FEATURES.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#D4A853" }} />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,.65)" }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="mx-6" style={{ height: 1, background: "rgba(212,168,83,.1)" }} />

              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-3 p-6">
                {STATS.slice(0, 4).map(({ val, label }, i) => (
                  <div key={i} className="text-center rounded-xl py-3"
                    style={{ background: "rgba(212,168,83,.05)", border: "1px solid rgba(212,168,83,.1)" }}>
                    <div className="text-xl font-black mb-0.5"
                      style={{
                        background: "linear-gradient(135deg,#F0D070,#D4A853)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      }}>
                      {val}
                    </div>
                    <div className="text-[9px] font-medium" style={{ color: "rgba(255,255,255,.35)" }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <div className="px-6 pb-6">
                <Link
                  href="/iletisim"
                  className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] group"
                  style={{ background: "#D4A853", color: "#09090b" }}
                >
                  <span className="text-sm font-bold">Ücretsiz Keşif Talep Et</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────── */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,.25)" }}>Scroll</span>
          <ChevronDown className="w-4 h-4" style={{ color: "rgba(212,168,83,.5)" }} />
        </motion.div>
      </div>
    </section>
  );
}
