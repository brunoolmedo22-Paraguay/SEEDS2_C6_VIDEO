// FILME SEEDS · v4 — o filme v3 COMPLETO (filme/FilmeV3.tsx, intacto) com:
//   1. ACELERAÇÃO GLOBAL 1,5× por remapeamento temporal: o quadro de saída f mostra o filme v3 no instante 1,5·f (quadros
//      fracionários, sem pular cenas nem quadros de dados). Títulos, gráficos, execução, cursor, transições e pausas aceleram
//      juntos, na mesma proporção; duração = duração do v3 / 1,5. As séries continuam com 96 intervalos de 15 min.
//      Implementação: as MESMAS camadas do v3 (mesma ordem, mesmos inícios e durações), cada uma com UM ÚNICO <Freeze> no seu
//      quadro local de origem (1,5·f − início), composto com o mapa de tempo interno da cena quando existe (R1, R2, R3). Um
//      <Freeze> global por fora dos <Freeze> internos não é usado: o aninhamento não se compõe corretamente (verificado).
//   2. RODAPÉ INSTITUCIONAL GLOBAL (filme/RodapeInstitucional.tsx) em todas as cenas: o quadro é reduzido UNIFORMEMENTE
//      (1008/1080, ancorado no topo, centrado) para liberar uma faixa inferior de 72 px — nenhum texto, eixo, horário ou nota
//      é coberto. No fechamento unificado (que já mostra as seis marcas grandes) o rodapé sai, para não duplicar.
// `rodape={false}` + `escala={1}` = só o tempo (composição de conferência FilmeSEEDSv4SoTempo).
import { AbsoluteFill, Freeze, Series, interpolate, useCurrentFrame } from "remotion";
import { cl } from "../componentes/grafico";
import { COR } from "../tema";
import { ResultadosDespacho } from "../resultados/Despacho";
import { R1Partitura2 } from "../capitulo3v2/R1Partitura2";
import { R3CargaLiquida2 } from "../capitulo3v2/R3CargaLiquida2";
import { MAPA_R1, DUR_R1F } from "./Filme";
import { Capitulo2Filme, DUR_CAP2F } from "./Capitulo2Filme";
import { DUR_R2V2, DUR_R3V2, MAPAS_V2, R4v2 } from "./FilmeV2";
import { DUR_R4L } from "./R4LadoALado";
import { Cierre, DUR_CIERRE } from "./Cierre";
import { CENAS_C1_V3, DUR_C1_V3, DUR_FILME3, FILME3 } from "./FilmeV3";
import { FAIXA_RODAPE, RodapeInstitucional } from "./RodapeInstitucional";
import { Mapa } from "./tempo";

export const VELOCIDADE = 1.5;
export const DUR_FILME4 = Math.ceil(DUR_FILME3 / VELOCIDADE);
export const ESCALA_CONTEUDO = (1080 - FAIXA_RODAPE) / 1080;
const FUSAO_R2 = 14;                                            // = filme v2/v3
const aplica = (m: Mapa, t: number) => interpolate(t, m.map((p) => p[0]), m.map((p) => p[1]), cl);

/** Uma camada do v3: visível em [início, início + duração) do tempo de ORIGEM; congelada no quadro local mapeado. */
const Camada: React.FC<{ src: number; inicio: number; dur: number; mapa?: Mapa; children: React.ReactNode }> = ({ src, inicio, dur, mapa, children }) => {
  const t = src - inicio;
  if (t < 0 || t >= dur) return null;
  return <Freeze frame={mapa ? aplica(mapa, t) : t}>{children}</Freeze>;
};

const Capitulo1 = () => (
  <Series>
    {CENAS_C1_V3.map(({ nome, dur, el }) => <Series.Sequence key={nome} name={nome} durationInFrames={dur}>{el}</Series.Sequence>)}
  </Series>
);

// `corRodape` (opcional): filme v5 = v4 com a faixa do rodapé em cinza escuro (CINZA_RODAPE_ESCURO); padrão = v4.
export const FilmeV4: React.FC<{ rodape?: boolean; escala?: number; corRodape?: string }> = ({ rodape = true, escala = ESCALA_CONTEUDO, corRodape }) => {
  const f = useCurrentFrame();
  const src = Math.min(f * VELOCIDADE, DUR_FILME3 - 1);
  const F = FILME3;
  const opR2 = interpolate(src - F.r2, [0, FUSAO_R2], [0, 1], cl);
  // rodapé: entra com a abertura; sai durante a dissolução R4 → fechamento unificado
  const op = interpolate(src, [8, 32, F.cierre - 12, F.cierre + 12], [0, 1, 1, 0], cl);
  return (
    <AbsoluteFill style={{ background: COR.fundo }}>
      <AbsoluteFill style={{ transform: escala === 1 ? undefined : `scale(${escala})`, transformOrigin: "50% 0%" }}>
        {/* mesma ordem de camadas do filme v3 */}
        <Camada src={src} inicio={F.c1} dur={DUR_C1_V3}><Capitulo1 /></Camada>
        <Camada src={src} inicio={F.r1} dur={DUR_R1F} mapa={MAPA_R1}><R1Partitura2 /></Camada>
        <Camada src={src} inicio={F.c2} dur={DUR_CAP2F}><Capitulo2Filme /></Camada>
        <AbsoluteFill style={{ opacity: opR2 }}>
          <Camada src={src} inicio={F.r2} dur={DUR_R2V2} mapa={MAPAS_V2.R2}><ResultadosDespacho ritmo={0.85} /></Camada>
        </AbsoluteFill>
        <Camada src={src} inicio={F.r3} dur={DUR_R3V2} mapa={MAPAS_V2.R3}><R3CargaLiquida2 /></Camada>
        <Camada src={src} inicio={F.cierre} dur={DUR_CIERRE}><Cierre /></Camada>
        <Camada src={src} inicio={F.r4} dur={DUR_R4L}><R4v2 /></Camada>
      </AbsoluteFill>
      {rodape && op > 0 && <RodapeInstitucional opacidade={op} cor={corRodape} />}
    </AbsoluteFill>
  );
};
