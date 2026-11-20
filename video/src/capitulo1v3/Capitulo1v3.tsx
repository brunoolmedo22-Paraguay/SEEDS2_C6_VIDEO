// CAPÍTULO 1 v3 — igual à v2 aprovada (abertura, título, PASSO 1, demanda + tarifa, solar + bateria), MENOS o protagonismo
// final da bateria com SOC e potência REALIZADOS: neste capítulo o sistema só é apresentado e montado. A bateria aparece
// como equipamento (1.003 MWh, 200 MW, η 95 %, SOC inicial 20 %); a operação real do BESS fica para o capítulo de resultados.
// A ampliação solar mostra o POTENCIAL FV previsto (entrada do EMS). v1, v2 e a prova de conceito continuam intactas.
import { AbsoluteFill, Series } from "remotion";
import { CENAS_CAP1V2 } from "../capitulo1v2/Capitulo1v2";
import { DUR_EQ3, Equipamentos } from "../capitulo1v2/Equipamentos";
import { COR } from "../tema";

export const CENAS_CAP1V3 = [
  ...CENAS_CAP1V2.slice(0, 4),                                         // abertura · título · PASSO 1 · demanda + tarifa (v2)
  { nome: "Solar + bateria (sem resultados)", dur: DUR_EQ3, el: <Equipamentos versao={3} /> },
];
export const DUR_CAP1V3 = CENAS_CAP1V3.reduce((s, c) => s + c.dur, 0);

export const Capitulo1v3 = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <Series>
      {CENAS_CAP1V3.map(({ nome, dur, el }) => <Series.Sequence key={nome} name={nome} durationInFrames={dur}>{el}</Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
