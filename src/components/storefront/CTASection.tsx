"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin, Clock, Shield } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  btnText?: string;
}

const TRUST = [
  { icon: Clock,  label: "Ücretsiz Keşif Ziyareti"  },
  { icon: Shield, label: "5 Yıl Garanti"             },
  { icon: MapPin, label: "Türkiye Geneli Montaj"     },
];

export function CTASection({
  title   = "Projeniz için Teklif Alın",
  subtitle = "Otel mobilyası ihtiyaçlarınız için ücretsiz keşif ve proje geliştirme hizmetimizden yararlanın.",
  btnText = "Ücretsiz Teklif Al",
}: CTASectionProps) {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const stripRef    = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(headingRef.current, {
      x: -50, opacity: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
    });
    gsap.from(rightRef.current, {
      x: 40, opacity: 0, duration: 0.9, delay: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
    });
    gsap.from(stripRef.current, {
      y: 20, opacity: 0, duration: 0.7, delay: 0.4, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
    });
  }, { scope: sectionRef });

  /* title word split: first half gold, second half white */
  const words  = title.split(" ");
  const half   = Math.ceil(words.length / 2);
  const goldPart  = words.slice(0, half).join(" ");
  const whitePart = words.slice(half).join(" ");

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "rgba(212,168,83,0.03)" }}
    >
      {/* top border */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(212,168,83,0.25),transparent)" }} />

      {/* bg radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 80% at 50% 50%,rgba(212,168,83,0.055) 0%,transparent 70%)" }} />

      {/* ── Main row ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16">

          {/* LEFT — heading */}
          <div ref={headingRef} className="flex-1">
            {/* eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ background: "#D4A853" }} />
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase"
                style={{ color: "#D4A853" }}>
                Hemen Başlayalım
              </span>
            </div>

            {/* heading */}
            <h2
              className="font-black leading-[1.0] tracking-tight mb-5"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 5rem)" }}
            >
              <span style={{
                backgroundImage: "linear-gradient(135deg,#F0D070 0%,#D4A853 50%,#C49640 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                {goldPart}
              </span>
              {whitePart && (
                <>
                  <br />
                  <span style={{ color: "rgba(255,255,255,0.88)" }}>{whitePart}</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.42)", maxWidth: "420px" }}>
              {subtitle}
            </p>
          </div>

          {/* RIGHT — CTA card */}
          <div ref={rightRef} className="lg:w-[360px] shrink-0">
            <div
              className="rounded-2xl p-7 sm:p-8 flex flex-col gap-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(212,168,83,0.18)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
            >
              {/* primary CTA */}
              <Link
                href="/iletisim"
                className="group relative flex items-center justify-between w-full px-6 py-4 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                style={{ background: "#D4A853", color: "#09090b" }}
              >
                <span className="relative z-10">{btnText}</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>

              {/* secondary CTA */}
              <Link
                href="/projelerimiz"
                className="flex items-center justify-between w-full px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "rgba(212,168,83,0.07)",
                  border: "1px solid rgba(212,168,83,0.15)",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                <span>Projelerimizi Gör</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* divider */}
              <div className="h-px" style={{ background: "rgba(212,168,83,0.1)" }} />

              {/* trust items */}
              <div className="space-y-3">
                {TRUST.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.18)" }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: "#D4A853" }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom stats strip ─────────────────────────────────── */}
      <div
        ref={stripRef}
        className="border-t"
        style={{ borderColor: "rgba(212,168,83,0.1)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 divide-x"
            style={{ "--tw-divide-opacity": 1, borderColor: "rgba(212,168,83,0.1)" } as React.CSSProperties}>
            {[
              { val: "500+", label: "Tamamlanan Proje" },
              { val: "12 Yıl", label: "Sektör Deneyimi"  },
              { val: "5.000 m²", label: "Üretim Alanı"   },
            ].map(({ val, label }, i) => (
              <div
                key={i}
                className="py-5 px-4 sm:px-8 text-center"
                style={{ borderColor: "rgba(212,168,83,0.1)" }}
              >
                <div
                  className="text-lg sm:text-2xl font-black mb-0.5"
                  style={{
                    backgroundImage: "linear-gradient(135deg,#F0D070,#D4A853)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}
                >
                  {val}
                </div>
                <div className="text-[10px] sm:text-xs font-medium"
                  style={{ color: "rgba(255,255,255,0.35)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* bottom border */}
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(212,168,83,0.15),transparent)" }} />
    </section>
  );
}
