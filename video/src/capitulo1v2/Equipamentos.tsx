// COMPOSIÇÃO SOLAR + BATERIA — distribuição do slide 8 do `Presentation 19.pptx` (duas colunas: identificação em cima,
// conteúdo embaixo; regiões azuis não exibidas) e, em seguida, o PROTAGONISMO de cada recurso: a coluna se amplia
// (as peças são REDESENHADAS nas novas caixas, não escaladas como imagem) e ganha sua curva própria.
//   Solar: irradiância de entrada (GHI, amostra de 15 min usada no intervalo) → potência FV aproveitada gravada.
//   Bateria: janela de SOC declarada (20–90 %) → SOC nas fronteiras e potência no barramento gravados no ensaio C6-B.
// Dados: dados/clima.json (assets/dados, entrada do ensaio) e dados/c6b.json (rodada 4713c3e1). Valores declarados:
// 1.000.000 × 580 W = 580 MWp; BESS 1.003 MWh, 200 MW, SOC 20–90 %, η 95 % (XLSX «05 Estratégia V2» / «03 Equipamentos»).
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RITMO_RAPIDO, TituloQueSobe, momentoSubida } from "../componentes/CenaTitulada";
import { cl, dec, saida, suave } from "../componentes/grafico";
import B from "../dados/c6b.json";
import C from "../dados/clima.json";
import { COR, FONTE } from "../tema";
import { Cartao } from "./Cartao";
import { Caixa, Grade, N, Rotulo, degrau, escalas, fmtMW, hora, mistura, revelar, surgir } from "./painel";

export const TEXTO_EQ = "SOLAR E BATERIA";
const SOBE = momentoSubida(TEXTO_EQ, RITMO_RAPIDO);
const t0 = SOBE + 34;
export const TL_EQ = {
  cartoes: t0 + 2, ghi: [t0 + 20, t0 + 95], barra: [t0 + 24, t0 + 84], marcador: [t0 + 84, t0 + 104], info: t0 + 108, completo: t0 + 150,
  zsSobe: [t0 + 300, t0 + 340], fv: [t0 + 352, t0 + 427], fvNotas: t0 + 432, zsDesce: [t0 + 600, t0 + 634],
  zbSobe: [t0 + 650, t0 + 690], soc: [t0 + 700, t0 + 775], pot: [t0 + 782, t0 + 852], batNotas: t0 + 858,
} as const;
export const DUR_EQ = TL_EQ.batNotas + 40 + 135 + 16;     // notas + 4,5 s de exibição estável + saída
// v3 (capítulo 1 v3): SEM o protagonismo da bateria (SOC e potência realizados ficam para o capítulo de resultados).
// Depois da ampliação solar, a composição volta e permanece 2,5 s antes da saída. A solar mostra o POTENCIAL FV previsto
// (entrada do EMS: modelo físico sobre o clima previsto; idêntico ao aproveitado nesta rodada) e nenhum indicador de resultado.
export const DUR_EQ3 = TL_EQ.zsDesce[1] + 75 + 16;

const ghi: number[] = C.ghi_W_m2, fv: number[] = B.fv_aproveitada_kW, fvGravada: number[] = fv, fvPot: number[] = B.fv_potencial_kW, pc: number[] = B.bess_carga_kW, pd: number[] = B.bess_descarga_kW;
const soc: number[] = B.bess_soc_fronteira.map((s: number) => s * 100);
const iGhi = ghi.indexOf(Math.max(...ghi)), iFv = fv.indexOf(Math.max(...fv)), kSocMax = soc.indexOf(Math.max(...soc));
const E = (a: number[]) => a.reduce((s, v) => s + v, 0) * 0.25;   // kWh = Σ média de intervalo × 0,25 h
const mil = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ---------------------------------------------------------------- caixas: composição (2 colunas) × ampliações
const COMP = {
  sCartao: { x: 110, y: 130 }, bCartao: { x: 1030, y: 130 },
  ghi: { x: 92, y: 430, w: 800, h: 370 } as Caixa, sInfo: { x: 110, y: 860 },
  barra: { x: 1030, y: 450, w: 780, h: 270 } as Caixa, bInfo: { x: 1030, y: 860 },
};
const ZS = { ghi: { x: 92, y: 370, w: 1740, h: 290 } as Caixa, fv: { x: 92, y: 720, w: 1740, h: 290 } as Caixa, sInfo: { x: 960, y: 150 } };
const ZB = { barra: { x: 1000, y: 140, w: 830, h: 170 } as Caixa, soc: { x: 92, y: 400, w: 1740, h: 270 } as Caixa, pot: { x: 92, y: 730, w: 1740, h: 280 } as Caixa };

const Valor: React.FC<{ x: number; y: number; v: string; u: string; r: string; op: number; cor?: string }> = ({ x, y, v, u, r, op, cor = COR.tinta2 }) => (
  <g opacity={op} transform={`translate(${x}, ${y + (1 - op) * 8})`}>
    <text y={0} fontFamily={FONTE.titulo} fontWeight={600} fontSize={46} fill={COR.tinta}>{v}<tspan fontSize={26} fill={COR.tinta2}> {u}</tspan></text>
    <text y={36} fontFamily={FONTE.texto} fontSize={22} fill={cor}>{r}</text>
  </g>
);

// ---------------------------------------------------------------- SOLAR
const GraficoGHI: React.FC<{ c: Caixa; rev: number; op: number; nota: number }> = ({ c, rev, op, nota }) => {
  const e = escalas(c, 1200, 0, { esq: 80 });
  const r = e.L + (e.R - e.L) * rev;
  let area = `M${e.x(0)},${e.y(0)}`; ghi.forEach((v, i) => { area += `V${e.y(v)}H${e.x(i + 1)}`; }); area += `V${e.y(0)}Z`;
  return (
    <g>
      <defs><clipPath id={`ghi-${c.w | 0}`}><rect x={0} y={0} width={r} height={1080} /></clipPath></defs>
      <Rotulo x={c.x} y={c.y - 22} texto="IRRADIÂNCIA GLOBAL HORIZONTAL · FOZ DO IGUAÇU · 02/10" op={op} cor={COR.fv} />
      <Grade e={e} ticks={[0, 500, 1000]} fmt={(v) => mil(v)} unidade="W/m²" op={op} />
      <g clipPath={`url(#ghi-${c.w | 0})`}>
        <path d={area} fill={COR.fv} fillOpacity={0.16} />
        <path d={degrau(ghi, e.x, e.y)} fill="none" stroke={COR.fv} strokeWidth={3.5} />
      </g>
      <g opacity={nota}>
        <circle cx={(e.x(iGhi) + e.x(iGhi + 1)) / 2} cy={e.y(ghi[iGhi])} r={7} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
        <text x={(e.x(iGhi) + e.x(iGhi + 1)) / 2 + 16} y={e.y(ghi[iGhi]) - 4} fontFamily={FONTE.titulo} fontWeight={600} fontSize={26} fill={COR.tinta}>{mil(ghi[iGhi])} W/m² · {hora(iGhi)}</text>
      </g>
    </g>
  );
};

const GraficoFV: React.FC<{ c: Caixa; rev: number; op: number; nota: number; v3?: boolean }> = ({ c, rev, op, nota, v3 = false }) => {
  const fv = v3 ? fvPot : fvGravada;
  const e = escalas(c, 700_000, 0, { esq: 80 });
  const r = e.L + (e.R - e.L) * rev;
  let area = `M${e.x(0)},${e.y(0)}`; fv.forEach((v, i) => { area += `V${e.y(v)}H${e.x(i + 1)}`; }); area += `V${e.y(0)}Z`;
  return (
    <g>
      <defs><clipPath id="fv-rev"><rect x={0} y={0} width={r} height={1080} /></clipPath></defs>
      <Rotulo x={c.x} y={c.y - 22} texto={v3 ? "POTENCIAL FV PREVISTO · MODELO FÍSICO SOBRE O CLIMA DE ENTRADA" : "POTÊNCIA FV APROVEITADA · GRAVADA NO ENSAIO"} op={op} cor={COR.fv} />
      <Grade e={e} ticks={[0, 250_000, 500_000]} fmt={fmtMW} unidade="MW" op={op} />
      <g opacity={op}>
        <line x1={e.L} x2={e.R} y1={e.y(580_000)} y2={e.y(580_000)} stroke={COR.fv} strokeOpacity={0.7} strokeWidth={2} strokeDasharray="10 8" />
        <text x={e.R} y={e.y(580_000) - 10} textAnchor="end" fontFamily={FONTE.texto} fontSize={22} fill={COR.fv}>580 MWp instalados</text>
      </g>
      <g clipPath="url(#fv-rev)">
        <path d={area} fill={COR.fv} fillOpacity={0.85} />
      </g>
      <g opacity={nota}>
        <circle cx={(e.x(iFv) + e.x(iFv + 1)) / 2} cy={e.y(fv[iFv])} r={7} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
        <text x={(e.x(iFv) + e.x(iFv + 1)) / 2 + 16} y={e.y(fv[iFv]) + 30} fontFamily={FONTE.titulo} fontWeight={600} fontSize={26} fill={COR.tinta}>pico {fmtMW(fv[iFv])} MW · {hora(iFv)}</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- BATERIA
const BarraSOC: React.FC<{ c: Caixa; enche: number; zonas: number; marcador: number; op: number }> = ({ c, enche, zonas, marcador, op }) => {
  const h = Math.min(56, c.h * 0.34), y = c.y + c.h * 0.42, x = (p: number) => c.x + (p / 100) * c.w;
  return (
    <g opacity={op}>
      <Rotulo x={c.x} y={c.y - 22 + (c.h > 200 ? 0 : 10)} texto="ESTADO DE CARGA · LIMITES DECLARADOS" op={1} cor={COR.bat} />
      <rect x={c.x} y={y} width={c.w * enche} height={h} rx={10} fill={COR.bat} fillOpacity={0.12} />
      <rect x={x(20)} y={y} width={(x(90) - x(20)) * zonas} height={h} fill={COR.bat} fillOpacity={0.75} />
      <rect x={c.x} y={y} width={c.w} height={h} rx={10} fill="none" stroke={COR.bat} strokeOpacity={0.5 * enche} strokeWidth={2} />
      {/* SOC e a energia correspondente (1.003 MWh × fração; derivado da capacidade declarada) */}
      {[0, 20, 90].map((p) => (
        <g key={p} opacity={zonas}>
          <text x={x(p)} y={y + h + 32} textAnchor={p === 0 ? "start" : "middle"} fontFamily={FONTE.texto} fontSize={22} fill={COR.tinta2}>{p} %</text>
          {c.h > 200 && p > 0 && <text x={x(p)} y={y + h + 62} textAnchor="middle" fontFamily={FONTE.texto} fontSize={20} fill={COR.tinta3}>{dec(1003 * p / 100, 1)} MWh</text>}
        </g>
      ))}
      <text x={(x(20) + x(90)) / 2} y={y + h / 2 + 9} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={24} fill={COR.fundo} opacity={zonas}>janela operativa 20–90 %</text>
      {/* marcador do SOC inicial declarado (20 %) */}
      <g opacity={marcador} transform={`translate(${x(20 * marcador)}, ${y - 14})`}>
        <path d="M-9,-14 L9,-14 L0,0 Z" fill={COR.tinta} />
        <text y={-24} textAnchor="middle" fontFamily={FONTE.texto} fontSize={22} fill={COR.tinta}>SOC inicial 20 %</text>
      </g>
    </g>
  );
};

const GraficoSOC: React.FC<{ c: Caixa; rev: number; op: number; nota: number }> = ({ c, rev, op, nota }) => {
  const e = escalas(c, 100, 0, { esq: 80 });
  const xf = (k: number) => e.L + (k / N) * (e.R - e.L);               // fronteiras: pontos em t_k (N + 1 = 97)
  const r = e.L + (e.R - e.L) * rev;
  const pts = soc.map((s, k) => `${xf(k)},${e.y(s)}`).join(" ");
  return (
    <g>
      <defs><clipPath id="soc-rev"><rect x={0} y={0} width={r + 4} height={1080} /></clipPath></defs>
      <Rotulo x={c.x} y={c.y - 22} texto="ESTADO DE CARGA NAS FRONTEIRAS · ENSAIO C6-B (COM BESS)" op={op} cor={COR.bat} />
      <Grade e={e} ticks={[0, 20, 90]} fmt={(v) => `${v} %`} unidade="SOC" op={op} />
      <g clipPath="url(#soc-rev)">
        <polyline points={pts} fill="none" stroke={COR.bat} strokeWidth={3.5} strokeLinejoin="round" />
        {soc.map((s, k) => (k % 4 === 0 ? <circle key={k} cx={xf(k)} cy={e.y(s)} r={4} fill={COR.bat} /> : null))}
      </g>
      <g opacity={nota}>
        <circle cx={xf(kSocMax)} cy={e.y(soc[kSocMax])} r={8} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
        <text x={xf(kSocMax) + 16} y={e.y(soc[kSocMax]) + 34} fontFamily={FONTE.titulo} fontWeight={600} fontSize={26} fill={COR.tinta}>
          {Math.round(soc[kSocMax])} % · {hora(kSocMax)}
        </text>
      </g>
    </g>
  );
};

const GraficoPotBat: React.FC<{ c: Caixa; rev: number; op: number; nota: number }> = ({ c, rev, op, nota }) => {
  const e = escalas(c, 260_000, -260_000, { esq: 80 });
  const r = e.L + (e.R - e.L) * rev;
  const zero = e.y(0);
  return (
    <g>
      <defs>
        <clipPath id="pot-rev"><rect x={0} y={0} width={r} height={1080} /></clipPath>
        <pattern id="eq-hach" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={10} height={10} fill={COR.fundo} /><rect width={4.8} height={10} fill={COR.bat} />
        </pattern>
      </defs>
      <Rotulo x={c.x} y={c.y - 22} texto="POTÊNCIA NO BARRAMENTO · DESCARGA (+) · CARGA (−) · ENSAIO C6-B" op={op} cor={COR.bat} />
      <Grade e={e} ticks={[-200_000, 0, 200_000]} fmt={(v) => (v < 0 ? "−" : "") + fmtMW(Math.abs(v))} unidade="MW" op={op} />
      <g clipPath="url(#pot-rev)">
        {pd.map((d, i) => (d > 1 ? <rect key={`d${i}`} x={e.x(i) + 1} y={e.y(d)} width={e.x(i + 1) - e.x(i) - 2} height={zero - e.y(d)} fill={COR.bat} /> : null))}
        {pc.map((q, i) => (q > 1 ? <rect key={`c${i}`} x={e.x(i) + 1} y={zero} width={e.x(i + 1) - e.x(i) - 2} height={e.y(-q) - zero} fill="url(#eq-hach)" /> : null))}
      </g>
      <g opacity={nota} fontFamily={FONTE.titulo} fontWeight={600} fontSize={26} fill={COR.tinta}>
        <text x={e.x(43) - 16} y={e.y(-110_000)} textAnchor="end">carga {mil(E(pc) / 1000)} MWh · 11:00–14:45</text>
        <text x={e.x(72)} y={e.y(200_000) - 16}>descarga {mil(E(pd) / 1000)} MWh · 600 na ponta</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- cena
export const Equipamentos: React.FC<{ versao?: 2 | 3 }> = ({ versao = 2 }) => {
  const v3 = versao === 3, DUR = v3 ? DUR_EQ3 : DUR_EQ;
  const f = useCurrentFrame();
  const T = TL_EQ;
  const zs = interpolate(f, [T.zsSobe[0], T.zsSobe[1], T.zsDesce[0], T.zsDesce[1]], [0, 1, 1, 0], { ...cl, easing: suave });
  const zb = v3 ? 0 : interpolate(f, [T.zbSobe[0], T.zbSobe[1]], [0, 1], { ...cl, easing: suave });
  const cartoes = surgir(f, T.cartoes);
  const ghiRev = interpolate(f, T.ghi, [0, 1], { ...cl, easing: suave });
  const enche = interpolate(f, [T.barra[0], T.barra[0] + 30], [0, 1], { ...cl, easing: saida });
  const zonas = interpolate(f, [T.barra[0] + 26, T.barra[1]], [0, 1], { ...cl, easing: saida });
  const marc = interpolate(f, T.marcador, [0, 1], { ...cl, easing: saida });
  const info = (k: number) => surgir(f, T.info + k * 12);
  const sai = interpolate(f, [DUR - 16, DUR], [1, 0], cl);
  // presença de cada coluna: a outra sai de cena durante a ampliação
  const solarVis = 1 - zb, batVis = 1 - zs;
  const sInfoPos = { x: COMP.sInfo.x + (ZS.sInfo.x - COMP.sInfo.x) * zs, y: COMP.sInfo.y + (ZS.sInfo.y - COMP.sInfo.y) * zs };
  const ghiCaixa = mistura(COMP.ghi, ZS.ghi, zs);
  const barraCaixa = mistura(COMP.barra, ZB.barra, zb);
  const bCartaoX = COMP.bCartao.x + (110 - COMP.bCartao.x) * zb;
  const fvRev = interpolate(f, T.fv, [0, 1], { ...cl, easing: suave }), socRev = interpolate(f, T.soc, [0, 1], { ...cl, easing: suave });
  const potRev = interpolate(f, T.pot, [0, 1], { ...cl, easing: suave });
  const fvOp = Math.min(surgir(f, T.fv[0] - 12), zs > 0 ? 1 : 0) * Math.min(1, zs * 1.5);
  const notaFv = surgir(f, T.fvNotas) * Math.min(1, zs * 1.5);
  return (
    <AbsoluteFill style={{ background: COR.fundo }}>
      <AbsoluteFill style={{ opacity: sai }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* coluna SOLAR */}
          <g opacity={solarVis} transform={`translate(${-120 * zb}, 0)`}>
            <Cartao x={COMP.sCartao.x} y={COMP.sCartao.y} tipo="fv" cor={COR.fv} rotulo="SOLAR FOTOVOLTAICA" nome="Usina FV C6"
              valor="580 MWp" sub="1.000.000 módulos de 580 W · 20 × 50.000" op={cartoes} desloc={(1 - cartoes) * -14} />
            <GraficoGHI c={ghiCaixa} rev={ghiRev} op={surgir(f, T.ghi[0] - 14)} nota={surgir(f, T.info)} />
            <g>
              <Valor x={sInfoPos.x} y={sInfoPos.y + 40} v={fmtMW((v3 ? fvPot : fv)[iFv])} u="MW" r={v3 ? `pico do potencial · ${hora(iFv)}` : `pico FV aproveitado · ${hora(iFv)}`} op={info(0)} />
              <Valor x={sInfoPos.x + 320} y={sInfoPos.y + 40} v={mil(E(v3 ? fvPot : fv) / 1000)} u="MWh" r={v3 ? "potencial FV no dia" : "energia FV no dia · vertimento 0"} op={info(1)} />
            </g>
            {zs > 0 && <GraficoFV c={ZS.fv} rev={fvRev} op={fvOp} nota={notaFv} v3={v3} />}
          </g>
          {/* coluna BATERIA */}
          <g opacity={batVis} transform={`translate(${120 * zs}, 0)`}>
            <Cartao x={bCartaoX} y={COMP.bCartao.y} tipo="bat" cor={COR.bat} rotulo="BATERIA · BESS" nome="Banco equivalente C6"
              valor="1.003 MWh" sub="200 MW de potência operativa · η 95 %" op={cartoes} desloc={(1 - cartoes) * 14} />
            <BarraSOC c={barraCaixa} enche={enche} zonas={zonas} marcador={marc} op={surgir(f, T.barra[0] - 10)} />
            <g opacity={1 - zb}>
              {v3 ? (<>
                <Valor x={COMP.bInfo.x} y={COMP.bInfo.y + 40} v="200" u="MW" r="carga e descarga máximas" op={info(2)} />
                <Valor x={COMP.bInfo.x + 400} y={COMP.bInfo.y + 40} v="95" u="%" r="eficiência de carga e de descarga" op={info(3)} />
              </>) : (<>
                <Valor x={COMP.bInfo.x} y={COMP.bInfo.y + 40} v="702" u="MWh" r="energia na janela 20–90 % (derivado)" op={info(2)} />
                <Valor x={COMP.bInfo.x + 400} y={COMP.bInfo.y + 40} v="200" u="MW" r="carga e descarga máximas" op={info(3)} />
              </>)}
            </g>
            {zb > 0 && (
              <g opacity={Math.min(1, zb * 1.5)}>
                <GraficoSOC c={ZB.soc} rev={socRev} op={surgir(f, T.soc[0] - 12)} nota={surgir(f, T.batNotas)} />
                <GraficoPotBat c={ZB.pot} rev={potRev} op={surgir(f, T.pot[0] - 12)} nota={surgir(f, T.batNotas + 14)} />
              </g>
            )}
          </g>
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center", fontFamily: FONTE.texto, fontSize: 20, color: COR.tinta3,
          opacity: surgir(f, T.info + 30) }}>
          {zb > 0.5 ? "SOC e potência gravados na rodada C6-B (4713c3e1) · simulação algébrica offline"
            : zs > 0.5 ? (v3 ? "GHI de entrada (amostra de 15 min usada no intervalo) · potencial FV previsto pelo modelo físico · ensaio offline"
              : "GHI de entrada (amostra de 15 min usada no intervalo) · potência FV gravada na rodada · ensaio offline")
              : "configuração validada do ensaio C6 · clima de entrada de 02/10 · simulação algébrica offline"}
        </div>
        <TituloQueSobe texto={TEXTO_EQ} tamanho={112} ritmo={RITMO_RAPIDO} sobe={SOBE} escalaFinal={0.4} alturaFinal={58} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
