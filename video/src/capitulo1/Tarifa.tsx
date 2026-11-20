// TARIFA — tarifa de importação SINTÉTICA de decisão (96 × 15 min), desenhada em DEGRAU como em `laneTarifa` da Partitura:
// um patamar por intervalo, o início de cada período rotulado com o valor gravado. Destaques: vale solar (0,10) e ponta (1,50).
// Fonte: video/src/dados/c6b.json (tarifa idêntica no C6-A e em assets/dados/C6_C_tarifa_valle_solar_96_intervalos.txt).
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RITMO_RAPIDO, TituloQueSobe, momentoSubida, opacidadeCena } from "../componentes/CenaTitulada";
import { N, cl, dec, degraus, escala, hh, saida, suave } from "../componentes/grafico";
import B from "../dados/c6b.json";
import { COR, FONTE } from "../tema";

export const TEXTO_TARIFA = "TARIFA DE IMPORTAÇÃO";
const SOBE = momentoSubida(TEXTO_TARIFA, RITMO_RAPIDO);
export const DUR_TARIFA = SOBE + 172;

const Q = { L: 230, R: 1690, T: 330, B: 860, ymax: 1.75 };
const { x, y } = escala(Q);
const tar: number[] = B.tarifa_R_kWh;
const inicios = tar.map((t, i) => (i === 0 || t !== tar[i - 1] ? i : -1)).filter((i) => i >= 0);   // começo de cada período
const periodo = (v: number) => { const i0 = tar.indexOf(v); let i1 = i0; while (i1 < N && tar[i1] === v) i1++; return [i0, i1] as const; };
const VALE = periodo(0.1), PONTA = periodo(1.5);   // [11:00, 14:00) e [18:00, 21:00)

const Destaque: React.FC<{ p: readonly [number, number]; cor: string; valor: string; rot: string; t: number; yRot: number }> = ({ p, cor, valor, rot, t, yRot }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [t, t + 18], [0, 1], { ...cl, easing: saida });
  const cx = (x(p[0]) + x(p[1])) / 2, topo = yRot;   // rótulo no espaço livre acima da curva
  return (
    <g opacity={a}>
      {/* a faixa começa ABAIXO do rótulo (o texto é mais largo que 3 h de eixo) */}
      <rect x={x(p[0])} y={topo + 6} width={x(p[1]) - x(p[0])} height={Q.B - topo - 6} fill={cor} opacity={0.08} />
      <line x1={x(p[0])} x2={x(p[0])} y1={topo + 6} y2={Q.B} stroke={cor} strokeOpacity={0.45} strokeDasharray="3 6" strokeWidth={2} />
      <line x1={x(p[1])} x2={x(p[1])} y1={topo + 6} y2={Q.B} stroke={cor} strokeOpacity={0.45} strokeDasharray="3 6" strokeWidth={2} />
      <text x={cx} y={topo - 58 + (1 - a) * 10} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={52} fill={COR.tinta}>{valor}</text>
      <text x={cx} y={topo - 20 + (1 - a) * 10} textAnchor="middle" fontFamily={FONTE.texto} fontSize={25} fill={COR.tinta2}>{rot}</text>
    </g>
  );
};

export const Tarifa = () => {
  const f = useCurrentFrame();
  const t0 = SOBE + 20;
  const T = { eixos: t0, linha: [t0 + 14, t0 + 84], vale: t0 + 96, ponta: t0 + 120, nota: t0 + 140 };
  const eixos = interpolate(f, [T.eixos, T.eixos + 18], [0, 1], cl);
  const rev = interpolate(f, T.linha, [x(0), x(N)], { ...cl, easing: suave });
  const play = f > T.linha[0] && f < T.linha[1] + 4 ? rev : null;
  return (
    <AbsoluteFill style={{ background: COR.fundo, opacity: opacidadeCena(f, DUR_TARIFA, 1) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="tar-rev"><rect x={0} y={0} width={rev} height={1080} /></clipPath></defs>
        <g opacity={eixos} fontFamily={FONTE.texto}>
          {[0, 0.5, 1, 1.5].map((v) => (
            <g key={v}>
              <line x1={Q.L} x2={Q.R} y1={y(v)} y2={y(v)} stroke={v === 0 ? "rgba(255,255,255,.28)" : COR.linha} strokeWidth={v === 0 ? 2 : 1.5} />
              <text x={Q.L - 18} y={y(v) + 8} textAnchor="end" fontSize={24} fill={COR.tinta3}>{dec(v, 2)}</text>
            </g>
          ))}
          <text x={Q.L - 18} y={Q.T - 40} textAnchor="end" fontSize={22} fill={COR.tinta3}>R$/kWh</text>
          {Array.from({ length: 9 }, (_, k) => k * 12).map((i) => <text key={i} x={x(i)} y={Q.B + 40} textAnchor="middle" fontSize={24} fill={COR.tinta3}>{hh(i)}</text>)}
        </g>
        <Destaque p={VALE} cor={COR.fv} valor="R$ 0,10" rot={`vale solar · ${hh(VALE[0])}–${hh(VALE[1])}`} t={T.vale} yRot={y(1.0)} />
        <Destaque p={PONTA} cor={COR.tar} valor="R$ 1,50" rot={`ponta · ${hh(PONTA[0])}–${hh(PONTA[1])}`} t={T.ponta} yRot={y(1.5)} />
        <g clipPath="url(#tar-rev)">
          <path d={degraus(tar, x, y)} fill="none" stroke={COR.tar} strokeWidth={5} strokeLinejoin="round" />
          {/* valor gravado no início de cada período, como na Partitura (exceto os dois destacados) */}
          {inicios.filter((i) => tar[i] !== 0.1 && tar[i] !== 1.5).map((i) => (
            <text key={i} x={x(i) + 8} y={y(tar[i]) - 14} fontFamily={FONTE.texto} fontWeight={600} fontSize={24} fill={COR.tar}>{dec(tar[i], 2)}</text>
          ))}
        </g>
        {play !== null && <line x1={play} x2={play} y1={Q.T - 10} y2={Q.B} stroke={COR.tinta} strokeOpacity={0.35} strokeWidth={2} />}
      </svg>
      <TituloQueSobe texto={TEXTO_TARIFA} tamanho={104} ritmo={RITMO_RAPIDO} sobe={SOBE} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: FONTE.texto, fontSize: 21, color: COR.tinta3,
        opacity: interpolate(f, [T.nota, T.nota + 16], [0, 1], cl) }}>
        Tarifa SINTÉTICA de ensaio (não é tarifa oficial) · degrau por intervalo de 15 min · usada na decisão do EMS
      </div>
    </AbsoluteFill>
  );
};
