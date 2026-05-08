import { create } from "zustand";
import type { RoomPlannerState, PlacedObject } from "@/types/room-planner";

export const useRoomPlannerStore = create<RoomPlannerState>((set) => ({
  roomWidth: 4,
  roomHeight: 2.8,
  roomDepth: 3,
  wallColor: "#f5f5f0",
  floorTexture: "wood",
  objects: [],
  selectedObjectId: null,
  activeTool: "select",

  addObject: (obj) =>
    set((state) => ({
      objects: [
        ...state.objects,
        { ...obj, id: `obj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` },
      ],
    })),

  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((o) => o.id !== id),
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
    })),

  updateObjectTransform: (id, transform) =>
    set((state) => ({
      objects: state.objects.map((o) => (o.id === id ? { ...o, ...transform } : o)),
    })),

  updateObjectColor: (id, colorHex) =>
    set((state) => ({
      objects: state.objects.map((o) => (o.id === id ? { ...o, colorHex } : o)),
    })),

  setSelectedObject: (id) => set({ selectedObjectId: id }),

  setRoomDimensions: (dims) =>
    set((state) => ({
      roomWidth: dims.width ?? state.roomWidth,
      roomHeight: dims.height ?? state.roomHeight,
      roomDepth: dims.depth ?? state.roomDepth,
    })),

  setActiveTool: (tool) => set({ activeTool: tool }),
  setWallColor: (color) => set({ wallColor: color }),
  setFloorTexture: (texture) => set({ floorTexture: texture }),

  reset: () =>
    set({
      roomWidth: 4,
      roomHeight: 2.8,
      roomDepth: 3,
      wallColor: "#f5f5f0",
      floorTexture: "wood",
      objects: [],
      selectedObjectId: null,
      activeTool: "select",
    }),
}));
