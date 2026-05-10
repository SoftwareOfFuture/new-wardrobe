"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  Save,
  X,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  order: number;
  children: Category[];
  _count: { products: number };
}

export default function KategorilerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      parentId: form.parentId || null,
      description: form.description || null,
    };

    const url = editingId
      ? `/api/categories/${editingId}`
      : "/api/categories";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(editingId ? "Kategori güncellendi" : "Kategori oluşturuldu");
      resetForm();
      fetchCategories();
    } else {
      toast.error("Bir hata oluştu");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Kategori silindi");
      fetchCategories();
    } else {
      toast.error("Silinemedi");
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      parentId: cat.parentId || "",
      order: cat.order,
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setShowForm(false);
    setForm({ name: "", slug: "", description: "", parentId: "", order: 0 });
  }

  const rootCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold">Kategoriler</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ürün kategorilerini yönetin
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Kategori
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass rounded-xl p-6 space-y-4 border border-border"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {editingId ? "Kategori Düzenle" : "Yeni Kategori"}
            </h3>
            <button type="button" onClick={resetForm}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ad</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: editingId ? form.slug : slugify(e.target.value),
                  })
                }
                placeholder="Kategori adı"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="kategori-slug"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Üst Kategori</Label>
              <select
                value={form.parentId}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Yok (Ana Kategori)</option>
                {categories
                  .filter((c) => c.id !== editingId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Sıra</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Açıklama</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Opsiyonel açıklama"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              {editingId ? "Güncelle" : "Oluştur"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              İptal
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Yükleniyor...
        </div>
      ) : rootCategories.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl border border-border">
          <FolderTree className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Henüz kategori yok</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rootCategories.map((cat) => (
            <CategoryItem
              key={cat.id}
              category={cat}
              onEdit={startEdit}
              onDelete={handleDelete}
              depth={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryItem({
  category,
  onEdit,
  onDelete,
  depth,
}: {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
  depth: number;
}) {
  return (
    <>
      <div
        className="flex items-center gap-3 p-3 rounded-lg glass border border-border hover:border-primary/30 transition-colors"
        style={{ marginLeft: depth * 24 }}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
        <FolderTree className="w-4 h-4 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium">{category.name}</p>
          <p className="text-xs text-muted-foreground">
            /{category.slug} · {category._count.products} ürün
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(category)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(category.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      {category.children?.map((child) => (
        <CategoryItem
          key={child.id}
          category={child as Category}
          onEdit={onEdit}
          onDelete={onDelete}
          depth={depth + 1}
        />
      ))}
    </>
  );
}
