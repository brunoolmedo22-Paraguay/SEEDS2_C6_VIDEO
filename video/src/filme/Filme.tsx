// FILME SEEDS · MONTAGEM INTEGRAL v1 — capítulos 1, 2 e 3 numa ÚNICA linha do tempo do Remotion (não é concatenação de MP4s),
// com os cortes aprovados pelo responsável depois de assistir aos três capítulos. Reutiliza os componentes aprovados; os
// capítulos isolados (Capitulo1v3, Capitulo2, Capitulo3v2) e seus MP4s ficam intactos.
//   1. Capítulo 1 = capítulo 1 v3 até a composição completa SOLAR E BATERIA (lado a lado, irradiância e parâmetros
//      declarados) + ≈ 2 s de exibição e saída suave. A ampliação solar (FV) NÃO entra: o corte é anterior a TL_EQ.zsSobe.
//   2. Capítulo 2 = filme/Capitulo2Filme.tsx: mesmo quadro e cards, leitura ≈ 1 s, cursor rápido, missão mais rápida e
//      desfecho no próprio modal (100 % → Concluída → FECHAR → o cartão fecha). Mini-diagrama de execução inalterado.
//   3. A cena «SIMULAÇÃO CONCLUÍDA» (R0) sai: a Partitura começa a se montar SOB o cartão que fecha (dissolução).
//   4. R1 (Partitura) acelerada por REMAPEAMENTO DO TEMPO (Freeze com quadro fracionário): o MESMO componente R1Partitura2,
//      construção ≈ 2,8 s, ≈ 1 s de leitura, ampliação ≈ 1,5 s até a geometria da R2. Nada é redesenhado nem retirado.
//   5. R2 (despacho + Solar · Rede · Bateria), R3 (carga líquida) e R4 (sem × com bateria, sobreposição, PEAK SHAVING) iguais
//      ao capítulo 3 v2. A R4 é CORTADA antes do fechamento isolado (TL_R4.fecha): o PEAK SHAVING sobre o gráfico é o clímax e
//      a cena dissolve diretamente na marca.
//   6. Marca «SIMULADO NO SEEDS» + frase MILP–MPC e créditos institucionais (seis logotipos) iguais ao capítulo 3 v2.
// Dados: os mesmos JSON das rodadas oficiais C6-A 6f164853 e C6-B 4713c3e1 (nenhum valor nem trajetória alterados).
import { AbsoluteFill, Freeze, Sequence, Series, interpolate, useCurrentFrame } from "remotion";
import { CENAS_CAP1V2 } from "../capitulo1v2/Capitulo1v2";
import { Equipamentos, TL_EQ } from "../capitulo1v2/Equipamentos";
import { DUR_R2_2, R2 } from "../capitulo3v2/Capitulo3v2";
import { DUR_R1_2, R1Partitura2, TL_R1 } from "../capitulo3v2/R1Partitura2";
import { DUR_R3_2, R3CargaLiquida2 } from "../capitulo3v2/R3CargaLiquida2";
import { R4Comparacao2, TL_R4 } from "../capitulo3v2/R4Comparacao2";
import { DUR_MARCA, Marca } from "../capitulo3v2/Marca";
import { Creditos, DUR_CREDITOS } from "../capitulo3v2/Creditos";
import { cl } from "../componentes/grafico";
import { COR } from "../tema";
import { Capitulo2Filme, DUR_CAP2F, INICIO_PARTITURA, TL_FECHAR } from "./Capitulo2Filme";

// ---------------------------------------------------------------- 1 · corte do capítulo 1 (composição SOLAR E BATERIA)
const SAIDA_EQ = 18;
export const CORTE_EQ = TL_EQ.completo + 60 + SAIDA_EQ;    // completa em TL_EQ.completo · ≈ 2 s estável · saída de 0,6 s
if (CORTE_EQ > TL_EQ.zsSobe[0]) throw new Error("o corte do capítulo 1 precisa ser anterior à ampliação solar");
const EquipCorte = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: COR.fundo }}>
      <AbsoluteFill style={{ opacity: interpolate(f, [CORTE_EQ - SAIDA_EQ, CORTE_EQ], [1, 0], cl) }}><Equipamentos versao={3} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const CENAS_C1 = [...CENAS_CAP1V2.slice(0, 4), { nome: "Solar + bateria (composição conjunta)", dur: CORTE_EQ, el: <EquipCorte /> }];
export const DUR_C1 = CENAS_C1.reduce((s, c) => s + c.dur, 0);

// ---------------------------------------------------------------- 4 · R1 com o tempo remapeado (mesmo componente)
// pares [quadro de saída, quadro da R1 v2]; interpolação linear entre eles
const BUILD_FIM = TL_R1.varre[1] + 1;                        // 141: tudo montado (raias, inspetor, estado, varredura do cursor)
const MAPA_R1: [number, number][] = [
  [0, 0], [85, BUILD_FIM],                                   // construção paralela em ≈ 2,8 s (× 1,66)
  [115, TL_R1.zoom[0]],                                      // ≈ 1 s de leitura (trecho estável da v2 percorrido)
  [160, TL_R1.zoom[1]],                                      // ampliação da raia Atendimento em 1,5 s (× 1,47)
  [160 + (DUR_R1_2 - TL_R1.zoom[1]), DUR_R1_2],              // mesma cauda da v2 (fusão com a R2)
];
export const DUR_R1F = MAPA_R1[MAPA_R1.length - 1][0];
export const R1Rapida = () => {
  const f = useCurrentFrame();
  const src = interpolate(f, MAPA_R1.map((p) => p[0]), MAPA_R1.map((p) => p[1]), cl);
  return <Freeze frame={src}><R1Partitura2 /></Freeze>;
};

// ---------------------------------------------------------------- 5–6 · R4 sem o fechamento isolado → marca
const CORTE_R4 = TL_R4.fecha, SAIDA_R4 = 28, FUSAO_MARCA = 12;
const R4Corte = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [CORTE_R4 - SAIDA_R4, CORTE_R4], [1, 0], { ...cl, easing: (x) => x * x }) }}><R4Comparacao2 /></AbsoluteFill>;
};

// ---------------------------------------------------------------- linha do tempo do filme
const FUSAO_R2 = 14;                                          // igual ao capítulo 3 v2
export const FILME = (() => {
  const c1 = 0, c2 = DUR_C1, r1 = c2 + INICIO_PARTITURA, r2 = r1 + DUR_R1F - FUSAO_R2, r3 = r2 + DUR_R2_2, r4 = r3 + DUR_R3_2;
  const marca = r4 + CORTE_R4 - FUSAO_MARCA, cred = marca + DUR_MARCA;
  return { c1, c2, fechar: c2 + TL_FECHAR.clique, r1, r2, r3, r4, marca, cred, fim: cred + DUR_CREDITOS };
})();
export const DUR_FILME = FILME.fim;

export const Filme = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <Sequence name="Capítulo 1" from={FILME.c1} durationInFrames={DUR_C1}>
      <Series>
        {CENAS_C1.map(({ nome, dur, el }) => <Series.Sequence key={nome} name={nome} durationInFrames={dur}>{el}</Series.Sequence>)}
      </Series>
    </Sequence>
    {/* capítulo 3 por baixo do capítulo 2 durante a dissolução do cartão de execução */}
    <Sequence name="R1 · Partitura" from={FILME.r1} durationInFrames={DUR_R1F}><R1Rapida /></Sequence>
    <Sequence name="Capítulo 2" from={FILME.c2} durationInFrames={DUR_CAP2F}><Capitulo2Filme /></Sequence>
    <Sequence name="R2 · despacho" from={FILME.r2} durationInFrames={DUR_R2_2}><R2 /></Sequence>
    <Sequence name="R3 · carga líquida" from={FILME.r3} durationInFrames={DUR_R3_2}><R3CargaLiquida2 /></Sequence>
    <Sequence name="Marca" from={FILME.marca} durationInFrames={DUR_MARCA}><Marca /></Sequence>
    <Sequence name="R4 · sem × com bateria" from={FILME.r4} durationInFrames={CORTE_R4}><R4Corte /></Sequence>
    <Sequence name="Créditos" from={FILME.cred} durationInFrames={DUR_CREDITOS}><Creditos /></Sequence>
  </AbsoluteFill>
);
