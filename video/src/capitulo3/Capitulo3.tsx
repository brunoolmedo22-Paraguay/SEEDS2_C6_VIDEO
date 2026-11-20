// CAPÍTULO 3 v1 — RESULTADOS (R0–R5), conforme docs/PROPOSTA_RESULTADOS.md e as decisões do responsável.
// R0 ponte «SIMULAÇÃO CONCLUÍDA» → R1 Partitura montada → R2 despacho com destaque por recurso (protótipo aprovado,
// INALTERADO) → R3 carga líquida e compensação → R4 sem × com bateria → PEAK SHAVING → R5 custo e marca.
import { AbsoluteFill, Freeze, Sequence, interpolate, useCurrentFrame } from "remotion";
import { cl } from "../componentes/grafico";
import { DUR_DESP, ResultadosDespacho, TL_DESP } from "../resultados/Despacho";
import { COR } from "../tema";
import { DUR_R0, R0Concluida } from "./R0Concluida";
import { DUR_R1, R1Partitura } from "./R1Partitura";
import { DUR_R3, R3CargaLiquida } from "./R3CargaLiquida";
import { DUR_R4, R4Comparacao } from "./R4Comparacao";
import { DUR_R5, R5Encerramento } from "./R5Encerramento";

// R2: o protótipo começa no quadro em que o despacho está completo (TL_DESP.completo) — a R1 já construiu as barras e a
// ampliação termina exatamente nessa geometria. O quadro completo fica parado CONGELADO por R2_PAUSA quadros (leitura) e
// depois o protótipo segue sem nenhuma alteração até o fim (solar → rede → bateria → saída).
const FUSAO = 14, R2_PAUSA = 75;
export const DUR_R2 = R2_PAUSA + (DUR_DESP - TL_DESP.completo);
const R2 = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, FUSAO], [0, 1], cl) }}>
      {f < R2_PAUSA
        ? <Freeze frame={TL_DESP.completo}><ResultadosDespacho /></Freeze>
        : <Sequence from={R2_PAUSA - TL_DESP.completo}><ResultadosDespacho /></Sequence>}
    </AbsoluteFill>
  );
};

export const CAP3 = (() => {
  const r0 = 0, r1 = r0 + DUR_R0, r2 = r1 + DUR_R1 - FUSAO, r3 = r2 + DUR_R2, r4 = r3 + DUR_R3, r5 = r4 + DUR_R4;
  return { r0, r1, r2, r3, r4, r5, fim: r5 + DUR_R5 };
})();
export const DUR_CAP3 = CAP3.fim;

export const Capitulo3 = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <Sequence from={CAP3.r0} durationInFrames={DUR_R0}><R0Concluida /></Sequence>
    <Sequence from={CAP3.r1} durationInFrames={DUR_R1}><R1Partitura /></Sequence>
    <Sequence from={CAP3.r2} durationInFrames={DUR_R2}><R2 /></Sequence>
    <Sequence from={CAP3.r3} durationInFrames={DUR_R3}><R3CargaLiquida /></Sequence>
    <Sequence from={CAP3.r4} durationInFrames={DUR_R4}><R4Comparacao /></Sequence>
    <Sequence from={CAP3.r5} durationInFrames={DUR_R5}><R5Encerramento /></Sequence>
  </AbsoluteFill>
);
