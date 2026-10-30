import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import PuzzleScene from "./PuzzleScene";
import { BACKGROUND, CAMERA, ZOOM_REFERENCE_WIDTH } from "./puzzleConfig";

// Keeps the exported framing on desktop and zooms out on narrow screens
function ResponsiveZoom() {
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    camera.zoom = CAMERA.zoom * Math.min(1, width / ZOOM_REFERENCE_WIDTH);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, width, invalidate]);

  return null;
}

export default function HeroPuzzleCanvas({
  active,
  continuous,
  skipped,
  reducedMotion,
  onSolved,
  onReady,
}) {
  // "never" while off-screen or the tab is hidden. The idle and solved floats
  // need a steady loop; with reduced motion nothing floats, so render on demand.
  const frameloop = !active ? "never" : continuous ? "always" : "demand";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 2]}
      shadows
      flat
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <color attach="background" args={[BACKGROUND]} />
      <OrthographicCamera
        makeDefault
        position={CAMERA.position}
        quaternion={CAMERA.quaternion}
        zoom={CAMERA.zoom}
        near={CAMERA.near}
        far={CAMERA.far}
      />
      <ResponsiveZoom />
      <Suspense fallback={null}>
        <PuzzleScene
          skipped={skipped}
          reducedMotion={reducedMotion}
          onSolved={onSolved}
          onReady={onReady}
        />
      </Suspense>
    </Canvas>
  );
}
