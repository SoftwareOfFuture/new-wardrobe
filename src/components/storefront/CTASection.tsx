"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  btnText?: string;
}

export function CTASection({
  title = "Projeniz için Teklif Alın",
  subtitle = "Otel mobilyası ihtiyaçlarınız için ücretsiz keşif ve proje geliştirme hizmetimizden yararlanın.",
  btnText = "Ücretsiz Teklif Al",
}: CTASectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.to(glowRef.current, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.from(contentRef.current, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-28 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div
          ref={contentRef}
          className="relative rounded-3xl overflow-hidden p-10 sm:p-16 lg:p-20"
        >
          {/* BG layers */}
          <div className="absolute inset-0"
            style={{ background: "rgba(212,168,83,0.04)", backdropFilter: "blur(20px)" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(212,168,83,0.07) 0%, transparent 50%, rgba(212,168,83,0.03) 100%)" }} />

          {/* Animated glow blob */}
          <div
            ref={glowRef}
            className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(212,168,83,0.14) 0%, transparent 70%)", filter: "blur(50px)" }}
          />

          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
            style={{ background: "radial-gradient(circle at top right, rgba(212,168,83,0.1) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 left-0 w-56 h-56 pointer-events-none"
            style={{ background: "radial-gradient(circle at bottom left, rgba(212,168,83,0.07) 0%, transparent 60%)" }} />

          {/* Border */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ border: "1px solid rgba(212,168,83,0.18)" }} />

          {/* Dots pattern */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #D4A853 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="badge-gold mb-8 mx-auto w-fit"
            >
              <Sparkles className="w-3 h-3" />
              Ücretsiz Keşif
            </motion.div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gradient-gold">{title.split(" ").slice(0, 3).join(" ")}</span>
              {title.split(" ").length > 3 && (
                <>
                  <br />
                  <span className="text-foreground">{title.split(" ").slice(3).join(" ")}</span>
                </>
              )}
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-12">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/iletisim"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:glow-gold-subtle"
                style={{ background: "#D4A853", color: "#09090b" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {btnText}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
              </Link>

              <Link
                href="/projelerimiz"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:border-primary/30"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Projelerimizi Gör
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              {[
                "✦ Ücretsiz Keşif",
                "✦ 5 Yıl Garanti",
                "✦ Türkiye Geneli Montaj",
              ].map((item) => (
                <span key={item} className="text-xs text-muted-foreground">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
