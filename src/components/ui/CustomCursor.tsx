"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const INTERACTIVE_SELECTOR = "a, button, [data-cursor], input, textarea, select, [role='button']";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
      if (!isVisible) setIsVisible(true);
    };

    // Event delegation — single listener on document, no MutationObserver needed
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE_SELECTOR)) {
        setIsPointer(true);
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE_SELECTOR)) {
        setIsPointer(false);
      }
    };

    const onLeaveWindow = () => setIsHidden(true);
    const onEnterWindow = () => setIsHidden(false);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
    };
  }, []); // empty deps — no re-registration

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.style.cursor = "none";
    return () => { document.documentElement.style.cursor = ""; };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: isPointer ? "8px" : "6px",
          height: isPointer ? "8px" : "6px",
          borderRadius: "50%",
          background: "#D4A853",
          opacity: isHidden ? 0 : isVisible ? 1 : 0,
          transition: "width 0.2s, height 0.2s, opacity 0.3s",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: isPointer ? "48px" : "36px",
          height: isPointer ? "48px" : "36px",
          borderRadius: "50%",
          border: `1.5px solid ${isPointer ? "#D4A853" : "rgba(212,168,83,0.5)"}`,
          opacity: isHidden ? 0 : isVisible ? 1 : 0,
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.2s, opacity 0.3s",
          willChange: "transform",
        }}
      />
    </>
  );
}
