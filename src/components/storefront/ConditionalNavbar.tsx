"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/storefront/Navbar";

interface ConditionalNavbarProps {
  brand?: string;
  links?: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
}

// Navbar gizlenen sayfalar
const NO_NAVBAR_PATHS = ["/oda-planlayici"];

export function ConditionalNavbar(props: ConditionalNavbarProps) {
  const pathname = usePathname();
  if (NO_NAVBAR_PATHS.some((p) => pathname.startsWith(p))) return null;
  return <Navbar {...props} />;
}
