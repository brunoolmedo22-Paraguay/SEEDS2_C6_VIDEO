// ABERTURA COM O LOGO OFICIAL (filme v10) — mesma coreografia da Abertura2 aprovada, com o logo OFICIAL do SEEDS:
//   o DESENHO (emblema) surge grande no centro, encolhe, desliza à esquerda e a palavra «SEEDS» se ABRE por trás dele (máscara
//   a partir da borda direita do emblema); por fim, a frase «Smart Energy Ecosystem for Decision Support».
// Partes de ferramentas/preparar_logo_oficial.py (fundo retirado corretamente, cores e formas intactas). No quadro final o
// conjunto reproduz o desenho do arquivo oficial em escala 1:1 (posições relativas do original). A frase do arquivo é
// cinza-escuro (ilegível no preto): aqui é TEXTO, com as mesmas palavras, a mesma posição e a mesma largura, em cinza claro.
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, saida } from "../componentes/grafico";
import { COR, FONTE } from "../tema";
import L from "../dados_logo_oficial.json";

const E = L.partes.emblema, P = L.partes.palavra, F = L.partes.frase;
const ESQ = Math.min(E.x, P.x), DIR = Math.max(E.x + E.w, P.x + P.w), TOPO = E.y, BASE = E.y + E.h;
const OX = Math.round(960 - (ESQ + DIR) / 2), OY = Math.round(540 - (TOPO + BASE) / 2);     // conjunto centrado no quadro
const GAP = P.x - (E.x + E.w);
const GRANDE = 1.35;                                    // escala do emblema sozinho no início (depois 1:1)

export const AberturaOficial: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const entrada = interpolate(f, [0, 20], [0, 1], { ...cl, easing: saida });
  const escEntrada = interpolate(f, [0, 20], [0.94, 1], { ...cl, easing: saida });
  const s = interpolate(f, [56, 96], [GRANDE, 1], { ...cl, easing: saida });
  const p = interpolate(f, [108, 166], [0, 1], { ...cl, easing: saida });
  const sub = interpolate(f, [172, 198], [0, 1], { ...cl, easing: saida });
  const sai = interpolate(f, [dur - 16, dur], [1, 0], cl);
  // centro do emblema: no meio da tela até a revelação; depois vai à posição final do conjunto
  const cxF = OX + E.x + E.w / 2, cyF = OY + E.y + E.h / 2;
  const cx = interpolate(p, [0, 1], [960, cxF]), cy = interpolate(p, [0, 1], [540, cyF]);
  const ew = E.w * s * escEntrada, eh = E.h * s * escEntrada;
  const bordaDir = cx + ew / 2;
  const palavraEsq = bordaDir + GAP - (1 - p) * (GAP + P.w);
  const palavraTopo = cy - E.h / 2 + (P.y - E.y);
  return (
    <AbsoluteFill style={{ background: COR.fundo, opacity: entrada * sai }}>
      {p > 0 && (
        <div style={{ position: "absolute", left: bordaDir, top: 0, width: 1920 - bordaDir, height: 1080, overflow: "hidden" }}>
          <Img src={staticFile(P.arquivo)} width={P.w} height={P.h} style={{ position: "absolute", left: palavraEsq - bordaDir, top: palavraTopo }} />
        </div>
      )}
      <Img src={staticFile(E.arquivo)} width={E.w} height={E.h}
        style={{ position: "absolute", left: cx - E.w / 2, top: cy - E.h / 2, scale: String(s * escEntrada) }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <text x={OX + F.x} y={OY + F.y + F.h - 6 + (1 - sub) * 8} textLength={F.w} lengthAdjust="spacing" opacity={sub}
          fontFamily={FONTE.texto} fontSize={F.h + 3} fill={COR.tinta2}>Smart Energy Ecosystem for Decision Support</text>
      </svg>
    </AbsoluteFill>
  );
};
