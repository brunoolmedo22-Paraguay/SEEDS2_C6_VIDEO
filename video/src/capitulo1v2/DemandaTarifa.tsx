// COMPOSIÇÃO DEMANDA + TARIFA — distribuição espacial do slide 7 do `Presentation 19.pptx` (regiões azuis = lugares do
// conteúdo, não exibidas): ↖ identificação da demanda · ↙ tarifa sintética · ↗ (destaque) demanda, solar e formação da
// curva de pato · ↘ máximos e mínimos. Os gráficos entram em sequência e o QUADRO COMPLETO permanece visível ≥ 5 s.
// Dados: video/src/dados/c6b.json (demanda, FV aproveitada e tarifa gravadas; idênticas no C6-A). Carga líquida =
// demanda − FV aproveitada (derivado, rotulado). Energia diária da demanda = 21.810.467,1 kWh (indicador selado = Σ × Δ).
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RITMO_RAPIDO, TituloQueSobe, momentoSubida } from "../componentes/CenaTitulada";
import { cl, dec } from "../componentes/grafico";
import B from "../dados/c6b.json";
import { COR, FONTE } from "../tema";
import { Cartao } from "./Cartao";
import { Caixa, Grade, N, Rotulo, degrau, escalas, fmtMW, hora, revelar, surgir } from "./painel";

export const TEXTO_DT = "A CURVA DE PATO";
const SOBE = momentoSubida(TEXTO_DT, RITMO_RAPIDO);
const t0 = SOBE + 34;
export const TL_DT = {
  cartao: t0 + 4, eixosPato: t0 + 6, dem: [t0 + 20, t0 + 95], liq: [t0 + 110, t0 + 185], energia: t0 + 192,
  tarifa: t0 + 196, tarLinha: [t0 + 210, t0 + 285], vale: t0 + 292, ponta: t0 + 306,
  extremos: t0 + 322, completo: t0 + 384,
} as const;
export const DUR_DT = TL_DT.completo + 150 + 16;     // 5 s de quadro completo + saída

const dem: number[] = B.demanda_kW, fv: number[] = B.fv_aproveitada_kW, tar: number[] = B.tarifa_R_kWh;
const liq = dem.map((d, i) => d - fv[i]);
const im = (a: number[], f: (...v: number[]) => number) => a.indexOf(f(...a));
const EXT = [
  { rot: "DEMANDA · MÁX.", s: dem, i: im(dem, Math.max), cor: COR.tinta },
  { rot: "DEMANDA · MÍN.", s: dem, i: im(dem, Math.min), cor: COR.tinta },
  { rot: "CARGA LÍQUIDA · MÁX.", s: liq, i: im(liq, Math.max), cor: COR.liq },
  { rot: "CARGA LÍQUIDA · MÍN.", s: liq, i: im(liq, Math.min), cor: COR.liq },
];
const periodo = (v: number) => { const i0 = tar.indexOf(v); let i1 = i0; while (i1 < N && tar[i1] === v) i1++; return [i0, i1] as const; };
const VALE = periodo(0.1), PONTA = periodo(1.5);
const inicios = tar.map((t, i) => (i === 0 || t !== tar[i - 1] ? i : -1)).filter((i) => i >= 0);
const rotuloLargo = (i: number) => { let j = i; while (j < N && tar[j] === tar[i]) j++; return j - i >= 8; };   // período ≥ 2 h

// regiões (px no quadro 1920 × 1080), na proporção das caixas do slide 7
const R_CARTAO = { x: 110, y: 120 };
const R_TAR: Caixa = { x: 92, y: 420, w: 720, h: 560 };
const R_PATO: Caixa = { x: 900, y: 140, w: 950, h: 560 };
const R_EXT = { x: 900, y: 772, w: 950 };

const Pato = () => {
  const f = useCurrentFrame();
  const e = escalas(R_PATO, 1_200_000, 0, { esq: 84, dir: 132 });
  const op = surgir(f, TL_DT.eixosPato);
  const rD = revelar(f, TL_DT.dem[0], TL_DT.dem[1], e.L, e.R), rL = revelar(f, TL_DT.liq[0], TL_DT.liq[1], e.L, e.R);
  const rotD = surgir(f, TL_DT.dem[1] - 6, 14), rotL = surgir(f, TL_DT.liq[1] - 6, 14);
  let faixa = `M${e.x(0)},${e.y(dem[0])}`; dem.forEach((v, i) => { faixa += `V${e.y(v)}H${e.x(i + 1)}`; });
  for (let i = N - 1; i >= 0; i--) faixa += `V${e.y(liq[i])}H${e.x(i)}`;
  const play = f > TL_DT.dem[0] && f < TL_DT.dem[1] + 3 ? rD : f > TL_DT.liq[0] && f < TL_DT.liq[1] + 3 ? rL : null;
  return (
    <g>
      <defs>
        <clipPath id="dt-dem"><rect x={0} y={0} width={rD} height={1080} /></clipPath>
        <clipPath id="dt-liq"><rect x={0} y={0} width={rL} height={1080} /></clipPath>
      </defs>
      <Rotulo x={R_PATO.x} y={R_PATO.y - 26} texto="DEMANDA · SOLAR · CARGA LÍQUIDA" op={op} />
      <Grade e={e} ticks={[0, 500_000, 1_000_000]} fmt={fmtMW} unidade="MW" op={op} />
      <path d={faixa + "Z"} fill={COR.fv} fillOpacity={0.52} clipPath="url(#dt-liq)" />
      <path d={degrau(dem, e.x, e.y)} fill="none" stroke={COR.tinta} strokeWidth={3} clipPath="url(#dt-dem)" />
      <path d={degrau(liq, e.x, e.y)} fill="none" stroke={COR.liq} strokeWidth={4.5} clipPath="url(#dt-liq)" />
      {play !== null && <line x1={play} x2={play} y1={e.T} y2={e.B} stroke={COR.tinta} strokeOpacity={0.35} strokeWidth={2} />}
      <text x={e.R + 14} y={e.y(dem[N - 1]) - 12} fontFamily={FONTE.texto} fontSize={24} fill={COR.tinta} opacity={rotD}>demanda</text>
      <text x={e.R + 14} y={e.y(liq[N - 1]) + 30} fontFamily={FONTE.texto} fontSize={24} fill={COR.liq} opacity={rotL}>carga</text>
      <text x={e.R + 14} y={e.y(liq[N - 1]) + 58} fontFamily={FONTE.texto} fontSize={24} fill={COR.liq} opacity={rotL}>líquida</text>
      <text x={e.x(48)} y={e.y((dem[48] + liq[48]) / 2) + 10} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={28} fill={COR.fv} opacity={rotL}>solar</text>
      {EXT.map((q, k) => (
        <circle key={k} cx={(e.x(q.i) + e.x(q.i + 1)) / 2} cy={e.y(q.s[q.i])} r={8} fill={COR.fundo} stroke={q.cor} strokeWidth={3} opacity={surgir(f, TL_DT.extremos + 10 + k * 12, 12)} />
      ))}
    </g>
  );
};

const Tarifa = () => {
  const f = useCurrentFrame();
  const e = escalas(R_TAR, 1.75, 0, { esq: 78 });
  const op = surgir(f, TL_DT.tarifa);
  const r = revelar(f, TL_DT.tarLinha[0], TL_DT.tarLinha[1], e.L, e.R);
  const destaque = (p: readonly [number, number], cor: string, valor: string, rot: string, t: number, yRot: number) => {
    const a = surgir(f, t), cx = (e.x(p[0]) + e.x(p[1])) / 2;
    return (
      <g opacity={a}>
        <rect x={e.x(p[0])} y={yRot + 8} width={e.x(p[1]) - e.x(p[0])} height={e.B - yRot - 8} fill={cor} opacity={0.09} />
        <text x={cx} y={yRot - 30} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={38} fill={COR.tinta}>{valor}</text>
        <text x={cx} y={yRot - 2} textAnchor="middle" fontFamily={FONTE.texto} fontSize={21} fill={COR.tinta2}>{rot}</text>
      </g>
    );
  };
  return (
    <g>
      <defs><clipPath id="dt-tar"><rect x={0} y={0} width={r} height={1080} /></clipPath></defs>
      <Rotulo x={R_TAR.x} y={R_TAR.y - 26} texto="TARIFA DE IMPORTAÇÃO · SINTÉTICA" op={op} cor={COR.tar} />
      <Grade e={e} ticks={[0, 0.5, 1, 1.5]} fmt={(v) => dec(v, 2)} unidade="R$/kWh" op={op} />
      {destaque(VALE, COR.fv, "0,10", "vale solar", TL_DT.vale, e.y(1.05))}
      {destaque(PONTA, COR.tar, "1,50", "ponta", TL_DT.ponta, e.y(1.5) - 14)}
      <g clipPath="url(#dt-tar)">
        <path d={degrau(tar, e.x, e.y)} fill="none" stroke={COR.tar} strokeWidth={4.5} />
        {/* vista compacta: rótulo só nos períodos com espaço (≥ 2 h ou o primeiro); os de 1 h (0,30 · 0,20 · 0,45 · 0,50) ficam
            legíveis pelo eixo — os valores completos estão no dado e no documento da cena */}
        {inicios.filter((i) => tar[i] !== 0.1 && tar[i] !== 1.5 && (rotuloLargo(i) || i === 0)).map((i) => (
          <text key={i} x={e.x(i) + 6} y={e.y(tar[i]) - 12} fontFamily={FONTE.texto} fontWeight={600} fontSize={20} fill={COR.tar}>{dec(tar[i], 2)}</text>
        ))}
      </g>
    </g>
  );
};

const CartaoDemanda = () => {
  const f = useCurrentFrame();
  // valor VIVO: o intervalo sob a cabeça de leitura da curva de demanda; depois, a energia diária (indicador selado)
  const e = escalas(R_PATO, 1_200_000, 0, { esq: 84, dir: 132 });
  const rD = revelar(f, TL_DT.dem[0], TL_DT.dem[1], e.L, e.R);
  const i = Math.min(N - 1, Math.max(0, Math.floor(((rD - e.L) / (e.R - e.L)) * N)));
  const fim = interpolate(f, [TL_DT.energia, TL_DT.energia + 16], [0, 1], cl);
  const vivo = 1 - fim;
  return (
    <g>
      <Cartao x={R_CARTAO.x} y={R_CARTAO.y} tipo="dem" cor={COR.tinta} rotulo="DEMANDA" nome="Demanda agregada" op={surgir(f, TL_DT.cartao) * vivo}
        valor={`${dec(dem[i] / 1000, 1)} MW`} sub={`realizada · ${hora(i)}`} desloc={(1 - surgir(f, TL_DT.cartao)) * -14} />
      <Cartao x={R_CARTAO.x} y={R_CARTAO.y} tipo="dem" cor={COR.tinta} rotulo="DEMANDA" nome="Demanda agregada" op={fim}
        valor="21.810 MWh" sub="no dia · perfil SIN digitalizado e escalado (÷100)" />
    </g>
  );
};

const Extremos = () => {
  const f = useCurrentFrame();
  const w = R_EXT.w / 4;
  return (
    <g>
      <Rotulo x={R_EXT.x} y={R_EXT.y - 26} texto="MÁXIMOS E MÍNIMOS" op={surgir(f, TL_DT.extremos)} />
      {EXT.map((q, k) => {
        const a = surgir(f, TL_DT.extremos + 10 + k * 12);
        return (
          <g key={k} opacity={a} transform={`translate(${R_EXT.x + k * w}, ${R_EXT.y + (1 - a) * 10})`}>
            <text y={26} fontFamily={FONTE.titulo} fontWeight={700} fontSize={17} letterSpacing="0.08em" fill={q.cor}>{q.rot}</text>
            <text y={92} fontFamily={FONTE.titulo} fontWeight={600} fontSize={56} fill={COR.tinta}>{fmtMW(q.s[q.i])}<tspan fontSize={30} fill={COR.tinta2}> MW</tspan></text>
            <text y={132} fontFamily={FONTE.texto} fontSize={24} fill={COR.tinta2}>às {hora(q.i)}</text>
          </g>
        );
      })}
    </g>
  );
};

export const DemandaTarifa = () => {
  const f = useCurrentFrame();
  const sai = interpolate(f, [DUR_DT - 16, DUR_DT], [1, 0], cl);
  return (
    <AbsoluteFill style={{ background: COR.fundo }}>
      <AbsoluteFill style={{ opacity: sai }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <CartaoDemanda />
          <Pato />
          <Tarifa />
          <Extremos />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontFamily: FONTE.texto, fontSize: 20, color: COR.tinta3,
          opacity: surgir(f, TL_DT.extremos + 40) }}>
          carga líquida = demanda − solar aproveitada · médias de 15 min gravadas · tarifa sintética de ensaio
        </div>
        <TituloQueSobe texto={TEXTO_DT} tamanho={112} ritmo={RITMO_RAPIDO} sobe={SOBE} escalaFinal={0.4} alturaFinal={58} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
