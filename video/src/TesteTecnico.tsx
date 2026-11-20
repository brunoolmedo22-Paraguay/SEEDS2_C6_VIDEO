// TESTE TÉCNICO do ambiente (não é protótipo de estilo nem cena do filme): fontes locais, texto digitado por frame e
// uma série GRAVADA (importação no PCC, C6-B) desenhada como degraus por intervalo [t_k, t_k+1), revelada da esquerda
// para a direita. Nenhum valor é alterado nem interpolado: a animação só controla QUANTO do desenho aparece.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import dados from "./dados/c6b.json";
import { COR, FONTE } from "./tema";

const TEXTO = "teste técnico · Remotion";

const Digitado = () => {
  const frame = useCurrentFrame();
  const n = Math.min(TEXTO.length, Math.floor(frame / 2));
  const cursorVisivel = n < TEXTO.length || Math.floor(frame / 10) % 2 === 0;
  return (
    <div style={{ fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 64, color: COR.tinta, letterSpacing: "-0.01em", whiteSpace: "pre" }}>
      {TEXTO.slice(0, n)}
      <span style={{ display: "inline-block", width: 3, height: 84, marginLeft: 6, verticalAlign: "middle", background: COR.tinta, opacity: cursorVisivel ? 1 : 0 }} />
    </div>
  );
};

const W = 1600, H = 420, MAX = 1_200_000; // eixo até o limite de importação do PCC declarado (1.200 MW)
const serie: number[] = dados.importacao_kW;
const x = (i: number) => (i / serie.length) * W;
const y = (v: number) => H - (v / MAX) * H;
// degrau por intervalo: horizontal em [t_i, t_i+1), vertical só na fronteira (sem rampas inventadas)
const degraus = serie.reduce((d, v, i) => d + (i === 0 ? `M0,${y(v).toFixed(2)}` : `V${y(v).toFixed(2)}`) + `H${x(i + 1).toFixed(2)}`, "");

const Serie = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revelado = interpolate(frame, [1 * fps, 3.5 * fps], [0, W], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) });
  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      <defs><clipPath id="rev"><rect x={0} y={-10} width={revelado} height={H + 20} /></clipPath></defs>
      {[0, 0.5, 1].map((f) => <line key={f} x1={0} x2={W} y1={y(f * MAX)} y2={y(f * MAX)} stroke={COR.linha} strokeWidth={1.5} />)}
      <path d={degraus} fill="none" stroke={COR.grid} strokeWidth={4} strokeLinejoin="round" clipPath="url(#rev)" />
    </svg>
  );
};

export const TesteTecnico = () => (
  <AbsoluteFill style={{ background: COR.fundo, alignItems: "center", justifyContent: "center", gap: 80 }}>
    <Digitado />
    <Serie />
    <div style={{ fontFamily: FONTE.texto, fontSize: 22, color: COR.tinta3 }}>importação no PCC · C6-B (rodada 4713c3e1) · dados gravados</div>
  </AbsoluteFill>
);
