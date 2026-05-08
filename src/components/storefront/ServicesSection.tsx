"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { BedDouble, UtensilsCrossed, Armchair, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: BedDouble,
    title: "Otel Odası Mobilyaları",
    desc: "Yatak başlıkları, komodiner, TV üniteleri, sandıklar ve tüm oda mobilyası çözümleri.",
    items: ["Yatak Başlığı & Karyola", "Komodin & Sandık", "TV Ünitesi", "Bagaj Sehpası"],
    accent: "rgba(212,168,83,0.07)",
  },
  {
    icon: UtensilsCrossed,
    title: "Restoran & Lobi",
    desc: "Lobi girişlerinden restoran içlerine kadar bütünleşik tasarım ve üretim hizmeti.",
    items: ["Resepsiyon Tezgahı", "Lobi Koltukları", "Restoran Masa-Sandalye", "Bar Ünitesi"],
    accent: "rgba(120,80,180,0.07)",
  },
  {
    icon: Armchair,
    title: "Özel Bölge & SPA",
    desc: "SPA, wellness, toplantı odaları ve ortak alanlara özel tasarım mobilya koleksiyonları.",
    items: ["SPA Şezlong", "Toplantı Odası", "Fitness Alanı", "Açık Alan Mobilyaları"],
    accent: "rgba(30,120,80,0.07)",
  },
  {
    icon: Briefcase,
    title: "Kurumsal & Ofis",
    desc: "Otel back-office, yönetim binaları ve kurumsal mekanlar için ergonomik çözümler.",
    items: ["Yönetici Ofisleri", "Açık Ofis Sistemleri", "Toplantı Masaları", "Depolama Üniteleri"],
    accent: "rgba(212,100,30,0.07)",
  },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(".service-card", {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-28 px-6 relative overflow-hidden">
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.15), transparent)" }} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-gold mb-5">Hizmetlerimiz</div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Her Alana Özel <span className="text-gradient-gold">Çözümler</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            5 yıldızlı otelden butik tesislere, her konsept ve bütçeye uygun üretim yapıyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={i}
                className="service-card group relative rounded-2xl p-6 cursor-default overflow-hidden h-full"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                style={{
                  background: svc.accent,
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Hover border glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ border: "1px solid rgba(212,168,83,0.25)" }} />

                {/* Corner shimmer */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle at top right, rgba(212,168,83,0.08) 0%, transparent 70%)" }} />

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)" }}>
                  <Icon className="w-6 h-6" style={{ color: "#D4A853" }} />
                </div>

                <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors leading-snug">
                  {svc.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{svc.desc}</p>

                {/* Item list */}
                <ul className="space-y-1.5">
                  {svc.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full shrink-0" style={{ background: "#D4A853" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/iletisim"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 group"
            style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}>
            Projeniz İçin Görüşelim
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
