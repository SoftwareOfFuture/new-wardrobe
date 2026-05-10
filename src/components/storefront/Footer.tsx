import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle, ArrowUpRight, ExternalLink } from "lucide-react";

interface FooterProps {
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

const NAV_LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Ürünler", href: "/urunler" },
  { label: "Projelerimiz", href: "/projelerimiz" },
  { label: "Urban Creative", href: "/oda-planlayici" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
];

const SERVICES = [
  "Otel Odası Mobilyası",
  "Restoran & Lobi",
  "SPA & Wellness",
  "Kurumsal & Ofis",
  "Anahtar Teslim Proje",
  "3D Tasarım Hizmeti",
];

export function Footer({
  brand = "URBAN MOBİLYA",
  footerText = "5 yıldızlı otellere özel mobilya üretimi. Antalya'dan Türkiye'ye ve dünyaya.",
  copyright,
  phone = "",
  email = "",
  address = "",
  instagram = "",
  facebook = "",
  linkedin = "",
  whatsapp = "",
}: FooterProps) {
  const brandParts = brand.split(" ");
  const brandFirst = brandParts[0];
  const brandRest = brandParts.slice(1).join(" ");
  const year = new Date().getFullYear();
  const copyrightText = copyright || `© ${year} ${brand}`;

  const socialLinks = [
    instagram && { href: instagram, label: "Instagram" },
    facebook && { href: facebook, label: "Facebook" },
    linkedin && { href: linkedin, label: "LinkedIn" },
    whatsapp && { href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`, label: "WhatsApp" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="relative overflow-hidden" style={{ background: "oklch(0.075 0.004 260)" }}>
      {/* Top gold line */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(212,168,83,0.4) 30%, rgba(212,168,83,0.8) 50%, rgba(212,168,83,0.4) 70%, transparent 100%)" }} />

      {/* Ambient glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle at top left, rgba(212,168,83,0.04) 0%, transparent 60%)" }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(circle at bottom right, rgba(212,168,83,0.03) 0%, transparent 60%)" }} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10">

        {/* Top section: Big brand + tagline */}
        <div className="mb-10 sm:mb-14 pb-10 sm:pb-14" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.02em] mb-3">
                <span style={{
                  background: "linear-gradient(135deg, #F0D070 0%, #D4A853 50%, #B8902E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  {brandFirst}
                </span>
                {brandRest && <span className="text-white/80"> {brandRest}</span>}
              </div>
              <p className="text-base text-white/40 max-w-sm leading-relaxed">{footerText}</p>
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map(({ href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="footer-social-link inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-14">

          {/* Col 1: Company info */}
          <div className="col-span-1 space-y-4">
            <h5 className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "#D4A853" }}>
              Şirket
            </h5>
            <div className="space-y-3">
              {address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-white/40 hover:text-white/70 transition-colors group cursor-pointer"
                >
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 group-hover:text-primary transition-colors" style={{ color: "#D4A853", opacity: 0.7 }} />
                  <span className="leading-relaxed">{address}</span>
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`}
                  className="flex items-center gap-2.5 text-sm text-white/40 hover:text-white/70 transition-colors group cursor-pointer">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: "#D4A853", opacity: 0.7 }} />
                  {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-sm text-white/40 hover:text-white/70 transition-colors group cursor-pointer">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: "#D4A853", opacity: 0.7 }} />
                  {email}
                </a>
              )}
              {!address && !phone && !email && (
                <p className="text-sm text-white/30">Antalya, Türkiye</p>
              )}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "#D4A853" }}>
              Sayfalar
            </h5>
            <nav className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-1 text-sm text-white/40 hover:text-white/80 transition-colors"
                >
                  <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-200 text-xs" style={{ color: "#D4A853" }}>›</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "#D4A853" }}>
              Hizmetler
            </h5>
            <ul className="space-y-2.5">
              {SERVICES.map((svc) => (
                <li key={svc} className="text-sm text-white/35 leading-snug">{svc}</li>
              ))}
            </ul>
          </div>

          {/* Col 4: CTA card */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "#D4A853" }}>
              Proje Danışma
            </h5>
            <div className="rounded-2xl p-5 space-y-4"
              style={{ background: "rgba(212,168,83,0.05)", border: "1px solid rgba(212,168,83,0.12)" }}>
              <p className="text-sm text-white/50 leading-relaxed">
                Projeniz için ücretsiz keşif ve teklif alın.
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:gap-2.5 group"
                style={{ color: "#D4A853" }}
              >
                Hemen Başlayın
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {[
                "✓ Ücretsiz Keşif",
                "✓ 5 Yıl Garanti",
                "✓ Türkiye Geneli",
              ].map((item) => (
                <p key={item} className="text-xs text-white/30">{item}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-6 sm:pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs text-white/25 text-center sm:text-left">{copyrightText}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <span className="text-xs text-white/25 cursor-pointer hover:text-white/50 transition-colors">Gizlilik Politikası</span>
            <span className="text-white/10 hidden sm:inline">·</span>
            <span className="text-xs text-white/25 cursor-pointer hover:text-white/50 transition-colors">Kullanım Şartları</span>
            <span className="text-white/10 hidden sm:inline">·</span>
            <span className="text-xs font-medium" style={{ color: "rgba(212,168,83,0.5)" }}>
              Antalya
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
