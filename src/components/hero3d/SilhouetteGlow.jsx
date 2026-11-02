import { forwardRef, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Soft halo hugging the cube's silhouette, standing in for Spline's glow.
// Each frame the target's box corners are projected onto the camera plane; the
// shader measures the true distance to that convex outline (rounded by
// `radius`) so the falloff stays round past the corners instead of streaking out.
// The halo also fills the outline itself and is drawn *behind* the cube (see
// the render order in PuzzleScene), so the gaps between pieces show glow
// rather than the black background.
const MAX_EDGES = 8;

const vertexShader = /* glsl */ `
  varying vec2 vLocal;
  void main() {
    vLocal = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  #define MAX_EDGES ${MAX_EDGES}
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uWidth;
  uniform float uRadius;
  uniform int uEdgeCount;
  uniform vec4 uEdges[MAX_EDGES]; // xy = start, zw = end (counter-clockwise)
  varying vec2 vLocal;
  void main() {
    float dist = 1e5;
    bool inside = true;
    for (int i = 0; i < MAX_EDGES; i++) {
      if (i >= uEdgeCount) break;
      vec2 a = uEdges[i].xy;
      vec2 ba = uEdges[i].zw - a;
      vec2 pa = vLocal - a;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      dist = min(dist, length(pa - ba * h));
      if (ba.x * pa.y - ba.y * pa.x < 0.0) inside = false;
    }
    float d = inside ? 0.0 : max(dist - uRadius, 0.0);
    // Two gaussians: a bright soft rim plus a wide faint bloom. Both are flat
    // at d = 0, so there is no hard line where the halo meets the cube.
    float x = d / uWidth;
    float a = 0.6 * exp(-x * x) + 0.4 * exp(-x * x / 9.0);
    // Premultiplied: the glow adds its own alpha, so it also shows on a
    // transparent canvas without darkening what is behind it
    gl_FragColor = vec4(uColor * a * uOpacity, a * uOpacity);
  }
`;

function convexHull(points) {
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 1e-6) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (const p of pts.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 1e-6) upper.pop();
    upper.push(p);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

const SilhouetteGlow = forwardRef(function SilhouetteGlow(
  { target, size, color, width = 30, radius = 20, renderOrder = 0 },
  ref
) {
  const camera = useThree((s) => s.camera);
  const meshRef = useRef(null);

  const scratch = useMemo(
    () => ({
      right: new THREE.Vector3(),
      up: new THREE.Vector3(),
      center: new THREE.Vector3(),
      corner: new THREE.Vector3(),
      points: Array.from({ length: 8 }, () => new THREE.Vector2()),
    }),
    []
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: 0 },
          uWidth: { value: width },
          uRadius: { value: radius },
          uEdgeCount: { value: 0 },
          uEdges: { value: Array.from({ length: MAX_EDGES }, () => new THREE.Vector4()) },
        },
        // Kept in the opaque queue so render order can slot it between the
        // floor and the cube; colour and alpha are added (one, one).
        depthWrite: false,
        depthTest: false,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
      }),
    [color, width, radius]
  );
  useEffect(() => () => material.dispose(), [material]);

  // Big enough for the box's outline at any rotation, plus the fade
  const planeSize = useMemo(() => Math.hypot(...size) + width * 16, [size, width]);

  useFrame(() => {
    const mesh = meshRef.current;
    const obj = target.current;
    if (!mesh || !obj || !mesh.visible) return;

    obj.updateWorldMatrix(true, false);
    camera.updateMatrixWorld();
    const { right, up, center, corner, points } = scratch;
    right.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
    up.setFromMatrixColumn(camera.matrixWorld, 1).normalize();
    center.setFromMatrixPosition(obj.matrixWorld);

    // Shrink the box by the corner radius; the shader grows it back out round
    let i = 0;
    for (const sx of [-1, 1])
      for (const sy of [-1, 1])
        for (const sz of [-1, 1]) {
          corner
            .set(sx * (size[0] / 2 - radius), sy * (size[1] / 2 - radius), sz * (size[2] / 2 - radius))
            .applyMatrix4(obj.matrixWorld)
            .sub(center);
          points[i++].set(corner.dot(right), corner.dot(up));
        }

    const hull = convexHull(points);
    const edges = material.uniforms.uEdges.value;
    hull.forEach((a, k) => {
      const b = hull[(k + 1) % hull.length];
      edges[k].set(a.x, a.y, b.x, b.y);
    });
    material.uniforms.uEdgeCount.value = Math.min(hull.length, MAX_EDGES);

    mesh.position.copy(center);
    mesh.quaternion.copy(camera.quaternion);
  });

  return (
    <mesh
      ref={(el) => {
        meshRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      material={material}
      visible={false}
      renderOrder={renderOrder}
    >
      <planeGeometry args={[planeSize, planeSize]} />
    </mesh>
  );
});

export default SilhouetteGlow;
