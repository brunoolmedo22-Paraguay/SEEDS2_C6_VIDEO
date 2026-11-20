// CAPÍTULO 1 v4 — idêntico à v3 aprovada, com o título «SUAVIZANDO A CURVA DE PATO» no lugar de «ALIVIANDO A CURVA DE PATO».
// Mesma cadência de digitação (RITMO_RAPIDO) e o mesmo +1 s de leitura da v2/v3. v1, v2 e v3 continuam intactas.
import { AbsoluteFill, Series } from "remotion";
import { DUR_TITULO_V4, TEXTO_TITULO_V4, TituloVideo } from "../capitulo1/TituloVideo";
import { CENAS_CAP1V3 } from "../capitulo1v3/Capitulo1v3";
import { COR } from "../tema";

const DUR_TITULO_V4_LEITURA = DUR_TITULO_V4 + 30;
export const CENAS_CAP1V4 = CENAS_CAP1V3.map((c, k) =>
  k === 1 ? { nome: "Título", dur: DUR_TITULO_V4_LEITURA, el: <TituloVideo dur={DUR_TITULO_V4_LEITURA} texto={TEXTO_TITULO_V4} /> } : c);
export const DUR_CAP1V4 = CENAS_CAP1V4.reduce((s, c) => s + c.dur, 0);

export const Capitulo1v4 = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <Series>
      {CENAS_CAP1V4.map(({ nome, dur, el }) => <Series.Sequence key={nome} name={nome} durationInFrames={dur}>{el}</Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
