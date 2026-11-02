import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { watchContextLoss } from "../../three/webgl";

// The About hero: three floating slabs, People over Problems over Solutions,
// each carrying a few blocks, with a signal that drops through the stack. The
// whole rig turns toward the pointer (pointerRef is written by the hero
// section) and drifts gently on its own.

const FONT = "/fonts/rajdhani-bold.woff";

const SLAB = { w: 4.4, d: 3.1, t: 0.22, gap: 1.5 };

const LAYERS = [
  {
    label: "People",
    y: SLAB.gap,
    blocks: [
      [-1.2, -0.6, 0.55],
      [0.2, 0.3, 0.45],
      [1.3, -0.4, 0.5],
    ],
  },
  {
    label: "Problems",
    y: 0,
    blocks: [
      [-1.3, 0.5, 0.5],
      [-0.1, -0.5, 0.6],
      [1.2, 0.6, 0.45],
      [0.9, -0.7, 0.4],
    ],
  },
  {
    label: "Solutions",
    y: -SLAB.gap,
    blocks: [
      [-0.9, 0.1, 0.6],
      [0.6, -0.3, 0.6],
      [-0.1, 0.9, 0.45],
    ],
  },
];

const COLORS = {
  slab: "#1b1529",
  edge: "#c4b5fd",
  block: "#8b5cf6",
  blockDeep: "#7c3aed",
  hot: "#ff2bf4",
  beam: "#e879f9",
  label: "#c4b5fd",
};

function Slab({ layer, index, edgeRef }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(SLAB.w, SLAB.t, SLAB.d)), []);
  useEffect(() => () => edges.dispose(), [edges]);
  return (
    <group position={[0, layer.y, 0]}>
      <RoundedBox args={[SLAB.w, SLAB.t, SLAB.d]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color={COLORS.slab} roughness={0.5} metalness={0.25} />
      </RoundedBox>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={(m) => (edgeRef.current[index] = m)} color={COLORS.edge} transparent opacity={0.35} />
      </lineSegments>
      {/* Faint grid etched on the slab */}
      <gridHelper args={[SLAB.w - 0.3, 8, "#3b2f57", "#2a2140"]} position={[0, SLAB.t / 2 + 0.002, 0]} scale={[1, 1, (SLAB.d - 0.3) / (SLAB.w - 0.3)]} />
      {layer.blocks.map(([x, z, s], i) => (
        <Block key={i} x={x} z={z} size={s} hot={index === 1 && i === 1} seed={index * 7 + i} />
      ))}
      <Text
        font={FONT}
        fontSize={0.3}
        letterSpacing={0.12}
        color={COLORS.label}
        anchorX="left"
        anchorY="middle"
        position={[-SLAB.w / 2 + 0.25, SLAB.t / 2 + 0.26, SLAB.d / 2 - 0.1]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {layer.label.toUpperCase()}
      </Text>
    </group>
  );
}

function Block({ x, z, size, hot, seed }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = SLAB.t / 2 + size / 2 + 0.05 + Math.sin(t * 0.9 + seed) * 0.05;
    ref.current.rotation.y = Math.sin(t * 0.3 + seed) * 0.08;
  });
  return (
    <mesh ref={ref} position={[x, SLAB.t / 2 + size / 2 + 0.05, z]}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={hot ? COLORS.hot : seed % 2 ? COLORS.block : COLORS.blockDeep}
        emissive={hot ? COLORS.hot : COLORS.blockDeep}
        emissiveIntensity={hot ? 0.9 : 0.12}
        roughness={0.35}
      />
    </mesh>
  );
}

// The signal: a bright bead that falls from People to Solutions, lighting
// each slab's edge as it passes
function Signal({ edgeRef, reducedMotion }) {
  const bead = useRef(null);
  const top = SLAB.gap + 0.6;
  const bottom = -SLAB.gap - 0.4;
  useFrame((state) => {
    if (!bead.current) return;
    if (reducedMotion) {
      bead.current.visible = false;
      return;
    }
    const period = 4.2;
    const u = (state.clock.elapsedTime % period) / period;
    const travel = Math.min(1, u / 0.7); // moves for 70% of the period, rests at the bottom
    const y = THREE.MathUtils.lerp(top, bottom, travel);
    bead.current.position.y = y;
    bead.current.visible = u < 0.8;
    bead.current.material.opacity = u < 0.7 ? 1 : 1 - (u - 0.7) / 0.1;
    LAYERS.forEach((l, i) => {
      const m = edgeRef.current[i];
      if (!m) return;
      const near = Math.max(0, 1 - Math.abs(y - l.y) / 0.5);
      m.opacity = 0.3 + near * 0.6;
      m.color.lerpColors(new THREE.Color(COLORS.edge), new THREE.Color(COLORS.beam), near);
    });
  });
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, SLAB.gap * 2 + 1.2, 8]} />
        <meshBasicMaterial color={COLORS.edge} transparent opacity={0.25} />
      </mesh>
      <mesh ref={bead}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#ffe4ff" transparent />
      </mesh>
      <pointLight color={COLORS.hot} intensity={6} distance={5} decay={2} position={[0, 0.2, 0.4]} />
    </group>
  );
}

function Rig({ pointerRef, reducedMotion, children }) {
  const rig = useRef(null);
  const { invalidate } = useThree();
  useFrame((state, delta) => {
    if (!rig.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const p = pointerRef.current;
    const idle = reducedMotion ? 0 : 1;
    const targetY = 0.55 + p.x * 0.5 + Math.sin(t * 0.25) * 0.08 * idle;
    const targetX = 0.42 - p.y * 0.22 + Math.sin(t * 0.33) * 0.04 * idle;
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, targetY, 4, dt);
    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, targetX, 4, dt);
    rig.current.position.y = Math.sin(t * 0.6) * 0.06 * idle;
    if (reducedMotion) invalidate();
  });
  return (
    <group ref={rig} rotation={[0.42, 0.55, 0]}>
      {children}
    </group>
  );
}

export default function StackCanvas({ active, reducedMotion, pointerRef, onReady, onContextLost }) {
  const edgeRef = useRef([]);
  const frameloop = !active ? "never" : reducedMotion ? "demand" : "always";
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      flat
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, position: [0, 0.6, 11.5], near: 0.1, far: 50 }}
      style={{ touchAction: "pan-y" }}
      onCreated={({ gl }) => {
        if (onContextLost) watchContextLoss(gl.domElement, onContextLost);
        onReady?.();
      }}
    >
      <hemisphereLight args={["#cebede", "#1a1326", 1.4]} />
      <directionalLight color="#dda6f6" intensity={2.2} position={[4, 6, 5]} />
      <directionalLight color="#7c3aed" intensity={1.2} position={[-5, -2, -3]} />
      <Suspense fallback={null}>
        <Rig pointerRef={pointerRef} reducedMotion={reducedMotion}>
          {LAYERS.map((layer, i) => (
            <Slab key={layer.label} layer={layer} index={i} edgeRef={edgeRef} />
          ))}
          <Signal edgeRef={edgeRef} reducedMotion={reducedMotion} />
        </Rig>
      </Suspense>
    </Canvas>
  );
}
