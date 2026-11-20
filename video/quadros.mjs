// Renderiza vários quadros-chave de uma composição com UM só bundle:
//   node quadros.mjs <Composicao> <pasta-de-saida> <quadro> [<quadro> …]
// Usa REMOTION_BROWSER (Chrome Headless Shell local), como remotion.config.ts.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [id, saida, ...quadros] = process.argv.slice(2);
mkdirSync(saida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_BROWSER || null;
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const q of quadros.map(Number)) {
  const output = path.join(saida, `${id}_${String(q).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: q, output, browserExecutable, imageFormat: "png" });
  console.log(output);
}
