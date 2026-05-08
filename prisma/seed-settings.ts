import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL ?? "",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const settings = [
  // ── GENEL ──────────────────────────────────────────────
  { key: "site.name",        label: "Site Adı",          group: "general", type: "text",    value: "Urban Mobilya" },
  { key: "site.tagline",     label: "Slogan",             group: "general", type: "text",    value: "Otel Mobilyasında 12 Yıllık Tecrübe" },
  { key: "site.brand",       label: "Marka Adı (Navbar)", group: "general", type: "text",    value: "NEW WARDROBE" },
  { key: "site.logo_url",    label: "Logo URL",           group: "general", type: "image",   value: "" },
  { key: "site.favicon_url", label: "Favicon URL",        group: "general", type: "image",   value: "" },
  { key: "site.preloader_text", label: "Preloader Metni", group: "general", type: "text",   value: "NEW WARDROBE" },

  // ── SEO ────────────────────────────────────────────────
  { key: "seo.title",       label: "Varsayılan Sayfa Başlığı", group: "seo", type: "text",     value: "Urban Mobilya | Otel Mobilyası Üreticisi" },
  { key: "seo.description", label: "Meta Açıklama",            group: "seo", type: "textarea", value: "Antalya merkezli Urban Mobilya, 12 yılı aşkın deneyimiyle Türkiye'nin önde gelen otel mobilyası üreticisidir." },
  { key: "seo.keywords",    label: "Anahtar Kelimeler",        group: "seo", type: "text",     value: "otel mobilyası, hotel furniture, antalya mobilya, özel üretim mobilya" },
  { key: "seo.og_image",    label: "OG Görseli URL",           group: "seo", type: "image",    value: "" },

  // ── İLETİŞİM ───────────────────────────────────────────
  { key: "contact.phone",    label: "Telefon",   group: "contact", type: "text",     value: "+90 242 427 46 48" },
  { key: "contact.email",    label: "E-posta",   group: "contact", type: "text",     value: "info@urbanmobilya.com.tr" },
  { key: "contact.email2",   label: "E-posta 2", group: "contact", type: "text",     value: "cihatgokalp@urbanmobilya.com.tr" },
  { key: "contact.address",  label: "Adres",     group: "contact", type: "textarea", value: "Hacıaliler Mh. Aksu Cd. No:73/1 Aksu / Antalya" },
  { key: "contact.maps_url", label: "Google Maps Linki", group: "contact", type: "text", value: "" },

  // ── SOSYAL MEDYA ──────────────────────────────────────
  { key: "social.instagram", label: "Instagram URL", group: "social", type: "text", value: "" },
  { key: "social.facebook",  label: "Facebook URL",  group: "social", type: "text", value: "" },
  { key: "social.linkedin",  label: "LinkedIn URL",  group: "social", type: "text", value: "" },
  { key: "social.youtube",   label: "YouTube URL",   group: "social", type: "text", value: "" },
  { key: "social.whatsapp",  label: "WhatsApp No",   group: "social", type: "text", value: "" },

  // ── NAVBAR ─────────────────────────────────────────────
  { key: "navbar.links", label: "Navigasyon Linkleri", group: "navbar", type: "json", value: JSON.stringify([
    { label: "Ana Sayfa",     href: "/" },
    { label: "Projelerimiz",  href: "/projelerimiz" },
    { label: "Oda Planlayıcı", href: "/oda-planlayici" },
    { label: "Hakkımızda",    href: "/hakkimizda" },
    { label: "İletişim",      href: "/iletisim" },
  ]) },
  { key: "navbar.cta_label", label: "CTA Buton Metni", group: "navbar", type: "text", value: "Projelerimizi Keşfet" },
  { key: "navbar.cta_href",  label: "CTA Buton Linki", group: "navbar", type: "text", value: "/projelerimiz" },

  // ── FOOTER ─────────────────────────────────────────────
  { key: "footer.text",      label: "Footer Açıklaması", group: "footer", type: "textarea", value: "Antalya merkezli üretim tesisimizde CNC teknolojisi ve deneyimli ekibimizle 5 yıldızlı otellere özel mobilya üretiyoruz." },
  { key: "footer.copyright", label: "Telif Hakkı",       group: "footer", type: "text",     value: "© 2025 Urban Mobilya. Tüm hakları saklıdır." },

  // ── ANA SAYFA ──────────────────────────────────────────
  { key: "home.hero_title",    label: "Hero Başlık",       group: "homepage", type: "text",     value: "Otel Mobilyasında 12 Yıllık Tecrübe" },
  { key: "home.hero_subtitle", label: "Hero Alt Başlık",   group: "homepage", type: "textarea", value: "Antalya merkezli üretim tesisimizde CNC teknolojisi ve deneyimli ekibimizle 5 yıldızlı otellere özel mobilya üretiyoruz." },
  { key: "home.hero_bg",       label: "Hero Arkaplan Görseli", group: "homepage", type: "image", value: "https://res.cloudinary.com/djghexldz/image/upload/v1778090569/new-wardrobe/portfolio/page01_img1_pwmaq5.jpg" },
  { key: "home.cta_title",     label: "CTA Başlık",        group: "homepage", type: "text",     value: "Projeniz için Teklif Alın" },
  { key: "home.cta_subtitle",  label: "CTA Alt Başlık",    group: "homepage", type: "textarea", value: "Otel mobilyası ihtiyaçlarınız için ücretsiz keşif ve proje geliştirme hizmetimizden yararlanın." },
  { key: "home.cta_btn",       label: "CTA Buton Metni",   group: "homepage", type: "text",     value: "Teklif Al" },

  // ── HAKKIMIZDA ─────────────────────────────────────────
  { key: "about.badge",       label: "Rozet Metni",        group: "about", type: "text",     value: "2025 Mobilya Tutkusuyla Tasarlıyoruz" },
  { key: "about.title",       label: "Başlık",             group: "about", type: "text",     value: "Şirketimiz Hakkında" },
  { key: "about.description", label: "Açıklama",           group: "about", type: "textarea", value: "Urban Mobilya olarak, kurulduğumuz günden bu yana otel mobilyası üretiminde edindiğimiz tecrübe ve iş disiplinimizle; konuk deneyimini artıran, uzun ömürlü ve şık çalışmalar ortaya koyuyoruz." },
  { key: "about.mission",     label: "Misyon Metni",       group: "about", type: "textarea", value: "Kaliteli üretim, zamanında teslimat ve müşteri memnuniyetini ilke edindik. Antalya merkezli üretim tesisimizde, son teknolojiyle donatılmış ekipmanlarımız ve deneyimli kadromuzla sektöre yenilikçi çözümler sunuyoruz." },

  // ── İLETİŞİM SAYFASI ───────────────────────────────────
  { key: "contact_page.title",    label: "Sayfa Başlığı",   group: "contact_page", type: "text",     value: "İletişim" },
  { key: "contact_page.subtitle", label: "Alt Başlık",      group: "contact_page", type: "textarea", value: "Projeniz için bizimle iletişime geçin. Antalya merkezli üretim tesisimizden size en hızlı şekilde dönüş sağlayalım." },

  // ── SAYFA BAŞLIKLARI (SEKMELERİ) ──────────────────────
  { key: "pagetitle.home",     label: "Ana Sayfa Sekmesi",       group: "pagetitles", type: "text", value: "Urban Mobilya | Otel Mobilyası Üreticisi" },
  { key: "pagetitle.projects", label: "Projelerimiz Sekmesi",    group: "pagetitles", type: "text", value: "Projelerimiz | Urban Mobilya" },
  { key: "pagetitle.about",    label: "Hakkımızda Sekmesi",      group: "pagetitles", type: "text", value: "Hakkımızda | Urban Mobilya" },
  { key: "pagetitle.contact",  label: "İletişim Sekmesi",        group: "pagetitles", type: "text", value: "İletişim | Urban Mobilya" },
  { key: "pagetitle.products", label: "Ürünler Sekmesi",         group: "pagetitles", type: "text", value: "Ürünler | Urban Mobilya" },
  { key: "pagetitle.planner",  label: "Oda Planlayıcı Sekmesi",  group: "pagetitles", type: "text", value: "Oda Planlayıcı | Urban Mobilya" },
];

async function main() {
  console.log("Seeding site settings...");
  let count = 0;
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { label: s.label, type: s.type, group: s.group },
      create: s,
    });
    count++;
  }
  console.log(`✓ ${count} settings seeded`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
