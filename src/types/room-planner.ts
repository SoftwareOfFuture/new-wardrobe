export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
}

export interface PlacedObject {
  id: string;
  productId: string;
  productName: string;
  modelUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  colorHex?: string;
}

export interface AvailableModel {
  productId: string;
  productName: string;
  modelUrl: string;
  thumbnailUrl?: string;
  colorVariants: ColorVariant[];
}

export interface RoomDimensions {
  width: number;
  height: number;
  depth: number;
}

export type ActiveTool = "select" | "move" | "rotate" | "scale";

export interface RoomPlannerState {
  roomWidth: number;
  roomHeight: number;
  roomDepth: number;
  wallColor: string;
  floorTexture: string;
  objects: PlacedObject[];
  selectedObjectId: string | null;
  activeTool: ActiveTool;
  addObject: (obj: Omit<PlacedObject, "id">) => void;
  removeObject: (id: string) => void;
  updateObjectTransform: (
    id: string,
    transform: Partial<Pick<PlacedObject, "position" | "rotation" | "scale">>
  ) => void;
  updateObjectColor: (id: string, colorHex: string) => void;
  setSelectedObject: (id: string | null) => void;
  setRoomDimensions: (dims: Partial<RoomDimensions>) => void;
  setActiveTool: (tool: ActiveTool) => void;
  setWallColor: (color: string) => void;
  setFloorTexture: (texture: string) => void;
  reset: () => void;
}
