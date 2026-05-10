import { prisma } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let project;
  try {
    project = await prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    });
  } catch { notFound(); }

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Projeyi Düzenle</h1>
        <p className="text-muted-foreground mt-1">{project.name}</p>
      </div>
      <ProjectForm
        initialData={{
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description,
          category: project.category,
          published: project.published,
          order: project.order,
          images: project.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            order: img.order,
          })),
        }}
      />
    </div>
  );
}
