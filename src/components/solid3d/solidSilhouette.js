import * as THREE from "three";

// Derives a piece's outline from its real mesh. The pieces are built from
// equal-sized cells; every cell has a flat face toward the camera, so the cells
// a piece occupies are found from the front/back-facing triangles of the
// geometry itself. The cell boundary is traced into a closed contour and its
// corners are rounded to match the rounded edges of the model.
//
// Returns coordinates in the piece's local XY after `quaternion` (the piece's
// own rotation), i.e. as seen from the front camera.

const CELL = 95.3; // nominal cell pitch; the real pitch is fitted per piece below
const CORNER_RADIUS = 7;

export function buildSilhouette(geometry, quaternion) {
  const pos = geometry.attributes.position;
  const index = geometry.index;
  const triCount = index ? index.count / 3 : pos.count / 3;

  const v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  const fetch = (k, out) => {
    const i = index ? index.getX(k) : k;
    return out.fromBufferAttribute(pos, i).applyQuaternion(quaternion);
  };

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    v[0].fromBufferAttribute(pos, i).applyQuaternion(quaternion);
    minX = Math.min(minX, v[0].x);
    maxX = Math.max(maxX, v[0].x);
    minY = Math.min(minY, v[0].y);
    maxY = Math.max(maxY, v[0].y);
  }
  const nx = Math.max(1, Math.round((maxX - minX) / CELL));
  const ny = Math.max(1, Math.round((maxY - minY) / CELL));
  const px = (maxX - minX) / nx;
  const py = (maxY - minY) / ny;

  const filled = Array.from({ length: nx }, () => new Array(ny).fill(false));
  for (let t = 0; t < triCount; t++) {
    fetch(t * 3, v[0]);
    fetch(t * 3 + 1, v[1]);
    fetch(t * 3 + 2, v[2]);
    ab.subVectors(v[1], v[0]);
    ac.subVectors(v[2], v[0]);
    nrm.crossVectors(ab, ac);
    const len = nrm.length();
    if (len === 0 || Math.abs(nrm.z) / len < 0.9) continue; // keep faces toward/away from the camera
    const cx = (v[0].x + v[1].x + v[2].x) / 3;
    const cy = (v[0].y + v[1].y + v[2].y) / 3;
    const ix = THREE.MathUtils.clamp(Math.floor((cx - minX) / px), 0, nx - 1);
    const iy = THREE.MathUtils.clamp(Math.floor((cy - minY) / py), 0, ny - 1);
    filled[ix][iy] = true;
  }

  const has = (x, y) => x >= 0 && y >= 0 && x < nx && y < ny && filled[x][y];

  // Directed boundary edges, counter-clockwise around filled cells
  const next = new Map();
  const key = (x, y) => `${x},${y}`;
  const link = (a, b) => next.set(key(...a), b);
  for (let x = 0; x < nx; x++)
    for (let y = 0; y < ny; y++) {
      if (!filled[x][y]) continue;
      if (!has(x, y - 1)) link([x, y], [x + 1, y]);
      if (!has(x + 1, y)) link([x + 1, y], [x + 1, y + 1]);
      if (!has(x, y + 1)) link([x + 1, y + 1], [x, y + 1]);
      if (!has(x - 1, y)) link([x, y + 1], [x, y]);
    }

  // Walk the contour, keeping only the corner vertices
  const start = [...next.keys()][0].split(",").map(Number);
  const loop = [];
  let cur = start;
  let prevDir = null;
  do {
    const nxt = next.get(key(...cur));
    const dir = `${nxt[0] - cur[0]},${nxt[1] - cur[1]}`;
    if (dir !== prevDir) loop.push(cur);
    prevDir = dir;
    cur = nxt;
  } while (key(...cur) !== key(...start));
  // The start vertex may sit mid-edge; drop it if the edge keeps going straight
  const first = loop[0];
  const last = loop[loop.length - 1];
  const after = loop[1];
  const straight =
    (first[0] - last[0]) * (after[1] - first[1]) === (first[1] - last[1]) * (after[0] - first[0]);
  if (straight) loop.shift();

  const points = loop.map(([x, y]) => new THREE.Vector2(minX + x * px, minY + y * py));

  // Round every corner
  const shape = new THREE.Shape();
  const n = points.length;
  const d1 = new THREE.Vector2();
  const d2 = new THREE.Vector2();
  points.forEach((p, i) => {
    const a = points[(i + n - 1) % n];
    const b = points[(i + 1) % n];
    d1.subVectors(a, p);
    d2.subVectors(b, p);
    const r = Math.min(CORNER_RADIUS, d1.length() / 2, d2.length() / 2);
    d1.setLength(r);
    d2.setLength(r);
    const inX = p.x + d1.x;
    const inY = p.y + d1.y;
    if (i === 0) shape.moveTo(inX, inY);
    else shape.lineTo(inX, inY);
    shape.quadraticCurveTo(p.x, p.y, p.x + d2.x, p.y + d2.y);
  });
  shape.closePath();

  return {
    shape,
    outline: shape.getPoints(6),
    bounds: { minX, maxX, minY, maxY },
    half: [(maxX - minX) / 2, (maxY - minY) / 2],
    cells: filled.flat().filter(Boolean).length,
  };
}
