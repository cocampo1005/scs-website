// Trims the Spline "SOLID tetris" export down to the geometry the About page uses:
// the seven puzzle pieces and the Logo Cube. The 3D description cards, text
// meshes, frame and lights are dropped (the info is HTML now), taking the file
// from ~8MB to a few hundred KB. Node transforms are kept as exported, minus the
// GLB root's 0.01 scale (the scene is authored in Spline units).
//
//   node scripts/extract-solid-puzzle-model.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "docs/references/spline-tetris-solid-interaction/solid_tetris.glb");
const OUT = path.join(root, "public/models/scs-solid-puzzle.glb");

const PIECES = ["S Piece", "O Piece", "L Piece", "I Piece", "D Piece", "SOLID Piece", "Corner Piece"];
const LOGO_PARTS = ["Cube", "Solid S", "Code C", "Solutions S"];

const buf = fs.readFileSync(SRC);
const jsonLen = buf.readUInt32LE(12);
const src = JSON.parse(buf.subarray(20, 20 + jsonLen).toString());
const bin = buf.subarray(20 + jsonLen + 8);

const SIZE = { 5126: 4, 5125: 4, 5123: 2, 5121: 1 };
const COUNT = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };

// Copy one accessor's data tightly packed into the new binary
const chunks = [];
const bufferViews = [];
const accessors = [];
let offset = 0;
function copyAccessor(index, target) {
  const a = src.accessors[index];
  const bv = src.bufferViews[a.bufferView];
  const n = COUNT[a.type];
  const elem = SIZE[a.componentType] * n;
  const stride = bv.byteStride || elem;
  const start = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const out = Buffer.alloc(a.count * elem);
  for (let i = 0; i < a.count; i++) bin.copy(out, i * elem, start + i * stride, start + i * stride + elem);
  const pad = (4 - (out.length % 4)) % 4;
  chunks.push(out, Buffer.alloc(pad));
  bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: out.length, target });
  offset += out.length + pad;
  accessors.push({
    bufferView: bufferViews.length - 1,
    componentType: a.componentType,
    count: a.count,
    type: a.type,
    ...(a.min ? { min: a.min, max: a.max } : {}),
  });
  return accessors.length - 1;
}

const materials = [];
const meshes = [];
const nodes = [];

function addMeshNode(srcNode) {
  const prim = src.meshes[srcNode.mesh].primitives[0];
  const material = {
    name: srcNode.name,
    pbrMetallicRoughness: { ...src.materials[prim.material].pbrMetallicRoughness },
  };
  materials.push(material);
  const attributes = {
    POSITION: copyAccessor(prim.attributes.POSITION, 34962),
    NORMAL: copyAccessor(prim.attributes.NORMAL, 34962),
  };
  const primitive = { attributes, material: materials.length - 1 };
  if (prim.indices !== undefined) primitive.indices = copyAccessor(prim.indices, 34963);
  meshes.push({ name: srcNode.name, primitives: [primitive] });
  nodes.push({ name: srcNode.name, mesh: meshes.length - 1, matrix: srcNode.matrix });
  return nodes.length - 1;
}

const find = (name) => src.nodes.find((n) => n.name === name);
const sceneChildren = [];

for (const name of PIECES) sceneChildren.push(addMeshNode(find(name)));

// Logo Cube group: parent matrix (position, 0.5 scale) with its four meshes
const logoParts = LOGO_PARTS.map((name) => addMeshNode(find(name)));
nodes.push({ name: "Logo Cube", matrix: find("Logo Cube").matrix, children: logoParts });
sceneChildren.push(nodes.length - 1);

nodes.push({ name: "Scene 1", children: sceneChildren });

const json = {
  asset: { version: "2.0", generator: "extract-solid-puzzle-model.mjs" },
  scene: 0,
  scenes: [{ nodes: [nodes.length - 1] }],
  nodes,
  meshes,
  materials,
  accessors,
  bufferViews,
  buffers: [{ byteLength: offset }],
};

const jsonBuf = Buffer.from(JSON.stringify(json));
const jsonPad = (4 - (jsonBuf.length % 4)) % 4;
const jsonChunk = Buffer.concat([jsonBuf, Buffer.alloc(jsonPad, 0x20)]);
const binChunk = Buffer.concat(chunks);
const header = Buffer.alloc(12);
header.write("glTF", 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8);
const jh = Buffer.alloc(8);
jh.writeUInt32LE(jsonChunk.length, 0);
jh.write("JSON", 4);
const bh = Buffer.alloc(8);
bh.writeUInt32LE(binChunk.length, 0);
bh.write("BIN\0", 4);

fs.writeFileSync(OUT, Buffer.concat([header, jh, jsonChunk, bh, binChunk]));
console.log(`wrote ${path.relative(root, OUT)} (${((12 + 16 + jsonChunk.length + binChunk.length) / 1024).toFixed(0)} KB)`);
