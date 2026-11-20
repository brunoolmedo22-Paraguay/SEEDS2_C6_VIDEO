// CAPÍTULO 1 (independente; duração provisória ≈ 35 s) — abertura SEEDS · título · PASSO 1 sistema · curva de pato · tarifa.
// Cada cena entra e sai pelo preto (sem transições exageradas). A prova de conceito v1 continua intocada (cenas/ProvaConceito).
import { AbsoluteFill, Series } from "remotion";
import { COR } from "../tema";
import { Abertura, DUR_ABERTURA } from "./Abertura";
import { CurvaPato, DUR_PATO } from "./CurvaPato";
import { DUR_PASSO1, Passo1Sistema } from "./Passo1Sistema";
import { DUR_TARIFA, Tarifa } from "./Tarifa";
import { DUR_TITULO, TituloVideo } from "./TituloVideo";

export const CENAS_CAP1 = [
  { nome: "Abertura", dur: DUR_ABERTURA, C: Abertura },
  { nome: "Título", dur: DUR_TITULO, C: TituloVideo },
  { nome: "PASSO 1 · sistema", dur: DUR_PASSO1, C: Passo1Sistema },
  { nome: "Curva de pato", dur: DUR_PATO, C: CurvaPato },
  { nome: "Tarifa", dur: DUR_TARIFA, C: Tarifa },
];
export const DUR_CAP1 = CENAS_CAP1.reduce((s, c) => s + c.dur, 0);

export const Capitulo1 = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <Series>
      {CENAS_CAP1.map(({ nome, dur, C }) => (
        <Series.Sequence key={nome} name={nome} durationInFrames={dur}><C /></Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
