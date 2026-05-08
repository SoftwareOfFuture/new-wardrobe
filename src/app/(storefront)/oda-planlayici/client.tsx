"use client";

import dynamic from "next/dynamic";
import { RoomPlannerSidebar } from "@/components/room-planner/RoomPlannerSidebar";
import { useRoomPlannerStore } from "@/stores/room-planner-store";
import type { AvailableModel } from "@/types/room-planner";
import {
  Loader2, Box, MousePointer, Move, RotateCw,
  Maximize, Trash2, Layers3, ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const RoomPlannerCanvas = dynamic(
  () => import("@/components/room-planner/RoomPlannerCanvas").then((m) => m.RoomPlannerCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex flex-col items-center justify-center gap-4 w-full h-full"
        style={{ background: "#1a1a1e" }}
      >
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.3)" }}
          >
            <Layers3 className="w-8 h-8 animate-pulse" style={{ color: "#D4A853" }} />
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "#D4A853" }}
          >
            <Loader2 className="w-3 h-3 animate-spin text-black" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white/70">3D sahne yükleniyor</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            Lütfen bekleyin...
          </p>
        </div>
      </div>
    ),
  }
);

interface RoomPlannerClientProps {
  availableModels: AvailableModel[];
}

// ── Floating top toolbar ───────────────────────────
function TopToolbar() {
  const { activeTool, setActiveTool, selectedObjectId, removeObject, objects } =
    useRoomPlannerStore();

  const tools = [
    { id: "select" as const, icon: MousePointer, label: "Seç" },
    { id: "move"   as const, icon: Move,         label: "Taşı" },
    { id: "rotate" as const, icon: RotateCw,     label: "Döndür" },
    { id: "scale"  as const, icon: Maximize,     label: "Ölçekle" },
  ];

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-1.5 rounded-2xl"
      style={{
        background: "rgba(9,9,11,0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Tool group */}
      <div
        className="flex items-center gap-0.5 pr-2 mr-1"
        style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}
      >
        {tools.map((tool) => {
          const active = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: active ? "rgba(212,168,83,0.15)" : "transparent",
                color: active ? "#D4A853" : "rgba(255,255,255,0.4)",
                border: active ? "1px solid rgba(212,168,83,0.3)" : "1px solid transparent",
              }}
            >
              <tool.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Delete selected */}
      {selectedObjectId && (
        <button
          onClick={() => removeObject(selectedObjectId)}
          title="Nesneyi sil"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
          style={{
            background: "rgba(220,38,38,0.12)",
            color: "#f87171",
            border: "1px solid rgba(220,38,38,0.25)",
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sil</span>
        </button>
      )}

      {/* Object count */}
      {objects.length > 0 && (
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs"
          style={{ color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.03)" }}
        >
          <Box className="w-3 h-3" />
          {objects.length}
        </div>
      )}
    </div>
  );
}

// ── Help overlay ──────────────────────────────────
function HelpBadge() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-5 py-2.5 rounded-full text-xs pointer-events-auto"
      style={{
        background: "rgba(9,9,11,0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.07)",
        color: "rgba(255,255,255,0.35)",
      }}
    >
      <span>🖱 Döndür</span>
      <span className="opacity-30">·</span>
      <span>⌘ Pan</span>
      <span className="opacity-30">·</span>
      <span>Scroll Zum</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

export function RoomPlannerClient({ availableModels }: RoomPlannerClientProps) {
  return (
    /*
     * Tam ekran layout: Navbar yüksekliği 64px.
     * overflow: hidden — sayfanın kendisi scroll etmez, sadece sidebar içi scroll eder.
     */
    <div
      style={{
        height: "calc(100vh - 64px)",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Sidebar */}
      <RoomPlannerSidebar availableModels={availableModels} />

      {/* Canvas area */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", minWidth: 0 }}>
        <TopToolbar />

        {/* Canvas fills parent completely */}
        <div style={{ position: "absolute", inset: 0 }}>
          <RoomPlannerCanvas />
        </div>

        <HelpBadge />

        {/* Ürünlere Dön — sol alt */}
        <Link
          href="/urunler"
          className="absolute bottom-5 left-5 z-20 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 group"
          style={{
            background: "rgba(9,9,11,0.82)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "rgba(255,255,255,0.65)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <ArrowLeft
            className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
            style={{ color: "#D4A853" }}
          />
          Ürünlere Dön
        </Link>
      </div>
    </div>
  );
}
