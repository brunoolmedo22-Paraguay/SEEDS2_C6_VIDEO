// Utilitários dos gráficos do capítulo 1 (mesmas convenções da prova v1, sem alterar seus arquivos):
// eixo do tempo = 96 intervalos de 15 min; grandeza de intervalo desenhada em DEGRAU [t_k, t_k+1).
import { Easing } from "remotion";

export const N = 96;
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const suave = Easing.bezier(0.33, 0, 0.2, 1);
export const saida = Easing.bezier(0.16, 1, 0.3, 1);

export type Quadro = { L: number; R: number; T: number; B: number; ymax: number };
export const escala = (q: Quadro) => ({
  x: (i: number) => q.L + (i / N) * (q.R - q.L),
  y: (v: number) => q.B - (v / q.ymax) * (q.B - q.T),
});
/** Caminho em degraus: horizontal em cada intervalo, vertical só nas fronteiras (sem rampas inventadas). */
export const degraus = (s: number[], x: (i: number) => number, y: (v: number) => number) =>
  s.reduce((d, v, i) => d + (i === 0 ? `M${x(0)},${y(v)}` : `V${y(v)}`) + `H${x(i + 1)}`, "");
/** Faixa entre duas séries em degrau (topo = a, base = b), como a faixa renovável da Partitura. */
export const faixaEntre = (a: number[], b: number[], x: (i: number) => number, y: (v: number) => number) => {
  let d = `M${x(0)},${y(a[0])}`;
  a.forEach((v, i) => { d += `V${y(v)}H${x(i + 1)}`; });
  for (let i = N - 1; i >= 0; i--) d += `V${y(b[i])}H${x(i)}`;
  return d + "Z";
};
// pt-BR sem depender do ICU do navegador de render: milhar com ponto, decimal com vírgula
export const milhar = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const dec = (n: number, d: number) => n.toFixed(d).replace(".", ",");
export const hh = (i: number) => `${String((i / 4) | 0).padStart(2, "0")}h`;
