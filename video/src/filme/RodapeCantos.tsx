// RODAPÉ NOS CANTOS (pedido do responsável após as propostas A–E): só LACA (esquerda) e GPEnSE (direita), grandes (até
// 96 px; ferramentas/preparar_logos_rodape_cantos.py — mesmo tratamento, cores e proporções oficiais), um em cada canto
// inferior. O conteúdo do filme é reduzido uniformemente para liberar a faixa (nada é coberto). `cor` = aba presa à borda
// inferior atrás de cada marca; `null` = sem fundo, direto no preto. `entrada` (0–1) = subida a partir da borda inferior.
import { Img, staticFile } from "remotion";
import L from "../creditos/logos_rodape_cantos.json";

export const FAIXA_CANTOS = 120;
const MARGEM = 64, PAD = 26;
const H_MAX = Math.max(...L.map((l) => l.h));
const laca = L.find((l) => l.id === "03_LACA")!, gpense = L.find((l) => l.id === "04_GPEnSE")!;

export const RodapeCantos: React.FC<{ cor: string | null; opacidade: number; entrada: number }> = ({ cor, opacidade, entrada }) => {
  const cy = 1080 - FAIXA_CANTOS / 2 + 4, desce = Math.round((1 - entrada) * (FAIXA_CANTOS + 30));
  const marca = (l: typeof laca, x: number) => (
    <div key={l.id}>
      {cor && <div style={{ position: "absolute", left: x - PAD, top: cy - H_MAX / 2 - PAD + 6, width: l.w + 2 * PAD, height: 200, borderRadius: 24, background: cor }} />}
      <Img src={staticFile(l.arquivo)} width={l.w} height={l.h} style={{ position: "absolute", left: x, top: Math.round(cy - l.h / 2) }} />
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: opacidade, translate: `0px ${desce}px`, overflow: "hidden", pointerEvents: "none" }}>
      {marca(laca, MARGEM)}
      {marca(gpense, 1920 - MARGEM - gpense.w)}
    </div>
  );
};
