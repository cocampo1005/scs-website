// Compresses the 3D models in public/models with EXT_meshopt_compression.
//
//   node scripts/optimize-models.mjs
//
// The scenes read vertex positions in Spline units (silhouettes, snapping,
// camera framing) and ignore node scale, so the geometry must stay in float
// units: this uses meshopt's exponential filter on floats rather than integer
// quantization, which would move a dequantization scale into the nodes.
// Lossless steps first (dedup, prune, vertex reorder). drei's loader decodes
// meshopt out of the box.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression, KHRONOS_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, prune, reorder } from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const MODELS = [
  { src: "docs/references/models/scs-hero-puzzle.glb", out: "public/models/scs-hero-puzzle.glb" },
  { src: "docs/references/models/scs-solid-puzzle.glb", out: "public/models/scs-solid-puzzle.glb" },
];

await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions([...KHRONOS_EXTENSIONS, EXTMeshoptCompression]).registerDependencies({
  "meshopt.decoder": MeshoptDecoder,
  "meshopt.encoder": MeshoptEncoder,
});

for (const { src, out } of MODELS) {
  const doc = await io.read(path.join(root, src));
  await doc.transform(dedup(), prune(), reorder({ encoder: MeshoptEncoder }));
  doc
    .createExtension(EXTMeshoptCompression)
    .setRequired(true)
    .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });
  await io.write(path.join(root, out), doc);
  const { statSync } = await import("node:fs");
  console.log(`${src} ${(statSync(path.join(root, src)).size / 1024).toFixed(0)} KB → ${out} ${(statSync(path.join(root, out)).size / 1024).toFixed(0)} KB`);
}
