// PROTÓTIPO · RESULTADOS — DESPACHO COMPLETO COM DESTAQUE POR RECURSO (rodada oficial C6-B 4713c3e1; dados/c6b.json).
// Gráfico superior = raia «Atendimento · injeção por recurso × demanda realizada» da Partitura (lente Operação; pilha
// rede → solar → bateria, carga da bateria hachurada abaixo de zero, demanda em linha). Gráfico inferior = APOIO do recurso
// em destaque, no MESMO eixo de tempo (as faixas verticais atravessam os dois gráficos):
//   Solar → potência FV aproveitada · Rede → tarifa de decisão (degrau) · Bateria → SOC nas fronteiras.
// As barras crescem a partir de zero e terminam exatamente nos valores gravados; o destaque só muda opacidade (como o foco
// da legenda da Partitura). Nenhum valor é interpolado entre intervalos.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cl, dec, saida } from "../componentes/grafico";
import B from "../dados/c6b.json";
import { COR, FONTE } from "../tema";
import { Grade, N, Rotulo, degrau, escalas, fmtMW, hora, revelar, surgir } from "../capitulo1v2/painel";

const imp: number[] = B.importacao_kW, fv: number[] = B.fv_aproveitada_kW, pd: number[] = B.bess_descarga_kW, pc: number[] = B.bess_carga_kW;
const dem: number[] = B.demanda_kW, tar: number[] = B.tarifa_R_kWh, soc: number[] = B.bess_soc_fronteira.map((s: number) => s * 100);
const E = (a: number[]) => a.reduce((s, v) => s + v, 0) * 0.25;
const mil = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const periodo = (v: number) => { const i0 = tar.indexOf(v); let i1 = i0; while (i1 < N && tar[i1] === v) i1++; return [i0, i1] as const; };
const VALE = periodo(0.1), PONTA = periodo(1.5);
const CARGA = [pc.findIndex((c) => c > 1e-6), pc.length - [...pc].reverse().findIndex((c) => c > 1e-6)] as const;   // 11:00–14:45

// ---------------------------------------------------------------- linha do tempo (30 fps)
export const TL_DESP = {
  eixos: 6, barras: [24, 120], completo: 140,
  solar: [210, 470], rede: [470, 740], bat: [740, 1010],
} as const;
export const DUR_DESP = TL_DESP.bat[1] + 20;

const TOPO = { x: 92, y: 150, w: 1740, h: 430 }, APOIO = { x: 92, y: 690, w: 1740, h: 300 };
const eT = escalas(TOPO, 1_250_000, -260_000, { esq: 96, dir: 24 });
const eA = (ymax: number, ymin = 0) => escalas(APOIO, ymax, ymin, { esq: 96, dir: 24 });

type Foco = "todos" | "fv" | "grid" | "bat";
const focoEm = (f: number): { foco: Foco; t: number } => {
  for (const k of ["solar", "rede", "bat"] as const) { const [a, b] = TL_DESP[k]; if (f >= a && f < b) return { foco: k === "solar" ? "fv" : k === "rede" ? "grid" : "bat", t: f - a }; }
  return { foco: "todos", t: 0 };
};

const Despacho = () => {
  const f = useCurrentFrame();
  const { foco, t } = focoEm(f);
  // transições do foco: entra em 14 quadros, sai nos últimos 14 do bloco
  const fim = foco === "todos" ? 0 : (TL_DESP[foco === "fv" ? "solar" : foco === "grid" ? "rede" : "bat"][1] - TL_DESP[foco === "fv" ? "solar" : foco === "grid" ? "rede" : "bat"][0]);
  const forca = foco === "todos" ? 0 : interpolate(t, [0, 14, fim - 14, fim], [0, 1, 1, 0], cl);
  const op = (k: Foco) => (foco === "todos" || k === foco ? 1 : 1 - 0.78 * forca);
  const cw = eT.x(1) - eT.x(0), zero = eT.y(0);
  const cresce = (i: number) => interpolate(f, [TL_DESP.barras[0] + i, TL_DESP.barras[0] + i + 12], [0, 1], { ...cl, easing: saida });
  const rDem = revelar(f, TL_DESP.barras[0] + 6, TL_DESP.barras[1] + 8, eT.L, eT.R);
  const ox = surgir(f, TL_DESP.eixos);
  return (
    <g>
      <defs>
        <pattern id="d-hach" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={10} height={10} fill={COR.fundo} /><rect width={4.8} height={10} fill={COR.bat} />
        </pattern>
        <clipPath id="d-dem"><rect x={0} y={0} width={rDem} height={1080} /></clipPath>
      </defs>
      <Rotulo x={TOPO.x} y={TOPO.y - 26} texto="ATENDIMENTO · INJEÇÃO POR RECURSO × DEMANDA REALIZADA" op={ox} />
      <Grade e={eT} ticks={[-250_000, 0, 500_000, 1_000_000]} fmt={(v) => (v < 0 ? "−" : "") + fmtMW(Math.abs(v))} unidade="MW" op={ox} passoH={3} />
      {imp.map((g, i) => {
        const k = cresce(i); if (k <= 0) return null;
        const x = eT.x(i) + 1.5, w = cw - 3, yg = eT.y(g * k), yf = eT.y((g + fv[i]) * k), yb = eT.y((g + fv[i] + pd[i]) * k);
        return (
          <g key={i}>
            <rect x={x} y={yg} width={w} height={zero - yg} rx={2} fill={COR.grid} opacity={op("grid")} />
            {fv[i] > 1 && <rect x={x} y={yf} width={w} height={yg - yf} rx={2} fill={COR.fv} opacity={op("fv")} />}
            {pd[i] > 1 && <rect x={x} y={yb} width={w} height={yf - yb} rx={2} fill={COR.bat} opacity={op("bat")} />}
            {pc[i] > 1 && <rect x={x} y={zero} width={w} height={eT.y(-pc[i] * k) - zero} rx={2} fill="url(#d-hach)" opacity={op("bat")} />}
          </g>
        );
      })}
      <path d={degrau(dem, eT.x, eT.y)} fill="none" stroke={COR.tinta} strokeWidth={3} clipPath="url(#d-dem)" opacity={foco === "todos" ? 1 : 1 - 0.5 * forca} />
    </g>
  );
};

// ---------------------------------------------------------------- apoio por recurso (mesmo eixo de tempo)
const Faixa: React.FC<{ p: readonly [number, number]; cor: string; op: number; rot?: string; solida?: boolean }> = ({ p, cor, op, rot, solida }) => (
  <g opacity={op}>
    <rect x={eT.x(p[0])} y={TOPO.y - 6} width={eT.x(p[1]) - eT.x(p[0])} height={APOIO.y + APOIO.h - TOPO.y - 30} fill={cor} opacity={solida ? 0.1 : 0.07} />
    <line x1={eT.x(p[0])} x2={eT.x(p[0])} y1={TOPO.y - 6} y2={APOIO.y + APOIO.h - 36} stroke={cor} strokeOpacity={0.45} strokeDasharray="3 6" strokeWidth={2} />
    <line x1={eT.x(p[1])} x2={eT.x(p[1])} y1={TOPO.y - 6} y2={APOIO.y + APOIO.h - 36} stroke={cor} strokeOpacity={0.45} strokeDasharray="3 6" strokeWidth={2} />
    {rot && <text x={(eT.x(p[0]) + eT.x(p[1])) / 2} y={TOPO.y - 16} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={22} fill={cor}>{rot}</text>}
  </g>
);

const ApoioSolar: React.FC<{ t: number; dur: number; k?: number }> = ({ t, dur, k = 1 }) => {
  const e = eA(600_000), a = interpolate(t, [10, 26, dur - 16, dur], [0, 1, 1, 0], cl);
  const r = e.L + (e.R - e.L) * interpolate(t, [20, 20 + 60 * k], [0, 1], { ...cl, easing: saida });
  let area = `M${e.x(0)},${e.y(0)}`; fv.forEach((v, i) => { area += `V${e.y(v)}H${e.x(i + 1)}`; }); area += `V${e.y(0)}Z`;
  const ip = fv.indexOf(Math.max(...fv)), nota = interpolate(t, [20 + 66 * k, 38 + 66 * k], [0, 1], cl);
  return (
    <g opacity={a}>
      <defs><clipPath id="ap-fv"><rect x={0} y={0} width={r} height={1080} /></clipPath></defs>
      <Rotulo x={APOIO.x} y={APOIO.y - 24} texto="SOLAR · POTÊNCIA FV APROVEITADA" op={1} cor={COR.fv} />
      <Grade e={e} ticks={[0, 250_000, 500_000]} fmt={fmtMW} unidade="MW" op={1} passoH={3} />
      <path d={area} fill={COR.fv} fillOpacity={0.85} clipPath="url(#ap-fv)" />
      <g opacity={nota} fontFamily={FONTE.titulo} fontWeight={600} fill={COR.tinta}>
        <circle cx={(e.x(ip) + e.x(ip + 1)) / 2} cy={e.y(fv[ip])} r={7} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
        <text x={(e.x(ip) + e.x(ip + 1)) / 2 + 16} y={e.y(fv[ip]) + 6} fontSize={26}>pico {fmtMW(fv[ip])} MW · {hora(ip)}</text>
        <text x={e.x(70)} y={e.y(380_000)} fontSize={44}>{mil(E(fv) / 1000)} MWh</text>
        <text x={e.x(70)} y={e.y(380_000) + 36} fontSize={24} fontFamily={FONTE.texto} fontWeight={400} fill={COR.tinta2}>{dec((100 * E(fv)) / E(dem), 1)} % da energia demandada no dia</text>
      </g>
    </g>
  );
};

const ApoioRede: React.FC<{ t: number; dur: number; k?: number }> = ({ t, dur, k = 1 }) => {
  const e = eA(1.75), a = interpolate(t, [10, 26, dur - 16, dur], [0, 1, 1, 0], cl);
  const r = e.L + (e.R - e.L) * interpolate(t, [20, 20 + 60 * k], [0, 1], { ...cl, easing: saida });
  return (
    <g opacity={a}>
      <defs><clipPath id="ap-tar"><rect x={0} y={0} width={r} height={1080} /></clipPath></defs>
      <Rotulo x={APOIO.x} y={APOIO.y - 24} texto="REDE · TARIFA DE IMPORTAÇÃO (SINTÉTICA)" op={1} cor={COR.tar} />
      <Grade e={e} ticks={[0, 0.5, 1, 1.5]} fmt={(v) => dec(v, 2)} unidade="R$/kWh" op={1} passoH={3} />
      <path d={degrau(tar, e.x, e.y)} fill="none" stroke={COR.tar} strokeWidth={4.5} clipPath="url(#ap-tar)" />
    </g>
  );
};

const ApoioBateria: React.FC<{ t: number; dur: number; k?: number }> = ({ t, dur, k = 1 }) => {
  const e = eA(100), a = interpolate(t, [10, 26, dur - 16, dur], [0, 1, 1, 0], cl);
  const rev = interpolate(t, [20, 20 + 64 * k], [0, 1], { ...cl, easing: saida });
  const xf = (k: number) => e.L + (k / N) * (e.R - e.L), r = e.L + (e.R - e.L) * rev;
  const pts = soc.map((s, k) => `${xf(k)},${e.y(s)}`).join(" ");
  const kMax = soc.indexOf(Math.max(...soc)), nota = interpolate(t, [20 + 70 * k, 38 + 70 * k], [0, 1], cl);
  return (
    <g opacity={a}>
      <defs><clipPath id="ap-soc"><rect x={0} y={0} width={r + 4} height={1080} /></clipPath></defs>
      <Rotulo x={APOIO.x} y={APOIO.y - 24} texto="BATERIA · ESTADO DE CARGA NAS FRONTEIRAS" op={1} cor={COR.bat} />
      <Grade e={e} ticks={[0, 20, 90]} fmt={(v) => `${v} %`} unidade="SOC" op={1} passoH={3} />
      <g clipPath="url(#ap-soc)">
        <polyline points={pts} fill="none" stroke={COR.bat} strokeWidth={4} strokeLinejoin="round" />
        {soc.map((s, k) => (k % 4 === 0 ? <circle key={k} cx={xf(k)} cy={e.y(s)} r={4.5} fill={COR.bat} /> : null))}
      </g>
      <g opacity={nota} fontFamily={FONTE.titulo} fontWeight={600} fontSize={26} fill={COR.tinta}>
        <circle cx={xf(kMax)} cy={e.y(soc[kMax])} r={8} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
        <text x={xf(kMax) + 16} y={e.y(soc[kMax]) + 34}>{Math.round(soc[kMax])} % · {hora(kMax)}</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- cena
const Rotulos: React.FC<{ foco: Foco; forca: number }> = ({ foco, forca }) => {
  const nome = foco === "fv" ? "SOLAR" : foco === "grid" ? "REDE" : foco === "bat" ? "BATERIA" : "DESPACHO COMPLETO";
  const cor = foco === "fv" ? COR.fv : foco === "grid" ? COR.grid : foco === "bat" ? COR.bat : COR.tinta;
  return <text x={960} y={84} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={64} letterSpacing="0.02em" fill={cor} opacity={foco === "todos" ? 1 : forca}>{nome}</text>;
};

/** `ritmo` (opcional, padrão 1 = protótipo aprovado e capítulo 3 v1, idênticos) multiplica SÓ a duração do desenho dos
 *  gráficos de apoio (revelação e entrada das notas); blocos, pausas, transições e dados não mudam. Capítulo 3 v2: 0,85. */
export const ResultadosDespacho: React.FC<{ ritmo?: number }> = ({ ritmo = 1 }) => {
  const f = useCurrentFrame();
  const { foco, t } = focoEm(f);
  const bloco = foco === "fv" ? TL_DESP.solar : foco === "grid" ? TL_DESP.rede : foco === "bat" ? TL_DESP.bat : null;
  const dur = bloco ? bloco[1] - bloco[0] : 0;
  const forca = bloco ? interpolate(t, [0, 14, dur - 14, dur], [0, 1, 1, 0], cl) : 0;
  const nota = (ini: number) => (bloco ? interpolate(t, [ini, ini + 16, dur - 16, dur], [0, 1, 1, 0], cl) : 0);
  const tituloTodos = interpolate(f, [TL_DESP.completo - 20, TL_DESP.completo, TL_DESP.solar[0] - 4, TL_DESP.solar[0]], [0, 1, 1, 0], cl);
  const sai = interpolate(f, [DUR_DESP - 16, DUR_DESP], [1, 0], cl);
  return (
    <AbsoluteFill style={{ background: COR.fundo, opacity: sai }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {foco === "todos" ? <g opacity={tituloTodos}><Rotulos foco="todos" forca={1} /></g> : <Rotulos foco={foco} forca={forca} />}
        {/* faixas que ligam o destaque ao apoio (mesmo eixo de tempo) */}
        {foco === "grid" && <><Faixa p={VALE} cor={COR.fv} op={nota(40)} rot="vale · R$ 0,10" /><Faixa p={PONTA} cor={COR.tar} op={nota(52)} rot="ponta · R$ 1,50" solida /></>}
        {foco === "bat" && <><Faixa p={CARGA} cor={COR.bat} op={nota(40)} rot={`carrega · ${mil(E(pc) / 1000)} MWh`} /><Faixa p={PONTA} cor={COR.bat} op={nota(56)} rot="descarrega · 600 MWh na ponta" solida /></>}
        <Despacho />
        {foco === "fv" && <ApoioSolar t={t} dur={dur} k={ritmo} />}
        {foco === "grid" && <ApoioRede t={t} dur={dur} k={ritmo} />}
        {foco === "bat" && <ApoioBateria t={t} dur={dur} k={ritmo} />}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: FONTE.texto, fontSize: 20, color: COR.tinta3 }}>
        Rodada C6-B 4713c3e1 · médias de 15 min gravadas · simulação algébrica offline · tarifa sintética
      </div>
    </AbsoluteFill>
  );
};
