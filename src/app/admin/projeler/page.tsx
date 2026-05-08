import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Images } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProjectsAdminPage() {
  let projects: { id: string; name: string; category: string | null; published: boolean; _count: { images: number } }[] = [];

  try {
    projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        category: true,
        published: true,
        _count: { select: { images: true } },
      },
    });
  } catch { /* */ }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projeler</h1>
          <p className="text-muted-foreground mt-1">{projects.length} proje</p>
        </div>
        <Link href="/admin/projeler/yeni">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Proje
          </Button>
        </Link>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Proje Adı</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Kategori</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Görseller</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Durum</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-border/30 hover:bg-white/3 transition-colors">
                <td className="px-4 py-3 font-medium">{project.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{project.category || "—"}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Images className="w-3.5 h-3.5" />
                    {project._count.images}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${project.published ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                    {project.published ? "Yayında" : "Taslak"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/projeler/${project.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Henüz proje yok</div>
        )}
      </div>
    </div>
  );
}
