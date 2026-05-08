"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";

interface NavbarProps {
  brand?: string;
  links?: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULT_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/projelerimiz", label: "Projelerimiz" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function Navbar({
  brand = "NEW WARDROBE",
  links = DEFAULT_LINKS,
  ctaLabel = "Teklif Al",
  ctaHref = "/iletisim",
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const brandParts = brand.split(" ");
  const brandFirst = brandParts[0];
  const brandRest = brandParts.slice(1).join(" ");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const isFirstLoad = sessionStorage.getItem("nw_loaded") !== "1";
    sessionStorage.setItem("nw_loaded", "1");
    gsap.fromTo(
      navRef.current,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: isFirstLoad ? 2.8 : 0, ease: "power3.out" }
    );
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3 border-b"
            : "bg-transparent py-5"
        )}
        style={scrolled ? {
          background: "rgba(9,9,11,0.85)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderColor: "rgba(255,255,255,0.07)",
        } : {}}
      >
        {/* Scroll progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-100"
          style={{
            width: `${scrollProgress}%`,
            background: "linear-gradient(90deg, #D4A853, #F0D070)",
            opacity: scrolled ? 1 : 0,
          }}
        />

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-0 shrink-0">
            <span
              className="text-base font-black tracking-[0.18em] uppercase transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #F0D070 0%, #D4A853 50%, #B8902E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {brandFirst}
            </span>
            {brandRest && (
              <span className="text-base font-black tracking-[0.18em] uppercase text-white/90 ml-1.5">
                {brandRest}
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    active
                      ? "text-white"
                      : "text-white/50 hover:text-white/85"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)" }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  {active && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "#D4A853" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href={ctaHref}
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: "#D4A853",
                color: "#09090b",
                boxShadow: "0 0 0 rgba(212,168,83,0)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(212,168,83,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 rgba(212,168,83,0)";
              }}
            >
              {ctaLabel}
            </Link>

            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at calc(100% - 52px) 28px)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at calc(100% - 52px) 28px)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at calc(100% - 52px) 28px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col lg:hidden"
            style={{ background: "rgba(9,9,11,0.97)", backdropFilter: "blur(20px)" }}
          >
            {/* Gold glow */}
            <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
              style={{ background: "radial-gradient(circle at top right, rgba(212,168,83,0.07) 0%, transparent 60%)" }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
              style={{ background: "radial-gradient(circle at bottom left, rgba(212,168,83,0.04) 0%, transparent 70%)" }} />

            <div className="flex flex-col justify-center h-full px-8 py-20">
              {/* Brand in menu */}
              <div className="mb-12 opacity-30 text-xs font-bold tracking-[0.3em] uppercase" style={{ color: "#D4A853" }}>
                {brand}
              </div>

              <nav className="space-y-1">
                {links.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.07, ease: [0.33, 1, 0.68, 1] }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center justify-between py-4 group border-b"
                        style={{ borderColor: "rgba(255,255,255,0.05)" }}
                      >
                        <span className={cn(
                          "text-3xl font-bold tracking-tight transition-colors",
                          active ? "text-gradient-gold" : "text-white/60 group-hover:text-white"
                        )}>
                          {link.label}
                        </span>
                        <ChevronRight className={cn(
                          "w-5 h-5 transition-all group-hover:translate-x-1",
                          active ? "opacity-100" : "opacity-20 group-hover:opacity-60"
                        )} style={{ color: "#D4A853" }} />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-10"
              >
                <Link
                  href={ctaHref}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all hover:scale-105"
                  style={{ background: "#D4A853", color: "#09090b" }}
                >
                  {ctaLabel}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
