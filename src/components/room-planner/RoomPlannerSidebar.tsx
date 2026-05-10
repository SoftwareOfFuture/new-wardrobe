"use client";

import React, { useState } from "react";
import { useRoomPlannerStore } from "@/stores/room-planner-store";
import type { AvailableModel } from "@/types/room-planner";
import {
  Move, RotateCw, Maximize, MousePointer, Trash2,
  RotateCcw, Save, Camera, Share2, Loader2,
  ChevronDown, ChevronRight, Package, Layers,
  Paintbrush, Ruler, Plus, Palette, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RoomPlannerSidebarProps {
  availableModels: AvailableModel[];
  mobileSection?: string;
}

// ── Collapsible section (desktop only) ──────────────
function Section({
  title, icon: Icon, children, defaultOpen = true, badge,
}: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b" style={{ borderColor: "rgba(212,168,83,0.10)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-white/[0.03]"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-3.5 h-3.5" style={{ color: "#D4A853" }} />
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase" style={{ color: "rgba(42,26,12,0.6)" }}>
            {title}
          </span>
          {badge !== undefined && badge > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-none"
              style={{ background: "rgba(212,168,83,0.2)", color: "#D4A853" }}>
              {badge}
            </span>
          )}
        </div>
        {open
          ? <ChevronDown className="w-3.5 h-3.5" style={{ color: "rgba(42,26,12,0.3)" }} />
          : <ChevronRight className="w-3.5 h-3.5" style={{ color: "rgba(42,26,12,0.3)" }} />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// ── Wall color presets ───────────────────────────────
const WALL_COLORS = [
  { hex: "#f5f5f0", label: "Beyaz" },
  { hex: "#f0ebe0", label: "Krem" },
  { hex: "#e8ddd0", label: "Bej" },
  { hex: "#d4cfc8", label: "Gri Bej" },
  { hex: "#c5cdd6", label: "Açık Mavi" },
  { hex: "#cfd4cc", label: "Açık Yeşil" },
  { hex: "#2c2c2c", label: "Antrasit" },
  { hex: "#1a1412", label: "Koyu" },
];

// ── Floor texture presets ────────────────────────────
const FLOOR_TEXTURES = [
  { id: "wood",     label: "Parke",  color: "#b5935a" },
  { id: "marble",   label: "Mermer", color: "#d6cfc4" },
  { id: "dark",     label: "Koyu",   color: "#4a3728" },
  { id: "concrete", label: "Beton",  color: "#8a8a86" },
  { id: "carpet",   label: "Halı",   color: "#6b6b8a" },
];

export function RoomPlannerSidebar({ availableModels, mobileSection }: RoomPlannerSidebarProps) {
  const {
    roomWidth, roomHeight, roomDepth, setRoomDimensions,
    activeTool, setActiveTool,
    addObject, removeObject,
    selectedObjectId, objects,
    wallColor, setWallColor,
    floorTexture, setFloorTexture,
    updateObjectColor,
    reset,
  } = useRoomPlannerStore();

  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const selectedObj = objects.find((o) => o.id === selectedObjectId);
  const selectedModel = selectedObj
    ? availableModels.find((m) => m.productId === selectedObj.productId)
    : null;

  const tools = [
    { id: "select" as const, icon: MousePointer, label: "Seç" },
    { id: "move"   as const, icon: Move,         label: "Taşı" },
    { id: "rotate" as const, icon: RotateCw,     label: "Döndür" },
    { id: "scale"  as const, icon: Maximize,     label: "Ölçekle" },
  ];

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/room-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Oda ${new Date().toLocaleDateString("tr-TR")}`,
          roomWidth, roomHeight, roomDepth, objects,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const url = `${window.location.origin}/oda-planlayici?token=${data.shareToken}`;
        setShareUrl(url);
        toast.success("Oda kaydedildi!");
      }
    } catch {
      toast.error("Kaydetme başarısız");
    }
    setSaving(false);
  }

  function handleScreenshot() {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `oda-plani-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Görüntü indirildi");
    }
  }

  // ── Reusable section content (no outer padding) ────

  const toolsContent = (
    <>
      <div className="grid grid-cols-4 gap-1.5">
        {tools.map((tool) => {
          const active = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl text-[10px] font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: active ? "rgba(212,168,83,0.15)" : "rgba(212,168,83,0.05)",
                border: `1px solid ${active ? "rgba(212,168,83,0.4)" : "rgba(212,168,83,0.10)"}`,
                color: active ? "#D4A853" : "rgba(42,26,12,0.5)",
              }}
            >
              <tool.icon className="w-4 h-4" />
              {tool.label}
            </button>
          );
        })}
      </div>

      {/* Selected object panel */}
      {selectedObj && (
        <div className="mt-3 rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(212,168,83,0.2)", background: "rgba(212,168,83,0.04)" }}>
          <div className="px-3 py-2.5 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(212,168,83,0.12)" }}>
            <p className="text-[11px] font-semibold truncate" style={{ color: "#D4A853" }}>
              {selectedObj.productName}
            </p>
            <button
              onClick={() => removeObject(selectedObjectId!)}
              className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer ml-2"
              style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#f87171" }}
            >
              <Trash2 className="w-3 h-3" />
              Kaldır
            </button>
          </div>

          {selectedModel && selectedModel.colorVariants.length > 0 && (
            <div className="px-3 py-2.5">
              <p className="text-[10px] font-semibold mb-2 flex items-center gap-1.5"
                style={{ color: "rgba(42,26,12,0.5)" }}>
                <Palette className="w-3 h-3" style={{ color: "#D4A853" }} />
                Renk Seçeneği
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedModel.colorVariants.map((cv) => {
                  const active = selectedObj.colorHex === cv.hex;
                  return (
                    <button
                      key={cv.id}
                      title={cv.name}
                      onClick={() => updateObjectColor(selectedObjectId!, cv.hex)}
                      className="relative w-7 h-7 rounded-lg transition-all duration-150 cursor-pointer"
                      style={{
                        background: cv.hex,
                        border: active ? "2px solid #D4A853" : "2px solid rgba(212,168,83,0.2)",
                        boxShadow: active ? `0 0 0 1px rgba(212,168,83,0.5), 0 0 8px ${cv.hex}55` : "none",
                        transform: active ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      {active && (
                        <Check
                          className="w-3 h-3 absolute inset-0 m-auto"
                          style={{ color: parseInt(cv.hex.slice(1), 16) > 0xaaaaaa ? "#000" : "#fff" }}
                        />
                      )}
                    </button>
                  );
                })}
                {selectedObj.colorHex && (
                  <button
                    title="Orijinal renk"
                    onClick={() => updateObjectColor(selectedObjectId!, "")}
                    className="w-7 h-7 rounded-lg text-[8px] font-bold transition-all cursor-pointer flex items-center justify-center"
                    style={{
                      background: "rgba(212,168,83,0.06)",
                      border: "2px solid rgba(212,168,83,0.18)",
                      color: "rgba(42,26,12,0.5)",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  const roomContent = (
    <div className="space-y-3.5">
      {[
        { key: "width",  label: "Genişlik",  val: roomWidth,  min: 2, max: 20 },
        { key: "depth",  label: "Derinlik",  val: roomDepth,  min: 2, max: 20 },
        { key: "height", label: "Yükseklik", val: roomHeight, min: 2, max: 5  },
      ].map(({ key, label, val, min, max }) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-medium" style={{ color: "rgba(42,26,12,0.55)" }}>{label}</label>
            <span className="text-[11px] font-bold tabular-nums" style={{ color: "#D4A853" }}>
              {val.toFixed(1)} m
            </span>
          </div>
          <input
            type="range"
            min={min} max={max} step={0.1} value={val}
            onChange={(e) => setRoomDimensions({ [key]: parseFloat(e.target.value) })}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(90deg, #D4A853 ${((val - min) / (max - min)) * 100}%, rgba(212,168,83,0.15) 0%)`,
              accentColor: "#D4A853",
            }}
          />
          <div className="flex justify-between mt-0.5">
            <span className="text-[9px]" style={{ color: "rgba(42,26,12,0.35)" }}>{min}m</span>
            <span className="text-[9px]" style={{ color: "rgba(42,26,12,0.35)" }}>{max}m</span>
          </div>
        </div>
      ))}
    </div>
  );

  const appearanceContent = (
    <div className="space-y-4">
      {/* Wall colors */}
      <div>
        <p className="text-[10px] font-medium mb-2.5" style={{ color: "rgba(42,26,12,0.5)" }}>Duvar Rengi</p>
        <div className="grid grid-cols-4 gap-1.5">
          {WALL_COLORS.map(({ hex, label }) => (
            <button
              key={hex}
              title={label}
              onClick={() => setWallColor(hex)}
              className="w-full aspect-square rounded-xl transition-all duration-200 cursor-pointer relative"
              style={{
                background: hex,
                border: wallColor === hex ? "2.5px solid #D4A853" : "2px solid rgba(212,168,83,0.18)",
                boxShadow: wallColor === hex ? "0 0 0 1px rgba(212,168,83,0.4)" : "none",
                transform: wallColor === hex ? "scale(1.08)" : "scale(1)",
              }}
            >
              {wallColor === hex && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full"
                    style={{ background: parseInt(hex.slice(1), 16) > 0xaaaaaa ? "rgba(0,0,0,0.6)" : "rgba(42,26,12,0.8)" }} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Floor textures */}
      <div>
        <p className="text-[10px] font-medium mb-2.5" style={{ color: "rgba(42,26,12,0.5)" }}>Zemin Malzeme</p>
        <div className="grid grid-cols-5 gap-1.5">
          {FLOOR_TEXTURES.map(({ id, label, color }) => (
            <button key={id} title={label} onClick={() => setFloorTexture(id)}
              className="flex flex-col items-center gap-1 cursor-pointer">
              <div
                className="w-full aspect-square rounded-lg transition-all duration-200"
                style={{
                  background: color,
                  border: floorTexture === id ? "2.5px solid #D4A853" : "2px solid rgba(212,168,83,0.12)",
                  transform: floorTexture === id ? "scale(1.08)" : "scale(1)",
                }}
              />
              <span className="text-[9px] font-medium"
                style={{ color: floorTexture === id ? "#D4A853" : "rgba(42,26,12,0.45)" }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const catalogContent = availableModels.length === 0 ? (
    <div className="text-center py-5">
      <div className="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.15)" }}>
        <Package className="w-5 h-5 opacity-40" style={{ color: "#D4A853" }} />
      </div>
      <p className="text-[11px] font-medium" style={{ color: "rgba(42,26,12,0.4)" }}>
        Henüz 3D model yok
      </p>
      <p className="text-[10px] mt-1" style={{ color: "rgba(42,26,12,0.35)" }}>
        Admin panelinden ürün ekleyin
      </p>
    </div>
  ) : (
    <div className="space-y-1.5">
      {availableModels.map((model) => (
        <button
          key={model.productId}
          onClick={() => addObject({
            productId: model.productId,
            productName: model.productName,
            modelUrl: model.modelUrl,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            colorHex: model.colorVariants[0]?.hex,
          })}
          className="w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer group flex items-center gap-3"
          style={{ background: "rgba(212,168,83,0.04)", border: "1px solid rgba(212,168,83,0.12)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,83,0.3)";
            (e.currentTarget as HTMLElement).style.background = "rgba(212,168,83,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,83,0.12)";
            (e.currentTarget as HTMLElement).style.background = "rgba(212,168,83,0.04)";
          }}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)" }}>
            {model.thumbnailUrl ? (
              <img src={model.thumbnailUrl} alt={model.productName} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-4 h-4" style={{ color: "#D4A853" }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: "rgba(42,26,12,0.85)" }}>{model.productName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-[10px]" style={{ color: "rgba(42,26,12,0.4)" }}>Sahneye ekle</p>
              {model.colorVariants.length > 0 && (
                <div className="flex gap-0.5">
                  {model.colorVariants.slice(0, 5).map((cv) => (
                    <div key={cv.id} title={cv.name} className="w-2.5 h-2.5 rounded-full"
                      style={{ background: cv.hex, border: "1px solid rgba(212,168,83,0.2)" }} />
                  ))}
                  {model.colorVariants.length > 5 && (
                    <span className="text-[8px]" style={{ color: "rgba(42,26,12,0.45)" }}>
                      +{model.colorVariants.length - 5}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            style={{ color: "#D4A853" }} />
        </button>
      ))}
    </div>
  );

  const objectsContent = objects.length === 0 ? (
    <div className="text-center py-5">
      <div className="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center"
        style={{ background: "rgba(212,168,83,0.06)", border: "1px solid rgba(212,168,83,0.10)" }}>
        <Layers className="w-4 h-4 opacity-30 text-white" />
      </div>
      <p className="text-[11px]" style={{ color: "rgba(42,26,12,0.4)" }}>Henüz nesne eklenmedi</p>
    </div>
  ) : (
    <div className="space-y-1.5">
      {objects.map((obj) => {
        const sel = obj.id === selectedObjectId;
        return (
          <div
            key={obj.id}
            onClick={() => useRoomPlannerStore.getState().setSelectedObject(obj.id)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all"
            style={{
              background: sel ? "rgba(212,168,83,0.1)" : "rgba(212,168,83,0.04)",
              border: `1px solid ${sel ? "rgba(212,168,83,0.3)" : "rgba(212,168,83,0.08)"}`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: obj.colorHex || "#D4A853", opacity: sel ? 1 : 0.5, border: "1px solid rgba(212,168,83,0.25)" }}
            />
            <span className={cn("text-xs flex-1 truncate")}
              style={{ color: sel ? "#D4A853" : "rgba(42,26,12,0.6)" }}>
              {obj.productName}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); removeObject(obj.id); }}
              className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer p-1 rounded"
              style={{ color: "#f87171" }}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );

  const actionsContent = (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          style={{ background: "#D4A853", color: "#09090b" }}
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Kaydet
        </button>
        <button
          onClick={handleScreenshot}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
          style={{
            background: "rgba(212,168,83,0.06)",
            border: "1px solid rgba(212,168,83,0.18)",
            color: "rgba(42,26,12,0.7)",
          }}
        >
          <Camera className="w-3.5 h-3.5" />
          Ekran
        </button>
      </div>

      {shareUrl && (
        <button
          onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success("Link kopyalandı!"); }}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
          style={{
            background: "rgba(212,168,83,0.08)",
            border: "1px solid rgba(212,168,83,0.2)",
            color: "#D4A853",
          }}
        >
          <Share2 className="w-3.5 h-3.5" />
          Linki Kopyala
        </button>
      )}

      <button
        onClick={reset}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-medium transition-all cursor-pointer"
        style={{ color: "rgba(42,26,12,0.35)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(42,26,12,0.65)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(42,26,12,0.35)"; }}
      >
        <RotateCcw className="w-3 h-3" />
        Sahneyi Sıfırla
      </button>
    </div>
  );

  // ── Mobile mode: render only the requested section ──
  if (mobileSection) {
    const p = "px-4 pt-2 pb-5";
    const divider = <div className="mx-4" style={{ height: 1, background: "rgba(212,168,83,0.10)" }} />;
    return (
      <div>
        {mobileSection === "tools" && (
          <>
            <div className={p}>{toolsContent}</div>
            {divider}
            <div className={p}>{actionsContent}</div>
          </>
        )}
        {mobileSection === "catalog" && <div className={p}>{catalogContent}</div>}
        {mobileSection === "room" && <div className={p}>{roomContent}</div>}
        {mobileSection === "appearance" && <div className={p}>{appearanceContent}</div>}
        {mobileSection === "objects" && (
          <>
            <div className={p}>{objectsContent}</div>
            {divider}
            <div className={p}>{actionsContent}</div>
          </>
        )}
      </div>
    );
  }

  // ── Desktop mode: full sidebar ──
  return (
    <aside
      className="w-72 flex flex-col shrink-0"
      style={{
        background: "rgba(250,246,240,0.97)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(212,168,83,0.12)",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0"
        style={{ borderBottom: "1px solid rgba(212,168,83,0.12)" }}>
        <div>
          <h2 className="text-sm font-bold tracking-wide" style={{ color: "rgba(42,26,12,0.85)" }}>Urban Creative</h2>
          <p className="text-[10px] mt-0.5" style={{ color: "#D4A853" }}>
            {objects.length} nesne sahnede
          </p>
        </div>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#D4A853" }} />
      </div>

      <Section title="Araçlar" icon={MousePointer}>{toolsContent}</Section>
      <Section title="Oda Boyutları" icon={Ruler}>{roomContent}</Section>
      <Section title="Görünüm" icon={Paintbrush}>{appearanceContent}</Section>
      <Section title="Ürün Kataloğu" icon={Package} badge={availableModels.length}>
        {catalogContent}
      </Section>
      {objects.length > 0 && (
        <Section title="Sahnedeki Nesneler" icon={Layers} defaultOpen={false} badge={objects.length}>
          {objectsContent}
        </Section>
      )}

      {/* Actions */}
      <div className="mt-auto p-4 shrink-0" style={{ borderTop: "1px solid rgba(212,168,83,0.10)" }}>
        {actionsContent}
      </div>
    </aside>
  );
}
