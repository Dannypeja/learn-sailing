#!/usr/bin/env node
/**
 * Print mesh/node names and POSITION bounds from a GLB or glTF JSON file.
 * Usage: node scripts/inspect-glb.mjs <path-or-https-url>
 */
import { readFile } from "node:fs/promises";

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/inspect-glb.mjs <path-or-https-url>");
  process.exit(1);
}

const bytes = await loadBytes(src);
const json = parseGltfJson(bytes, src);
const names = {
  scenes: (json.scenes ?? []).map((item) => item.name ?? ""),
  nodes: (json.nodes ?? []).map((item, index) => item.name || `#${index}`),
  meshes: (json.meshes ?? []).map((item, index) => item.name || `#${index}`),
  materials: (json.materials ?? []).map((item, index) => item.name || `#${index}`),
};
const bounds = positionBounds(json);

console.log(
  JSON.stringify(
    {
      source: src,
      bytes: bytes.byteLength,
      generator: json.asset?.generator ?? null,
      extensions: json.extensionsUsed ?? [],
      bounds,
      ...names,
    },
    null,
    2,
  ),
);

async function loadBytes(input) {
  if (/^https?:\/\//i.test(input)) {
    const response = await fetch(input);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText} for ${input}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }
  return readFile(input);
}

function parseGltfJson(buf, input) {
  if (buf.subarray(0, 4).toString("ascii") === "glTF") {
    const jsonLength = buf.readUInt32LE(12);
    const jsonType = buf.toString("ascii", 16, 20);
    if (jsonType !== "JSON") {
      throw new Error(`Unexpected GLB chunk type "${jsonType}"`);
    }
    return JSON.parse(buf.subarray(20, 20 + jsonLength).toString("utf8"));
  }
  const text = buf.toString("utf8").trimStart();
  if (text.startsWith("{")) {
    return JSON.parse(text);
  }
  throw new Error(`Not a GLB or glTF JSON file: ${input}`);
}

function positionBounds(json) {
  const accessors = json.accessors ?? [];
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  let found = false;
  for (const accessor of accessors) {
    if (accessor.type !== "VEC3" || !accessor.min || !accessor.max) {
      continue;
    }
    found = true;
    for (let i = 0; i < 3; i += 1) {
      min[i] = Math.min(min[i], accessor.min[i]);
      max[i] = Math.max(max[i], accessor.max[i]);
    }
  }
  if (!found) {
    return null;
  }
  return {
    min,
    max,
    size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
    note: "Untransformed POSITION accessor bounds (mesh space, not world).",
  };
}
