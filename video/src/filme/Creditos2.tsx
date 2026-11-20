// CRÉDITOS v2 (filme v2) — seis logotipos sobre FUNDO CINZA NEUTRO, sem cartões brancos (decisão do responsável após o v1).
// Logotipos preparados por ferramentas/preparar_logos_v2.py (originais intocados; UFPB só sem o fundo branco EXTERNO).
// Cinza escolhido por teste de contraste (docs/FILME_MONTAGEM_v2.md): tons de grafite apagam o roxo-escuro de LACA e UNILA
// (contraste ≈ 1,3); #949494 dá ≈ 4,6 a LACA/UNILA, ≈ 4,0 ao CEAR e ≈ 6,9 à UFPB, e mantém PPGIES e GPEnSE reconhecíveis (cor
// saturada e contorno próprio). Duas linhas de três, ordem do LEIA.txt; nenhum texto, nome ou vínculo atribuído.
// A tela do v1 (capitulo3v2/Creditos.tsx, cartões brancos) fica intacta.
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, saida } from "../componentes/grafico";
import { COR } from "../tema";
import LOGOS from "../creditos/logos_v2.json";

export const CINZA_CREDITOS = "#949494";
const CW = 480, CH = 280, GX = 40, GY = 40;
const X0 = (1920 - 3 * CW - 2 * GX) / 2, Y0 = (1080 - 2 * CH - GY) / 2;    // 200 · 220
const T = { fundo: 18, entra: 20, passo: 7, dur: 22, sai: 30 };
export const DUR_CREDITOS2 = T.entra + 5 * T.passo + T.dur + 200 + T.sai;

export const Creditos2 = () => {
  const f = useCurrentFrame();
  const fundo = interpolate(f, [0, T.fundo], [0, 1], { ...cl, easing: saida });
  const sai = interpolate(f, [DUR_CREDITOS2 - T.sai, DUR_CREDITOS2], [1, 0], cl);
  return (
    <AbsoluteFill style={{ background: COR.fundo }}>
      <AbsoluteFill style={{ background: CINZA_CREDITOS, opacity: fundo * sai }} />
      {LOGOS.map((l, k) => {
        const a = interpolate(f, [T.entra + k * T.passo, T.entra + k * T.passo + T.dur], [0, 1], { ...cl, easing: saida });
        const x = X0 + (k % 3) * (CW + GX), y = Y0 + Math.floor(k / 3) * (CH + GY);
        return (
          <div key={l.id} style={{ position: "absolute", left: x, top: y, width: CW, height: CH, opacity: a * sai, translate: `0px ${Math.round((1 - a) * 12)}px` }}>
            <Img src={staticFile(l.arquivo)} width={l.w} height={l.h}
              style={{ position: "absolute", left: Math.round((CW - l.w) / 2), top: Math.round((CH - l.h) / 2) }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
