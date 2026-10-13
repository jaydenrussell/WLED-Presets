#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const srcPath = process.argv[2] ? resolve(process.argv[2]) : join(here, "Favorite_Presets.txt");
const outPath = process.argv[3] ? resolve(process.argv[3]) : join(here, "wled_presets_Favorites.json");

function parseSource(text) {
  const presets = [];
  let name = null;
  let lineNo = 0;
  for (const raw of text.split(/\r?\n/)) {
    lineNo++;
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("//")) {
      name = line.slice(2).trim();
      continue;
    }
    if (line.startsWith("{")) {
      let obj;
      try {
        obj = JSON.parse(line);
      } catch (err) {
        throw new Error(`Line ${lineNo}: invalid JSON for "${name ?? "(unnamed)"}": ${err.message}`);
      }
      presets.push({ name, obj });
      name = null;
    }
  }
  return presets;
}

function normalize(entry, index) {
  const o = entry.obj;
  const out = {};
  out.n = entry.name ?? `Preset ${index}`;
  out.on = true;
  for (const [k, v] of Object.entries(o)) {
    if (k === "seg" || k === "n" || k === "on" || k === "mainseg") continue;
    out[k] = v;
  }
  out.mainseg = Object.prototype.hasOwnProperty.call(o, "mainseg") ? o.mainseg : 0;
  if (o.seg != null) {
    const segs = Array.isArray(o.seg) ? o.seg : [o.seg];
    out.seg = segs.map((s, i) => (Object.prototype.hasOwnProperty.call(s, "id") ? s : { id: i, ...s }));
  }
  return out;
}

function buildDocument(presets) {
  const entries = [["0", {}]];
  presets.forEach((p, i) => entries.push([String(i + 1), normalize(p, i + 1)]));
  const lines = ["{"];
  entries.forEach(([k, v], i) => {
    lines.push(`"${k}":${JSON.stringify(v)}${i < entries.length - 1 ? "," : ""}`);
  });
  lines.push("}");
  return lines.join("\n") + "\n";
}

const presets = parseSource(readFileSync(srcPath, "utf8"));
const doc = buildDocument(presets);
JSON.parse(doc);
writeFileSync(outPath, doc, "utf8");
console.log(`Built ${presets.length} presets -> ${outPath}`);
