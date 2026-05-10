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
    desc: "Ücretsiz keşif ziyaretimizde ihtiyaçlarınızı analiz eder, ölçüm alır ve size özel tasarım dosyası hazırlarız.",
  },
  {
    number: "02",
    icon: Ruler,
    title: "Proje Geliştirme",
    desc: "Teknik çizimler, malzeme seçimi ve fiyat teklifini 3 iş günü içinde teslim ederiz. Onayınızla üretime geçeriz.",
  },
  {
    number: "03",
    icon: Factory,
    title: "CNC Üretim",
    desc: "Antalya tesisimizde CNC freze, boyahane ve demir hane süreçleri entegre yönetilerek üretim tamamlanır.",
  },
  {
    number: "04",
    icon: Truck,
    title: "Teslimat & Montaj",
    desc: "Profesyonel montaj ekibimiz tüm Türkiye ve yurt dışına kurulum gerçekleştirir. Garanti kapsamındayız.",
  },
];

export function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Line draw
    gsap.from(".process-line", {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.5,
      ease: "power2.inOut",
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
    });

    // Cards stagger
    gsap.from(".process-step", {
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-16 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Bg glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px]"
          style={{ background: "radial-gradient(ellipse, rgba(212,168,83,0.04) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="badge-gold mb-5">Nasıl Çalışıyoruz</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Projeden <span className="text-gradient-gold">Teslimata</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            4 adımda hayalinizdeki mobilyayı gerçeğe dönüştürüyoruz.
          </p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* Connector line */}
          <div className="process-line absolute top-16 left-[12.5%] right-[12.5%] h-px"
            style={{ background: "linear-gradient(90deg, #D4A853 0%, rgba(212,168,83,0.3) 100%)" }} />

          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="process-step flex flex-col items-center text-center group">
                  {/* Circle + icon */}
                  <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 group-hover:scale-110"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "2px solid rgba(212,168,83,0.35)",
                        boxShadow: "0 0 0 8px rgba(212,168,83,0.06)",
                      }}>
                      <Icon className="w-8 h-8" style={{ color: "#D4A853" }} />
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: "#D4A853", color: "#09090b" }}>
                      {step.number}
                    </div>
                    {/* Pulse ring on hover */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ boxShadow: "0 0 30px rgba(212,168,83,0.2)" }} />
                  </div>
                  <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="process-step flex gap-5 relative">
                {/* Vertical connector */}
                {i < steps.length - 1 && (
                  <div className="absolute left-7 top-16 w-px h-[calc(100%+24px)]"
                    style={{ background: "linear-gradient(180deg, rgba(212,168,83,0.4), rgba(212,168,83,0.05))" }} />
                )}
                <div className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center relative"
                  style={{ background: "rgba(212,168,83,0.08)", border: "1.5px solid rgba(212,168,83,0.3)" }}>
                  <Icon className="w-6 h-6" style={{ color: "#D4A853" }} />
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "#D4A853", color: "#09090b" }}>
                    {i + 1}
                  </div>
                </div>
                <div className="pt-1 pb-6">
                  <h3 className="font-bold text-base mb-1.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
