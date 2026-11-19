// R3 v2 · CARGA LÍQUIDA — igual à v1 (capitulo3/R3CargaLiquida.tsx, preservada), com o DESENHO dos gráficos ≈ 15 % mais
// rápido (revelações e crescimento das barras × 0,85); pausas de leitura e ênfases com a mesma duração; dados idênticos.
// (v1:) R3 · CARGA LÍQUIDA — painel «Carga líquida» do explorador da Partitura, redesenhado com os dados gravados da C6-B:
//   (1) demanda total × carga líquida (carga líquida = demanda − solar aproveitada; DERIVADO; idêntica em C6-A e C6-B,
//       porque demanda e FV são iguais nas duas rodadas — conferido em preparar_dados.py);
//   (2) compensação da carga líquida: importação + descarga acima de zero, carga da bateria hachurada abaixo, linha = carga
//       líquida. A diferença importação − carga líquida = carga − descarga do BESS em todo intervalo (balanço gravado).
// Ênfase 1: vale (intervalos com carga do BESS, 11:00–14:45) — a importação SOBE acima da carga líquida: +739 MWh.
// Ênfase 2: ponta tarifária (18:00–20:45) — a descarga cobre 200 MW e a importação fica 200 MW abaixo da carga líquida.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cl, saida, suave } from "../componentes/grafico";
import { COR, FONTE } from "../tema";
import { Grade, Rotulo, escalas, fmtMW, revelar, surgir } from "../capitulo1v2/painel";
import { CARGA, I_1930, MW, N, PONTA, dem, energia, fv, hora, impB, liq, milhar, pc, pd } from "../capitulo3/dados";

export const TL_R3 = { c1: 10, dem: [24, 85] as const, liq: [54, 122] as const, nota: 130, c2: 150, barras: 160, passoBarra: 0.68, liq2: [192, 260] as const,
  e1: [304, 554] as const, e2: [554, 824] as const };
export const DUR_R3_2 = TL_R3.e2[1] + 20;

const C1 = { x: 92, y: 200, w: 1740, h: 290 }, C2 = { x: 92, y: 574, w: 1740, h: 430 };
const e1 = escalas(C1, 1_250_000, 0, { esq: 96, dir: 24, baixo: 36 });
const e2 = escalas(C2, 1_250_000, -260_000, { esq: 96, dir: 24, baixo: 36 });
const passos = (s: number[], x: (i: number) => number, y: (v: number) => number) =>
  s.reduce((d, v, i) => d + (i === 0 ? `M${x(0)},${y(v)}` : `V${y(v)}`) + `H${x(i + 1)}`, "");
const extra = energia(impB.map((v, i) => (i >= CARGA[0] && i < CARGA[1] ? v - liq[i] : 0)));   // = energia carregada (739 MWh)

const Faixa: React.FC<{ p: readonly [number, number]; cor: string; op: number; rot: string }> = ({ p, cor, op, rot }) => (
  <g opacity={op}>
    <rect x={e2.x(p[0])} y={C1.y - 4} width={e2.x(p[1]) - e2.x(p[0])} height={e2.B - C1.y + 4} fill={cor} opacity={0.08} />
    {[p[0], p[1]].map((i) => <line key={i} x1={e2.x(i)} x2={e2.x(i)} y1={C1.y - 4} y2={e2.B} stroke={cor} strokeOpacity={0.5} strokeDasharray="3 6" strokeWidth={2} />)}
    <text x={(e2.x(p[0]) + e2.x(p[1])) / 2} y={C1.y - 14} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={22} fill={cor}>{rot}</text>
  </g>
);

const Cabeca: React.FC<{ f: number; ini: number; fim: number; texto: string; sub?: string; primeira?: boolean }> = ({ f, ini, fim, texto, sub, primeira }) => {
  const a = interpolate(f, primeira ? [ini, ini + 18, fim - 12, fim] : [ini, ini + 16, fim - 12, fim], [0, 1, 1, 0], cl);
  const s = sub ? interpolate(f, [ini + 22, ini + 40, fim - 12, fim], [0, 1, 1, 0], cl) : 0;
  return (
    <g>
      <text x={960} y={80} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={60} letterSpacing="0.02em" fill={COR.tinta} opacity={a}>{texto}</text>
      {sub && <text x={960} y={128} textAnchor="middle" fontFamily={FONTE.texto} fontSize={30} fill={COR.tinta2} opacity={s}>{sub}</text>}
    </g>
  );
};

export const R3CargaLiquida2 = () => {
  const f = useCurrentFrame();
  const [a1, b1] = TL_R3.e1, [a2, b2] = TL_R3.e2;
  const forca1 = interpolate(f, [a1, a1 + 16, b1 - 14, b1], [0, 1, 1, 0], cl), forca2 = interpolate(f, [a2, a2 + 16, b2 - 14, b2], [0, 1, 1, 0], cl);
  const naFaixa = (i: number) => (forca1 > 0 ? i >= CARGA[0] && i < CARGA[1] : forca2 > 0 ? i >= PONTA[0] && i < PONTA[1] : true);
  const forca = Math.max(forca1, forca2);
  const opBar = (i: number) => (naFaixa(i) ? 1 : 1 - 0.72 * forca);
  const g1 = surgir(f, TL_R3.c1), g2 = surgir(f, TL_R3.c2);
  const rDem = revelar(f, TL_R3.dem[0], TL_R3.dem[1], e1.L, e1.R), rLiq = revelar(f, TL_R3.liq[0], TL_R3.liq[1], e1.L, e1.R), rLiq2 = revelar(f, TL_R3.liq2[0], TL_R3.liq2[1], e2.L, e2.R);
  const cresce = (i: number) => interpolate(f, [TL_R3.barras + i * TL_R3.passoBarra, TL_R3.barras + i * TL_R3.passoBarra + 12], [0, 1], { ...cl, easing: saida });
  const nota = surgir(f, TL_R3.nota, 20) * (1 - 0.6 * forca);
  const cw = e2.x(1) - e2.x(0), z = e2.y(0);
  const ov1 = interpolate(f, [a1 + 34, a1 + 54, b1 - 14, b1], [0, 1, 1, 0], { ...cl, easing: suave });
  const ov2 = interpolate(f, [a2 + 34, a2 + 54, b2 - 14, b2], [0, 1, 1, 0], { ...cl, easing: suave });
  const iMin = liq.indexOf(Math.min(...liq));
  const sai = interpolate(f, [DUR_R3_2 - 16, DUR_R3_2], [1, 0], cl);
  let banda = `M${e1.x(0)},${e1.y(dem[0])}`;
  dem.forEach((v, i) => { banda += `V${e1.y(v)}H${e1.x(i + 1)}`; });
  for (let i = N - 1; i >= 0; i--) banda += `V${e1.y(liq[i])}H${e1.x(i)}`;
  banda += "Z";
  return (
    <AbsoluteFill style={{ background: COR.fundo, opacity: interpolate(f, [0, 12], [0, 1], cl) * sai }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="r3-h" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={4.8} height={10} fill={COR.bat} /></pattern>
          <clipPath id="r3-dem"><rect x={0} y={0} width={rDem} height={1080} /></clipPath>
          <clipPath id="r3-liq"><rect x={0} y={0} width={rLiq} height={1080} /></clipPath>
          <clipPath id="r3-liq2"><rect x={0} y={0} width={rLiq2} height={1080} /></clipPath>
        </defs>
        <Cabeca f={f} ini={0} fim={a1 + 4} texto="CARGA LÍQUIDA" primeira />
        <Cabeca f={f} ini={a1 + 4} fim={b1} texto="AUMENTO DA IMPORTAÇÃO NO VALE" sub={`+${milhar(extra / 1000)} MWh · carga da bateria`} />
        <Cabeca f={f} ini={a2 + 4} fim={b2} texto="DIMINUIÇÃO DO ESFORÇO NA PONTA" sub="−200 MW de importação" />
        <Faixa p={CARGA} cor={COR.bat} op={forca1} rot={`intervalos ${hora(CARGA[0])}–${hora(CARGA[1] - 1)}`} />
        <Faixa p={PONTA} cor={COR.tar} op={forca2} rot={`ponta tarifária · intervalos ${hora(PONTA[0])}–${hora(PONTA[1] - 1)}`} />

        {/* (1) demanda × carga líquida */}
        <g opacity={1 - 0.45 * forca}>
          <Rotulo x={C1.x} y={C1.y - 22} texto="DEMANDA TOTAL × CARGA LÍQUIDA" op={g1} />
          <g opacity={g1 * (1 - forca)} fontFamily={FONTE.texto} fontSize={20} fill={COR.tinta2}>
            <line x1={1100} x2={1132} y1={C1.y - 29} y2={C1.y - 29} stroke={COR.tinta} strokeWidth={3} /><text x={1142} y={C1.y - 22}>demanda</text>
            <line x1={1262} x2={1294} y1={C1.y - 29} y2={C1.y - 29} stroke={COR.liq} strokeWidth={3.5} /><text x={1304} y={C1.y - 22}>carga líquida</text>
            <rect x={1450} y={C1.y - 39} width={20} height={20} rx={3} fill={COR.fv} fillOpacity={0.6} /><text x={1480} y={C1.y - 22}>solar aproveitada</text>
          </g>
          <Grade e={e1} ticks={[0, 500_000, 1_000_000]} fmt={fmtMW} unidade="MW" op={g1} passoH={3} fs={19} />
          <path d={banda} fill={COR.fv} fillOpacity={0.55} clipPath="url(#r3-liq)" />
          <path d={passos(dem, e1.x, e1.y)} fill="none" stroke={COR.tinta} strokeWidth={3} clipPath="url(#r3-dem)" />
          <path d={passos(liq, e1.x, e1.y)} fill="none" stroke={COR.liq} strokeWidth={3.5} clipPath="url(#r3-liq)" />
          <g opacity={nota} fontFamily={FONTE.texto}>
            <circle cx={(e1.x(iMin) + e1.x(iMin + 1)) / 2} cy={e1.y(liq[iMin])} r={6} fill={COR.fundo} stroke={COR.liq} strokeWidth={3} />
            <text x={(e1.x(iMin) + e1.x(iMin + 1)) / 2} y={e1.y(liq[iMin]) + 34} textAnchor="middle" fontSize={22} fill={COR.tinta2}>mínimo {MW(liq[iMin])} MW · {hora(iMin)}</text>
            <text x={e1.R} y={e1.y(310_000)} textAnchor="end" fontSize={24} fill={COR.tinta}>carga líquida = demanda − solar aproveitada</text>
            <text x={e1.R} y={e1.y(310_000) + 32} textAnchor="end" fontSize={22} fill={COR.tinta2}>a mesma com e sem bateria</text>
          </g>
        </g>

        {/* (2) compensação da carga líquida */}
        <Rotulo x={C2.x} y={C2.y - 22} texto="COMPENSAÇÃO DA CARGA LÍQUIDA" op={g2} />
        <g opacity={g2} fontFamily={FONTE.texto} fontSize={20} fill={COR.tinta2}>
          <rect x={1008} y={C2.y - 39} width={20} height={20} rx={3} fill={COR.grid} /><text x={1038} y={C2.y - 22}>importação</text>
          <rect x={1170} y={C2.y - 39} width={20} height={20} rx={3} fill={COR.bat} /><text x={1200} y={C2.y - 22}>descarga</text>
          <rect x={1316} y={C2.y - 39} width={20} height={20} rx={3} fill="url(#r3-h)" /><text x={1346} y={C2.y - 22}>carga da bateria</text>
          <line x1={1520} x2={1552} y1={C2.y - 29} y2={C2.y - 29} stroke={COR.liq} strokeWidth={3.5} /><text x={1562} y={C2.y - 22}>carga líquida</text>
        </g>
        <Grade e={e2} ticks={[-250_000, 0, 500_000, 1_000_000]} fmt={(v) => (v < 0 ? "−" : "") + fmtMW(Math.abs(v))} unidade="MW" op={g2} passoH={3} fs={19} />
        {impB.map((g, i) => {
          const k = cresce(i); if (k <= 0) return null;
          const x = e2.x(i) + 1.5, w = cw - 3, yg = e2.y(g * k), yb = e2.y((g + pd[i]) * k);
          return (
            <g key={i} opacity={opBar(i)}>
              <rect x={x} y={yg} width={w} height={z - yg} rx={2} fill={COR.grid} />
              {pd[i] > 1 && <rect x={x} y={yb} width={w} height={yg - yb} rx={2} fill={COR.bat} />}
              {pc[i] > 1 && <rect x={x} y={z} width={w} height={e2.y(-pc[i] * k) - z} rx={2} fill="url(#r3-h)" />}
            </g>
          );
        })}
        <path d={passos(liq, e2.x, e2.y)} fill="none" stroke={COR.liq} strokeWidth={3.5} clipPath="url(#r3-liq2)" />

        {/* ênfase 1: a parte da importação ACIMA da carga líquida (= carga do BESS) e a própria carga, abaixo de zero */}
        <g opacity={ov1}>
          {Array.from({ length: CARGA[1] - CARGA[0] }, (_, k) => CARGA[0] + k).map((i) => (pc[i] > 1 ? (
            <g key={i}>
              <rect x={e2.x(i) + 1.5} y={e2.y(impB[i])} width={cw - 3} height={e2.y(liq[i]) - e2.y(impB[i])} rx={2} fill="#fff" opacity={0.32} />
              <rect x={e2.x(i) + 1.5} y={z} width={cw - 3} height={e2.y(-pc[i]) - z} rx={2} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={1.5} />
            </g>) : null))}
          <g fontFamily={FONTE.texto} fontSize={22} fill={COR.tinta}>
            <text x={(e2.x(CARGA[0]) + e2.x(CARGA[1])) / 2} y={e2.y(Math.max(...impB.slice(CARGA[0], CARGA[1]))) - 18} textAnchor="middle">importação acima da carga líquida</text>
            <text x={e2.x(CARGA[1]) + 18} y={e2.y(-120_000) + 8} fill={COR.tinta2}>= a mesma energia, armazenada na bateria · {milhar(energia(pc) / 1000)} MWh</text>
          </g>
        </g>

        {/* ênfase 2: na ponta, a descarga preenche até a carga líquida e a importação fica 200 MW abaixo dela */}
        <g opacity={ov2}>
          {Array.from({ length: PONTA[1] - PONTA[0] }, (_, k) => PONTA[0] + k).map((i) => (
            <rect key={i} x={e2.x(i) + 1.5} y={e2.y(impB[i] + pd[i])} width={cw - 3} height={e2.y(impB[i]) - e2.y(impB[i] + pd[i])} rx={2} fill="#fff" opacity={0.25} />
          ))}
          {(() => {
            const xc = (e2.x(I_1930) + e2.x(I_1930 + 1)) / 2, yA = e2.y(liq[I_1930]), yB = e2.y(impB[I_1930]);
            return (
              <g>
                <line x1={xc} x2={xc} y1={yA} y2={yB} stroke={COR.tinta} strokeWidth={3} />
                <line x1={xc - 9} x2={xc + 9} y1={yA} y2={yA} stroke={COR.tinta} strokeWidth={3} />
                <line x1={xc - 9} x2={xc + 9} y1={yB} y2={yB} stroke={COR.tinta} strokeWidth={3} />
                <text x={(e2.x(PONTA[0]) + e2.x(PONTA[1])) / 2} y={yA - 16} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={30} fill={COR.tinta}>−200 MW</text>
              </g>
            );
          })()}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: FONTE.texto, fontSize: 19, color: COR.tinta3 }}>
        Rodada C6-B 4713c3e1 · médias de 15 min gravadas · carga líquida derivada · simulação algébrica offline · tarifa sintética
      </div>
    </AbsoluteFill>
  );
};
