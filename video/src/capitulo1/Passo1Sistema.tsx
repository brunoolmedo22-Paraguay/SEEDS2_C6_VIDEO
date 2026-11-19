// PASSO 1 — ADICIONANDO O SISTEMA. Diagrama da microrrede C6 na linguagem da PLANTA do SEEDS2 (seeds2/ui/static/trama/planta.js):
// barramento equivalente horizontal; o que injeta ACIMA (solar), o que armazena/consome/conecta ABAIXO (bateria, demanda, rede);
// um pino neutro por equipamento no barramento; ligações SEM setas (a Planta não representa fluxos). Ícones = os oficiais
// (ICONS de static/inventory.js para FV e bateria; ICO_PL de planta.js para demanda e rede). Cores = as da Partitura, as
// mesmas dos gráficos do vídeo (na Planta/Gestor a bateria é verde e a demanda violeta: trocado aqui para que «violeta =
// bateria» valha em todo o filme — decisão registrada para avaliação).
// Valores: configuração VALIDADA (CLAUDE.md, docs/VERIFICACAO_DADOS.md) — 1.000.000 × 580 W = 580 MWp; BESS 1.003 MWh,
// 200 MW operativos; PCC somente importação, limite 1.200 MW; demanda: perfil SIN escalado, pico gravado 1.006.387,5 kW.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RITMO_RAPIDO, TituloQueSobe, momentoSubida, opacidadeCena } from "../componentes/CenaTitulada";
import { cl, saida, suave } from "../componentes/grafico";
import { COR, FONTE } from "../tema";

export const TEXTO_PASSO1 = "PASSO 1: ADICIONANDO O SISTEMA";
const SOBE = momentoSubida(TEXTO_PASSO1, RITMO_RAPIDO);
export const SOBE_PASSO1 = SOBE;   // diagrama completo em SOBE + 116 (último nó com texto)
export const DUR_PASSO1 = SOBE + 160;

export type Tipo = "fv" | "bat" | "dem" | "grid";
export const ICONE: Record<Tipo, React.ReactNode> = {
  fv: (<><path d="M5 22l4-12h14l4 12z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M7 16h18M14 10l-2 12M18 10l2 12" stroke="currentColor" strokeWidth="1.5" opacity=".7" /><path d="M16 22v5M11 27h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>),
  bat: (<><rect x="5" y="9" width="20" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><rect x="25" y="13" width="3" height="6" rx="1" fill="currentColor" /><rect x="8" y="12" width="5" height="8" rx="1" fill="currentColor" opacity=".8" /><rect x="14" y="12" width="5" height="8" rx="1" fill="currentColor" opacity=".45" /></>),
  dem: (<><path d="M5 15.5L16 6l11 9.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 13.5V26h16V13.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M17.2 14.5l-3.4 5.2h3.6l-2.6 4.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></>),
  grid: (<><path d="M16 3l-7 26M16 3l7 26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M8 10h16M6.5 16.5h19M10.5 23h11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M12.5 10l7 6.5M19.5 10l-7 6.5" stroke="currentColor" strokeWidth="1.2" opacity=".6" /></>),
};

const BARRA_Y = 560, BARRA_L = 300, BARRA_R = 1620, TILE = 100;
type No = { tipo: Tipo; x: number; acima: boolean; cor: string; rot: string; valor: string; sub: string; t: number };
const NOS: No[] = [
  { tipo: "fv", x: 960, acima: true, cor: COR.fv, rot: "SOLAR FOTOVOLTAICA", valor: "580 MWp", sub: "1.000.000 módulos de 580 W", t: 0 },
  { tipo: "bat", x: 480, acima: false, cor: COR.bat, rot: "BATERIA", valor: "1.003 MWh", sub: "200 MW de potência operativa", t: 14 },
  { tipo: "grid", x: 1440, acima: false, cor: COR.grid, rot: "REDE · PCC", valor: "1.200 MW", sub: "limite de importação", t: 28 },
  { tipo: "dem", x: 960, acima: false, cor: COR.tinta, rot: "DEMANDA", valor: "até 1.006 MW", sub: "perfil SIN escalado", t: 42 },
];
const FIO = 120; // comprimento do fio entre o pino e o ícone

const Barramento: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t0, t0 + 26], [0, 1], { ...cl, easing: suave });
  const meio = (BARRA_L + BARRA_R) / 2, meia = ((BARRA_R - BARRA_L) / 2) * p;
  return (
    <g>
      <line x1={meio - meia} x2={meio + meia} y1={BARRA_Y} y2={BARRA_Y} stroke={COR.tinta} strokeWidth={6} strokeLinecap="round" />
      <text x={BARRA_L} y={BARRA_Y - 22} fontFamily={FONTE.titulo} fontWeight={600} fontSize={19} letterSpacing="0.12em" fill={COR.tinta3}
        opacity={interpolate(f, [t0 + 18, t0 + 34], [0, 1], cl)}>BARRAMENTO EQUIVALENTE</text>
    </g>
  );
};

const NoPlanta: React.FC<{ n: No; t0: number }> = ({ n, t0 }) => {
  const f = useCurrentFrame();
  const t = t0 + n.t;
  const fio = interpolate(f, [t, t + 16], [0, 1], { ...cl, easing: suave });
  const surge = interpolate(f, [t + 10, t + 28], [0, 1], { ...cl, easing: saida });
  const texto = interpolate(f, [t + 18, t + 36], [0, 1], { ...cl, easing: saida });
  const sinal = n.acima ? -1 : 1;
  const yIcone = BARRA_Y + sinal * (FIO + TILE / 2);
  return (
    <g>
      {fio > 0.01 && <line x1={n.x} x2={n.x} y1={BARRA_Y} y2={BARRA_Y + sinal * FIO * fio} stroke={n.cor} strokeWidth={4} strokeLinecap="round" />}
      <circle cx={n.x} cy={BARRA_Y} r={9} fill={COR.tinta} stroke={COR.fundo} strokeWidth={4} opacity={interpolate(f, [t, t + 6], [0, 1], cl)} />
      <g opacity={surge} transform={`translate(${n.x}, ${yIcone}) scale(${0.9 + 0.1 * surge})`}>
        <rect x={-TILE / 2} y={-TILE / 2} width={TILE} height={TILE} rx={20} fill={n.cor} fillOpacity={0.15} stroke={n.cor} strokeOpacity={0.35} strokeWidth={1.5} />
        <svg x={-31} y={-31} width={62} height={62} viewBox="0 0 32 32" style={{ color: n.cor }} overflow="visible">{ICONE[n.tipo]}</svg>
      </g>
      {/* texto centralizado sob o ícone (acima, para o que injeta), como rótulo · valor · detalhe */}
      <g opacity={texto} textAnchor="middle" transform={`translate(${n.x}, ${n.acima ? yIcone - TILE / 2 - 128 : yIcone + TILE / 2 + 44 + (1 - texto) * 8})`}>
        <text y={0} fontFamily={FONTE.titulo} fontWeight={700} fontSize={20} letterSpacing="0.1em" fill={n.cor}>{n.rot}</text>
        <text y={58} fontFamily={FONTE.titulo} fontWeight={600} fontSize={56} fill={COR.tinta}>{n.valor}</text>
        <text y={96} fontFamily={FONTE.texto} fontSize={25} fill={COR.tinta2}>{n.sub}</text>
      </g>
    </g>
  );
};

// `dur` (opcional; capítulo 1 v2) prolonga a exibição estável; o padrão é a duração da v1, que fica inalterada.
export const Passo1Sistema: React.FC<{ dur?: number }> = ({ dur = DUR_PASSO1 }) => {
  const f = useCurrentFrame();
  const t0 = SOBE + 16;
  return (
    <AbsoluteFill style={{ background: COR.fundo, opacity: opacidadeCena(f, dur, 1) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Barramento t0={t0} />
        {NOS.map((n) => <NoPlanta key={n.tipo} n={n} t0={t0 + 22} />)}
      </svg>
      <TituloQueSobe texto={TEXTO_PASSO1} tamanho={84} ritmo={RITMO_RAPIDO} sobe={SOBE} escalaFinal={0.7} alturaFinal={118} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: FONTE.texto, fontSize: 21, color: COR.tinta3,
        opacity: interpolate(f, [t0 + 80, t0 + 100], [0, 1], cl) }}>
        Microrrede do ensaio C6 · configuração validada · simulação algébrica offline
      </div>
    </AbsoluteFill>
  );
};
