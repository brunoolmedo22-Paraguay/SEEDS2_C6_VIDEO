// CAPÍTULO 1 v2 — correções do responsável sobre a v1 (docs/CAPITULO1_v2.md):
//   1. abertura sem vibração (geometria determinística; marca SEEDS, sem «2»);
//   2. composição simultânea demanda + tarifa na distribuição do slide 7;
//   3. composição solar + bateria (slide 8) e protagonismo de cada recurso;
//   4. três etapas por quadro — construção · exibição estável (≥ 4,5–5 s nos quadros com vários gráficos) · transição.
// A v1 (capitulo1/) e a prova de conceito (cenas/) continuam intactas; daqui só se reutilizam o título e o PASSO 1 com
// duração maior (parâmetro opcional `dur`; o padrão mantém a v1 idêntica).
import { AbsoluteFill, Series } from "remotion";
import { DUR_TITULO, TituloVideo } from "../capitulo1/TituloVideo";
import { Passo1Sistema, SOBE_PASSO1 } from "../capitulo1/Passo1Sistema";
import { COR } from "../tema";
import { Abertura2, DUR_ABERTURA2 } from "./Abertura2";
import { DemandaTarifa, DUR_DT } from "./DemandaTarifa";
import { DUR_EQ, Equipamentos } from "./Equipamentos";

const DUR_TITULO2 = DUR_TITULO + 30;                     // +1 s de leitura do título
const DUR_PASSO1_2 = SOBE_PASSO1 + 116 + 150 + 16;       // diagrama completo em SOBE + 116, depois 5 s estável e saída

export const CENAS_CAP1V2 = [
  { nome: "Abertura", dur: DUR_ABERTURA2, el: <Abertura2 /> },
  { nome: "Título", dur: DUR_TITULO2, el: <TituloVideo dur={DUR_TITULO2} /> },
  { nome: "PASSO 1 · sistema", dur: DUR_PASSO1_2, el: <Passo1Sistema dur={DUR_PASSO1_2} /> },
  { nome: "Demanda + tarifa", dur: DUR_DT, el: <DemandaTarifa /> },
  { nome: "Solar + bateria", dur: DUR_EQ, el: <Equipamentos /> },
];
export const DUR_CAP1V2 = CENAS_CAP1V2.reduce((s, c) => s + c.dur, 0);

export const Capitulo1v2 = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <Series>
      {CENAS_CAP1V2.map(({ nome, dur, el }) => <Series.Sequence key={nome} name={nome} durationInFrames={dur}>{el}</Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
