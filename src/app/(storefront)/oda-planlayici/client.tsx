"use client";

import dynamic from "next/dynamic";
import { RoomPlannerSidebar } from "@/components/room-planner/RoomPlannerSidebar";
import { useRoomPlannerStore } from "@/stores/room-planner-store";
import type { AvailableModel } from "@/types/room-planner";
import {
  Loader2, Box, MousePointer, Move, RotateCw,
  Maximize, Trash2, Layers3, ArrowLeft,
  Package, Ruler, Paintbrush,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

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
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
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

export type MobileTab = "catalog" | "tools" | "room" | "appearance" | "objects";

const MOBILE_TABS: { id: MobileTab; icon: typeof Package; label: string }[] = [
  { id: "catalog",    icon: Package,      label: "Ürünler"  },
  { id: "tools",      icon: MousePointer, label: "Araçlar"  },
  { id: "room",       icon: Ruler,        label: "Oda"      },
  { id: "appearance", icon: Paintbrush,   label: "Görünüm"  },
  { id: "objects",    icon: Layers3,      label: "Nesneler" },
];

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
      className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-2xl"
      style={{
        background: "rgba(250,246,240,0.93)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(212,168,83,0.15)",
        boxShadow: "0 8px 32px rgba(212,168,83,0.12)",
      }}
    >
      {/* Tool group */}
      <div
        className="flex items-center gap-0.5 pr-1.5 sm:pr-2 mr-0.5 sm:mr-1"
        style={{ borderRight: "1px solid rgba(212,168,83,0.15)" }}
      >
        {tools.map((tool) => {
          const active = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: active ? "rgba(212,168,83,0.15)" : "transparent",
                color: active ? "#D4A853" : "rgba(42,26,12,0.5)",
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
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
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
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs"
          style={{ color: "rgba(42,26,12,0.4)", background: "rgba(212,168,83,0.08)" }}
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
    <>
      {/* Mobile: fixed above tab bar */}
      <div
        className="lg:hidden fixed left-1/2 -translate-x-1/2 z-[35] flex items-center gap-3 px-4 py-2 rounded-full text-xs pointer-events-auto"
        style={{
          bottom: "calc(60px + env(safe-area-inset-bottom, 0px) + 12px)",
          background: "rgba(9,9,11,0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.07)",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        <span>1P Döndür</span>
        <span className="opacity-30">·</span>
        <span>2P Zum</span>
        <button onClick={() => setVisible(false)} className="ml-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer text-base leading-none">×</button>
      </div>
      {/* Desktop: absolute inside canvas */}
      <div
        className="hidden lg:flex absolute bottom-16 left-1/2 -translate-x-1/2 z-20 items-center gap-3 px-4 py-2.5 rounded-full text-xs pointer-events-auto"
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
        <button onClick={() => setVisible(false)} className="ml-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer text-base leading-none">×</button>
      </div>
    </>
  );
}

export function RoomPlannerClient({ availableModels }: RoomPlannerClientProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("catalog");
  const { objects, activeTool } = useRoomPlannerStore();
  const prevObjCount = useRef(objects.length);

  // Auto-close sheet when a new object is added to the scene
  useEffect(() => {
    if (objects.length > prevObjCount.current && mobileSidebarOpen) {
      const timer = setTimeout(() => setMobileSidebarOpen(false), 250);
      prevObjCount.current = objects.length;
      return () => clearTimeout(timer);
    }
    prevObjCount.current = objects.length;
  }, [objects.length, mobileSidebarOpen]);

  // Auto-close sheet when a transform tool is selected (user wants to interact with object)
  useEffect(() => {
    if (["move", "rotate", "scale"].includes(activeTool) && mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  }, [activeTool]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabPress = (tab: MobileTab) => {
    if (mobileSidebarOpen && mobileTab === tab) {
      setMobileSidebarOpen(false);
    } else {
      setMobileTab(tab);
      setMobileSidebarOpen(true);
    }
  };

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Desktop sidebar — hidden on mobile/tablet */}
      <div className="hidden lg:flex shrink-0">
        <RoomPlannerSidebar availableModels={availableModels} />
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", minWidth: 0 }}>
        <TopToolbar />

        {/* Canvas fills parent completely */}
        <div style={{ position: "absolute", inset: 0 }}>
          <RoomPlannerCanvas />
        </div>

        <HelpBadge />

        {/* Ürünlere Dön — mobile: fixed above tab bar, desktop: absolute bottom-left */}
        <Link
          href="/urunler"
          className="hidden lg:inline-flex absolute bottom-5 left-5 z-20 items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 group"
          style={{
            background: "rgba(9,9,11,0.82)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "rgba(255,255,255,0.65)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" style={{ color: "#D4A853" }} />
          Ürünlere Dön
        </Link>
        <Link
          href="/urunler"
          className="lg:hidden fixed left-3 z-[35] inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 group"
          style={{
            bottom: "calc(60px + env(safe-area-inset-bottom, 0px) + 12px)",
            background: "rgba(9,9,11,0.82)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "rgba(255,255,255,0.65)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <ArrowLeft className="w-3 h-3" style={{ color: "#D4A853" }} />
          Geri
        </Link>

        {/* ── Tap backdrop — closes sheet when tapping canvas ── */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="lg:hidden fixed inset-0"
              style={{ zIndex: 30, background: "rgba(0,0,0,0.4)" }}
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Mobile bottom sheet — fixed to viewport ── */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 right-0 overflow-hidden rounded-t-2xl"
              style={{
                bottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
                maxHeight: "62vh",
                zIndex: 35,
                background: "rgba(250,246,240,0.97)",
                backdropFilter: "blur(24px)",
                borderTop: "1px solid rgba(212,168,83,0.18)",
                borderLeft: "1px solid rgba(212,168,83,0.12)",
                borderRight: "1px solid rgba(212,168,83,0.12)",
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-2.5 pb-0 shrink-0">
                <div className="w-10 h-1 rounded-full" style={{ background: "rgba(212,168,83,0.25)" }} />
              </div>
              {/* Section label */}
              <div className="px-4 pt-2.5 pb-1 shrink-0">
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: "#D4A853" }}>
                  {MOBILE_TABS.find((t) => t.id === mobileTab)?.label}
                </p>
              </div>
              {/* Scrollable content */}
              <div className="overflow-y-auto" style={{ maxHeight: "calc(62vh - 56px)" }}>
                <RoomPlannerSidebar
                  availableModels={availableModels}
                  mobileSection={mobileTab}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile bottom tab bar — fixed to viewport ── */}
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-end justify-around"
          style={{
            background: "rgba(250,246,240,0.97)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(212,168,83,0.15)",
            paddingTop: "8px",
            paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          {MOBILE_TABS.map((tab) => {
            const isActive = mobileSidebarOpen && mobileTab === tab.id;
            const showBadge = tab.id === "objects" && objects.length > 0;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabPress(tab.id)}
                className="relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 cursor-pointer min-w-[52px]"
                style={{ color: isActive ? "#D4A853" : "rgba(42,26,12,0.45)" }}
              >
                {showBadge && (
                  <span
                    className="absolute -top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{ background: "#D4A853", color: "#09090b" }}
                  >
                    {objects.length > 9 ? "9+" : objects.length}
                  </span>
                )}
                <tab.icon className="w-5 h-5" />
                <span className="text-[9px] font-medium leading-none mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
