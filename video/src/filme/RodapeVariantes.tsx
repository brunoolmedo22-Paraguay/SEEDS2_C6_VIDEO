// PROPOSTAS de rodapé institucional MAIOR (sobre o filme v5) — para o responsável escolher. Mesmos logotipos (variante
// grande, até 62 px: ferramentas/preparar_logos_rodape_g.py), ordem do LEIA.txt, uma fileira centrada; o conteúdo do filme
// é reduzido uniformemente para liberar a faixa (nada é coberto). `entrada` (0–1) = subida a partir da borda inferior.
//   pilula — pílula flutuante cinza escuro, maior;
//   aba    — aba presa à borda inferior (cantos de cima arredondados), como se saísse de baixo do quadro;
//   faixa  — faixa de largura total na base, com filete fino no topo.
import { Img, staticFile } from "remotion";
import G62 from "../creditos/logos_rodape_g.json";
import G76 from "../creditos/logos_rodape_xg.json";

export type EstiloRodape = "pilula" | "aba" | "faixa";
export type VarianteRodape = { estilo: EstiloRodape; cor: string; gap: number; grande?: boolean };
const alt = (v: VarianteRodape) => (v.grande ? 76 : 62);
export const faixaDe = (v: VarianteRodape) => alt(v) + (v.estilo === "pilula" ? 34 : 30);

export const RodapeVariante: React.FC<{ v: VarianteRodape; opacidade: number; entrada: number }> = ({ v, opacidade, entrada }) => {
  const G = v.grande ? G76 : G62, H = alt(v);
  const larg = G.reduce((s, l) => s + l.w, 0) + v.gap * (G.length - 1);
  const x0 = Math.round((1920 - larg) / 2), B = faixaDe(v);
  const desce = Math.round((1 - entrada) * (B + 30));
  const cy = v.estilo === "pilula" ? 1080 - B / 2 : 1080 - (H + 26) / 2 - 2;     // centro vertical da fileira
  let x = x0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: opacidade, translate: `0px ${desce}px`, pointerEvents: "none", overflow: "hidden" }}>
      {v.estilo === "pilula" && <div style={{ position: "absolute", left: x0 - 34, top: cy - (H + 18) / 2, width: larg + 68, height: H + 18, borderRadius: (H + 18) / 2, background: v.cor }} />}
      {v.estilo === "aba" && <div style={{ position: "absolute", left: x0 - 48, top: 1080 - (H + 30), width: larg + 96, height: H + 60, borderRadius: 26, background: v.cor }} />}
      {v.estilo === "faixa" && <>
        <div style={{ position: "absolute", left: 0, top: 1080 - B, width: 1920, height: B, background: v.cor }} />
        <div style={{ position: "absolute", left: 0, top: 1080 - B, width: 1920, height: 1.5, background: "rgba(255,255,255,.14)" }} />
      </>}
      {G.map((l) => {
        const el = <Img key={l.id} src={staticFile(l.arquivo)} width={l.w} height={l.h} style={{ position: "absolute", left: x, top: Math.round(cy - l.h / 2) }} />;
        x += l.w + v.gap;
        return el;
      })}
    </div>
  );
};
