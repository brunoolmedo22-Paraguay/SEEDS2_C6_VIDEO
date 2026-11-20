// A CURVA DE PATO — demanda gravada (96 × 15 min) → faixa solar aproveitada → carga líquida = demanda − solar aproveitada.
// Mesma representação do painel «Demanda total × carga líquida» da Partitura: demanda em linha neutra, faixa renovável em
// âmbar translúcido ENTRE a carga líquida e a demanda, carga líquida em violeta-claro (--s-liq). Mesma escala da prova v1
// (0–1.200 MW) para que as cenas sejam comparáveis. Nada é interpolado: as séries são reveladas pela máscara.
// Fonte: video/src/dados/c6b.json (XLSX 43e3ac07 ≡ 4713c3e1); demanda e FV são idênticas no C6-A.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RITMO_RAPIDO, TituloQueSobe, momentoSubida, opacidadeCena } from "../componentes/CenaTitulada";
import { N, cl, degraus, escala, faixaEntre, hh, milhar, suave } from "../componentes/grafico";
import B from "../dados/c6b.json";
import { COR, FONTE } from "../tema";

export const TEXTO_PATO = "A CURVA DE PATO";
const SOBE = momentoSubida(TEXTO_PATO, RITMO_RAPIDO);
export const DUR_PATO = SOBE + 200;

const Q = { L: 230, R: 1690, T: 300, B: 880, ymax: 1_200_000 };
const { x, y } = escala(Q);
const dem: number[] = B.demanda_kW, fv: number[] = B.fv_aproveitada_kW;
const liq = dem.map((d, i) => d - fv[i]);                       // DERIVADO: demanda − solar aproveitada (rotulado)
const iMin = liq.indexOf(Math.min(...liq)), iMax = liq.indexOf(Math.max(...liq));
const hora = (i: number) => B.inicio_local[i];

export const CurvaPato = () => {
  const f = useCurrentFrame();
  const t0 = SOBE + 20;
  const T = { eixos: t0, dem: [t0 + 14, t0 + 74], liq: [t0 + 84, t0 + 144], marcas: t0 + 152, legenda: t0 + 168 };
  const eixos = interpolate(f, [T.eixos, T.eixos + 18], [0, 1], cl);
  const rDem = interpolate(f, T.dem, [x(0), x(N)], { ...cl, easing: suave });
  const rLiq = interpolate(f, T.liq, [x(0), x(N)], { ...cl, easing: suave });
  const marcas = interpolate(f, [T.marcas, T.marcas + 16], [0, 1], cl);
  const leg = interpolate(f, [T.legenda, T.legenda + 16], [0, 1], cl);
  const rotDem = interpolate(f, [T.dem[1] - 4, T.dem[1] + 10], [0, 1], cl), rotLiq = interpolate(f, [T.liq[1] - 4, T.liq[1] + 10], [0, 1], cl);
  const play = f > T.dem[0] && f < T.dem[1] + 4 ? rDem : f > T.liq[0] && f < T.liq[1] + 4 ? rLiq : null;
  return (
    <AbsoluteFill style={{ background: COR.fundo, opacity: opacidadeCena(f, DUR_PATO, 1) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="pato-dem"><rect x={0} y={0} width={rDem} height={1080} /></clipPath>
          <clipPath id="pato-liq"><rect x={0} y={0} width={rLiq} height={1080} /></clipPath>
        </defs>
        <g opacity={eixos} fontFamily={FONTE.texto}>
          {[0, 250_000, 500_000, 750_000, 1_000_000].map((v) => (
            <g key={v}>
              <line x1={Q.L} x2={Q.R} y1={y(v)} y2={y(v)} stroke={v === 0 ? "rgba(255,255,255,.28)" : COR.linha} strokeWidth={v === 0 ? 2 : 1.5} />
              <text x={Q.L - 18} y={y(v) + 8} textAnchor="end" fontSize={24} fill={COR.tinta3}>{milhar(v / 1000)}</text>
            </g>
          ))}
          <text x={Q.L - 18} y={Q.T - 30} textAnchor="end" fontSize={22} fill={COR.tinta3}>MW</text>
          {Array.from({ length: 9 }, (_, k) => k * 12).map((i) => <text key={i} x={x(i)} y={Q.B + 40} textAnchor="middle" fontSize={24} fill={COR.tinta3}>{hh(i)}</text>)}
        </g>
        {/* faixa solar aproveitada (entre carga líquida e demanda) e carga líquida, reveladas juntas */}
        {/* Partitura usa 0,38 sobre a superfície cinza; sobre o preto absoluto 0,52 mantém a leitura do âmbar */}
        <path d={faixaEntre(dem, liq, x, y)} fill={COR.fv} fillOpacity={0.52} clipPath="url(#pato-liq)" />
        <path d={degraus(dem, x, y)} fill="none" stroke={COR.tinta} strokeWidth={3} strokeLinejoin="round" clipPath="url(#pato-dem)" />
        <path d={degraus(liq, x, y)} fill="none" stroke={COR.liq} strokeWidth={5} strokeLinejoin="round" clipPath="url(#pato-liq)" />
        {play !== null && <line x1={play} x2={play} y1={Q.T - 10} y2={Q.B} stroke={COR.tinta} strokeOpacity={0.35} strokeWidth={2} />}
        {/* rótulos diretos nas pontas das séries (sem caixa de legenda) */}
        <text x={Q.R + 16} y={y(dem[N - 1]) - 14} fontFamily={FONTE.texto} fontSize={26} fill={COR.tinta} opacity={rotDem}>demanda</text>
        <text x={Q.R + 16} y={y(liq[N - 1]) + 34} fontFamily={FONTE.texto} fontSize={26} fill={COR.liq} opacity={rotLiq}>carga</text>
        <text x={Q.R + 16} y={y(liq[N - 1]) + 64} fontFamily={FONTE.texto} fontSize={26} fill={COR.liq} opacity={rotLiq}>líquida</text>
        <text x={x(48)} y={y((dem[48] + liq[48]) / 2) + 10} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={30} fill={COR.fv} opacity={rotLiq}>solar</text>
        {/* mínimo e máximo da carga líquida (valores derivados das séries gravadas) */}
        <g opacity={marcas}>
          <circle cx={(x(iMin) + x(iMin + 1)) / 2} cy={y(liq[iMin])} r={9} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
          <text x={(x(iMin) + x(iMin + 1)) / 2} y={y(liq[iMin]) + 58} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={40} fill={COR.tinta}>{milhar(liq[iMin] / 1000)} MW</text>
          <text x={(x(iMin) + x(iMin + 1)) / 2} y={y(liq[iMin]) + 92} textAnchor="middle" fontFamily={FONTE.texto} fontSize={24} fill={COR.tinta2}>mínimo · {hora(iMin)}</text>
          <circle cx={(x(iMax) + x(iMax + 1)) / 2} cy={y(liq[iMax])} r={9} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
          <text x={(x(iMax) + x(iMax + 1)) / 2} y={y(liq[iMax]) - 62} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={40} fill={COR.tinta}>{milhar(liq[iMax] / 1000)} MW</text>
          <text x={(x(iMax) + x(iMax + 1)) / 2} y={y(liq[iMax]) - 28} textAnchor="middle" fontFamily={FONTE.texto} fontSize={24} fill={COR.tinta2}>máximo · {hora(iMax)}</text>
        </g>
      </svg>
      <TituloQueSobe texto={TEXTO_PATO} tamanho={112} ritmo={RITMO_RAPIDO} sobe={SOBE} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: FONTE.texto, color: COR.tinta3, opacity: leg }}>
        <div style={{ fontSize: 28, color: COR.tinta2, marginBottom: 10 }}>carga líquida = demanda − solar aproveitada</div>
        <div style={{ fontSize: 21 }}>Médias de 15 min gravadas · perfil SIN digitalizado e escalado (÷100) · ensaio offline</div>
      </div>
    </AbsoluteFill>
  );
};
