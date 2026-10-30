import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import PuzzleScene from "./PuzzleScene";
import { watchContextLoss } from "../../three/webgl";
import { BACKGROUND, CAMERA, FRAMING, ZOOM_REFERENCE_WIDTH } from "./puzzleConfig";

const baseUp = new THREE.Vector3(0, 1, 0).applyQuaternion(
  new THREE.Quaternion(...CAMERA.quaternion),
);

// Fits the puzzle into the hero's stage: the canvas covers the whole hero, so
// the camera is zoomed to the stage height and slid along its up axis until the
// puzzle sits at the stage centre (`stage.offsetY` px below the canvas centre).
function StageFraming({ stage }) {
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const widthZoom = CAMERA.zoom * Math.min(1, width / ZOOM_REFERENCE_WIDTH);
    const zoom = stage
      ? Math.min(widthZoom, stage.height / FRAMING.contentHeight)
      : widthZoom;
    camera.zoom = zoom;
    const shift = stage
      ? stage.offsetY / zoom - FRAMING.contentOffset
      : 0;
    camera.position.set(...CAMERA.position).addScaledVector(baseUp, shift);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, width, stage, invalidate]);

  return null;
}

export default function HeroPuzzleCanvas({
  active,
  continuous,
  skipped,
  reducedMotion,
  stage,
  onSolved,
  onReady,
  onContextLost,
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
      // Vertical swipes scroll the page; only touches on the cube are captured
      style={{ touchAction: "pan-y" }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        if (onContextLost) watchContextLoss(gl.domElement, onContextLost);
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
      <StageFraming stage={stage} />
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
