"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BedDouble, UtensilsCrossed, Armchair, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: BedDouble,
    title: "Otel Odası Mobilyaları",
    desc: "Yatak başlıkları, komodiner, TV üniteleri, sandıklar ve tüm oda mobilyası çözümleri.",
    items: ["Yatak Başlığı & Karyola", "Komodin & Sandık", "TV Ünitesi", "Bagaj Sehpası"],
  },
  {
    icon: UtensilsCrossed,
    title: "Restoran & Lobi",
    desc: "Lobi girişlerinden restoran içlerine kadar bütünleşik tasarım ve üretim hizmeti.",
    items: ["Resepsiyon Tezgahı", "Lobi Koltukları", "Restoran Masa-Sandalye", "Bar Ünitesi"],
  },
  {
    icon: Armchair,
    title: "Özel Bölge & SPA",
    desc: "SPA, wellness, toplantı odaları ve ortak alanlara özel tasarım mobilya koleksiyonları.",
    items: ["SPA Şezlong", "Toplantı Odası", "Fitness Alanı", "Açık Alan Mobilyaları"],
  },
  {
    icon: Briefcase,
    title: "Kurumsal & Ofis",
    desc: "Otel back-office, yönetim binaları ve kurumsal mekanlar için ergonomik çözümler.",
    items: ["Yönetici Ofisleri", "Açık Ofis Sistemleri", "Toplantı Masaları", "Depolama Üniteleri"],
  },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(".svc-row", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#D4A853" }}>
              Hizmetlerimiz
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
              Her Alana Özel <span className="text-gradient-gold">Çözümler</span>
            </h2>
          </div>
          <p className="text-sm leading-relaxed sm:max-w-xs sm:text-right" style={{ color: "rgba(255,255,255,0.45)" }}>
            5 yıldızlı otelden butik tesislere, her konsept ve bütçeye uygun üretim.
          </p>
        </div>

        {/* Service rows */}
        <div>
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div
                key={i}
                className="svc-row group"
                style={{ borderTop: i === 0 ? "1px solid rgba(212,168,83,0.15)" : undefined }}
              >
                <div
                  className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-10 py-7 sm:py-9 transition-colors duration-300"
                  style={{ borderBottom: "1px solid rgba(212,168,83,0.15)" }}
                >
                  {/* Icon + title block */}
                  <div className="flex items-center gap-4 lg:w-72 shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300"
                      style={{ background: "rgba(212,168,83,0.08)" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "#D4A853" }} />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
                      {svc.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed lg:flex-1"
                    style={{ color: "rgba(255,255,255,0.48)" }}
                  >
                    {svc.desc}
                  </p>

                  {/* Items */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 lg:w-64 shrink-0">
                    {svc.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-xs"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        <div
                          className="w-1 h-1 rounded-full shrink-0"
                          style={{ background: "#D4A853", opacity: 0.5 }}
                        />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Arrow — desktop only */}
                  <div className="hidden lg:flex items-center shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
                      style={{
                        border: "1px solid rgba(212,168,83,0.2)",
                        color: "#D4A853",
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-14">
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
