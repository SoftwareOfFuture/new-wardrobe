import { Navbar } from "@/components/storefront/Navbar";
import { ConditionalFooter } from "@/components/storefront/ConditionalFooter";
import { Preloader } from "@/components/ui/Preloader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { getSettings, parseJsonSetting } from "@/lib/settings";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  const navLinks = parseJsonSetting<{ label: string; href: string }[]>(
    settings["navbar.links"],
    [
      { label: "Ana Sayfa", href: "/" },
      { label: "Projelerimiz", href: "/projelerimiz" },
      { label: "Oda Planlayıcı", href: "/oda-planlayici" },
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "İletişim", href: "/iletisim" },
    ]
  );

  return (
    <>
      <Preloader text={settings["site.preloader_text"] || "NEW WARDROBE"} />
      <CustomCursor />
      <SmoothScrollProvider>
        <Navbar
          brand={settings["site.brand"] || "NEW WARDROBE"}
          links={navLinks}
          ctaLabel={settings["navbar.cta_label"] || "Projelerimizi Keşfet"}
          ctaHref={settings["navbar.cta_href"] || "/projelerimiz"}
        />
        <main className="min-h-screen">{children}</main>
        <ConditionalFooter
          brand={settings["site.brand"] || "NEW WARDROBE"}
          footerText={settings["footer.text"] || ""}
          copyright={settings["footer.copyright"] || ""}
          phone={settings["contact.phone"] || ""}
          email={settings["contact.email"] || ""}
          address={settings["contact.address"] || ""}
          instagram={settings["social.instagram"] || ""}
          facebook={settings["social.facebook"] || ""}
          linkedin={settings["social.linkedin"] || ""}
          whatsapp={settings["social.whatsapp"] || ""}
        />
      </SmoothScrollProvider>
    </>
  );
}
