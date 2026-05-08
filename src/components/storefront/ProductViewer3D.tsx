"use client";

import { Suspense, useState, useEffect, useRef, useMemo, Component, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Bounds,
  useBounds,
} from "@react-three/drei";
import * as THREE from "three";
import { Loader2, Box } from "lucide-react";

// Proxy Meshy CloudFront URLs to bypass CORS
function proxyUrl(url: string) {
  if (url.startsWith("http")) {
    return `/api/proxy-glb?url=${encodeURIComponent(url)}`;
  }
  return url;
}

function Model({ url, onLoad }: { url: string; onLoad?: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url); // URL is already proxied by parent
  const bounds = useBounds();

  useEffect(() => {
    if (groupRef.current) {
      bounds.refresh(groupRef.current).fit();
      onLoad?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Error boundary to catch useGLTF failures gracefully
class ModelErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface ProductViewer3DProps {
  modelUrl: string;
  className?: string;
}

export function ProductViewer3D({ modelUrl, className }: ProductViewer3DProps) {
  const [hasError, setHasError] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  // Memoize proxy URL to prevent re-renders triggering multiple fetches
  const proxiedUrl = useMemo(() => proxyUrl(modelUrl), [modelUrl]);

  if (hasError) {
    return (
      <div
        className={`relative rounded-2xl overflow-hidden bg-zinc-900/80 flex items-center justify-center ${className || ""}`}
      >
        <div className="text-center text-muted-foreground p-8">
          <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">3D model yüklenemedi</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${className || ""}`}
      style={{ background: "#18181b" }}
    >
      {!modelLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-zinc-900">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          <span className="text-xs text-zinc-500">3D model yükleniyor...</span>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ height: "100%" }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#18181b"), 1);
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <directionalLight position={[-5, 5, -5]} intensity={0.8} />

        <Bounds fit clip observe margin={1.4}>
          <Suspense fallback={null}>
            <ModelErrorBoundary onError={() => setHasError(true)}>
              <Model url={proxiedUrl} onLoad={() => setModelLoaded(true)} />
            </ModelErrorBoundary>
          </Suspense>
        </Bounds>

        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 + 0.2}
        />
      </Canvas>

      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-xs text-zinc-400 pointer-events-none z-10">
        Döndürmek için sürükleyin
      </div>
    </div>
  );
}
