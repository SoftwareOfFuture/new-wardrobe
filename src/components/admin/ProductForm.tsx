"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Upload,
  Image as ImageIcon,
  Box,
  CheckCircle2,
  XCircle,
  Clock,
  Palette,
  Plus,
  Trash2,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  order: number;
}

interface Model3DData {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  modelUrl: string | null;
  sourceImageUrl: string;
  taskId: string | null;
  errorMessage: string | null;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    salePrice: number | null;
    sku: string | null;
    stock: number;
    featured: boolean;
    published: boolean;
    isProject: boolean;
    categoryId: string | null;
    tags: string | null;
    images?: ProductImage[];
    model3d?: Model3DData | null;
    colorVariants?: ColorVariant[];
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [images, setImages] = useState<ProductImage[]>(
    initialData?.images || []
  );
  const [uploading, setUploading] = useState(false);
  const [model3d, setModel3d] = useState<Model3DData | null>(
    initialData?.model3d || null
  );
  const [converting, setConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleDelete() {
    if (!initialData) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${initialData.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      toast.success("Ürün silindi");
      router.push("/admin/urunler");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Silme hatası");
      setDeleting(false);
    }
  }

  // ── Color variants ──────────────────────────────────
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(
    initialData?.colorVariants ?? []
  );
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#ffffff");
  const [savingColor, setSavingColor] = useState(false);

  async function handleAddColor() {
    if (!initialData || !newColorName.trim()) return;
    setSavingColor(true);
    try {
      const res = await fetch(`/api/products/${initialData.id}/colors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newColorName.trim(), hex: newColorHex }),
      });
      if (res.ok) {
        const created: ColorVariant = await res.json();
        setColorVariants((prev) => [...prev, created]);
        setNewColorName("");
        setNewColorHex("#ffffff");
        toast.success("Renk eklendi");
      } else {
        toast.error("Renk eklenemedi");
      }
    } catch {
      toast.error("Bağlantı hatası");
    }
    setSavingColor(false);
  }

  async function handleDeleteColor(colorId: string) {
    if (!initialData) return;
    try {
      await fetch(`/api/products/${initialData.id}/colors?colorId=${colorId}`, {
        method: "DELETE",
      });
      setColorVariants((prev) => prev.filter((c) => c.id !== colorId));
      toast.success("Renk silindi");
    } catch {
      toast.error("Silinemedi");
    }
  }

  useEffect(() => {
    if (model3d?.status === "PROCESSING" && model3d.taskId) {
      const interval = setInterval(async () => {
        const res = await fetch(`/api/ai/model-status/${model3d.taskId}`);
        if (res.ok) {
          const data = await res.json();
          setModel3d(data);
          if (data.status === "COMPLETED" || data.status === "FAILED") {
            clearInterval(interval);
            if (data.status === "COMPLETED")
              toast.success("3D model hazır!");
            else toast.error("3D dönüşüm başarısız");
          }
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [model3d?.status, model3d?.taskId]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const uploaded = await res.json();
        const newImages = uploaded.map(
          (m: { id: string; url: string; filename: string }, i: number) => ({
            id: m.id,
            url: m.url,
            alt: m.filename,
            order: images.length + i,
          })
        );
        setImages([...images, ...newImages]);
        toast.success(`${files.length} görsel yüklendi`);
      }
    } catch {
      toast.error("Yükleme başarısız");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleStart3DConversion() {
    if (!initialData || images.length === 0) return;
    setConverting(true);
    try {
      const res = await fetch("/api/ai/image-to-3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: initialData.id,
          imageUrl: images[0].url,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setModel3d(data.model);
        toast.success("3D dönüşüm başlatıldı");
      } else {
        const err = await res.json();
        toast.error(err.error || "Dönüşüm başlatılamadı");
      }
    } catch {
      toast.error("Bir hata oluştu");
    }
    setConverting(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      salePrice: formData.get("salePrice")
        ? parseFloat(formData.get("salePrice") as string)
        : null,
      sku: (formData.get("sku") as string) || null,
      stock: parseInt(formData.get("stock") as string) || 0,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      isProject: formData.get("isProject") === "on",
      categoryId: (formData.get("categoryId") as string) || null,
      tags: (formData.get("tags") as string) || null,
      images: images.map((img, i) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || null,
        order: i,
      })),
    };

    try {
      const url = initialData
        ? `/api/products/${initialData.id}`
        : "/api/products";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.fieldErrors?.name?.[0] || "Bir hata oluştu");
      }

      toast.success(
        initialData ? "Ürün güncellendi" : "Ürün oluşturuldu"
      );
      router.push("/admin/urunler");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Genel Bilgiler</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Ürün Adı</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!initialData) setSlug(slugify(e.target.value));
                }}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={initialData?.description || ""}
                rows={4}
                required
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Fiyat & Stok</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (₺)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={initialData?.price || ""}
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">İndirimli Fiyat (₺)</Label>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  step="0.01"
                  defaultValue={initialData?.salePrice || ""}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  defaultValue={initialData?.sku || ""}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  defaultValue={initialData?.stock || 0}
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Yayın Durumu</h2>

            <div className="flex items-center justify-between">
              <Label htmlFor="published">Yayında</Label>
              <Switch
                id="published"
                name="published"
                defaultChecked={initialData?.published || false}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Öne Çıkan</Label>
              <Switch
                id="featured"
                name="featured"
                defaultChecked={initialData?.featured || false}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isProject">Proje mi?</Label>
                <p className="text-xs text-muted-foreground">Projelerimiz sayfasında göster</p>
              </div>
              <Switch
                id="isProject"
                name="isProject"
                defaultChecked={initialData?.isProject || false}
              />
            </div>
          </div>

          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Kategori</h2>
            <select
              name="categoryId"
              defaultValue={initialData?.categoryId || ""}
              className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm"
            >
              <option value="">Kategori seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Etiketler</h2>
            <Input
              name="tags"
              defaultValue={initialData?.tags || ""}
              placeholder="modern, ahşap, beyaz"
              className="bg-background/50"
            />
            <p className="text-xs text-muted-foreground">
              Virgülle ayırarak yazın
            </p>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Ürün Görselleri
          </h2>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-1" />
              )}
              Yükle
            </Button>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Görsel yüklemek için butona tıklayın
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="aspect-square rounded-lg overflow-hidden border border-border relative group"
              >
                <img
                  src={img.url}
                  alt={img.alt || ""}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((i) => i.id !== img.id))
                  }
                  className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {initialData && (
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Box className="w-4 h-4" />
            3D Model
          </h2>

          {model3d ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {model3d.status === "COMPLETED" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : model3d.status === "FAILED" ? (
                  <XCircle className="w-5 h-5 text-destructive" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />
                )}
                <span className="text-sm font-medium">
                  {model3d.status === "COMPLETED"
                    ? "Model hazır"
                    : model3d.status === "FAILED"
                      ? "Dönüşüm başarısız"
                      : model3d.status === "PROCESSING"
                        ? "Dönüştürülüyor..."
                        : "Beklemede"}
                </span>
              </div>

              {model3d.status === "COMPLETED" && model3d.modelUrl && (
                <p className="text-xs text-muted-foreground break-all">
                  GLB: {model3d.modelUrl}
                </p>
              )}

              {model3d.errorMessage && (
                <p className="text-xs text-destructive">
                  {model3d.errorMessage}
                </p>
              )}

              {(model3d.status === "FAILED" ||
                model3d.status === "COMPLETED") && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleStart3DConversion}
                  disabled={converting || images.length === 0}
                >
                  {converting ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Box className="w-4 h-4 mr-1" />
                  )}
                  Yeniden Dönüştür
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                İlk görseli kullanarak AI ile 3D model oluşturun.
                {images.length === 0 && " Önce bir görsel yükleyin."}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleStart3DConversion}
                disabled={converting || images.length === 0}
              >
                {converting ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Box className="w-4 h-4 mr-1" />
                )}
                3D Modele Dönüştür
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Color Variants ── */}
      {initialData && (
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Renk Seçenekleri
            <span className="text-xs font-normal text-muted-foreground ml-1">
              (Urban Creative'de görünür)
            </span>
          </h2>

          {/* Existing variants */}
          {colorVariants.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {colorVariants.map((cv) => (
                <div
                  key={cv.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background/50 group"
                >
                  {/* Color swatch */}
                  <div
                    className="w-4 h-4 rounded-full border border-border shrink-0"
                    style={{ background: cv.hex }}
                  />
                  <span className="text-sm font-medium">{cv.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">{cv.hex}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteColor(cv.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-destructive hover:text-destructive/80 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new color */}
          <div className="flex items-end gap-3 flex-wrap">
            <div className="space-y-1.5">
              <Label>Renk Adı</Label>
              <Input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="örn. Ceviz, Beyaz, Antrasit"
                className="bg-background/50 w-48"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddColor(); } }}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Renk Kodu</Label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-border p-0.5 bg-background/50"
                    title="Renk seç"
                  />
                </div>
                <Input
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  placeholder="#ffffff"
                  className="bg-background/50 w-28 font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddColor}
              disabled={savingColor || !newColorName.trim()}
              className="h-10"
            >
              {savingColor ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-1" />
              )}
              Renk Ekle
            </Button>
          </div>

          {colorVariants.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Henüz renk eklenmedi. Renk seçenekleri Urban Creative'de kullanıcıların ürün rengini değiştirmesini sağlar.
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        {initialData && (
          <div className="flex items-center gap-2">
            {showDeleteConfirm ? (
              <>
                <span className="text-sm text-destructive font-medium">Bu ürün silinecek!</span>
                <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                  {deleting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
                  Evet, Sil
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                  Vazgeç
                </Button>
              </>
            ) : (
              <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="w-4 h-4 mr-1" />
                Ürünü Sil
              </Button>
            )}
          </div>
        )}
        {!initialData && <div />}
        <Button type="submit" disabled={loading} size="lg">
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {initialData ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
}
