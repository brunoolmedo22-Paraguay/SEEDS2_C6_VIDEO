// CAPÍTULO 3 v2 — RESULTADOS com foco na OPERAÇÃO ENERGÉTICA (decisões do responsável após a v1):
// R0 ponte (inalterada) → R1 Partitura em ≤ 5 s, sem indicadores monetários → R2 despacho + destaques (protótipo, desenho dos
// apoios × 0,85) → R3 carga líquida (desenho × 0,85) → R4 sem × com bateria → PEAK SHAVING → fechamento «PEAK SHAVING /
// −200 MW NA PONTA» → marca SEEDS → créditos institucionais. Sem resultados econômicos. A v1 (capitulo3/) fica intacta.
import { AbsoluteFill, Freeze, Sequence, interpolate, useCurrentFrame } from "remotion";
import { cl } from "../componentes/grafico";
import { DUR_DESP, ResultadosDespacho, TL_DESP } from "../resultados/Despacho";
import { COR } from "../tema";
import { DUR_R0, R0Concluida } from "../capitulo3/R0Concluida";
import { DUR_R1_2, R1Partitura2 } from "./R1Partitura2";
import { DUR_R3_2, R3CargaLiquida2 } from "./R3CargaLiquida2";
import { DUR_R4_2, R4Comparacao2 } from "./R4Comparacao2";
import { DUR_MARCA, Marca } from "./Marca";
import { Creditos, DUR_CREDITOS } from "./Creditos";

const FUSAO = 14, R2_PAUSA = 75, RITMO = 0.85;
export const DUR_R2_2 = R2_PAUSA + (DUR_DESP - TL_DESP.completo);
export const R2 = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, FUSAO], [0, 1], cl) }}>
      {f < R2_PAUSA
        ? <Freeze frame={TL_DESP.completo}><ResultadosDespacho ritmo={RITMO} /></Freeze>
        : <Sequence from={R2_PAUSA - TL_DESP.completo}><ResultadosDespacho ritmo={RITMO} /></Sequence>}
    </AbsoluteFill>
  );
};

export const CAP3V2 = (() => {
  const r0 = 0, r1 = r0 + DUR_R0, r2 = r1 + DUR_R1_2 - FUSAO, r3 = r2 + DUR_R2_2, r4 = r3 + DUR_R3_2, marca = r4 + DUR_R4_2, cred = marca + DUR_MARCA;
  return { r0, r1, r2, r3, r4, marca, cred, fim: cred + DUR_CREDITOS };
})();
export const DUR_CAP3V2 = CAP3V2.fim;

export const Capitulo3v2 = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <Sequence from={CAP3V2.r0} durationInFrames={DUR_R0}><R0Concluida /></Sequence>
    <Sequence from={CAP3V2.r1} durationInFrames={DUR_R1_2}><R1Partitura2 /></Sequence>
    <Sequence from={CAP3V2.r2} durationInFrames={DUR_R2_2}><R2 /></Sequence>
    <Sequence from={CAP3V2.r3} durationInFrames={DUR_R3_2}><R3CargaLiquida2 /></Sequence>
    <Sequence from={CAP3V2.r4} durationInFrames={DUR_R4_2}><R4Comparacao2 /></Sequence>
    <Sequence from={CAP3V2.marca} durationInFrames={DUR_MARCA}><Marca /></Sequence>
    <Sequence from={CAP3V2.cred} durationInFrames={DUR_CREDITOS}><Creditos /></Sequence>
  </AbsoluteFill>
);
