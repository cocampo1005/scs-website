import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// The arcade-style payoff when the wall is complete: a burst of small cubes
// from the wall's centre that arc up, spin and fall away, in the piece colours.

const COUNT = 90;
const LIFE = 2.6; // seconds
const GRAVITY = 1400; // units/s²

const PALETTE = ["#ff2bf4", "#c365ff", "#eb6ae6", "#a00adc", "#7215c7", "#ffe4ff"];

function seeded(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function WinBurst({ wall, solved, reducedMotion }) {
  const mesh = useRef(null);
  const elapsed = useRef(-1);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const angle = (seeded(i) * 0.9 + 0.05) * Math.PI; // mostly upward
        const speed = 520 + seeded(i + 1) * 620;
        return {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          vz: (seeded(i + 2) - 0.5) * 300,
          spin: (seeded(i + 3) - 0.5) * 12,
          size: 10 + seeded(i + 4) * 16,
          delay: seeded(i + 5) * 0.25,
          color: new THREE.Color(PALETTE[i % PALETTE.length]),
        };
      }),
    [],
  );

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    particles.forEach((p, i) => m.setColorAt(i, p.color));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [particles]);

  // Start the burst when the wall completes; reset when the puzzle resets
  useEffect(() => {
    elapsed.current = solved ? 0 : -1;
  }, [solved]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    if (elapsed.current < 0 || reducedMotion || elapsed.current > LIFE) {
      m.visible = false;
      return;
    }
    elapsed.current += Math.min(delta, 0.05);
    const t = elapsed.current;
    m.visible = true;
    particles.forEach((p, i) => {
      const tt = Math.max(0, t - p.delay);
      const fade = tt === 0 ? 0 : Math.max(0, 1 - tt / (LIFE - p.delay));
      dummy.position.set(wall.cx + p.vx * tt, wall.cy + p.vy * tt - 0.5 * GRAVITY * tt * tt, wall.z + 60 + p.vz * tt);
      dummy.rotation.set(p.spin * tt, p.spin * 0.7 * tt, 0);
      dummy.scale.setScalar(p.size * fade);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    state.invalidate();
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} visible={false} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.4} emissive="#7c3aed" emissiveIntensity={0.35} />
    </instancedMesh>
  );
}
