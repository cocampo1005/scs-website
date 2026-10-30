import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import SolidPuzzleScene from "./SolidPuzzleScene";
import { SOLID_SCENE } from "../../constants/solidPuzzleData";
import { watchContextLoss } from "../../three/webgl";

export default function SolidPuzzleCanvas({
  active,
  reducedMotion,
  layout,
  attempt,
  seed,
  activeId,
  onPlace,
  onSelect,
  onReady,
  onDragChange,
  onStageChange,
  placedIds,
  commandsRef,
  onContextLost,
}) {
  // "never" while off-screen or the tab is hidden. The idle float needs a steady
  // loop; with reduced motion nothing floats, so render on demand.
  const frameloop = !active ? "never" : reducedMotion ? "demand" : "always";

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, SOLID_SCENE.cameraZ], zoom: 1, near: -100000, far: 100000 }}
      frameloop={frameloop}
      dpr={[1, 1.75]}
      flat
      gl={{ antialias: true, alpha: true }}
      // Vertical swipes outside a piece still scroll the page
      style={{ touchAction: "pan-y" }}
      onCreated={({ gl }) => {
        if (onContextLost) watchContextLoss(gl.domElement, onContextLost);
      }}
    >
      <Suspense fallback={null}>
        <SolidPuzzleScene
          key={attempt}
          layout={layout}
          seed={seed}
          activeId={activeId}
          reducedMotion={reducedMotion}
          onPlace={onPlace}
          onSelect={onSelect}
          onReady={onReady}
          onDragChange={onDragChange}
          onStageChange={onStageChange}
          placedIds={placedIds}
          commandsRef={commandsRef}
        />
      </Suspense>
    </Canvas>
  );
}
