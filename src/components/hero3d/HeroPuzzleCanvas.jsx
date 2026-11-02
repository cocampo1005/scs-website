import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import PuzzleScene from "./PuzzleScene";
import { watchContextLoss } from "../../three/webgl";
import { CAMERA, FRAMING, ZOOM_REFERENCE_WIDTH } from "./puzzleConfig";

const cameraQuaternion = new THREE.Quaternion(...CAMERA.quaternion);
const baseUp = new THREE.Vector3(0, 1, 0).applyQuaternion(cameraQuaternion);
const baseRight = new THREE.Vector3(1, 0, 0).applyQuaternion(cameraQuaternion);

// Fits the puzzle into the hero's stage: the canvas covers the whole hero, so
// the camera is zoomed to the stage height and slid along its up and right axes
// until the puzzle sits at the stage centre (`stage.offsetX`/`offsetY` px from
// the canvas centre).
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
    const shiftX = stage ? -(stage.offsetX ?? 0) / zoom : 0;
    camera.position
      .set(...CAMERA.position)
      .addScaledVector(baseUp, shift)
      .addScaledVector(baseRight, shiftX);
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
  // Start assembled without animating (a solve restored from this session)
  restored = false,
  // Changing it remounts the scene with the pieces back at the start, inside
  // the same WebGL context
  replayKey = 0,
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
      // Transparent: the page's grid and circuit layer show through
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // Vertical swipes scroll the page; only touches on the cube are captured
      style={{ touchAction: "pan-y" }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        if (onContextLost) watchContextLoss(gl.domElement, onContextLost);
      }}
    >
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
          key={replayKey}
          restored={restored}
          showBubbles={false}
          shadowFloor
          skipped={skipped}
          reducedMotion={reducedMotion}
          onSolved={onSolved}
          onReady={onReady}
        />
      </Suspense>
    </Canvas>
  );
}
