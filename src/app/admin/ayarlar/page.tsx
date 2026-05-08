"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, Globe, Search, Phone, Share2, Navigation, PanelBottom, Home, Info, FileText, RefreshCw } from "lucide-react";

type Setting = {
  id: string;
  key: string;
  value: string;
  type: string;
  label: string;
  group: string;
};

type GroupedSettings = Record<string, Setting[]>;

const GROUP_META: Record<string, { label: string; icon: React.ReactNode }> = {
  general:      { label: "Genel",           icon: <Globe className="w-4 h-4" /> },
  seo:          { label: "SEO",             icon: <Search className="w-4 h-4" /> },
  contact:      { label: "İletişim",        icon: <Phone className="w-4 h-4" /> },
  social:       { label: "Sosyal Medya",    icon: <Share2 className="w-4 h-4" /> },
  navbar:       { label: "Navbar",          icon: <Navigation className="w-4 h-4" /> },
  footer:       { label: "Footer",          icon: <PanelBottom className="w-4 h-4" /> },
  homepage:     { label: "Ana Sayfa",       icon: <Home className="w-4 h-4" /> },
  about:        { label: "Hakkımızda",      icon: <Info className="w-4 h-4" /> },
  contact_page: { label: "İletişim Sayfası",icon: <Phone className="w-4 h-4" /> },
  pagetitles:   { label: "Sekme Başlıkları",icon: <FileText className="w-4 h-4" /> },
};

const GROUP_ORDER = ["general", "seo", "contact", "social", "navbar", "footer", "homepage", "about", "contact_page", "pagetitles"];

export default function SettingsPage() {
  const [grouped, setGrouped] = useState<GroupedSettings>({});
  const [activeGroup, setActiveGroup] = useState("general");
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/settings");
    const data = await res.json();
    const g: GroupedSettings = {};
    for (const s of data.settings as Setting[]) {
      if (!g[s.group]) g[s.group] = [];
      g[s.group].push(s);
    }
    setGrouped(g);
    const v: Record<string, string> = {};
    for (const s of data.settings as Setting[]) {
      v[s.key] = s.value;
    }
    setValues(v);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = Object.entries(values).map(([key, value]) => ({ key, value }));
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const currentSettings = grouped[activeGroup] ?? [];
  const groups = GROUP_ORDER.filter((g) => grouped[g]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Site Ayarları</h1>
          <p className="text-zinc-400 text-sm mt-1">Tüm içerikleri buradan yönetebilirsiniz</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchSettings}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Kaydedildi!" : "Kaydet"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="flex gap-4">
          {/* Sidebar tabs */}
          <nav className="flex flex-col gap-1 w-48 shrink-0">
            {groups.map((g) => {
              const meta = GROUP_META[g] ?? { label: g, icon: null };
              return (
                <button
                  key={g}
                  onClick={() => setActiveGroup(g)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                    activeGroup === g
                      ? "bg-amber-500/20 text-amber-400 font-medium"
                      : "hover:bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {meta.icon}
                  {meta.label}
                </button>
              );
            })}
          </nav>

          {/* Settings form */}
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-semibold mb-4">
              {GROUP_META[activeGroup]?.label ?? activeGroup}
            </h2>
            {currentSettings.map((s) => (
              <div key={s.key} className="space-y-1">
                <label className="block text-sm font-medium text-zinc-300">
                  {s.label}
                  <span className="ml-2 text-xs text-zinc-600 font-mono">{s.key}</span>
                </label>

                {s.type === "textarea" || s.type === "json" ? (
                  <textarea
                    value={values[s.key] ?? ""}
                    onChange={(e) => handleChange(s.key, e.target.value)}
                    rows={s.type === "json" ? 6 : 3}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono resize-y"
                    spellCheck={false}
                  />
                ) : s.type === "image" ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={values[s.key] ?? ""}
                      onChange={(e) => handleChange(s.key, e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                    {values[s.key] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={values[s.key]}
                        alt="preview"
                        className="h-20 w-auto rounded-lg object-cover border border-zinc-700"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                  </div>
                ) : s.type === "boolean" ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={values[s.key] === "true"}
                      onChange={(e) => handleChange(s.key, e.target.checked ? "true" : "false")}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className="text-sm text-zinc-400">Aktif</span>
                  </label>
                ) : (
                  <input
                    type="text"
                    value={values[s.key] ?? ""}
                    onChange={(e) => handleChange(s.key, e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
