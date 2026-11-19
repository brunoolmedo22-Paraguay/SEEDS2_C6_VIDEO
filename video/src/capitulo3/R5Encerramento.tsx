// R5 · ENCERRAMENTO — custo da operação no dia (indicadores selados das duas rodadas, conferidos contra a soma dos custos
// por intervalo gravados) → «−7,64 % · CUSTO OPERACIONAL» → tela preta com a marca SEEDS.
// Rigor: economia DIÁRIA (R$ 845.686,97) ≠ redução de custo SÓ na ponta (R$ 900.000,00); a energia importada no dia
// AUMENTA (perdas do BESS): o ganho é econômico, não de energia.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RITMO_RAPIDO } from "../componentes/CenaTitulada";
import { GlifoSeeds } from "../componentes/LogoSeeds";
import { TituloDigitado, fimDaDigitacao } from "../componentes/TituloDigitado";
import { cl, saida } from "../componentes/grafico";
import { COR, FONTE } from "../tema";
import { PONTA, cusA, cusB, custoA, custoB, dec, energia, impA, impB, milhar, reais } from "./dados";

const economia = custoA - custoB;
const pct = (100 * economia) / custoA;
const naPonta = cusA.slice(PONTA[0], PONTA[1]).reduce((s, v) => s + v, 0) - cusB.slice(PONTA[0], PONTA[1]).reduce((s, v) => s + v, 0);
const dImp = energia(impB) - energia(impA);                       // +72.057,6 kWh (perdas do BESS)
const mi = (v: number) => `R$ ${dec(v / 1e6, 2)} milhões`;

const MARCA = "SIMULADO NO SEEDS";
const T5 = { cab: 6, barras: [34, 96] as const, valores: 92, dif: 130, sai1: 250, pct: 270, sub: 302, linha1: 336, linha2: 356, sai2: 520, logo: 556, dig: 588 };
const RIT = { ...RITMO_RAPIDO, inicio: RITMO_RAPIDO.inicio + T5.dig, semente: "cap3-r5" };
const FIM_DIG = fimDaDigitacao(MARCA, RIT);
const T_FRASE = FIM_DIG + 26, T_NOTA = FIM_DIG + 50;
export const DUR_R5 = FIM_DIG + 230;

const X0 = 560, ESC = 900 / 12e6;                                  // eixo a partir de ZERO; 12 milhões de reais = 900 px
const Barra: React.FC<{ y: number; v: number; rot: string; cor: number; f: number }> = ({ y, v, rot, cor, f }) => {
  const k = interpolate(f, T5.barras, [0, 1], { ...cl, easing: saida }), w = v * ESC * k;
  const a = interpolate(f, [T5.valores, T5.valores + 16], [0, 1], cl);
  return (
    <g>
      <text x={X0 - 36} y={y + 70} textAnchor="end" fontFamily={FONTE.titulo} fontWeight={600} fontSize={46} letterSpacing="0.03em" fill={COR.tinta}
        opacity={interpolate(f, [T5.cab + 10, T5.cab + 26], [0, 1], cl)}>{rot}</text>
      <rect x={X0} y={y} width={w} height={110} rx={6} fill={COR.cus} opacity={cor} />
      <text x={X0 + v * ESC + 28} y={y + 72} fontFamily={FONTE.titulo} fontWeight={600} fontSize={48} fill={COR.tinta} opacity={a}>{mi(v)}</text>
    </g>
  );
};

export const R5Encerramento = () => {
  const f = useCurrentFrame();
  const p1 = interpolate(f, [T5.sai1, T5.sai1 + 18], [1, 0], cl);
  const p2 = interpolate(f, [T5.pct, T5.pct + 24, T5.sai2, T5.sai2 + 20], [0, 1, 1, 0], { ...cl, easing: saida });
  const s2 = interpolate(f, [T5.sub, T5.sub + 18], [0, 1], cl), l1 = interpolate(f, [T5.linha1, T5.linha1 + 18], [0, 1], cl), l2 = interpolate(f, [T5.linha2, T5.linha2 + 18], [0, 1], cl);
  const dif = interpolate(f, [T5.dif, T5.dif + 18], [0, 1], cl);
  const logo = interpolate(f, [T5.logo, T5.logo + 26], [0, 1], { ...cl, easing: saida });
  const frase = interpolate(f, [T_FRASE, T_FRASE + 20], [0, 1], cl), nota = interpolate(f, [T_NOTA, T_NOTA + 20], [0, 1], cl);
  const sai = interpolate(f, [DUR_R5 - 20, DUR_R5], [1, 0], cl);
  const xB = X0 + custoB * ESC;
  return (
    <AbsoluteFill style={{ background: COR.fundo }}>
      {/* custo das duas rodadas */}
      {p1 > 0 && (
        <AbsoluteFill style={{ opacity: p1 * interpolate(f, [0, 12], [0, 1], cl) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <text x={960} y={250} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={30} letterSpacing="0.16em" fill={COR.tinta3}
              opacity={interpolate(f, [T5.cab, T5.cab + 18], [0, 1], cl)}>CUSTO DA OPERAÇÃO · 24 h</text>
            <Barra y={360} v={custoA} rot="SEM BESS" cor={0.5} f={f} />
            <Barra y={560} v={custoB} rot="COM BESS" cor={1} f={f} />
            <line x1={xB} x2={xB} y1={340} y2={690} stroke={COR.tinta} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="5 7" opacity={dif} />
            <line x1={X0} x2={X0} y1={340} y2={690} stroke="rgba(255,255,255,.28)" strokeWidth={2} opacity={interpolate(f, [T5.cab + 10, T5.cab + 26], [0, 1], cl)} />
          </svg>
        </AbsoluteFill>
      )}
      {/* −7,64 % */}
      {p2 > 0 && (
        <AbsoluteFill style={{ opacity: p2 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 230,
            color: COR.tinta, letterSpacing: "-0.01em", lineHeight: 1, scale: String(0.96 + 0.04 * p2) }}>−{dec(pct, 2)} %</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 44,
            letterSpacing: "0.2em", color: COR.cus, opacity: s2 }}>CUSTO OPERACIONAL</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: FONTE.texto, fontSize: 30, color: COR.tinta2, opacity: l1 }}>
            −{reais(economia)} no dia · na ponta tarifária: −{reais(naPonta)}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", fontFamily: FONTE.texto, fontSize: 24, color: COR.tinta3, opacity: l2 }}>
            energia importada no dia: +{milhar(dImp / 1000)} MWh (perdas do BESS) · o ganho é econômico, não de energia
          </div>
        </AbsoluteFill>
      )}
      {/* marca */}
      {f >= T5.logo && (
        <AbsoluteFill style={{ opacity: sai }}>
          <div style={{ position: "absolute", left: 885, top: 300, opacity: logo, scale: String(0.94 + 0.06 * logo) }}><GlifoSeeds tamanho={150} /></div>
          {f >= T5.dig && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", translate: "0px 60px" }}>
              <TituloDigitado texto={MARCA} tamanho={72} ritmo={RIT} ocultarCursorEm={FIM_DIG + 30} />
            </AbsoluteFill>
          )}
          <div style={{ position: "absolute", left: 0, right: 0, top: 680, textAlign: "center", fontFamily: FONTE.texto, fontSize: 32, color: COR.tinta2, opacity: frase }}>
            Despacho energético otimizado por EMS hierárquico MILP–MPC.
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: FONTE.texto, fontSize: 20, color: COR.tinta3, opacity: nota }}>
            simulação algébrica offline · tarifa sintética · demanda: perfil do SIN digitalizado e escalado · rodadas C6-A 6f164853 e C6-B 4713c3e1
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
