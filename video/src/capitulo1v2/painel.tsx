// Peças das composições do capítulo 1 v2. Um gráfico é desenhado numa CAIXA {x, y, w, h} em pixels do quadro: a mesma
// peça serve na composição (caixa pequena) e na ampliação (caixa grande), redesenhada no novo tamanho — o traço continua
// nítido e os valores continuam os gravados. Convenções da Partitura: degrau por intervalo [t_k, t_k+1); eixos a partir de zero.
import { interpolate } from "remotion";
import { N, cl, saida } from "../componentes/grafico";
import { COR, FONTE } from "../tema";

export type Caixa = { x: number; y: number; w: number; h: number };
export const mistura = (a: Caixa, b: Caixa, t: number): Caixa => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t });

/** Área de plotagem dentro da caixa (margem para rótulos do eixo Y à esquerda e do tempo embaixo). */
export const area = (c: Caixa, esq = 78, baixo = 40, topo = 8, dir = 12) => ({ L: c.x + esq, R: c.x + c.w - dir, T: c.y + topo, B: c.y + c.h - baixo });
export type Margens = { esq?: number; baixo?: number; topo?: number; dir?: number };
export const escalas = (c: Caixa, ymax: number, ymin = 0, m: Margens = {}) => {
  const a = area(c, m.esq ?? 78, m.baixo ?? 40, m.topo ?? 8, m.dir ?? 12);
  return { ...a, x: (i: number) => a.L + (i / N) * (a.R - a.L), y: (v: number) => a.B - ((v - ymin) / (ymax - ymin)) * (a.B - a.T) };
};
export const degrau = (s: number[], x: (i: number) => number, y: (v: number) => number) =>
  s.reduce((d, v, i) => d + (i === 0 ? `M${x(0)},${y(v)}` : `V${y(v)}`) + `H${x(i + 1)}`, "");

/** Grade horizontal com rótulos, eixo zero mais forte e horas embaixo (a cada `passoH` horas). */
export const Grade: React.FC<{ e: ReturnType<typeof escalas>; ticks: number[]; fmt: (v: number) => string; unidade: string; passoH?: number; op: number; fs?: number }> =
  ({ e, ticks, fmt, unidade, passoH = 6, op, fs = 21 }) => (
    <g opacity={op} fontFamily={FONTE.texto}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={e.L} x2={e.R} y1={e.y(v)} y2={e.y(v)} stroke={v === 0 ? "rgba(255,255,255,.28)" : COR.linha} strokeWidth={v === 0 ? 2 : 1.5} />
          <text x={e.L - 14} y={e.y(v) + fs * 0.35} textAnchor="end" fontSize={fs} fill={COR.tinta3}>{fmt(v)}</text>
        </g>
      ))}
      <text x={e.L - 14} y={e.T - 4} textAnchor="end" fontSize={fs - 2} fill={COR.tinta3}>{unidade}</text>
      {Array.from({ length: 24 / passoH + 1 }, (_, k) => k * passoH * 4).map((i) => (
        <text key={i} x={e.x(i)} y={e.B + fs + 10} textAnchor="middle" fontSize={fs} fill={COR.tinta3}>{String(i / 4).padStart(2, "0")}h</text>
      ))}
    </g>
  );

/** Rótulo de região (como os títulos de raia da Partitura): caixa-alta espaçada, discreto. */
export const Rotulo: React.FC<{ x: number; y: number; texto: string; cor?: string; op: number; anchor?: "start" | "middle" | "end"; fs?: number }> =
  ({ x, y, texto, cor = COR.tinta3, op, anchor = "start", fs = 19 }) => (
    <text x={x} y={y} textAnchor={anchor} fontFamily={FONTE.titulo} fontWeight={600} fontSize={fs} letterSpacing="0.12em" fill={cor} opacity={op}>{texto}</text>
  );

/** Revelação da esquerda para a direita (quadro → posição x da máscara). */
export const revelar = (f: number, ini: number, fim: number, L: number, R: number) =>
  interpolate(f, [ini, fim], [L, R], { ...cl, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
export const surgir = (f: number, ini: number, dur = 18) => interpolate(f, [ini, ini + dur], [0, 1], { ...cl, easing: saida });
export const fmtMW = (kW: number) => String(Math.round(kW / 1000)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const hora = (i: number) => `${String((i / 4) | 0).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`;
export { N };
