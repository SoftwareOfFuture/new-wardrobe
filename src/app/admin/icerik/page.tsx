"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContentSection {
  id: string;
  sectionKey: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  imageUrl: string | null;
  metadata: string | null;
  updatedAt: string;
}

const sectionLabels: Record<string, string> = {
  hero: "Hero Bölümü",
  features: "Özellikler",
  cta: "CTA (Aksiyon Çağrısı)",
  about: "Hakkımızda",
  contact: "İletişim",
  footer: "Footer",
};

export default function IcerikPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    body: "",
    imageUrl: "",
    metadata: "",
  });

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    const res = await fetch("/api/content");
    const data = await res.json();
    setSections(data);
    setLoading(false);
    if (data.length > 0 && !activeSection) {
      selectSection(data[0]);
    }
  }

  function selectSection(section: ContentSection) {
    setActiveSection(section.id);
    setForm({
      title: section.title || "",
      subtitle: section.subtitle || "",
      body: section.body || "",
      imageUrl: section.imageUrl || "",
      metadata: section.metadata || "",
    });
  }

  async function handleSave() {
    if (!activeSection) return;
    setSaving(true);
    const res = await fetch(`/api/content/${activeSection}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);

    if (res.ok) {
      toast.success("İçerik güncellendi");
      fetchSections();
    } else {
      toast.error("Kaydetme başarısız");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">
          İçerik Yönetimi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Web sitesi bölümlerinin içeriklerini düzenleyin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => selectSection(section)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                activeSection === section.id
                  ? "bg-primary/10 text-primary font-medium border border-primary/30"
                  : "text-muted-foreground hover:bg-secondary border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>
                  {sectionLabels[section.sectionKey] || section.sectionKey}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 ml-6">
                {new Date(section.updatedAt).toLocaleDateString("tr-TR")}
              </p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 glass rounded-xl border border-border p-6 space-y-4">
          {activeSection ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Bölüm başlığı"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Görsel URL</Label>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Alt Başlık</Label>
                <Input
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm({ ...form, subtitle: e.target.value })
                  }
                  placeholder="Alt başlık veya açıklama"
                />
              </div>

              <div className="space-y-2">
                <Label>İçerik (Body)</Label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Ana içerik metni (HTML destekler)"
                  rows={8}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Metadata (JSON)</Label>
                <textarea
                  value={form.metadata}
                  onChange={(e) =>
                    setForm({ ...form, metadata: e.target.value })
                  }
                  placeholder='{"buttonText": "Keşfet", "items": [...]}'
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y min-h-[80px]"
                />
              </div>

              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Kaydet
              </Button>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Düzenlemek için bir bölüm seçin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
