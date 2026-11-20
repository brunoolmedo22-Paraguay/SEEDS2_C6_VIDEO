// Raia «Atendimento · injeção por recurso × demanda realizada» da Partitura (lente Operação), desenhada numa geometria
// PARAMETRIZADA: a mesma peça serve na Partitura montada (R1) e, ao ampliar, termina EXATAMENTE na geometria do gráfico
// superior do protótipo aprovado da R2 (resultados/Despacho.tsx: caixa {92,150,1740,430}, margens 96/24/8/40, escala
// −260.000…1.250.000 kW; barras x(i)+1,5 com largura cw−3, rx 2; demanda em degrau). Assim o corte R1 → R2 não salta.
import { N, dem, fv, impB, pc, pd } from "./dados";
import { COR } from "../tema";

export type Geo = { L: number; R: number; T: number; B: number; ymin: number; ymax: number };
export const GEO_R2: Geo = { L: 92 + 96, R: 92 + 1740 - 24, T: 150 + 8, B: 150 + 430 - 40, ymin: -260_000, ymax: 1_250_000 };
export const misturaGeo = (a: Geo, b: Geo, t: number): Geo =>
  ({ L: a.L + (b.L - a.L) * t, R: a.R + (b.R - a.R) * t, T: a.T + (b.T - a.T) * t, B: a.B + (b.B - a.B) * t, ymin: a.ymin + (b.ymin - a.ymin) * t, ymax: a.ymax + (b.ymax - a.ymax) * t });
export const fx = (g: Geo) => (i: number) => g.L + (i / N) * (g.R - g.L);
export const fy = (g: Geo) => (v: number) => g.B - ((v - g.ymin) / (g.ymax - g.ymin)) * (g.B - g.T);

/** `cresce(i)` ∈ [0,1] = altura relativa da barra i (construção); `rev` = x até onde a linha da demanda está revelada. */
export const Atendimento: React.FC<{ g: Geo; cresce: (i: number) => number; rev: number; hach: number; linha: number; id: string }> = ({ g, cresce, rev, hach, linha, id }) => {
  const x = fx(g), y = fy(g), cw = x(1) - x(0), zero = y(0);
  let d = "";
  dem.forEach((v, i) => { d += (i === 0 ? `M${x(0)},${y(v)}` : `V${y(v)}`) + `H${x(i + 1)}`; });
  return (
    <g>
      <defs>
        <pattern id={`${id}-h`} width={hach} height={hach} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={hach * 0.48} height={hach} fill={COR.bat} />
        </pattern>
        <clipPath id={`${id}-d`}><rect x={0} y={0} width={rev} height={1080} /></clipPath>
      </defs>
      {Array.from({ length: N }, (_, i) => {
        const k = cresce(i); if (k <= 0) return null;
        const xx = x(i) + 1.5, w = cw - 3, g0 = impB[i];
        const yg = y(g0 * k), yf = y((g0 + fv[i]) * k), yb = y((g0 + fv[i] + pd[i]) * k);
        return (
          <g key={i}>
            <rect x={xx} y={yg} width={w} height={zero - yg} rx={2} fill={COR.grid} />
            {fv[i] > 1 && <rect x={xx} y={yf} width={w} height={yg - yf} rx={2} fill={COR.fv} />}
            {pd[i] > 1 && <rect x={xx} y={yb} width={w} height={yf - yb} rx={2} fill={COR.bat} />}
            {pc[i] > 1 && <rect x={xx} y={zero} width={w} height={y(-pc[i] * k) - zero} rx={2} fill={`url(#${id}-h)`} />}
          </g>
        );
      })}
      <path d={d} fill="none" stroke={COR.tinta} strokeWidth={linha} clipPath={`url(#${id}-d)`} />
    </g>
  );
};
