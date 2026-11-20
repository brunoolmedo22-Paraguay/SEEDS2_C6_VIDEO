// Tokens da Partitura SEEDS2 — tema ESCURO de `assets/estilo-seeds2/trama.css` (idêntico a SEEDS_Energy_multimodel `main`).
// Únicos valores de cor do vídeo: não espalhar cores literais nos componentes.
export const COR = {
  fundo: "#000000",          // vídeo: preto absoluto (CLAUDE.md); a Partitura usa --bg #0a0a0a
  tinta: "#f3f3f1",          // --ink (dark) · demanda --s-dem
  tinta2: "#a9afb5",         // --ink-2
  tinta3: "#777e85",         // --ink-3
  linha: "rgba(255,255,255,.09)", // --line (grade)
  grid: "#e05a5a",           // --s-grid · Rede / PCC
  fv: "#bd860a",             // --s-fv · Solar
  bat: "#8b7cff",            // --s-bat · Bateria
  tar: "#22d3ee",            // --s-tar · tarifa de importação (UI-VISUAL-01)
  cus: "#f9853a",            // --s-cus · custo realizado (UI-VISUAL-01)
  liq: "#b3a8ff",            // --s-liq · carga líquida
} as const;

// Nome da FAMÍLIA (registro em fontes.ts) × pilha CSS (o nome com dígito precisa de aspas no CSS).
export const FAMILIA = { titulo: "Archivo", texto: "Source Sans 3" } as const;
export const FONTE = {
  titulo: `"${FAMILIA.titulo}", system-ui, sans-serif`,   // --f-d
  texto: `"${FAMILIA.texto}", system-ui, sans-serif`,     // --f-t
} as const;
