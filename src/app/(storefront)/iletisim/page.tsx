import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";
import { ContactForm } from "@/components/storefront/ContactForm";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: settings["pagetitle.contact"] || "İletişim" };
}

export default async function ContactPage() {
  const settings = await getSettings();

  const phone    = settings["contact.phone"]    || "+90 242 427 46 48";
  const email    = settings["contact.email"]    || "info@urbanmobilya.com.tr";
  const email2   = settings["contact.email2"]   || "";
  const address  = settings["contact.address"]  || "Hacıaliler Mh. Aksu Cd. No:73/1 Aksu / Antalya";
  const mapsUrl  = settings["contact.maps_url"] || "https://maps.google.com";
  const pageTitle    = settings["contact_page.title"]    || "İletişim";
  const pageSubtitle = settings["contact_page.subtitle"] || "Projeniz için bizimle iletişime geçin.";

  const contactItems = [
    { icon: Phone,   label: "Telefon",     value: phone,   href: `tel:${phone.replace(/\s/g,"")}` },
    { icon: Mail,    label: "E-posta",     value: email,   href: `mailto:${email}` },
    ...(email2 ? [{ icon: Mail, label: "Genel Müdür", value: email2, href: `mailto:${email2}` }] : []),
    { icon: MapPin,  label: "Adres",       value: address, href: mapsUrl },
    { icon: Clock,   label: "Çalışma Saatleri", value: "Pzt – Cts: 08:00 – 18:00", href: null },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
            style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}>
            Bize Ulaşın
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
            <span className="text-gradient-gold">{pageTitle}</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {pageSubtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Contact info cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactItems.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                {item.href ? (
                  <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:glow-gold-subtle cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="p-3 rounded-xl shrink-0 transition-colors group-hover:bg-primary/20"
                      style={{ background: "rgba(212,168,83,0.1)" }}>
                      <item.icon className="w-5 h-5" style={{ color: "#D4A853" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{item.value}</p>
                    </div>
                    {item.href.startsWith("http") && (
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1 ml-auto" />
                    )}
                  </a>
                ) : (
                  <div className="flex items-start gap-4 p-5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="p-3 rounded-xl shrink-0" style={{ background: "rgba(212,168,83,0.1)" }}>
                      <item.icon className="w-5 h-5" style={{ color: "#D4A853" }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                )}
              </ScrollReveal>
            ))}

            {/* Map embed placeholder */}
            <ScrollReveal delay={0.4}>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="group block relative rounded-2xl overflow-hidden aspect-[4/3]"
                style={{ background: "rgba(212,168,83,0.05)", border: "1px solid rgba(212,168,83,0.15)" }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="p-4 rounded-full" style={{ background: "rgba(212,168,83,0.15)" }}>
                    <MapPin className="w-6 h-6" style={{ color: "#D4A853" }} />
                  </div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">Haritada Görüntüle</p>
                  <p className="text-xs text-muted-foreground text-center px-6 leading-relaxed">{address}</p>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(212,168,83,0.03)" }} />
              </a>
            </ScrollReveal>
          </div>

          {/* Contact form */}
          <ScrollReveal className="lg:col-span-3" direction="right" delay={0.15}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
