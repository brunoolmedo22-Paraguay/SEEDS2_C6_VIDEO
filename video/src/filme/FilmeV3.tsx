// FILME SEEDS · v3 — ajustes finais sobre o filme v2 (filme/FilmeV2.tsx, intacto):
//   1. abertura com o significado da sigla, pequeno, sob a marca: «Smart Energy Ecosystem for Decision Support» (+1,5 s);
//   2. PASSO 1 sem o ponto solto (barramento com comprimento zero e ponta redonda — capitulo1/Passo1Sistema.tsx);
//   3–5. «SIMULADO NO SEEDS» e as instituições numa ÚNICA cena final sobre preto (filme/Cierre.tsx).
// Capítulos 1 e 2, Partitura, R2, R3 e R4 lado a lado: os mesmos componentes e mapas de tempo do v2.
import { AbsoluteFill, Sequence, Series } from "remotion";
import { Abertura2, DUR_ABERTURA2, SUBTITULO_SEEDS } from "../capitulo1v2/Abertura2";
import { R3CargaLiquida2 } from "../capitulo3v2/R3CargaLiquida2";
import { COR } from "../tema";
import { CENAS_C1, DUR_R1F, R1Rapida } from "./Filme";
import { Capitulo2Filme, DUR_CAP2F, INICIO_PARTITURA, TL_FECHAR } from "./Capitulo2Filme";
import { DUR_R2V2, DUR_R3V2, MAPA_R3, R2v2, R4v2 } from "./FilmeV2";
import { DUR_R4L } from "./R4LadoALado";
import { Cierre, DUR_CIERRE } from "./Cierre";
import { Remapear } from "./tempo";

const DUR_ABERTURA3 = DUR_ABERTURA2 + 45;                     // +1,5 s para ler o subtítulo
export const CENAS_C1_V3 = [{ nome: "Abertura", dur: DUR_ABERTURA3, el: <Abertura2 subtitulo={SUBTITULO_SEEDS} dur={DUR_ABERTURA3} /> }, ...CENAS_C1.slice(1)];
export const DUR_C1_V3 = CENAS_C1_V3.reduce((s, c) => s + c.dur, 0);
const FUSAO = 14, FUSAO_R3R4 = 10, FUSAO_CIERRE = 12;

export const FILME3 = (() => {
  const c1 = 0, c2 = DUR_C1_V3, r1 = c2 + INICIO_PARTITURA, r2 = r1 + DUR_R1F - FUSAO, r3 = r2 + DUR_R2V2, r4 = r3 + DUR_R3V2 - FUSAO_R3R4;
  const cierre = r4 + DUR_R4L - FUSAO_CIERRE;
  return { c1, c2, fechar: c2 + TL_FECHAR.clique, r1, r2, r3, r4, cierre, fim: cierre + DUR_CIERRE };
})();
export const DUR_FILME3 = FILME3.fim;

export const FilmeV3 = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <Sequence name="Capítulo 1" from={FILME3.c1} durationInFrames={DUR_C1_V3}>
      <Series>
        {CENAS_C1_V3.map(({ nome, dur, el }) => <Series.Sequence key={nome} name={nome} durationInFrames={dur}>{el}</Series.Sequence>)}
      </Series>
    </Sequence>
    <Sequence name="R1 · Partitura" from={FILME3.r1} durationInFrames={DUR_R1F}><R1Rapida /></Sequence>
    <Sequence name="Capítulo 2" from={FILME3.c2} durationInFrames={DUR_CAP2F}><Capitulo2Filme /></Sequence>
    <Sequence name="R2 · despacho" from={FILME3.r2} durationInFrames={DUR_R2V2}><R2v2 /></Sequence>
    <Sequence name="R3 · carga líquida" from={FILME3.r3} durationInFrames={DUR_R3V2}><Remapear mapa={MAPA_R3}><R3CargaLiquida2 /></Remapear></Sequence>
    <Sequence name="Fechamento" from={FILME3.cierre} durationInFrames={DUR_CIERRE}><Cierre /></Sequence>
    <Sequence name="R4 · sem × com bateria" from={FILME3.r4} durationInFrames={DUR_R4L}><R4v2 /></Sequence>
  </AbsoluteFill>
);
