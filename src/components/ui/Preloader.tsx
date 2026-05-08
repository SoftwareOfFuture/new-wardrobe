"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function Preloader({ text = "NEW WARDROBE" }: { text?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Skip preloader on subsequent navigations within the same session
    if (sessionStorage.getItem("nw_loaded") === "1") {
      setShow(false);
      return;
    }
    sessionStorage.setItem("nw_loaded", "1");

    const container = containerRef.current;
    const text = textRef.current;
    const line = lineRef.current;
    const count = countRef.current;
    if (!container || !text || !line || !count) return;

    const tl = gsap.timeline({
      onComplete: () => setShow(false),
    });

    // Count from 0 to 100
    tl.to(count, {
      innerHTML: 100,
      duration: 1.8,
      ease: "power2.inOut",
      snap: { innerHTML: 1 },
      roundProps: "innerHTML",
    }, 0);

    // Line grows
    tl.to(line, {
      scaleX: 1,
      duration: 1.8,
      ease: "power2.inOut",
    }, 0);

    // Logo appears
    tl.from(text, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    }, 0.2);

    // Logo glows briefly
    tl.to(text, {
      textShadow: "0 0 40px rgba(212,168,83,0.8)",
      duration: 0.4,
    }, 1.6);

    tl.to(text, {
      textShadow: "0 0 0px rgba(212,168,83,0)",
      duration: 0.3,
    }, 2.0);

    // Panels slide up to reveal site
    tl.to(panelsRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut",
      stagger: 0.06,
    }, 2.1);

    // Fade out container
    tl.to(container, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => setShow(false),
    }, 2.7);

    return () => { tl.kill(); };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
      style={{ background: "#09090b" }}
    >
      {/* Split panels */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          ref={(el) => { if (el) panelsRef.current[i] = el; }}
          className="absolute inset-y-0"
          style={{
            left: `${i * 20}%`,
            width: "20%",
            background: i % 2 === 0 ? "#09090b" : "#0f0f0f",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center">
        <div
          ref={textRef}
          className="text-5xl sm:text-7xl font-bold tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-heading, serif)" }}
        >
          {(() => {
            const parts = text.split(" ");
            const first = parts[0];
            const rest = parts.slice(1).join(" ");
            return (
              <>
                <span style={{ color: "#D4A853" }}>{first}</span>
                {rest && <> <span className="text-white">{rest}</span></>}
              </>
            );
          })()}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <div
            ref={lineRef}
            className="h-px flex-1 origin-left"
            style={{ background: "#D4A853", transform: "scaleX(0)" }}
          />
          <span
            ref={countRef}
            className="text-sm font-mono tabular-nums"
            style={{ color: "#D4A853", minWidth: "3ch" }}
          >
            0
          </span>
          <span className="text-sm font-mono" style={{ color: "#D4A853" }}>%</span>
        </div>
      </div>
    </div>
  );
}
