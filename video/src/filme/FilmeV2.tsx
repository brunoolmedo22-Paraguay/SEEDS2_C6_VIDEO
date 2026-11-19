// FILME SEEDS · v2 — a partir do filme v1 aprovado (filme/Filme.tsx, f88c670, intacto), com três refinamentos:
//   1. Capítulo 3 mais rápido: R2 (despacho + Solar · Rede · Bateria) e R3 (carga líquida + vale + ponta) com o tempo
//      REMAPEADO (filme/tempo.tsx): construção ≈ 1,3–1,75× mais rápida, ≈ 2,5 s de leitura por destaque depois da
//      construção, transições mais curtas e sem tempos mortos. Mesmos componentes, mesmos quadros, mesmos dados.
//   2. Comparação final SÓ lado a lado (filme/R4LadoALado.tsx): sem sobreposição e sem tela isolada de PEAK SHAVING; o título
//      surge na própria composição e a cena segue direto para «SIMULADO NO SEEDS».
//   3. Créditos sobre fundo cinza neutro, sem cartões brancos (filme/Creditos2.tsx; logotipos de preparar_logos_v2.py).
// Capítulo 1, capítulo 2 (com FECHAR), R1 (Partitura), marca e frase final: idênticos ao v1.
import { AbsoluteFill, Sequence, Series, interpolate, useCurrentFrame } from "remotion";
import { DUR_DESP, ResultadosDespacho, TL_DESP } from "../resultados/Despacho";
import { R3CargaLiquida2, TL_R3, DUR_R3_2 } from "../capitulo3v2/R3CargaLiquida2";
import { DUR_MARCA, Marca } from "../capitulo3v2/Marca";
import { cl } from "../componentes/grafico";
import { COR } from "../tema";
import { CENAS_C1, DUR_C1, DUR_R1F, R1Rapida } from "./Filme";
import { Capitulo2Filme, DUR_CAP2F, INICIO_PARTITURA, TL_FECHAR } from "./Capitulo2Filme";
import { DUR_R4L, R4LadoALado } from "./R4LadoALado";
import { Creditos2, DUR_CREDITOS2 } from "./Creditos2";
import { Mapa, Remapear, bloco, duracaoMapa } from "./tempo";

// ---------------------------------------------------------------- R2 · despacho completo + três destaques
// (ritmo 0,85 = capítulo 3 v2) construção de cada apoio termina ≈ 98 quadros após o início do bloco (revelação + notas + faixas)
const FIM_APOIO = 98, LEIT = 75;                             // leitura ≈ 2,5 s por recurso depois da construção
const MAPA_R2: Mapa = (() => {
  const m: [number, number][] = [[0, TL_DESP.completo], [40, TL_DESP.completo], [46, TL_DESP.solar[0]]];   // ≈ 1,3 s de leitura (v1: 4,8 s)
  for (const k of ["solar", "rede", "bat"] as const) {
    const [a, b] = TL_DESP[k];
    m.push(...bloco(m[m.length - 1][0], a, b, FIM_APOIO, 74, LEIT, 16, 12));
  }
  m.push([m[m.length - 1][0] + 16, DUR_DESP]);
  return m;
})();
export const DUR_R2V2 = duracaoMapa(MAPA_R2);
const FUSAO = 14;
const R2v2 = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, FUSAO], [0, 1], cl) }}>
      <Remapear mapa={MAPA_R2}><ResultadosDespacho ritmo={0.85} /></Remapear>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- R3 · carga líquida → vale → ponta
const [a1, b1] = TL_R3.e1, [a2, b2] = TL_R3.e2;
const MAPA_R3: Mapa = (() => {
  const m: [number, number][] = [[0, 0], [150, TL_R3.liq2[1] + 2], [165, a1]];   // construção × 1,75; 0,5 s antes do vale
  m.push(...bloco(165, a1, b1, 56, 40, LEIT, 14, 12));
  m.push(...bloco(m[m.length - 1][0], a2, b2, 56, 40, LEIT, 14, 12));
  m.push([m[m.length - 1][0] + 14, DUR_R3_2]);
  return m;
})();
export const DUR_R3V2 = duracaoMapa(MAPA_R3);

// ---------------------------------------------------------------- R4 lado a lado → marca
const SAIDA_R4 = 24, FUSAO_MARCA = 12, FUSAO_R3R4 = 10;
const R4v2 = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [DUR_R4L - SAIDA_R4, DUR_R4L], [1, 0], { ...cl, easing: (x) => x * x }) }}><R4LadoALado /></AbsoluteFill>;
};

export const FILME2 = (() => {
  const c1 = 0, c2 = DUR_C1, r1 = c2 + INICIO_PARTITURA, r2 = r1 + DUR_R1F - FUSAO, r3 = r2 + DUR_R2V2, r4 = r3 + DUR_R3V2 - FUSAO_R3R4;
  const marca = r4 + DUR_R4L - FUSAO_MARCA, cred = marca + DUR_MARCA;
  return { c1, c2, fechar: c2 + TL_FECHAR.clique, r1, r2, r3, r4, marca, cred, fim: cred + DUR_CREDITOS2 };
})();
export const DUR_FILME2 = FILME2.fim;
export const MAPAS_V2 = { R2: MAPA_R2, R3: MAPA_R3 };

export const FilmeV2 = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <Sequence name="Capítulo 1" from={FILME2.c1} durationInFrames={DUR_C1}>
      <Series>
        {CENAS_C1.map(({ nome, dur, el }) => <Series.Sequence key={nome} name={nome} durationInFrames={dur}>{el}</Series.Sequence>)}
      </Series>
    </Sequence>
    <Sequence name="R1 · Partitura" from={FILME2.r1} durationInFrames={DUR_R1F}><R1Rapida /></Sequence>
    <Sequence name="Capítulo 2" from={FILME2.c2} durationInFrames={DUR_CAP2F}><Capitulo2Filme /></Sequence>
    <Sequence name="R2 · despacho" from={FILME2.r2} durationInFrames={DUR_R2V2}><R2v2 /></Sequence>
    <Sequence name="R3 · carga líquida" from={FILME2.r3} durationInFrames={DUR_R3V2}><Remapear mapa={MAPA_R3}><R3CargaLiquida2 /></Remapear></Sequence>
    <Sequence name="Marca" from={FILME2.marca} durationInFrames={DUR_MARCA}><Marca /></Sequence>
    <Sequence name="R4 · sem × com bateria" from={FILME2.r4} durationInFrames={DUR_R4L}><R4v2 /></Sequence>
    <Sequence name="Créditos" from={FILME2.cred} durationInFrames={DUR_CREDITOS2}><Creditos2 /></Sequence>
  </AbsoluteFill>
);
