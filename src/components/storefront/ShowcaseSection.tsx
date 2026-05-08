"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Sparkles, Layers3, Paintbrush, Box } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const showcaseItems = [
  {
    icon: Box,
    title: "3D Deneyim",
    description:
      "Ürünlerimizi gerçekçi 3D modeller ile her açıdan inceleyin. Döndürün, yakınlaştırın, detayları keşfedin.",
    tag: "Teknoloji",
  },
  {
    icon: Layers3,
    title: "Oda Planlayıcı",
    description:
      "IKEA tarzı sürükle-bırak ile odanızı sanal ortamda tasarlayın. Gerçek boyutlar, gerçek hisler.",
    tag: "Araçlar",
  },
  {
    icon: Paintbrush,
    title: "Özel Tasarım",
    description: "İhtiyaçlarınıza özel premium mobilya çözümleri. Her mekan için benzersiz tasarım.",
    tag: "Hizmet",
  },
  {
    icon: Sparkles,
    title: "AI Dönüşüm",
    description:
      "Fotoğraftan 3D model oluşturun. Yapay zeka destekli teknoloji ile hayallerinizi gerçeğe dönüştürün.",
    tag: "Yapay Zeka",
  },
];

export function ShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      // Vertical timeline line grows
      gsap.to(".showcase-bg-line", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 50%",
          scrub: true,
        },
      });

      // Alternating slide-in for each item
      const cards = containerRef.current.querySelectorAll(".showcase-card");
      cards.forEach((card, i) => {
        const isEven = i % 2 === 0;
        gsap.from(card, {
          x: isEven ? -80 : 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });

        // Icon pop
        const icon = card.querySelector(".showcase-icon");
        gsap.from(icon, {
          scale: 0,
          rotation: -30,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-32 px-6 relative overflow-hidden">
      {/* Center vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none overflow-hidden hidden lg:block">
        <div
          className="showcase-bg-line w-full h-full origin-top scale-y-0"
          style={{ background: "linear-gradient(180deg, transparent, rgba(212,168,83,0.25) 20%, rgba(212,168,83,0.25) 80%, transparent)" }}
        />
      </div>

      {/* Section header */}
      <div className="max-w-5xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-medium tracking-widest uppercase"
            style={{
              background: "rgba(212,168,83,0.08)",
              border: "1px solid rgba(212,168,83,0.2)",
              color: "#D4A853",
            }}
          >
            Özelliklerimiz
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Mobilya Alışverişini{" "}
            <span className="text-gradient-gold">Yeniden Keşfedin</span>
          </h2>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto space-y-28">
        {showcaseItems.map((item, i) => (
          <div
            key={item.title}
            className={`showcase-card flex flex-col lg:flex-row items-center gap-12 ${
              i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            }`}
          >
            {/* Text content */}
            <div className="flex-1 space-y-5">
              <div
                className="inline-block px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase"
                style={{
                  background: "rgba(212,168,83,0.08)",
                  border: "1px solid rgba(212,168,83,0.15)",
                  color: "#D4A853",
                }}
              >
                {item.tag}
              </div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="showcase-icon inline-flex items-center justify-center w-16 h-16 rounded-2xl"
                style={{
                  background: "rgba(212,168,83,0.08)",
                  border: "1px solid rgba(212,168,83,0.15)",
                  boxShadow: "0 0 30px rgba(212,168,83,0.1)",
                }}
              >
                <item.icon className="w-8 h-8 text-primary" />
              </motion.div>

              <h3 className="text-2xl sm:text-3xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-base max-w-sm">
                {item.description}
              </p>

              <div className="flex items-center gap-2 text-sm text-primary group cursor-pointer w-fit">
                <span>Daha fazla bilgi</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </div>
            </div>

            {/* Visual placeholder */}
            <div className="flex-1 w-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="aspect-[4/3] rounded-2xl overflow-hidden relative"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(212,168,83,0.1)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                {/* Inner glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)",
                    }}
                  />
                  <item.icon className="absolute w-16 h-16 text-primary/10" />
                </div>
                {/* Corner dots */}
                {[["top-3 left-3"], ["top-3 right-3"], ["bottom-3 left-3"], ["bottom-3 right-3"]].map(([pos], idx) => (
                  <div key={idx} className={`absolute ${pos} w-1.5 h-1.5 rounded-full`}
                    style={{ background: "rgba(212,168,83,0.3)" }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
