"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface ProjectActionsProps {
  projectId: string;
  projectName: string;
}

export function ProjectActions({ projectId, projectName }: ProjectActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Silinemedi");
      }
      toast.success(`"${projectName}" silindi`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Silme hatası");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-destructive font-medium">Silinsin mi?</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="h-7 px-2"
        >
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Evet"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={deleting}
          className="h-7 px-2"
        >
          İptal
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 justify-end">
      <Link href={`/nfjmmn9wxzdf/projeler/${projectId}`}>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="w-4 h-4" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={() => setShowConfirm(true)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
