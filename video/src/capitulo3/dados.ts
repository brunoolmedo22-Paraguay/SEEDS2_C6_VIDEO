// Séries GRAVADAS das rodadas oficiais (dados/c6a.json = C6-A 6f164853 sem BESS; dados/c6b.json = C6-B 4713c3e1 com BESS;
// gerados por ferramentas/preparar_dados.py a partir dos XLSX com os mesmos SHA-256 das vistas v2 dos PDFs oficiais).
// Tudo o que é DERIVADO aqui é soma, diferença, máximo ou índice — nunca interpolação, suavização ou valor inventado.
import A from "../dados/c6a.json";
import B from "../dados/c6b.json";

export const N = 96;
export const dem: number[] = B.demanda_kW;
export const fv: number[] = B.fv_aproveitada_kW;
export const fvPot: number[] = B.fv_potencial_kW;
export const impA: number[] = A.importacao_kW;
export const impB: number[] = B.importacao_kW;
export const pc: number[] = B.bess_carga_kW;
export const pd: number[] = B.bess_descarga_kW;
export const tar: number[] = B.tarifa_R_kWh;
export const cusB: number[] = B.custo_intervalo_R;
export const cusA: number[] = A.custo_intervalo_R;
export const eBat: number[] = B.bess_energia_fronteira_kWh;        // 97 fronteiras
export const socB: number[] = B.bess_soc_fronteira;                 // 97 fronteiras (fração)
export const liq: number[] = dem.map((d, i) => d - fv[i]);          // carga líquida (derivado; igual em A e B)

const soma = (a: number[]) => a.reduce((s, v) => s + v, 0);
export const energia = (a: number[]) => soma(a) * 0.25;             // kWh (Δ = 15 min)
export const custoA = soma(cusA), custoB = soma(cusB);              // conferidos contra os indicadores selados (doc)
export const acumB = cusB.reduce<number[]>((o, v, i) => (o.push((i ? o[i - 1] : 0) + v), o), []);

const faixa = (pred: (i: number) => boolean) => {
  const ids = Array.from({ length: N }, (_, i) => i).filter(pred);
  return [ids[0], ids[ids.length - 1] + 1] as const;                // [início, fim) em índices de intervalo
};
export const PONTA = faixa((i) => tar[i] === 1.5);                  // 18:00–21:00 (12 intervalos)
export const CARGA = faixa((i) => pc[i] > 1e-6);                    // 11:00–15:00 (último intervalo 14:45)
export const I_1930 = PONTA[0] + 6;                                 // 19:30, meio da ponta
export const iMax = (a: number[]) => a.indexOf(Math.max(...a));

// pt-BR sem o ICU do navegador de render
export const milhar = (n: number) => (n < 0 ? "−" : "") + String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const dec = (n: number, d: number) => {
  const [i, f] = Math.abs(n).toFixed(d).split(".");
  return (n < 0 ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (f ? "," + f : "");
};
export const reais = (n: number) => "R$ " + dec(n, 2);
export const MW = (kW: number) => milhar(kW / 1000);
export const hora = (i: number) => `${String((i / 4) | 0).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`;
