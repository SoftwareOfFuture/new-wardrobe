import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { HeroSection } from "@/components/storefront/HeroSection";
import { StatsSection } from "@/components/storefront/StatsSection";
import { CTASection } from "@/components/storefront/CTASection";
import { FeaturesSection } from "@/components/storefront/FeaturesSection";
import { ProcessSection } from "@/components/storefront/ProcessSection";
import { ServicesSection } from "@/components/storefront/ServicesSection";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Building2, Play } from "lucide-react";
import type { Metadata } from "next";

// Static facility images (Cloudinary)
const FACILITY_IMAGES = [
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090665/new-wardrobe/portfolio/page48_img1_pf1tnl.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090666/new-wardrobe/portfolio/page48_img2_wupuaj.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090667/new-wardrobe/portfolio/page49_img1_zevzoq.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090668/new-wardrobe/portfolio/page49_img2_qa4gx4.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090669/new-wardrobe/portfolio/page49_img3_qvnd9s.jpg",
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090670/new-wardrobe/portfolio/page50_img1_ws0uph.jpg",
];

const FALLBACK_HERO_BG =
  "https://res.cloudinary.com/djghexldz/image/upload/v1778090569/new-wardrobe/portfolio/page01_img1_pwmaq5.jpg";

const DEFAULT_FEATURES = [
  { icon: "Award", title: "12 Yıllık Deneyim", description: "Türkiye'nin önde gelen otel zincirlerine kesintisiz hizmet veren köklü bir üretici." },
  { icon: "Box", title: "3D Modelleme", description: "Her ürün için 3D görsel ve Urban Creative ile siparişten önce tam ön izleme." },
  { icon: "Wrench", title: "Entegre Tesis", description: "CNC freze, boyahane, demir hane tek çatı altında — kalite kontrolü uçtan uca bizde." },
  { icon: "Layout", title: "Anahtar Teslim", description: "Tasarımdan montaja, garanti ve teknik destekle tam kapsamlı proje yönetimi." },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: settings["pagetitle.home"] || undefined };
}

export default async function HomePage() {
  const settings = await getSettings();

  let featuredProjects: {
    id: string;
    name: string;
    slug: string;
    category: string | null;
    coverImage: string | null;
    imageCount: number;
  }[] = [];

  let featuredProducts: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    imageUrl?: string;
    category?: string;
    has3DModel: boolean;
  }[] = [];

  try {
    const [projects, products] = await Promise.all([
      prisma.project.findMany({
        where: { published: true },
        include: { images: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
        take: 6,
      }),
      prisma.product.findMany({
        where: { published: true, featured: true },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          category: true,
          model3d: { select: { status: true } },
        },
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    featuredProjects = projects.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      coverImage: p.images[0]?.url ?? null,
      imageCount: p.images.length,
    }));

    featuredProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      imageUrl: p.images[0]?.url,
      category: p.category?.name,
      has3DModel: p.model3d?.status === "COMPLETED",
    }));
  } catch {
    // DB not available
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <HeroSection
        title={settings["home.hero_title"] || "Otel Mobilyasında 12 Yıllık Tecrübe"}
        subtitle={
          settings["home.hero_subtitle"] ||
          "Antalya merkezli üretim tesisimizde CNC teknolojisi ve deneyimli ekibimizle 5 yıldızlı otellere özel mobilya üretiyoruz."
        }
        bgImage={settings["home.hero_bg"] || FALLBACK_HERO_BG}
      />

      {/* ── STATS ────────────────────────────────────── */}
      <StatsSection />

      {/* ── HİZMETLERİMİZ ────────────────────────────── */}
      <ServicesSection />

      {/* ── FEATURED PROJECTS ────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="py-16 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
          {/* Bg accent */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(180deg, transparent 0%, rgba(212,168,83,0.02) 50%, transparent 100%)" }} />

          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="mb-10 sm:mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
              <div>
                <div className="badge-gold mb-4">Referans Projeler</div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Tamamlanan<br />
                  <span className="text-gradient-gold">Projelerimiz</span>
                </h2>
              </div>
              <Link href="/projelerimiz"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 shrink-0 group"
                style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}>
                Tümünü Gör
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>

            {/* Magazine-style grid: first card is big */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProjects.map((project, i) => (
                <ScrollReveal
                  key={project.id}
                  delay={i * 0.06}
                  className={i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
                >
                  <Link href={`/projelerimiz/${project.slug}`} className="group block h-full">
                    <article className="shimmer relative rounded-2xl overflow-hidden h-full"
                      style={{ border: "1px solid rgba(212,168,83,0.12)" }}>
                      <div className={`relative overflow-hidden ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                        {project.coverImage ? (
                          <Image
                            src={project.coverImage}
                            alt={project.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            sizes={i === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"
                            style={{ background: "rgba(212,168,83,0.03)" }}>
                            <Building2 className="w-12 h-12 opacity-10" style={{ color: "#D4A853" }} />
                          </div>
                        )}

                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          {project.category && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{ background: "rgba(9,9,11,0.80)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(212,168,83,0.15)" }}>
                              {project.category}
                            </span>
                          )}
                          {project.imageCount > 1 && (
                            <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{ background: "rgba(9,9,11,0.80)", color: "#D4A853", border: "1px solid rgba(212,168,83,0.25)" }}>
                              {project.imageCount} foto
                            </span>
                          )}
                        </div>

                        {/* Bottom info */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                          <h3 className={`font-bold leading-snug group-hover:text-primary transition-colors ${i === 0 ? "text-xl" : "text-base"}`}>
                            {project.name}
                          </h3>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shrink-0"
                            style={{ background: "#D4A853" }}>
                            <ArrowRight className="w-4 h-4 text-black" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEDEN BİZ? ───────────────────────────────── */}
      <FeaturesSection
        title="Neden Urban Mobilya?"
        subtitle="12 yıldır otelcilerin güvendiği marka — kalitemizi fark eden sayısız referansla."
        features={DEFAULT_FEATURES}
      />

      {/* ── ÜRETİM SÜRECİ ────────────────────────────── */}
      <ProcessSection />

      {/* ── TESİS / ÜRETİM ALANI ─────────────────────── */}
      <section className="py-16 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.12), transparent)" }} />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left copy */}
            <ScrollReveal>
              <div className="badge-gold mb-6">Üretim Gücümüz</div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                Modern Tesisimizde<br />
                <span className="text-gradient-gold">Entegre Üretim</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 text-base">
                CNC freze, CNC delik, panel kesim, boyahane ve demir hane — tüm üretim süreçleri
                Antalya'daki 5.000 m² tesisimizde tek çatı altında yönetilmektedir.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  "CNC Destekli Modern Üretim Tesisi",
                  "Bünyemizde Boyahane ve Demir Hane",
                  "Profesyonel Montaj ve Kurulum Ekibi",
                  "Satış Sonrası Garanti ve Teknik Destek",
                  "ISO Belgelendirilmiş Kalite Standartları",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "#D4A853" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/hakkimizda"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:glow-gold-subtle hover:scale-105 group"
                style={{ background: "#D4A853", color: "#09090b" }}>
                Şirketimizi Keşfedin
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>

            {/* Right: image collage */}
            <ScrollReveal direction="right">
              <div className="grid grid-cols-2 gap-3">
                {/* Large top-left */}
                <div className="relative rounded-2xl overflow-hidden aspect-square row-span-2 group"
                  style={{ border: "1px solid rgba(212,168,83,0.12)" }}>
                  <Image
                    src={FACILITY_IMAGES[0]}
                    alt="Üretim tesisi"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30" />
                </div>

                {/* Right column: 3 small */}
                {FACILITY_IMAGES.slice(1, 4).map((url, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden aspect-[4/3] group"
                    style={{ border: "1px solid rgba(212,168,83,0.12)" }}>
                    <Image
                      src={url}
                      alt={`Tesis ${i + 2}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 25vw, 20vw"
                    />
                  </div>
                ))}

                {/* "Video / daha fazla" placeholder card */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer"
                  style={{ background: "rgba(212,168,83,0.05)", border: "1px solid rgba(212,168,83,0.15)" }}>
                  <Image
                    src={FACILITY_IMAGES[4]}
                    alt="Tesis 5"
                    fill
                    className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60"
                    sizes="20vw"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(212,168,83,0.2)", border: "1.5px solid rgba(212,168,83,0.5)" }}>
                      <Play className="w-4 h-4 ml-0.5" style={{ color: "#D4A853" }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#D4A853" }}>Galeri</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-16 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.12), transparent)" }} />
          </div>

          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="mb-10 sm:mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
              <div>
                <div className="badge-gold mb-4">Ürün Koleksiyonu</div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Öne Çıkan<br />
                  <span className="text-gradient-gold">Ürünlerimiz</span>
                </h2>
              </div>
              <Link href="/urunler"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 shrink-0 group"
                style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}>
                Tüm Ürünler
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.05}>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    salePrice={product.salePrice}
                    imageUrl={product.imageUrl}
                    category={product.category}
                    has3DModel={product.has3DModel}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PARTNER LOGOS / SOSYAL KANIT ─────────────── */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px divider-gold" />
          <div className="absolute bottom-0 left-0 right-0 h-px divider-gold" />
        </div>

        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="text-center text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-10">
              Güvenilir Tedarikçileri Arasında
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {["Hilton", "Marriott", "Accor", "Wyndham", "IHG", "Best Western"].map((brand) => (
                <div key={brand}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 hover:text-primary"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(212,168,83,0.10)",
                  }}>
                  {brand}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <CTASection
        title={settings["home.cta_title"] || "Projeniz için Teklif Alın"}
        subtitle={
          settings["home.cta_subtitle"] ||
          "Otel mobilyası ihtiyaçlarınız için ücretsiz keşif ve proje geliştirme hizmetimizden yararlanın."
        }
        btnText={settings["home.cta_btn"] || "Ücretsiz Teklif Al"}
      />
    </>
  );
}
