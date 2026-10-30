import { memo, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { buildSilhouette } from "./solidSilhouette";
import {
  LAYOUTS,
  PUZZLE,
  SOLID_MODEL_URL,
  SOLID_PIECES,
  SOLID_SCENE,
} from "../../constants/solidPuzzleData";
import { LOGO_GRADIENT } from "../hero3d/puzzleConfig";

const OUTLINE_IDLE = new THREE.Color("#c4b5fd");
const OUTLINE_NEAR = new THREE.Color("#f5d0fe");
const FILL_IDLE = new THREE.Color("#a855f7");
const FILL_NEAR = new THREE.Color("#e879f9");
const OUTLINE_DEPTH = 40; // outlines sit this far behind the pieces' centre plane
const GLOW_DEPTH = 70;
const LOGO_SCALE = 1.15; // logo cube (60.5 units) sized to sit inside its 95-unit slot
const LOGO_LIFT = 95; // how far in front of the wall the logo floats
const LOGO_POP_SECONDS = 0.35;

const smoothstep = THREE.MathUtils.smoothstep;
const damp = THREE.MathUtils.damp;
const easeOutBack = (t) => {
  const c1 = 1.9;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pull geometry and the finished-wall transform of every piece out of the GLB.
// Each piece's node position/rotation *is* its target; outlines come from its
// real geometry.
function useSolidParts() {
  const { scene } = useGLTF(SOLID_MODEL_URL);

  const parts = useMemo(() => {
    const list = SOLID_PIECES.map((def) => {
      const name = THREE.PropertyBinding.sanitizeNodeName(def.meshName);
      const obj = scene.getObjectByName(name);
      if (!obj) throw new Error(`SOLID puzzle model is missing "${def.meshName}"`);
      const silhouette = buildSilhouette(obj.geometry, obj.quaternion);
      const outline = [...silhouette.outline, silhouette.outline[0]].map(
        (p) => new THREE.Vector3(p.x, p.y, 0),
      );
      return {
        ...def,
        geometry: obj.geometry,
        target: obj.position.clone(),
        quaternion: obj.quaternion.clone(),
        baseColor: obj.material.color.clone(),
        roughness: obj.material.roughness,
        silhouette,
        outline,
        fillGeometry: new THREE.ShapeGeometry(silhouette.shape, 6),
      };
    });

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    list.forEach((p) => {
      minX = Math.min(minX, p.target.x + p.silhouette.bounds.minX);
      maxX = Math.max(maxX, p.target.x + p.silhouette.bounds.maxX);
      minY = Math.min(minY, p.target.y + p.silhouette.bounds.minY);
      maxY = Math.max(maxY, p.target.y + p.silhouette.bounds.maxY);
    });
    const wall = {
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
      w: maxX - minX,
      h: maxY - minY,
      z: list[0].target.z,
    };
    return { list, wall };
  }, [scene]);

  useEffect(
    () => () => parts.list.forEach((p) => p.fillGeometry.dispose()),
    [parts],
  );
  return parts;
}

// Ghost of one piece's silhouette at its target slot
const Outline = memo(function Outline({ part, outlineRefs }) {
  const groupRef = useRef(null);
  const lineRef = useRef(null);
  const fill = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: FILL_IDLE,
        transparent: true,
        opacity: 0.07,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    const registry = outlineRefs.current;
    registry[part.id] = { group: groupRef.current, fill, line: lineRef.current };
    return () => {
      delete registry[part.id];
      fill.dispose();
    };
  }, [part.id, fill, outlineRefs]);

  const { x, y, z } = part.target;
  return (
    <group ref={groupRef} position={[x, y, z - OUTLINE_DEPTH]}>
      <mesh geometry={part.fillGeometry} material={fill} />
      <Line
        ref={lineRef}
        points={part.outline}
        color="#c4b5fd"
        lineWidth={2}
        dashed
        dashSize={11}
        gapSize={8}
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </group>
  );
});

// Soft light behind the finished wall (completion effect)
const glowVertex = /* glsl */ `
  varying vec2 vLocal;
  void main() {
    vLocal = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const glowFragment = /* glsl */ `
  uniform vec2 uHalf;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uWidth;
  varying vec2 vLocal;
  void main() {
    vec2 q = abs(vLocal) - uHalf;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    float x = max(d, 0.0) / uWidth;
    float a = 0.65 * exp(-x * x) + 0.35 * exp(-x * x / 9.0);
    float k = a * uOpacity;
    gl_FragColor = vec4(uColor * k, k); // premultiplied: the canvas is transparent
  }
`;

function WallGlow({ wall, glowRef }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: glowVertex,
        fragmentShader: glowFragment,
        uniforms: {
          uHalf: { value: new THREE.Vector2(wall.w / 2 - 8, wall.h / 2 - 8) },
          uColor: { value: new THREE.Color("#e879f9") },
          uOpacity: { value: 0 },
          uWidth: { value: 52 },
        },
        transparent: true,
        depthWrite: false,
        // Add colour and alpha so the glow lights the page background behind the
        // (transparent) canvas instead of painting an opaque rectangle
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
        blendSrcAlpha: THREE.OneFactor,
        blendDstAlpha: THREE.OneFactor,
      }),
    [wall],
  );
  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh
      ref={glowRef}
      material={material}
      position={[wall.cx, wall.cy, wall.z - GLOW_DEPTH]}
      visible={false}
    >
      <planeGeometry args={[wall.w + 700, wall.h + 700]} />
    </mesh>
  );
}

// The original Logo Cube, revealed in front of the SOLID piece's slot while that
// piece's information is open (as the Spline scene revealed it on hover). It
// lives in the board's own canvas, so no second WebGL context is needed.
function useLogoCube() {
  const { scene } = useGLTF(SOLID_MODEL_URL);
  const logo = useMemo(() => {
    const root = scene.getObjectByName("Logo_Cube").clone(true);
    root.position.set(0, 0, 0);
    root.updateMatrixWorld(true);

    // Same vertical gradient as the hero's logo cube
    const body = root.getObjectByName("Cube");
    const geometry = body.geometry.clone();
    geometry.computeBoundingBox();
    const { min, max } = geometry.boundingBox;
    const pos = geometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const top = new THREE.Color(LOGO_GRADIENT.top);
    const bottom = new THREE.Color(LOGO_GRADIENT.bottom);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      c.lerpColors(bottom, top, (pos.getY(i) - min.y) / (max.y - min.y));
      colors.set([c.r, c.g, c.b], i * 3);
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5 });
    body.geometry = geometry;
    body.material = material;

    const center = new THREE.Box3().setFromObject(root).getCenter(new THREE.Vector3());
    root.position.copy(center).multiplyScalar(-1);
    return { root, geometry, material };
  }, [scene]);

  useEffect(
    () => () => {
      logo.geometry.dispose();
      logo.material.dispose();
    },
    [logo],
  );
  return logo;
}

function LogoReveal({ slot, open, reducedMotion, onSelect }) {
  const logo = useLogoCube();
  const groupRef = useRef(null);
  const spinRef = useRef(null);
  const shown = useRef(0);
  const angle = useRef(0.6);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const target = open ? 1 : 0;
    shown.current = reducedMotion
      ? target
      : THREE.MathUtils.clamp(shown.current + Math.sign(target - shown.current) * (dt / LOGO_POP_SECONDS), 0, 1);
    const s = shown.current;
    g.visible = s > 0.001;
    if (!g.visible) return;

    const scale = open ? easeOutBack(s) : s * s;
    g.scale.setScalar(Math.max(0.001, scale) * LOGO_SCALE);
    if (!reducedMotion) angle.current += dt * 0.9;
    spinRef.current.rotation.set(0.35, angle.current, 0);
    const bob = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.6) * 3;
    g.position.set(slot.x, slot.y + bob, slot.z + LOGO_LIFT * s);
    if (!reducedMotion || (s > 0 && s < 1)) state.invalidate();
  });

  return (
    <group
      ref={groupRef}
      visible={false}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      <group ref={spinRef}>
        <primitive object={logo.root} />
      </group>
    </group>
  );
}

export default function SolidPuzzleScene({
  layout,
  seed,
  activeId,
  reducedMotion,
  onPlace,
  onSelect,
  onReady,
  onDragChange,
  onStageChange,
  placedIds,
  commandsRef,
}) {
  const { list: parts, wall } = useSolidParts();
  const { camera, gl, size, invalidate } = useThree();

  // Latest props for event handlers and the frame loop (no re-renders needed)
  const latest = useRef({});
  latest.current = { onPlace, onSelect, onDragChange, activeId, reducedMotion };

  // Start positions and stage framing. Stable for the whole attempt (seeded);
  // a reset draws a new seed. On phones the tray re-packs as pieces are placed.
  const placedKey = placedIds.join(",");
  const { homes, box } = useMemo(() => {
    const rng = mulberry32(seed);
    const jitter = PUZZLE.jitter[layout];
    const out = {};

    if (layout === "wide") {
      const L = LAYOUTS.wide;
      const arrangement = L.arrangements[Math.floor(rng() * L.arrangements.length)];
      parts.forEach((p) => {
        const [ox, oy] = arrangement[p.id];
        out[p.id] = new THREE.Vector3(
          wall.cx + ox + (rng() * 2 - 1) * jitter,
          wall.cy + oy + (rng() * 2 - 1) * jitter,
          wall.z,
        );
      });
      const b = L.box;
      return { homes: out, box: { cx: wall.cx + b.ox, cy: wall.cy + b.oy, w: b.w, h: b.h } };
    }

    // tall: seeded order and jitter, drawn for every piece so they don't change
    // as pieces get placed
    const T = LAYOUTS.tall.tray;
    const order = parts.map((p) => p.id);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const jit = Object.fromEntries(order.map((id) => [id, [(rng() * 2 - 1) * jitter, (rng() * 2 - 1) * jitter]]));
    const placed = new Set(placedKey ? placedKey.split(",") : []);
    const byId = Object.fromEntries(parts.map((p) => [p.id, p]));

    // Shelf-pack the pieces still to place, row by row under the wall
    const rows = [];
    let row = null;
    order
      .filter((id) => !placed.has(id))
      .forEach((id) => {
        const [hw, hh] = byId[id].silhouette.half;
        const w = hw * 2;
        if (!row || row.w + T.gap + w > T.width) {
          row = { items: [], w: -T.gap, h: 0 };
          rows.push(row);
        }
        row.items.push({ id, w });
        row.w += T.gap + w;
        row.h = Math.max(row.h, hh * 2);
      });
    const wallTop = wall.cy + wall.h / 2;
    const wallBottom = wall.cy - wall.h / 2;
    let y = wallBottom - T.wallGap;
    rows.forEach((r) => {
      let x = wall.cx - r.w / 2;
      r.items.forEach((it) => {
        const [jx, jy] = jit[it.id];
        out[it.id] = new THREE.Vector3(x + it.w / 2 + jx, y - r.h / 2 + jy, wall.z);
        x += it.w + T.gap;
      });
      y -= r.h + T.rowGap;
    });
    // Placed pieces never return home; park their home on the target
    parts.forEach((p) => {
      if (!out[p.id]) out[p.id] = p.target.clone();
    });

    const top = wallTop + T.topPad;
    const bottom = rows.length ? y + T.rowGap - T.bottomPad : wallBottom - T.topPad;
    const h = top - bottom;
    return { homes: out, box: { cx: wall.cx, cy: top - h / 2, w: LAYOUTS.tall.box.w, h, top } };
  }, [parts, wall, layout, seed, placedKey]);

  // Wide: fit the whole box. Tall: fit the width and pin the top edge, so when
  // the stage shrinks the wall stays put and only the empty tray goes away.
  useEffect(() => {
    if (layout === "tall") {
      camera.zoom = size.width / box.w;
      camera.position.y = box.top - size.height / 2 / camera.zoom;
    } else {
      camera.zoom = Math.min(size.width / box.w, size.height / box.h);
      camera.position.y = box.cy;
    }
    camera.position.x = box.cx;
    camera.position.z = SOLID_SCENE.cameraZ;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, box, layout, invalidate]);

  useEffect(() => {
    onStageChange?.(layout === "tall" ? box.h : null);
  }, [onStageChange, layout, box.h]);

  const phases = useMemo(() => {
    const rng = mulberry32(seed ^ 0x9e3779b9);
    return Object.fromEntries(parts.map((p) => [p.id, rng() * Math.PI * 2]));
  }, [parts, seed]);

  // Per-piece mutable state, updated every frame without touching React
  const runtime = useRef(null);
  if (runtime.current === null) {
    runtime.current = Object.fromEntries(
      parts.map((p) => [
        p.id,
        {
          phase: "floating", // floating | dragging | returning | snapping | placed
          pos: homes[p.id].clone(),
          home: homes[p.id].clone(),
          dragTarget: new THREE.Vector2(),
          grab: new THREE.Vector2(),
          from: new THREE.Vector2(),
          snapT: 0,
          floatAmt: 1,
          lift: 0,
          flash: 0,
          glow: 0,
          near: 0,
          outlineVis: 1,
          hover: false,
          placedAt: 0,
        },
      ]),
    );
  }
  const R = runtime.current;
  const groupRefs = useRef({});
  const outlineRefs = useRef({});
  const stageRef = useRef(null);
  const glowRef = useRef(null);
  const placedCount = useRef(0);
  const solveElapsed = useRef(0);

  // New homes: jump there on first load or a layout switch; otherwise (the tray
  // re-packing after a placement) glide there
  const homesLayout = useRef(null);
  useEffect(() => {
    const jump = homesLayout.current !== layout || latest.current.reducedMotion;
    homesLayout.current = layout;
    parts.forEach((p) => {
      const rt = R[p.id];
      const moved = rt.home.distanceTo(homes[p.id]) > 0.5;
      rt.home.copy(homes[p.id]);
      if (rt.phase !== "floating" && rt.phase !== "returning") return;
      if (jump) rt.pos.copy(rt.home);
      else if (moved) rt.phase = "returning";
    });
    invalidate();
  }, [homes, layout, parts, R, invalidate]);

  const materials = useMemo(
    () =>
      Object.fromEntries(
        parts.map((p) => [
          p.id,
          new THREE.MeshStandardMaterial({
            color: p.baseColor,
            roughness: p.roughness,
            metalness: 0,
          }),
        ]),
      ),
    [parts],
  );
  useEffect(
    () => () => Object.values(materials).forEach((m) => m.dispose()),
    [materials],
  );

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(
    () => () => {
      gl.domElement.style.cursor = "";
    },
    [gl],
  );

  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), -wall.z), [wall]);
  const hit = useMemo(() => new THREE.Vector3(), []);

  const setCursor = (value) => {
    gl.domElement.style.cursor = value;
  };

  const halfOf = (p) => p.silhouette.half;
  const clampTo = (p, x, y) => {
    const [hx, hy] = halfOf(p);
    const m = PUZZLE.edgeMargin;
    return [
      THREE.MathUtils.clamp(x, box.cx - box.w / 2 + hx + m, box.cx + box.w / 2 - hx - m),
      THREE.MathUtils.clamp(y, box.cy - box.h / 2 + hy + m, box.cy + box.h / 2 - hy - m),
    ];
  };

  const commit = (p) => {
    const rt = R[p.id];
    if (rt.phase === "placed" || rt.phase === "snapping") return;
    const g = groupRefs.current[p.id];
    rt.from.set(g.position.x, g.position.y);
    rt.pos.set(rt.from.x, rt.from.y, wall.z);
    rt.floatAmt = 0;
    rt.near = 1;
    rt.flash = 1;
    rt.placedAt = performance.now();
    placedCount.current += 1;
    if (latest.current.reducedMotion) {
      rt.pos.copy(p.target);
      rt.phase = "placed";
    } else {
      rt.phase = "snapping";
      rt.snapT = 0;
    }
    setCursor("");
    latest.current.onPlace?.(p.id);
    invalidate();
  };

  // Keyboard / assistive placement uses the same commit path as a drop
  useEffect(() => {
    if (!commandsRef) return undefined;
    commandsRef.current = {
      place: (id) => {
        const p = parts.find((x) => x.id === id);
        if (p) commit(p);
      },
    };
    return () => {
      commandsRef.current = null;
    };
    // commit only reads refs and stable values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandsRef, parts]);

  const onPointerDown = (e, p) => {
    const rt = R[p.id];
    if (rt.phase !== "floating" && rt.phase !== "returning") return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.stopPropagation();
    if (!e.ray.intersectPlane(dragPlane, hit)) return;
    e.target.setPointerCapture?.(e.pointerId);
    // Freeze at the displayed position (includes the float offset) so nothing jumps
    const g = groupRefs.current[p.id];
    rt.pos.set(g.position.x, g.position.y, wall.z);
    rt.floatAmt = 0;
    rt.grab.set(hit.x - rt.pos.x, hit.y - rt.pos.y);
    rt.dragTarget.set(rt.pos.x, rt.pos.y);
    rt.phase = "dragging";
    setCursor("grabbing");
    latest.current.onDragChange?.(true);
    invalidate();
  };

  const onPointerMove = (e, p) => {
    const rt = R[p.id];
    if (rt.phase !== "dragging") return;
    if (!e.ray.intersectPlane(dragPlane, hit)) return;
    const [x, y] = clampTo(p, hit.x - rt.grab.x, hit.y - rt.grab.y);
    rt.dragTarget.set(x, y);
    invalidate();
  };

  const endDrag = (e, p) => {
    const rt = R[p.id];
    if (rt.phase !== "dragging") return;
    e.target.releasePointerCapture?.(e.pointerId);
    latest.current.onDragChange?.(false);
    const dist = Math.hypot(rt.dragTarget.x - p.target.x, rt.dragTarget.y - p.target.y);
    if (dist <= PUZZLE.snapRadius) {
      commit(p);
    } else {
      // Wrong spot: float back to the start position
      rt.phase = "returning";
      if (latest.current.reducedMotion) rt.pos.copy(rt.home);
      setCursor(rt.hover ? "grab" : "");
      invalidate();
    }
  };

  const onClick = (e, p) => {
    const rt = R[p.id];
    if (rt.phase !== "placed" && rt.phase !== "snapping") return;
    e.stopPropagation();
    // The click that ends a drag lands on the piece just placed; it shouldn't
    // immediately toggle the info that placing it opened
    if (performance.now() - rt.placedAt < 450) return;
    latest.current.onSelect?.(p.id);
  };

  const onOver = (p) => {
    const rt = R[p.id];
    rt.hover = true;
    if (rt.phase === "placed" || rt.phase === "snapping") setCursor("pointer");
    else if (rt.phase !== "dragging") setCursor("grab");
    invalidate();
  };
  const onOut = (p) => {
    const rt = R[p.id];
    rt.hover = false;
    if (rt.phase !== "dragging") setCursor("");
    invalidate();
  };

  // Touch: if a touch begins on a piece that can still be dragged, stop the
  // browser from treating it as a page scroll. Touches anywhere else on the
  // canvas (and on placed pieces) keep scrolling normally.
  useEffect(() => {
    const el = gl.domElement;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      ndc.set(
        ((touch.clientX - rect.left) / rect.width) * 2 - 1,
        -((touch.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      // pointerdown fires before touchstart, so a piece just picked up by this
      // same touch is already "dragging"
      const draggable = parts
        .filter((p) => ["floating", "returning", "dragging"].includes(R[p.id].phase))
        .map((p) => groupRefs.current[p.id])
        .filter(Boolean);
      if (raycaster.intersectObjects(draggable, true).length > 0 && e.cancelable) {
        e.preventDefault();
      }
    };
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    return () => el.removeEventListener("touchstart", onTouchStart);
  }, [gl, camera, parts, R]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const { reducedMotion: rm, activeId: active } = latest.current;
    const total = parts.length;
    const allPlaced = placedCount.current === total;
    let busy = false;

    if (allPlaced) solveElapsed.current += dt;
    const solveT = solveElapsed.current;

    parts.forEach((p) => {
      const rt = R[p.id];
      const g = groupRefs.current[p.id];
      if (!g) return;

      switch (rt.phase) {
        case "floating":
          rt.floatAmt = damp(rt.floatAmt, rm ? 0 : 1, 3, dt);
          break;
        case "dragging":
          rt.floatAmt = 0;
          rt.pos.x = damp(rt.pos.x, rt.dragTarget.x, 30, dt);
          rt.pos.y = damp(rt.pos.y, rt.dragTarget.y, 30, dt);
          busy = true;
          break;
        case "returning":
          rt.floatAmt = damp(rt.floatAmt, rm ? 0 : 1, 3, dt);
          rt.pos.x = damp(rt.pos.x, rt.home.x, 7, dt);
          rt.pos.y = damp(rt.pos.y, rt.home.y, 7, dt);
          if (Math.hypot(rt.pos.x - rt.home.x, rt.pos.y - rt.home.y) < 0.5) {
            rt.pos.copy(rt.home);
            rt.phase = "floating";
          }
          busy = true;
          break;
        case "snapping": {
          rt.snapT = Math.min(1, rt.snapT + dt / PUZZLE.snapSeconds);
          const k = easeOutBack(rt.snapT);
          rt.pos.x = THREE.MathUtils.lerp(rt.from.x, p.target.x, k);
          rt.pos.y = THREE.MathUtils.lerp(rt.from.y, p.target.y, k);
          if (rt.snapT >= 1) {
            rt.pos.copy(p.target);
            rt.phase = "placed";
          }
          busy = true;
          break;
        }
        default:
          break; // placed
      }

      // Idle float (sums to zero once the piece is placed or held)
      const amp = PUZZLE.floatAmplitude * rt.floatAmt;
      const ph = phases[p.id];
      const fx = Math.sin(t * PUZZLE.floatSpeed * 0.7 + ph * 1.7) * amp * 0.4;
      const fy = Math.sin(t * PUZZLE.floatSpeed + ph) * amp;

      rt.lift = damp(rt.lift, rt.phase === "dragging" ? 1 : 0, 14, dt);
      const zLift = rt.lift * PUZZLE.liftZ;
      g.position.set(rt.pos.x + fx, rt.pos.y + fy, wall.z + zLift);

      const pop = rt.phase === "snapping" ? 0.07 * Math.sin(Math.PI * rt.snapT) : 0;
      g.scale.setScalar(1 + rt.lift * (PUZZLE.dragScale - 1) + pop);

      // Glow: selected piece, hover on placed pieces, success flash, completion wave
      const placedLike = rt.phase === "placed" || rt.phase === "snapping";
      const glowTarget = (active === p.id ? 0.16 : 0) + (rt.hover && placedLike ? 0.1 : 0);
      rt.glow = damp(rt.glow, glowTarget, 10, dt);
      rt.flash = Math.max(0, rt.flash - dt / 0.7);
      let wave = 0;
      if (allPlaced && !rm) {
        const delay = ((p.target.x - (wall.cx - wall.w / 2)) / wall.w) * 0.7;
        wave = Math.max(0, 1 - Math.abs(solveT - delay - 0.35) / 0.35) * 0.55;
      }
      const lightUp = rt.glow + rt.flash * 0.75 + wave;
      materials[p.id].emissive.copy(p.baseColor).multiplyScalar(lightUp);

      // Outline: brightens as the matching piece approaches, fades once filled
      const o = outlineRefs.current[p.id];
      if (o && o.line) {
        let nearTarget = 0;
        if (rt.phase === "dragging") {
          const d = Math.hypot(rt.dragTarget.x - p.target.x, rt.dragTarget.y - p.target.y);
          nearTarget = 1 - smoothstep(d, PUZZLE.snapRadius, PUZZLE.highlightRadius);
        }
        rt.near = damp(rt.near, nearTarget, 12, dt);
        rt.outlineVis = damp(rt.outlineVis, placedLike ? 0 : 1, 8, dt);
        const vis = rt.outlineVis;
        o.fill.opacity = (0.07 + rt.near * 0.26) * vis;
        o.fill.color.lerpColors(FILL_IDLE, FILL_NEAR, rt.near);
        o.line.material.opacity = (0.5 + rt.near * 0.5) * vis;
        o.line.material.color.lerpColors(OUTLINE_IDLE, OUTLINE_NEAR, rt.near);
        o.group.visible = vis > 0.01;
        if (vis > 0.01 && vis < 0.99) busy = true;
        if (rt.near > 0.01 && rt.near < 0.99) busy = true;
      }
      if (rt.lift > 0.002 || rt.flash > 0 || Math.abs(rt.glow - glowTarget) > 0.002) busy = true;
      if (rt.floatAmt > 0.001 && !rm) busy = true;
    });

    // Completion: unified pulse and a soft light behind the wall
    const stage = stageRef.current;
    if (stage) {
      const pulse = allPlaced && !rm ? Math.sin(Math.PI * Math.min(1, solveT / 1.2)) * 0.018 : 0;
      const s = 1 + pulse;
      stage.scale.set(s, s, 1);
      stage.position.set(wall.cx * (1 - s), wall.cy * (1 - s), 0);
    }
    const glow = glowRef.current;
    if (glow) {
      const ramp = allPlaced ? (rm ? 1 : smoothstep(solveT, 0, 1.2)) : 0;
      const breathe = allPlaced && !rm ? 0.1 * Math.sin(t * 1.4) : 0;
      glow.visible = ramp > 0.001;
      glow.material.uniforms.uOpacity.value = ramp * (0.5 + breathe);
      if (allPlaced && (!rm || solveT < 0.1)) busy = true;
    }

    if (busy) state.invalidate();
  });

  return (
    <>
      <hemisphereLight
        args={[SOLID_SCENE.hemisphere.color, SOLID_SCENE.hemisphere.color, SOLID_SCENE.hemisphere.intensity]}
      />
      <directionalLight
        color={SOLID_SCENE.directional.color}
        intensity={SOLID_SCENE.directional.intensity}
        position={SOLID_SCENE.directional.position}
      />

      <group ref={stageRef}>
        <WallGlow wall={wall} glowRef={glowRef} />

        <LogoReveal
          slot={parts.find((p) => p.id === "logo").target}
          open={activeId === "logo"}
          reducedMotion={reducedMotion}
          onSelect={() => onSelect?.("logo")}
        />

        {parts.map((p) => (
          <Outline key={p.id} part={p} outlineRefs={outlineRefs} />
        ))}

        {parts.map((p) => (
          <group
            key={p.id}
            ref={(el) => {
              groupRefs.current[p.id] = el;
            }}
            position={homes[p.id]}
            onPointerDown={(e) => onPointerDown(e, p)}
            onPointerMove={(e) => onPointerMove(e, p)}
            onPointerUp={(e) => endDrag(e, p)}
            onPointerCancel={(e) => endDrag(e, p)}
            onLostPointerCapture={(e) => endDrag(e, p)}
            onClick={(e) => onClick(e, p)}
            onPointerOver={() => onOver(p)}
            onPointerOut={() => onOut(p)}
          >
            <group quaternion={p.quaternion}>
              <mesh geometry={p.geometry} material={materials[p.id]} />
            </group>
            {/* Invisible silhouette-shaped hit area: the seams between a piece's
                rounded cubes (and the whole shape, for touch) stay grabbable */}
            <mesh geometry={p.fillGeometry} visible={false} />
          </group>
        ))}
      </group>
    </>
  );
}

useGLTF.preload(SOLID_MODEL_URL);
