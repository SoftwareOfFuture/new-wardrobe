"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/storefront/Footer";

interface ConditionalFooterProps {
  brand?: string;
  footerText?: string;
  copyright?: string;
  phone?: string;
  email?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  whatsapp?: string;
}

// Sayfalarda footer gösterilmez
const NO_FOOTER_PATHS = ["/oda-planlayici"];

export function ConditionalFooter(props: ConditionalFooterProps) {
  const pathname = usePathname();
  if (NO_FOOTER_PATHS.some((p) => pathname.startsWith(p))) return null;
  return <Footer {...props} />;
}
