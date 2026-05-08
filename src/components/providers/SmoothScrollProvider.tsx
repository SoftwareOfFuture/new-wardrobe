"use client";

/**
 * SmoothScrollProvider — basitleştirildi.
 *
 * Lenis kaldırıldı: GSAP ticker'a bağlı Lenis, ağır 3D sahneler ve
 * çok sayıda ScrollTrigger varken RAF loop'unu tıkıyor ve scroll'u donduruyor.
 * Native browser scroll son derece performanslı; CSS scroll-behavior ile
 * anchor geçişleri zaten smooth.
 *
 * GSAP ScrollTrigger native scroll'u doğrudan dinler — herhangi bir proxy'e
 * gerek yok.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
