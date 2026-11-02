import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import SilhouetteGlow from "./SilhouetteGlow";
import {
  MODEL_URL,
  LOGO_START_Y,
  LOGO_END_Y,
  SNAP_DISTANCE,
  RELEASE_SNAP_PROGRESS,
  LIGHTS,
  LOGO_GRADIENT,
  MAGENTA,
  SOLVED_PIECE_COLORS,
  SOLVE_TRANSITION_SECONDS,
  IDLE_FLOAT,
  SPIN_SECONDS,
  SPIN_TURNS,
  SPIN_BACK,
  SPIN_HOP,
  ASSEMBLY_LIFT,
  ASSEMBLY_FLOAT,
  BUBBLES,
  INDICATOR,
} from "./puzzleConfig";

const sign = (v) => (v >= 0 ? "+" : "-");
const easeInOut = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
// Back ease: dips below 0 before starting and overshoots 1 before settling
const easeInOutBack = (t, c) => {
  const k = c + 1;
  const u = 2 * t;
  return t < 0.5
    ? (u * u * (k * u - c)) / 2
    : ((u - 2) * (u - 2) * (k * (u - 2) + c) + 2) / 2;
};

// Draw order inside the opaque pass: floor, then the backdrop (bubbles and the
// cube's glow, which ignore depth), then the cube on top of both
const ORDER = { bubbles: 1, glow: 2, cube: 3 };

function pick(obj) {
  return {
    geometry: obj.geometry,
    position: obj.position.clone(),
    quaternion: obj.quaternion.clone(),
    scale: obj.scale.clone(),
    color: obj.material?.color?.clone() ?? new THREE.Color("#ffffff"),
  };
}

// Pull geometry and transforms out of the Spline GLB export
function useModelParts() {
  const { scene } = useGLTF(MODEL_URL);

  return useMemo(() => {
    const get = (name) => {
      const obj = scene.getObjectByName(name);
      if (!obj) throw new Error(`Hero puzzle model is missing "${name}"`);
      return obj;
    };

    const cubeGroup = get("Incomplete_Cube_Group");
    const logoGroup = get("Logo_Cube");
    const indicator = get("Drag_Down_Indicator");

    const pieces = cubeGroup.children.map((child) => {
      const p = pick(child);
      const key = [p.position.x, p.position.y, p.position.z]
        .map(sign)
        .join(",");
      return {
        ...p,
        solvedColor: new THREE.Color(SOLVED_PIECE_COLORS[key] ?? MAGENTA),
      };
    });

    // Logo cube body gets a vertical gradient via vertex colours
    const body = pick(get("Cube"));
    const gradientGeometry = body.geometry.clone();
    gradientGeometry.computeBoundingBox();
    const { min, max } = gradientGeometry.boundingBox;
    const pos = gradientGeometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const top = new THREE.Color(LOGO_GRADIENT.top);
    const bottom = new THREE.Color(LOGO_GRADIENT.bottom);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) - min.y) / (max.y - min.y);
      c.lerpColors(bottom, top, t);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    gradientGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3),
    );

    return {
      cubeGroupPosition: cubeGroup.position.clone(),
      pieces,
      logoGroupPosition: logoGroup.position.clone(),
      logoBody: { ...body, geometry: gradientGeometry },
      letters: ["Solid_S", "Code_C", "Solutions_S"].map((n) => pick(get(n))),
      indicatorPosition: indicator.position.clone(),
      arrow: pick(get("Arrow")),
      dragText: pick(get("Drag_Down")),
      floor: pick(get("Plane")),
    };
  }, [scene]);
}

// Outer bounds of the assembled 2x2x2 cube (piece spacing + half extent)
const GLOW_BOX = [243.5, 242.6, 243.9];

function seeded(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Pointy-top hexagon with rounded corners, traced into a Shape or Path
function roundedHexagon(path, radius, corner) {
  const verts = Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    return new THREE.Vector2(Math.cos(a) * radius, Math.sin(a) * radius);
  });
  verts.forEach((v, i) => {
    const prev = verts[(i + 5) % 6];
    const next = verts[(i + 1) % 6];
    const enter = prev.clone().sub(v).setLength(corner).add(v);
    const exit = next.clone().sub(v).setLength(corner).add(v);
    if (i === 0) path.moveTo(enter.x, enter.y);
    else path.lineTo(enter.x, enter.y);
    path.quadraticCurveTo(v.x, v.y, exit.x, exit.y);
  });
  path.closePath();
  return path;
}

function hexOutlineGeometry() {
  const shape = roundedHexagon(new THREE.Shape(), 10, 3);
  shape.holes.push(roundedHexagon(new THREE.Path(), 7.4, 2));
  return new THREE.ShapeGeometry(shape, 4);
}

export default function PuzzleScene({
  skipped,
  reducedMotion,
  onSolved,
  onReady,
  // Start assembled, with no animation (a solve restored from this session)
  restored = false,
  // Hexagon bubbles drifting up after the solve
  showBubbles = true,
  // Transparent floor that only receives shadows, so the page shows through
  shadowFloor = false,
}) {
  const parts = useModelParts();
  const { camera, gl, invalidate } = useThree();

  // The cube pieces and the logo cube share one parent ("assembly") centred on
  // the finished cube, so the solved cube can spin and float as a single object.
  const center = parts.cubeGroupPosition;
  const assemblyRef = useRef(null);
  const logoRef = useRef(null); // drag position (relative to the assembly)
  const logoFloatRef = useRef(null); // idle bob offset, kept separate from dragging

  const phase = useRef(restored ? "completed" : "idle"); // idle | dragging | snapping | completed
  const targetY = useRef(restored ? LOGO_END_Y : LOGO_START_Y);
  // Restored solves skip the snap, spin and colour transition
  const instant = useRef(restored);
  const grabOffset = useRef(0);
  const solvedT = useRef(0);
  const solvedNotified = useRef(false);
  const idleFloat = useRef(1);
  const spinT = useRef(0);
  const settledTime = useRef(0);

  // Logo heights are tracked in world units, as in the export
  const getLogoY = () => logoRef.current.position.y + center.y;
  const setLogoY = (y) => {
    logoRef.current.position.y = y - center.y;
  };

  const dragPlane = useMemo(() => new THREE.Plane(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);

  const pieceMaterials = useMemo(
    () =>
      parts.pieces.map(
        (p) =>
          new THREE.MeshStandardMaterial({
            color: p.color,
            roughness: 0.55,
            metalness: 0,
          }),
      ),
    [parts],
  );
  const indicatorMaterials = useMemo(
    () => ({
      // Unlit so the hint reads like the reference regardless of light placement
      arrow: new THREE.MeshBasicMaterial({
        color: INDICATOR.arrowColor,
        transparent: true,
      }),
    }),
    [],
  );
  // Bubbles live in screen space (fractions of the visible view) so they are
  // scattered across the whole hero whatever the canvas size. Spread evenly in
  // x with jitter, random everything else.
  const bubbleGeometry = useMemo(() => hexOutlineGeometry(), []);
  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLES.count }, (_, i) => ({
        u: ((i + 0.15 + 0.7 * seeded(i)) / BUBBLES.count) * 1.1 - 0.55,
        v0: seeded(i + 40),
        speed: 0.012 + seeded(i + 80) * 0.035, // view heights per second
        scale: 0.5 + Math.pow(seeded(i + 120), 2) * 1.8, // mostly small, a few large
        swayAmp: 6 + seeded(i + 160) * 22,
        swayFreq: 0.3 + seeded(i + 200) * 0.6,
        phase: seeded(i + 240) * Math.PI * 2,
        spin: (seeded(i + 280) - 0.5) * 1.2,
        opacity: 0.25 + seeded(i + 320) * 0.45,
        material: new THREE.MeshBasicMaterial({
          color: BUBBLES.color,
          opacity: 0,
          // Normal alpha blending without joining the transparent queue, so the
          // render order can keep the bubbles behind the cube
          blending: THREE.CustomBlending,
          depthWrite: false,
          depthTest: false,
        }),
      })),
    [],
  );
  const bubbleRefs = useRef([]);
  const bubbleScratch = useMemo(
    () => ({
      right: new THREE.Vector3(),
      up: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      origin: new THREE.Vector3(),
    }),
    [],
  );

  const glowRef = useRef(null);
  const indicatorRef = useRef(null);
  const indicatorFloatRef = useRef(null); // bob, mirrored against the logo cube
  const indicatorTextRef = useRef(null);
  const floorLightRef = useRef(null);
  const spotRefs = useRef([]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(
    () => () => {
      pieceMaterials.forEach((m) => m.dispose());
      indicatorMaterials.arrow.dispose();
      bubbleGeometry.dispose();
      bubbles.forEach((b) => b.material.dispose());
    },
    [pieceMaterials, indicatorMaterials, bubbleGeometry, bubbles],
  );

  // A touch that starts on the logo cube drags it, so stop the browser from
  // treating it as a page scroll. Touches anywhere else keep scrolling the page.
  useEffect(() => {
    const el = gl.domElement;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const onTouchStart = (e) => {
      if (e.touches.length !== 1 || !logoRef.current) return;
      // pointerdown fires before touchstart, so this touch may already be dragging
      if (phase.current !== "idle" && phase.current !== "dragging") return;
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      ndc.set(
        ((touch.clientX - rect.left) / rect.width) * 2 - 1,
        -((touch.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.intersectObject(logoRef.current, true).length > 0 && e.cancelable) {
        e.preventDefault();
      }
    };
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    return () => el.removeEventListener("touchstart", onTouchStart);
  }, [gl, camera]);

  const setCursor = (value) => {
    gl.domElement.style.cursor = value;
  };

  const startSnap = () => {
    phase.current = "snapping";
    targetY.current = LOGO_END_Y;
    if (reducedMotion && logoRef.current) setLogoY(LOGO_END_Y);
    invalidate();
  };

  // Skip: converge on the same completed state as a successful drag
  useEffect(() => {
    if (
      skipped &&
      phase.current !== "completed" &&
      phase.current !== "snapping"
    ) {
      startSnap();
    }
    // startSnap only reads refs and stable props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipped]);

  const yFromEvent = (e) => {
    if (!e.ray.intersectPlane(dragPlane, hit)) return null;
    return hit.y;
  };

  const onPointerDown = (e) => {
    if (phase.current !== "idle") return;
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);

    // Vertical plane through the logo cube, facing the camera horizontally
    const normal = camera.getWorldDirection(new THREE.Vector3());
    normal.y = 0;
    normal.normalize();
    const anchor = logoRef.current.getWorldPosition(new THREE.Vector3());
    dragPlane.setFromNormalAndCoplanarPoint(normal, anchor);

    const y = yFromEvent(e);
    if (y === null) return;
    grabOffset.current = y - getLogoY();
    phase.current = "dragging";
    setCursor("grabbing");
  };

  const onPointerMove = (e) => {
    if (phase.current !== "dragging") return;
    const y = yFromEvent(e);
    if (y === null) return;
    const next = THREE.MathUtils.clamp(
      y - grabOffset.current,
      LOGO_END_Y,
      LOGO_START_Y,
    );
    setLogoY(next);
    invalidate();
    if (next - LOGO_END_Y <= SNAP_DISTANCE) {
      e.target.releasePointerCapture?.(e.pointerId);
      startSnap();
    }
  };

  const endDrag = (e) => {
    if (phase.current !== "dragging") return;
    e.target.releasePointerCapture?.(e.pointerId);
    setCursor("grab");
    const progress = (LOGO_START_Y - getLogoY()) / (LOGO_START_Y - LOGO_END_Y);
    if (progress >= RELEASE_SNAP_PROGRESS) {
      startSnap();
    } else {
      // Not far enough: float back up to the start
      phase.current = "idle";
      targetY.current = LOGO_START_Y;
      invalidate();
    }
  };

  useFrame((state, delta) => {
    if (!logoRef.current) return;
    const dt = Math.min(delta, 0.05);
    let animating = false;

    // Logo cube movement (snap in, or float back after a short drag)
    if (phase.current !== "dragging" && phase.current !== "completed") {
      const y = getLogoY();
      const snappingIn = targetY.current === LOGO_END_Y;
      // Snap in fast and call it done a hair early so the spin kicks off at once
      if (Math.abs(y - targetY.current) > (snappingIn ? 2 : 0.3)) {
        const lambda = snappingIn ? 24 : 8;
        setLogoY(THREE.MathUtils.damp(y, targetY.current, lambda, dt));
        animating = true;
      } else {
        setLogoY(targetY.current);
        if (phase.current === "snapping") {
          phase.current = "completed";
          setCursor("");
        }
      }
    }

    // Idle bob while the logo cube waits at the top; eases out once grabbed
    const floatInner = logoFloatRef.current;
    if (floatInner) {
      const atRest =
        phase.current === "idle" && Math.abs(getLogoY() - LOGO_START_Y) < 1;
      const target = atRest && !reducedMotion ? 1 : 0;
      idleFloat.current = THREE.MathUtils.damp(
        idleFloat.current,
        target,
        6,
        dt,
      );
      if (idleFloat.current < 0.001 && target === 0) idleFloat.current = 0;
      floatInner.position.y =
        Math.sin(state.clock.elapsedTime * IDLE_FLOAT.speed) *
        IDLE_FLOAT.amplitude *
        idleFloat.current;
      if (idleFloat.current > 0) animating = true;

      // The drag hint bobs the opposite way: logo up, arrow and label down
      if (indicatorFloatRef.current) {
        indicatorFloatRef.current.position.y =
          -floatInner.position.y * INDICATOR.floatScale;
      }
    }

    // Solved: back-eased spin (wind-up, whip round, overshoot) with a hop, then
    // the whole cube bobs as one
    const assembly = assemblyRef.current;
    if (phase.current === "completed" && assembly) {
      if (spinT.current < 1) {
        const still = reducedMotion || instant.current;
        spinT.current = still
          ? 1
          : Math.min(1, spinT.current + dt / SPIN_SECONDS);
        const t = spinT.current;
        assembly.rotation.y = still
          ? 0
          : easeInOutBack(t, SPIN_BACK) * Math.PI * 2 * SPIN_TURNS;
        // sin² hop: rises while spinning up, lands softly (zero velocity) as the spin winds down
        const hop = Math.pow(Math.sin(Math.PI * t), 2) * SPIN_HOP;
        assembly.position.y = center.y + easeInOut(t) * ASSEMBLY_LIFT + hop;
        animating = true;
      } else if (!reducedMotion) {
        assembly.rotation.y = 0;
        settledTime.current += dt;
        const ramp = Math.min(1, settledTime.current);
        assembly.position.y =
          center.y +
          ASSEMBLY_LIFT +
          Math.sin(settledTime.current * ASSEMBLY_FLOAT.speed) *
            ASSEMBLY_FLOAT.amplitude *
            ramp;
        animating = true;
      }
    }

    if (phase.current === "completed" && !solvedNotified.current) {
      solvedNotified.current = true;
      onSolved?.();
    }

    // Solved transition: pieces light up, hint fades, floor glows
    if (phase.current === "completed" && solvedT.current < 1) {
      solvedT.current = reducedMotion || instant.current
        ? 1
        : Math.min(1, solvedT.current + dt / SOLVE_TRANSITION_SECONDS);
      animating = true;
      const t = easeInOut(solvedT.current);

      parts.pieces.forEach((p, i) => {
        const m = pieceMaterials[i];
        m.color.lerpColors(p.color, p.solvedColor, t);
        m.emissive.copy(p.solvedColor).multiplyScalar(0.38 * t);
      });
      indicatorMaterials.arrow.opacity = 1 - t;
      if (indicatorTextRef.current) {
        indicatorTextRef.current.fillOpacity = 1 - t;
        indicatorTextRef.current.outlineOpacity = 0.55 * (1 - t);
      }
      if (indicatorRef.current) indicatorRef.current.visible = t < 1;
      if (glowRef.current) {
        glowRef.current.visible = t > 0;
        glowRef.current.material.uniforms.uOpacity.value = 0.25 * t;
      }
      if (floorLightRef.current) floorLightRef.current.intensity = 6 * t;
      spotRefs.current.forEach((s, i) => {
        if (s) s.intensity = LIGHTS.spots[i].intensity * (1 + 0.2 * t);
      });
    }

    // Bubbles drifting up after the solve (static when reduced motion is on)
    if (showBubbles && solvedT.current > 0) {
      const { right, up, forward, origin } = bubbleScratch;
      right.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
      up.setFromMatrixColumn(camera.matrixWorld, 1).normalize();
      camera.getWorldDirection(forward);
      // Centre of the view, pushed to the cube's depth
      const depth = origin.copy(center).sub(camera.position).dot(forward);
      origin.copy(camera.position).addScaledVector(forward, depth);
      const viewW = state.size.width / camera.zoom;
      const viewH = state.size.height / camera.zoom;
      const time = reducedMotion ? 0 : state.clock.elapsedTime;
      const fade = easeInOut(solvedT.current);

      bubbleRefs.current.forEach((mesh, i) => {
        if (!mesh) return;
        const b = bubbles[i];
        const v = (b.v0 + time * b.speed) % 1;
        const x =
          b.u * viewW + Math.sin(time * b.swayFreq + b.phase) * b.swayAmp;
        const y = (v * 1.2 - 0.6) * viewH;
        mesh.position
          .copy(origin)
          .addScaledVector(right, x)
          .addScaledVector(up, y);
        mesh.quaternion.copy(camera.quaternion);
        mesh.rotateZ(b.phase + time * b.spin);
        b.material.opacity = b.opacity * fade;
        mesh.visible = true;
      });
      if (!reducedMotion) animating = true;
    }

    if (animating) invalidate();
  }, -1); // run before SilhouetteGlow so the halo tracks this frame's pose

  const { pieces, logoBody, letters, arrow, dragText, floor } = parts;

  return (
    <>
      <hemisphereLight
        args={[
          LIGHTS.hemisphere.color,
          LIGHTS.hemisphere.groundColor,
          LIGHTS.hemisphere.intensity,
        ]}
      />
      <directionalLight
        castShadow
        color={LIGHTS.directional.color}
        intensity={LIGHTS.directional.intensity}
        position={LIGHTS.directional.position}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={-2000}
        shadow-camera-far={3000}
        shadow-camera-left={-700}
        shadow-camera-right={700}
        shadow-camera-top={700}
        shadow-camera-bottom={-700}
        shadow-bias={-0.0005}
      />
      {LIGHTS.spots.map((s, i) => (
        <spotLight
          key={i}
          ref={(el) => {
            spotRefs.current[i] = el;
            if (el) {
              el.target.position.set(...s.target);
              el.target.updateMatrixWorld();
            }
          }}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={100}
          shadow-camera-far={3000}
          shadow-bias={-0.0005}
          color={s.color}
          intensity={s.intensity}
          distance={s.distance}
          angle={Math.PI / 6}
          penumbra={1}
          decay={0}
          position={s.position}
        />
      ))}
      <pointLight
        ref={floorLightRef}
        color="#7f1cff"
        intensity={0}
        distance={900}
        decay={0}
        position={[parts.cubeGroupPosition.x, -150, parts.cubeGroupPosition.z]}
      />

      {/* Floor */}
      <mesh
        geometry={floor.geometry}
        position={floor.position}
        quaternion={floor.quaternion}
        scale={floor.scale}
      >
        {shadowFloor ? (
          <shadowMaterial transparent opacity={0.35} color="#12001f" />
        ) : (
          <meshStandardMaterial
            color={floor.color.clone().multiplyScalar(0.55)}
            roughness={0.95}
          />
        )}
      </mesh>

      <group ref={assemblyRef} position={center} renderOrder={ORDER.cube}>
        {/* Incomplete cube (the export's group sat exactly at the assembly centre) */}
        {pieces.map((p, i) => (
          <mesh
            key={i}
            geometry={p.geometry}
            position={p.position}
            quaternion={p.quaternion}
            material={pieceMaterials[i]}
            castShadow
            receiveShadow
          />
        ))}

        {/* Draggable logo cube */}
        <group
          ref={logoRef}
          position={[
            parts.logoGroupPosition.x - center.x,
            (restored ? LOGO_END_Y : LOGO_START_Y) - center.y,
            parts.logoGroupPosition.z - center.z,
          ]}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          onPointerOver={() => phase.current === "idle" && setCursor("grab")}
          onPointerOut={() => phase.current === "idle" && setCursor("")}
        >
          <group ref={logoFloatRef}>
            <mesh
              geometry={logoBody.geometry}
              position={logoBody.position}
              quaternion={logoBody.quaternion}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial vertexColors roughness={0.5} />
            </mesh>
            {letters.map((l, i) => (
              <mesh
                key={i}
                geometry={l.geometry}
                position={l.position}
                quaternion={l.quaternion}
                castShadow
              >
                <meshStandardMaterial color={l.color} roughness={0.5} />
              </mesh>
            ))}
            {/* Larger invisible grab target, mainly for touch */}
            <mesh position={logoBody.position} visible={false}>
              <boxGeometry args={[170, 170, 170]} />
            </mesh>
          </group>
        </group>
      </group>
      <SilhouetteGlow
        ref={glowRef}
        target={assemblyRef}
        size={GLOW_BOX}
        color={MAGENTA}
        renderOrder={ORDER.glow}
      />

      {/* Drag hint */}
      <group
        ref={indicatorRef}
        position={[
          parts.indicatorPosition.x,
          parts.indicatorPosition.y + INDICATOR.lift,
          parts.indicatorPosition.z,
        ]}
      >
        <group ref={indicatorFloatRef}>
          <mesh
            geometry={arrow.geometry}
            position={arrow.position}
            quaternion={arrow.quaternion}
            material={indicatorMaterials.arrow}
          />
          {/* Real text (the export's flat mesh could not change font), turned to
              face the camera the same way the export's label was */}
          <Text
            ref={indicatorTextRef}
            font={INDICATOR.font}
            fontSize={INDICATOR.fontSize}
            letterSpacing={0.14}
            anchorX="center"
            anchorY="middle"
            color={INDICATOR.textColor}
            outlineColor={INDICATOR.glowColor}
            outlineBlur="30%"
            outlineOpacity={0.55}
            position={[
              dragText.position.x,
              INDICATOR.labelY,
              dragText.position.z,
            ]}
            quaternion={dragText.quaternion}
          >
            {INDICATOR.label}
          </Text>
        </group>
      </group>

      {/* Ambient bubbles that drift up once solved */}
      {showBubbles && bubbles.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => (bubbleRefs.current[i] = el)}
          geometry={bubbleGeometry}
          material={b.material}
          scale={b.scale}
          renderOrder={ORDER.bubbles}
          visible={false}
        />
      ))}
    </>
  );
}

useGLTF.preload(MODEL_URL);
