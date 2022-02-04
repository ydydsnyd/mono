import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildESM() {
  return buildInternal("esm", { ".js": ".mjs" });
}

function buildCJS() {
  return buildInternal("cjs", undefined);
}

/**
 * @param {"esm"|"cjs"} format
 * @param {Record<string,string>|undefined} outExtension
 */
function buildInternal(format, outExtension) {
  return build({
    bundle: true,
    sourcemap: true,
    format,
    target: "esnext",
    entryPoints: [path.join(__dirname, "src", "index.ts")],
    outdir: path.join(__dirname, "out"),
    outExtension,
  });
}

try {
  await Promise.all([buildESM(), `${buildCJS()}`]);
} catch {
  process.exitCode = 1;
}
