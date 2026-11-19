import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FAMILIA } from "./tema";

// Fontes variáveis (OFL) versionadas em public/fonts: o render não depende da rede.
export const fontesProntas = Promise.all([
  loadFont({ family: FAMILIA.titulo, url: staticFile("fonts/Archivo-Variable-latin.woff2"), weight: "100 900" }),
  loadFont({ family: FAMILIA.texto, url: staticFile("fonts/SourceSans3-Variable-latin.woff2"), weight: "200 900" }),
]);
