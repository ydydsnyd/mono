// @ts-check

import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildESM() {
  return buildInternal({
    format: "esm",
    outExtension: { ".js": ".mjs" },
    entryPoints: [path.join(__dirname, "src", "index.ts")],
    outdir: path.join(__dirname, "out"),
  });
}

function buildCJS() {
  return buildInternal({
    format: "cjs",
    entryPoints: [path.join(__dirname, "src", "index.ts")],
    outdir: path.join(__dirname, "out"),
  });
}

function buildExample() {
  return buildInternal({
    format: "esm",
    outExtension: { ".js": ".mjs" },
    entryPoints: [path.join(__dirname, "example", "index.ts")],
    outdir: path.join(__dirname, "out", "example"),
  });
}

/**
 * @param {Partial<import("esbuild").BuildOptions>} options
 */
function buildInternal(options) {
  return build({
    bundle: true,
    minify: true,
    sourcemap: true,
    target: "esnext",
    ...options,
  });
}

try {
  // @ts-ignore
  await Promise.all([buildESM(), buildCJS(), buildExample()]);
} catch {
  process.exitCode = 1;
}
