import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Images, MapPin, Calendar, Layers } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let name = "Proje";
  try {
    const p =
      (await prisma.project.findUnique({ where: { slug }, select: { name: true } })) ??
      (await prisma.product.findFirst({
        where: { slug, published: true, isProject: true },
        select: { name: true },
      }));
    if (p) name = p.name;
  } catch { /* */ }
  return { title: `${name} | Projelerimiz | Urban Mobilya` };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let project: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    images: { id: string; url: string; alt: string | null; order: number }[];
  } | null = null;

  try {
    const rawProject = await prisma.project.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: "asc" } } },
    });

    if (rawProject) {
      project = rawProject;
    } else {
      const rawProduct = await prisma.product.findFirst({
        where: { slug, published: true, isProject: true },
        include: {
          images: { orderBy: { order: "asc" } },
          category: { select: { name: true } },
        },
      });
      if (!rawProduct) return notFound();

      project = {
        id: rawProduct.id,
        name: rawProduct.name,
        description: rawProduct.description,
        category: rawProduct.category?.name ?? null,
        images: rawProduct.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt ?? null,
          order: img.order,
        })),
      };
    }
  } catch {
    return notFound();
  }

  if (!project) return notFound();

  const coverImage = project.images[0];
  const galleryImages = project.images.slice(1);

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #D4A853 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.02]"
          style={{ background: "radial-gradient(circle, #D4A853 0%, transparent 70%)" }} />
      </div>

      {/* Hero section with cover image */}
      <div className="relative w-full" style={{ height: "min(70vh, 600px)" }}>
        {coverImage ? (
          <>
            <Image
              src={coverImage.url}
              alt={coverImage.alt || project.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(9,9,11,0.3) 0%, rgba(9,9,11,0.0) 30%, rgba(9,9,11,0.0) 50%, rgba(9,9,11,0.85) 100%)" }} />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "rgba(212,168,83,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <Layers className="w-24 h-24 opacity-10" style={{ color: "#D4A853" }} />
          </div>
        )}

        {/* Back link over hero */}
        <div className="absolute top-0 left-0 right-0 pt-28 px-6">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/projelerimiz"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors group"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Tüm Projeler
            </Link>
          </div>
        </div>

        {/* Title over hero bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
          <div className="max-w-6xl mx-auto">
            {project.category && (
              <div className="badge-gold mb-4">{project.category}</div>
            )}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              {project.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 relative">

        {/* Meta bar */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center gap-6 py-8 mb-6"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {project.images.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Images className="w-4 h-4" style={{ color: "#D4A853" }} />
                <span>{project.images.length} görsel</span>
              </div>
            )}
            {project.category && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" style={{ color: "#D4A853" }} />
                <span>{project.category}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" style={{ color: "#D4A853" }} />
              <span>Tamamlandı</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Description */}
        {project.description && (
          <ScrollReveal className="mb-14">
            <div className="max-w-3xl">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <>
            <ScrollReveal className="mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">
                  Proje <span className="text-gradient-gold">Galerisi</span>
                </h2>
                <div className="divider-gold flex-1" />
              </div>
            </ScrollReveal>

            {/* Masonry-style gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {galleryImages.map((img, i) => {
                // Make every 7th image span 2 columns for visual variety
                const isWide = i % 7 === 0;
                return (
                  <ScrollReveal
                    key={img.id}
                    delay={i * 0.04}
                    className={isWide ? "sm:col-span-2" : ""}
                  >
                    <div className={`relative overflow-hidden rounded-2xl group shimmer ${isWide ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                      <Image
                        src={img.url}
                        alt={img.alt || `${project.name} - ${i + 2}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes={isWide ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                      {/* Image number */}
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300"
                        style={{ background: "rgba(212,168,83,0.9)", color: "#09090b" }}>
                        {i + 2}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </>
        )}

        {/* Bottom CTA */}
        <ScrollReveal className="mt-16">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-center"
            style={{ background: "rgba(212,168,83,0.04)", border: "1px solid rgba(212,168,83,0.12)" }}>
            {/* Decorative corner glows */}
            <div className="absolute top-0 left-0 w-32 h-32 opacity-20"
              style={{ background: "radial-gradient(circle, #D4A853 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20"
              style={{ background: "radial-gradient(circle, #D4A853 0%, transparent 70%)" }} />

            <div className="relative">
              <p className="text-muted-foreground mb-2 text-sm uppercase tracking-widest font-medium">Daha Fazla Keşfet</p>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                Diğer <span className="text-gradient-gold">Projelerimize</span> Göz Atın
              </h3>
              <Link
                href="/projelerimiz"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:glow-gold-subtle hover:scale-105"
                style={{ background: "#D4A853", color: "#09090b" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Tüm Projelere Dön
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
