import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: settings["pagetitle.projects"] || "Projelerimiz" };
}

export default async function ProjectsPage() {
  let projects: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string | null;
    images: { url: string; alt: string | null }[];
  }[] = [];

  try {
    const raw = await prisma.project.findMany({
      where: { published: true },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });

    projects = raw.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      category: p.category,
      images: p.images.map((img) => ({ url: img.url, alt: img.alt })),
    }));
  } catch {
    // DB not available
  }

  // Get unique categories for stats
  const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px]"
          style={{ background: "radial-gradient(ellipse, rgba(212,168,83,0.05) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <ScrollReveal className="text-center mb-6">
          <div className="badge-gold mb-6">Referans Çalışmalar</div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-5">
            <span className="text-gradient-gold">Projelerimiz</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Yurt içi ve yurt dışındaki otel projelerimizde ürettiğimiz mobilyaları keşfedin.
          </p>
        </ScrollReveal>

        {/* Quick stats bar */}
        {projects.length > 0 && (
          <ScrollReveal delay={0.1}>
            <div className="flex items-center justify-center gap-8 py-8 mb-14">
              <div className="divider-gold flex-1 max-w-32" />
              <div className="flex items-center gap-8 text-center">
                <div>
                  <p className="text-2xl font-bold text-gradient-gold">{projects.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Proje</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-2xl font-bold text-gradient-gold">
                    {projects.reduce((sum, p) => sum + p.images.length, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Görsel</p>
                </div>
                {categories.length > 0 && (
                  <>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <p className="text-2xl font-bold text-gradient-gold">{categories.length}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Kategori</p>
                    </div>
                  </>
                )}
              </div>
              <div className="divider-gold flex-1 max-w-32" />
            </div>
          </ScrollReveal>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center py-32 gap-5">
              <div className="p-6 rounded-2xl glass-gold">
                <Building2 className="w-12 h-12" style={{ color: "#D4A853" }} />
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">Henüz proje eklenmemiş</p>
                <p className="text-muted-foreground text-sm">
                  Yakında projelerimizi burada görebileceksiniz.
                </p>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.05}>
                <Link href={`/projelerimiz/${project.slug}`} className="group block h-full">
                  <article
                    className="shimmer relative rounded-2xl overflow-hidden h-full transition-all duration-500 hover:glow-gold-subtle hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Cover image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {project.images[0] ? (
                        <>
                          <Image
                            src={project.images[0].url}
                            alt={project.images[0].alt || project.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        </>
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: "rgba(212,168,83,0.04)" }}
                        >
                          <Building2 className="w-10 h-10 opacity-20" style={{ color: "#D4A853" }} />
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        {project.category && (
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: "rgba(9,9,11,0.8)",
                              color: "rgba(255,255,255,0.75)",
                              border: "1px solid rgba(255,255,255,0.12)",
                            }}
                          >
                            {project.category}
                          </span>
                        )}
                        {project.images.length > 1 && (
                          <span
                            className="ml-auto px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: "rgba(9,9,11,0.8)",
                              color: "#D4A853",
                              border: "1px solid rgba(212,168,83,0.25)",
                            }}
                          >
                            {project.images.length} foto
                          </span>
                        )}
                      </div>

                      {/* Arrow hint */}
                      <div
                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                        style={{ background: "#D4A853" }}
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-black" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h2 className="font-semibold text-base leading-snug mb-1 group-hover:text-primary transition-colors">
                        {project.name}
                      </h2>
                      {project.description && !project.description.startsWith("Legacy") && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}

                      {/* Thumbnail strip */}
                      {project.images.length > 1 && (
                        <div className="mt-4 flex gap-1.5">
                          {project.images.slice(1, 5).map((img, idx) => (
                            <div
                              key={idx}
                              className="relative w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-white/5"
                            >
                              <Image
                                src={img.url}
                                alt={img.alt || ""}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          ))}
                          {project.images.length > 5 && (
                            <div className="w-12 h-9 rounded-lg bg-white/5 flex items-center justify-center text-xs text-muted-foreground shrink-0 border border-white/5">
                              +{project.images.length - 5}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
