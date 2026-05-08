"use client";

import { Suspense, useRef, useCallback, useEffect, useState, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  TransformControls,
  ContactShadows,
  Preload,
  Grid,
} from "@react-three/drei";
import { useRoomPlannerStore } from "@/stores/room-planner-store";
import type { PlacedObject } from "@/types/room-planner";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────
   Floor — warm PBR look, 5 material presets
───────────────────────────────────────────────────── */
const FLOOR_COLORS: Record<string, { color: string; roughness: number; metalness: number }> = {
  wood:     { color: "#b5935a", roughness: 0.75, metalness: 0.02 },
  marble:   { color: "#d6cfc4", roughness: 0.15, metalness: 0.05 },
  dark:     { color: "#4a3728", roughness: 0.70, metalness: 0.02 },
  concrete: { color: "#8a8a86", roughness: 0.90, metalness: 0.00 },
  carpet:   { color: "#6b6b8a", roughness: 0.95, metalness: 0.00 },
};

function FloorMesh() {
  const { roomWidth, roomDepth, floorTexture } = useRoomPlannerStore();
  const mat = FLOOR_COLORS[floorTexture] ?? FLOOR_COLORS.wood;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[roomWidth, roomDepth]} />
      <meshStandardMaterial color={mat.color} roughness={mat.roughness} metalness={mat.metalness} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────
   Room shell — back + left + right wall, ceiling, baseboard
───────────────────────────────────────────────────── */
function WallPanel({
  position, rotation, width, height, color,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  height: number;
  color: string;
}) {
  return (
    <mesh position={position} rotation={rotation ?? [0, 0, 0]} receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={color} roughness={0.85} metalness={0} side={THREE.FrontSide} />
    </mesh>
  );
}

function RoomShell() {
  const { roomWidth, roomHeight, roomDepth, wallColor } = useRoomPlannerStore();
  const hw = roomWidth / 2;
  const hd = roomDepth / 2;

  const trimColor = new THREE.Color(wallColor).multiplyScalar(0.72).getStyle();
  const ceilColor = new THREE.Color("#f0ede8").getStyle();

  return (
    <group>
      {/* Walls */}
      <WallPanel position={[0, roomHeight / 2, -hd]} width={roomWidth} height={roomHeight} color={wallColor} />
      <WallPanel position={[-hw, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} width={roomDepth} height={roomHeight} color={wallColor} />
      <WallPanel position={[hw, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]} width={roomDepth} height={roomHeight} color={wallColor} />

      {/* Ceiling */}
      <mesh position={[0, roomHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial color={ceilColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* Baseboards */}
      <mesh position={[0, 0.05, -hd + 0.015]}>
        <boxGeometry args={[roomWidth, 0.1, 0.015]} />
        <meshStandardMaterial color={trimColor} roughness={0.6} />
      </mesh>
      <mesh position={[-hw + 0.015, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[roomDepth, 0.1, 0.015]} />
        <meshStandardMaterial color={trimColor} roughness={0.6} />
      </mesh>
      <mesh position={[hw - 0.015, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[roomDepth, 0.1, 0.015]} />
        <meshStandardMaterial color={trimColor} roughness={0.6} />
      </mesh>

      {/* Ceiling cornice */}
      <mesh position={[0, roomHeight - 0.05, -hd + 0.015]}>
        <boxGeometry args={[roomWidth, 0.1, 0.015]} />
        <meshStandardMaterial color={trimColor} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────
   Lighting rig
───────────────────────────────────────────────────── */
function Lighting() {
  const { roomWidth, roomHeight, roomDepth } = useRoomPlannerStore();
  return (
    <>
      <ambientLight intensity={0.65} color="#fff8f0" />
      <directionalLight
        position={[roomWidth * 0.8, roomHeight * 1.3, roomDepth * 0.6]}
        intensity={1.2}
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.002}
      />
      {/* Fill light */}
      <pointLight
        position={[-roomWidth * 0.5, roomHeight * 0.7, roomDepth * 0.4]}
        intensity={0.35}
        color="#dde0ff"
      />
      {/* Ceiling bounce */}
      <pointLight
        position={[0, roomHeight - 0.15, 0]}
        intensity={0.3}
        color="#fff8f0"
        distance={12}
        decay={2}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────
   Draggable 3D model with color tinting
───────────────────────────────────────────────────── */
function DraggableModel({ obj }: { obj: PlacedObject }) {
  const proxyUrl = obj.modelUrl.startsWith("http")
    ? `/api/proxy-glb?url=${encodeURIComponent(obj.modelUrl)}`
    : obj.modelUrl;

  const { scene } = useGLTF(proxyUrl);
  const {
    selectedObjectId, setSelectedObject, updateObjectTransform,
    activeTool, roomWidth, roomHeight, roomDepth,
  } = useRoomPlannerStore();

  const isSelected = selectedObjectId === obj.id;
  const meshRef = useRef<THREE.Group>(null);
  const [ready, setReady] = useState(false);
  const bbox = useRef({ halfW: 0.5, halfD: 0.5, floorY: 0, halfH: 1 });

  // Deep-clone scene + materials so each instance is independent
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }
      }
    });
    return clone;
  }, [scene]);

  // Apply color tint whenever obj.colorHex changes
  useEffect(() => {
    if (!obj.colorHex) return;
    const color = new THREE.Color(obj.colorHex);
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial;
          if (mat.color) mat.color.copy(color);
        });
      }
    });
  }, [obj.colorHex, clonedScene]);

  // Snap to floor on mount
  useEffect(() => {
    let raf: number;
    function snap() {
      if (!meshRef.current) return;
      const box = new THREE.Box3().setFromObject(meshRef.current);
      if (box.isEmpty() || box.min.y === box.max.y) {
        raf = requestAnimationFrame(snap);
        return;
      }
      const size = new THREE.Vector3();
      box.getSize(size);
      bbox.current = {
        halfW: Math.max(size.x / 2, 0.01),
        halfD: Math.max(size.z / 2, 0.01),
        halfH: Math.max(size.y / 2, 0.01),
        floorY: -box.min.y,
      };
      const maxX = roomWidth / 2 - bbox.current.halfW;
      const maxZ = roomDepth / 2 - bbox.current.halfD;
      const nx = Math.max(-maxX, Math.min(maxX, meshRef.current.position.x));
      const nz = Math.max(-maxZ, Math.min(maxZ, meshRef.current.position.z));
      meshRef.current.position.set(nx, bbox.current.floorY, nz);
      updateObjectTransform(obj.id, { position: [nx, bbox.current.floorY, nz] });
      setReady(true);
    }
    raf = requestAnimationFrame(() => { raf = requestAnimationFrame(snap); });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obj.id]);

  const handleClick = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setSelectedObject(obj.id);
  }, [obj.id, setSelectedObject]);

  const mode = activeTool === "rotate" ? "rotate" : activeTool === "scale" ? "scale" : "translate";

  const handleObjectChange = useCallback(() => {
    if (!meshRef.current) return;
    const { position: pos, rotation: rot, scale: scl } = meshRef.current;
    const { halfW, halfD, floorY, halfH } = bbox.current;

    if (activeTool === "select" || activeTool === "move") {
      const cx = Math.max(-(roomWidth / 2 - halfW), Math.min(roomWidth / 2 - halfW, pos.x));
      const cz = Math.max(-(roomDepth / 2 - halfD), Math.min(roomDepth / 2 - halfD, pos.z));
      const cy = Math.max(floorY, Math.min(roomHeight - halfH * 2, pos.y));
      meshRef.current.position.set(cx, cy, cz);
      updateObjectTransform(obj.id, {
        position: [cx, cy, cz],
        rotation: [rot.x, rot.y, rot.z],
        scale: [scl.x, scl.y, scl.z],
      });
    } else {
      updateObjectTransform(obj.id, {
        position: [pos.x, pos.y, pos.z],
        rotation: [rot.x, rot.y, rot.z],
        scale: [scl.x, scl.y, scl.z],
      });
    }
  }, [obj.id, activeTool, roomWidth, roomDepth, roomHeight, updateObjectTransform]);

  return (
    <group>
      <group
        ref={meshRef}
        position={obj.position}
        rotation={obj.rotation}
        scale={obj.scale}
        onClick={handleClick}
        visible={ready}
        castShadow
        receiveShadow
      >
        <primitive object={clonedScene} />

        {/* Gold selection ring */}
        {isSelected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -bbox.current.floorY + 0.005, 0]}>
            <ringGeometry args={[
              Math.max(bbox.current.halfW, bbox.current.halfD) * 1.15,
              Math.max(bbox.current.halfW, bbox.current.halfD) * 1.38,
              64,
            ]} />
            <meshBasicMaterial color="#D4A853" transparent opacity={0.8} />
          </mesh>
        )}

        {/* Subtle shadow blob */}
        {isSelected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -bbox.current.floorY + 0.003, 0]}>
            <circleGeometry args={[Math.max(bbox.current.halfW, bbox.current.halfD) * 1.1, 32]} />
            <meshBasicMaterial color="#D4A853" transparent opacity={0.06} />
          </mesh>
        )}
      </group>

      {isSelected && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode={mode}
          onObjectChange={handleObjectChange}
          size={0.7}
        />
      )}
    </group>
  );
}

/* ─────────────────────────────────────────────────────
   Full scene
───────────────────────────────────────────────────── */
function SceneContent() {
  const { objects, setSelectedObject } = useRoomPlannerStore();
  const { gl } = useThree();

  return (
    <>
      <Lighting />
      <FloorMesh />
      <RoomShell />

      {/* Subtle floor grid */}
      <Grid
        args={[50, 50]}
        position={[0, 0.002, 0]}
        cellSize={0.5}
        cellColor="#33221100"
        sectionSize={1}
        sectionColor="#44332200"
        fadeDistance={18}
        fadeStrength={1.2}
        infiniteGrid={false}
      />

      {/* Contact shadows */}
      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.35}
        scale={22}
        blur={2.8}
        far={5}
        color="#1a0f00"
        frames={1}
      />

      {objects.map((obj) => (
        <Suspense key={obj.id} fallback={null}>
          <DraggableModel obj={obj} />
        </Suspense>
      ))}

      <OrbitControls
        enablePan
        minDistance={1.2}
        maxDistance={20}
        minPolarAngle={0.05}
        maxPolarAngle={Math.PI / 2 - 0.02}
        makeDefault
        enableDamping
        dampingFactor={0.07}
        onStart={() => { gl.domElement.style.cursor = "grabbing"; }}
        onEnd={() => { gl.domElement.style.cursor = "grab"; }}
      />

      <Environment preset="apartment" environmentIntensity={0.3} />

      {/* Invisible floor — click to deselect */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onClick={() => setSelectedObject(null)}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <Preload all />
    </>
  );
}

/* ─────────────────────────────────────────────────────
   Export
───────────────────────────────────────────────────── */
export function RoomPlannerCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [5, 4, 5], fov: 45 }}
      style={{ width: "100%", height: "100%", cursor: "grab", background: "#1a1a1e", display: "block" }}
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#1c1c20"]} />
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
