"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 500, suffix: "+", label: "Tamamlanan Proje", sub: "Yurt içi & yurt dışı" },
  { value: 12, suffix: "+", label: "Yıllık Deneyim", sub: "Sektörde köklü geçmiş" },
  { value: 5000, suffix: "", label: "m² Tesis Alanı", sub: "Antalya merkez" },
  { value: 98, suffix: "%", label: "Müşteri Memnuniyeti", sub: "Onaylı referanslar" },
];

function Counter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2400;
    const start = performance.now();
    const raf = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * p);
      setCount(Math.round(value * eased));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, value]);

  return <span className="tabular-nums">{count.toLocaleString("tr-TR")}{suffix}</span>;
}

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.25 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useGSAP(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(sectionRef.current.querySelectorAll(".stat-item"), {
      y: 40, opacity: 0, duration: 0.7,
      stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(212,168,83,0.03) 0%, rgba(212,168,83,0.06) 50%, rgba(212,168,83,0.03) 100%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)" }} />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="stat-item relative group py-8 px-6 text-center">
              {/* Dividers */}
              {i < stats.length - 1 && (
                <div className="absolute right-0 top-6 bottom-6 w-px hidden lg:block"
                  style={{ background: "linear-gradient(180deg, transparent, rgba(212,168,83,0.2), transparent)" }} />
              )}
              {(i === 0 || i === 2) && (
                <div className="absolute right-0 top-6 bottom-6 w-px lg:hidden"
                  style={{ background: "linear-gradient(180deg, transparent, rgba(212,168,83,0.15), transparent)" }} />
              )}

              {/* Number */}
              <div className="relative mb-1">
                <p className="font-black leading-none tracking-tight"
                  style={{
                    fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                    background: "linear-gradient(135deg, #F0D070 0%, #D4A853 50%, #B8902E 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                  <Counter value={stat.value} suffix={stat.suffix} inView={inView} />
                </p>
                {/* Glow under number */}
                <div className="absolute inset-x-0 bottom-0 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
                  style={{ background: "rgba(212,168,83,0.15)" }} />
              </div>

              <p className="text-sm font-semibold text-white/75 mb-0.5">{stat.label}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{stat.sub}</p>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-400"
                style={{ background: "linear-gradient(90deg, transparent, #D4A853, transparent)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
