"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Loader2, Upload, Image as ImageIcon, X, GripVertical } from "lucide-react";
import Image from "next/image";

interface ProjectImage {
  id?: string;
  url: string;
  alt: string | null;
  order: number;
}

interface ProjectFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string | null;
    published: boolean;
    order: number;
    images?: ProjectImage[];
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [images, setImages] = useState<ProjectImage[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("files", files[i]);
    try {
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      if (res.ok) {
        const uploaded = await res.json();
        const newImages = uploaded.map((m: { url: string; filename: string }, i: number) => ({
          url: m.url,
          alt: m.filename,
          order: images.length + i,
        }));
        setImages([...images, ...newImages]);
        toast.success(`${files.length} görsel yüklendi`);
      }
    } catch { toast.error("Yükleme başarısız"); }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || null,
      category: (formData.get("category") as string) || null,
      published: formData.get("published") === "on",
      order: parseInt(formData.get("order") as string) || 0,
      images: images.map((img, i) => ({ id: img.id, url: img.url, alt: img.alt || null, order: i })),
    };

    try {
      const url = initialData ? `/api/projects/${initialData.id}` : "/api/projects";
      const method = initialData ? "PUT" : "POST";
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Bir hata oluştu");
      toast.success(initialData ? "Proje güncellendi" : "Proje oluşturuldu");
      router.push("/admin/projeler");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Proje Bilgileri</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Proje Adı</Label>
          <Input id="name" name="name" value={name} onChange={(e) => { setName(e.target.value); if (!initialData) setSlug(slugify(e.target.value)); }} required className="bg-background/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="bg-background/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Input id="category" name="category" defaultValue={initialData?.category || ""} placeholder="Otel Odası Mobilyası" className="bg-background/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Açıklama</Label>
          <Textarea id="description" name="description" defaultValue={initialData?.description || ""} rows={3} className="bg-background/50" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="order">Sıra</Label>
            <Input id="order" name="order" type="number" defaultValue={initialData?.order ?? 0} className="bg-background/50" />
          </div>
          <div className="flex items-center justify-between pt-6">
            <Label htmlFor="published">Yayında</Label>
            <Switch id="published" name="published" defaultChecked={initialData?.published ?? true} />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Proje Görselleri
          </h2>
          <div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
              Yükle
            </Button>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Görsel yüklemek için butona tıklayın</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square bg-white/5">
                <Image src={img.url} alt={img.alt || ""} fill className="object-cover" sizes="150px" />
                {idx === 0 && (
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(212,168,83,0.9)", color: "#09090b" }}>Kapak</div>
                )}
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">İlk görsel kapak görseli olarak kullanılır.</p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {initialData ? "Güncelle" : "Oluştur"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
      </div>
    </form>
  );
}
