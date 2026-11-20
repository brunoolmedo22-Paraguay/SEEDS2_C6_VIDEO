// CAPÍTULO 2 · VARIANTE DO FILME (montagem integral, src/filme/Filme.tsx). Cópia de capitulo2/Capitulo2.tsx (preservado,
// intacto), com SÓ o ritmo e o desfecho alterados — composição, quatro cards, trilho, botão e cartão de execução iguais:
//   * leitura do quadro completo ≈ 1 s, entrada do cursor mais rápida (22 quadros), clique e abertura imediata do modal;
//   * missão MPC mais rápida (24 janelas × 6 quadros, antes × 10) — mecânica real k = 4·j inalterada;
//   * desfecho NO PRÓPRIO MODAL: 100 % → «Concluída» → controle FECHAR → cursor clica → o cartão fecha (≈ 0,4 s) e o fundo
//     escurece enquanto a Partitura começa a se montar (sem tela «SIMULAÇÃO CONCLUÍDA» e sem segunda mensagem de conclusão).
//   O controle FECHAR é ADAPTAÇÃO VISUAL do filme (o cartão do app oferece «OCULTAR PAINEL»; não é registro literal da UI).
// Mini-diagrama da execução (eólica, PEMFC/H₂, solar, bateria, rede): o MESMO componente de ModalExecucao.tsx, sem alteração.
// (cabeçalho original:)
//   CAPÍTULO 2 — PASSO 2: DEFININDO A SIMULAÇÃO (slide 11 do `Presentation 19.pptx`: título no topo e QUATRO cards verticais
// lado a lado — os retângulos azuis são só a composição). Uma única visualização construída aos poucos:
//   título digitado sobe → trilho das «Etapas do experimento» do Centro de Operação (marcadores 01–04 que viram ✓, como em
//   seeds2/ui/operation_center.py `_stages`) → cards revelados um a um (Inicialização · Previsões · Estratégia EMS · Execução)
//   → quadro completo estável → botão «Rodar simulação» → cursor entra e clica → a cena desfoca e escurece (o mesmo fundo
//   do modal do app) e o cartão de EXECUÇÃO da rodada sobe (ModalExecucao.tsx, reprodução de execucao.js).
// Dados: configuração validada; SOC inicial 20 %; demanda e irradiância de entrada (dados/c6b.json, dados/clima.json);
// estratégia declarada da rodada (N = 8, m = 4, H_L = 96; PDF 4713c3e1); missão de 96 × 15 min = 1.440 min.
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ICONE } from "../capitulo1/Passo1Sistema";
import { RITMO_RAPIDO, TituloQueSobe, momentoSubida } from "../componentes/CenaTitulada";
import { cl, saida, suave } from "../componentes/grafico";
import B from "../dados/c6b.json";
import C from "../dados/clima.json";
import { COR, FONTE } from "../tema";
import { EstadoRodada, M_BLOCO, ModalExecucao, N_INT, N_JAN, S, TOKENS_MX, transicao } from "../capitulo2/ModalExecucao";

// Título corrigido a pedido do responsável (filme v8; o capítulo 2 isolado mantém «DEFININDO A SIMULAÇÃO»).
export const TEXTO_PASSO2 = "PASSO 2: DEFININDO PARÂMETROS";
const SOBE = momentoSubida(TEXTO_PASSO2, RITMO_RAPIDO);
const t0 = SOBE + 30;
const CARD = (k: number) => t0 + 22 + k * 80;              // entrada de cada card (≈ 2,7 s entre cards)
const COMPLETO = CARD(3) + 80;                              // quatro cards completos (estado do card 4 visível)
const ENTRA = COMPLETO + 30;                                 // ≈ 1 s de leitura do quadro completo antes do cursor
export const TL2 = {
  trilho: [t0, t0 + 44], completo: COMPLETO, botao: CARD(3) + 76,
  cursorEntra: ENTRA, chega: ENTRA + 22, aperta: ENTRA + 29, clique: ENTRA + 33,
};
const M0 = TL2.clique + 2;                                  // abre o modal (imediato)
const PASSO_J = 6;                                          // quadros por janela MPC (capítulo 2 v1: 10)
const FASES_T = { montagem: M0 + 10, missao: M0 + 34, auditoria: M0 + 34 + 24 * PASSO_J, gravando: M0 + 34 + 24 * PASSO_J + 22, concluida: M0 + 34 + 24 * PASSO_J + 22 + 18 };
// desfecho no modal: FECHAR surge → cursor → clique → fechamento
const CC = FASES_T.concluida;
export const TL_FECHAR = { surge: CC + 12, entra: CC + 26, chega: CC + 44, aperta: CC + 50, clique: CC + 54, fecha: CC + 56, fechado: CC + 68 };
export const INICIO_PARTITURA = TL_FECHAR.fecha + 2;        // a interface de resultados começa a se montar sob o cartão que fecha
export const DUR_CAP2F = TL_FECHAR.fecha + 20;              // fim da dissolução do capítulo 2 sobre a Partitura

const W = 395, GAP = 40, X0 = 110, Y0 = 350, H = 540;
const xCard = (k: number) => X0 + k * (W + GAP);
const TRILHO_Y = 292;

// ---------------------------------------------------------------- moldura do card (superfície escura, borda fina)
const Moldura: React.FC<{ k: number; titulo: string; estado: string; corEstado: string; children: React.ReactNode }> = ({ k, titulo, estado, corEstado, children }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [CARD(k), CARD(k) + 22], [0, 1], { ...cl, easing: saida });
  const st = interpolate(f, [CARD(k) + 62, CARD(k) + 76], [0, 1], cl);
  return (
    <g opacity={a} transform={`translate(${xCard(k)}, ${Y0 + (1 - a) * 24})`}>
      <rect x={0} y={0} width={W} height={H} rx={26} fill="#101012" stroke="rgba(255,255,255,.12)" strokeWidth={1.5} />
      <text x={W / 2} y={52} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={700} fontSize={17} letterSpacing="0.16em" fill={COR.tinta3}>ETAPA 0{k + 1}</text>
      <text x={W / 2} y={100} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={38} fill={COR.tinta}>{titulo}</text>
      {children}
      <text opacity={st} x={W / 2} y={H - 34} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={700} fontSize={22} fill={corEstado}>
        <tspan fontSize={18}>●</tspan>  {estado}
      </text>
    </g>
  );
};
const linha = (y: number, txt: string, op: number, cor: string = COR.tinta2, fs = 25) => (
  <text x={W / 2} y={y} textAnchor="middle" fontFamily={FONTE.texto} fontSize={fs} fill={cor} opacity={op}>{txt}</text>
);

// ---------------------------------------------------------------- 1 · Inicialização
const Card1 = () => {
  const f = useCurrentFrame(), c = CARD(0);
  const tiles: [keyof typeof ICONE, string][] = [["grid", COR.grid], ["fv", COR.fv], ["bat", COR.bat]];
  return (
    <Moldura k={0} titulo="Inicialização" estado="definida" corEstado="#4cc38a">
      {tiles.map(([tp, cor], i) => {
        const a = interpolate(f, [c + 16 + i * 8, c + 34 + i * 8], [0, 1], { ...cl, easing: saida });
        const x = W / 2 + (i - 1) * 100;
        return (
          <g key={tp} opacity={a} transform={`translate(${x}, ${172}) scale(${0.85 + 0.15 * a})`}>
            <rect x={-38} y={-38} width={76} height={76} rx={18} fill={cor} fillOpacity={0.15} stroke={cor} strokeOpacity={0.35} strokeWidth={1.5} />
            <svg x={-24} y={-24} width={48} height={48} viewBox="0 0 32 32" style={{ color: cor }} overflow="visible">{ICONE[tp]}</svg>
          </g>
        );
      })}
      {linha(262, "sistema configurado", interpolate(f, [c + 40, c + 54], [0, 1], cl))}
      {linha(298, "rede + solar + bateria", interpolate(f, [c + 44, c + 58], [0, 1], cl))}
      <g opacity={interpolate(f, [c + 50, c + 66], [0, 1], cl)}>
        <text x={W / 2} y={362} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={700} fontSize={17} letterSpacing="0.12em" fill={COR.bat}>SOC INICIAL</text>
        <text x={W / 2} y={438} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={72} fill={COR.tinta}>20 %</text>
      </g>
    </Moldura>
  );
};

// ---------------------------------------------------------------- 2 · Previsões (miniaturas das curvas de entrada)
const Mini: React.FC<{ y: number; s: number[]; lo: number; hi: number; cor: string; rot: string; faixa: string; rev: number; op: number }> = ({ y, s, lo, hi, cor, rot, faixa, rev, op }) => {
  const L = 36, R = W - 36, h = 66, xs = (i: number) => L + (i / N_INT) * (R - L), ys = (v: number) => y + h - ((v - lo) / (hi - lo)) * h;
  const d = s.reduce((acc, v, i) => acc + (i === 0 ? `M${xs(0)},${ys(v)}` : `V${ys(v)}`) + `H${xs(i + 1)}`, "");
  const id = `mini-${rot.replace(/\W/g, "")}`;
  return (
    <g opacity={op}>
      <text x={L} y={y - 14} fontFamily={FONTE.titulo} fontWeight={700} fontSize={17} letterSpacing="0.1em" fill={cor}>{rot}</text>
      <text x={R} y={y - 14} textAnchor="end" fontFamily={FONTE.texto} fontSize={19} fill={COR.tinta3}>{faixa}</text>
      <line x1={L} x2={R} y1={y + h} y2={y + h} stroke="rgba(255,255,255,.18)" strokeWidth={1.5} />
      <defs><clipPath id={id}><rect x={0} y={y - 10} width={L + (R - L) * rev} height={h + 20} /></clipPath></defs>
      <path d={d} fill="none" stroke={cor} strokeWidth={3} clipPath={`url(#${id})`} />
    </g>
  );
};
const Card2 = () => {
  const f = useCurrentFrame(), c = CARD(1);
  const r1 = interpolate(f, [c + 18, c + 52], [0, 1], { ...cl, easing: suave }), r2 = interpolate(f, [c + 30, c + 64], [0, 1], { ...cl, easing: suave });
  return (
    <Moldura k={1} titulo="Previsões" estado="adicionadas" corEstado="#4cc38a">
      <Mini y={170} s={B.demanda_kW} lo={600_000} hi={1_050_000} cor={COR.tinta} rot="DEMANDA" faixa="755–1.006 MW" rev={r1} op={interpolate(f, [c + 14, c + 26], [0, 1], cl)} />
      <Mini y={300} s={C.ghi_W_m2} lo={0} hi={1000} cor={COR.fv} rot="IRRADIÂNCIA" faixa="0–970 W/m²" rev={r2} op={interpolate(f, [c + 26, c + 38], [0, 1], cl)} />
      {linha(420, "curva de demanda", interpolate(f, [c + 52, c + 64], [0, 1], cl))}
      {linha(456, "clima e irradiância", interpolate(f, [c + 56, c + 68], [0, 1], cl))}
    </Moldura>
  );
};

// ---------------------------------------------------------------- 3 · Estratégia EMS (lógica hierárquica, mínima)
const Card3 = () => {
  const f = useCurrentFrame(), c = CARD(2);
  const L = 40, R = W - 40, cel = (R - L) / N_INT;
  // janela MPC deslizando sobre o dia: k = 0, 4, 8 … (bloco aplicado m = 4, horizonte N = 8) — só ilustra a mecânica declarada
  const passo = Math.max(0, Math.floor((f - (c + 30)) / 9)), k = (passo * M_BLOCO) % (N_INT - N_JAN + M_BLOCO);   // 0, 4, …, 88, 0, …
  const op = interpolate(f, [c + 18, c + 30], [0, 1], cl);
  return (
    <Moldura k={2} titulo="Estratégia EMS" estado="declarada" corEstado="#4cc38a">
      <text x={W / 2} y={178} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={52} fill={COR.tinta} opacity={op}>MILP–MPC</text>
      <g opacity={interpolate(f, [c + 26, c + 40], [0, 1], cl)} fontFamily={FONTE.texto}>
        <text x={L} y={222} fontSize={18} fill={COR.tinta3}>planejador · 24 h</text>
        <rect x={L} y={232} width={R - L} height={12} rx={6} fill="rgba(255,255,255,.14)" />
        <text x={L} y={276} fontSize={18} fill={COR.tinta3}>MPC · janela 2 h · aplica 1 h</text>
        <rect x={L} y={286} width={R - L} height={12} rx={6} fill="rgba(255,255,255,.06)" />
        <rect x={L} y={286} width={k * cel} height={12} rx={6} fill="rgba(255,255,255,.28)" />
        <rect x={L + k * cel} y={283} width={N_JAN * cel} height={18} rx={5} fill="none" stroke={COR.tinta} strokeWidth={2} />
        <rect x={L + k * cel} y={286} width={M_BLOCO * cel} height={12} rx={4} fill={COR.tinta} />
      </g>
      {linha(352, "despacho hierárquico", interpolate(f, [c + 44, c + 56], [0, 1], cl))}
      {linha(388, "carga crítica atendida", interpolate(f, [c + 48, c + 60], [0, 1], cl))}
      {linha(424, "arbitragem tarifária", interpolate(f, [c + 52, c + 64], [0, 1], cl), COR.tar)}
    </Moldura>
  );
};

// ---------------------------------------------------------------- 4 · Execução
const Card4 = () => {
  const f = useCurrentFrame(), c = CARD(3);
  const L = 36, R = W - 36, cel = (R - L) / N_INT;
  const n = Math.round(interpolate(f, [c + 30, c + 62], [0, N_INT], { ...cl, easing: suave }));
  return (
    <Moldura k={3} titulo="Execução" estado="pronta para rodar" corEstado="#6fb0ee">
      <g opacity={interpolate(f, [c + 16, c + 30], [0, 1], cl)}>
        <text x={W / 2} y={190} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={64} fill={COR.tinta}>1.440 min</text>
        <text x={W / 2} y={226} textAnchor="middle" fontFamily={FONTE.texto} fontSize={23} fill={COR.tinta2}>horizonte diário</text>
      </g>
      {Array.from({ length: N_INT }, (_, i) => (
        <rect key={i} x={L + i * cel + 0.6} y={i % 4 === 0 ? 270 : 278} width={Math.max(1, cel - 1.2)} height={i % 4 === 0 ? 40 : 32} rx={1}
          fill={i < n ? COR.tinta : "rgba(255,255,255,.12)"} />
      ))}
      <g opacity={interpolate(f, [c + 50, c + 64], [0, 1], cl)}>
        <text x={W / 2} y={374} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={40} fill={COR.tinta}>96 × 15 min</text>
        <text x={W / 2} y={410} textAnchor="middle" fontFamily={FONTE.texto} fontSize={23} fill={COR.tinta2}>intervalos da missão</text>
      </g>
    </Moldura>
  );
};

// ---------------------------------------------------------------- trilho das etapas (marcadores 01–04 → ✓)
const Trilho = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, TL2.trilho, [0, 1], { ...cl, easing: suave });
  const cx = (k: number) => xCard(k) + W / 2;
  return (
    <g>
      <line x1={cx(0)} x2={cx(0) + (cx(3) - cx(0)) * p} y1={TRILHO_Y} y2={TRILHO_Y} stroke="rgba(255,255,255,.22)" strokeWidth={2} />
      {[0, 1, 2].map((k) => {
        const ok = interpolate(f, [CARD(k) + 70, CARD(k) + 78], [0, 1], cl);
        return <line key={k} x1={cx(k)} x2={cx(k) + (cx(k + 1) - cx(k)) * ok} y1={TRILHO_Y} y2={TRILHO_Y} stroke={COR.tinta} strokeOpacity={0.55} strokeWidth={2} />;
      })}
      {[0, 1, 2, 3].map((k) => {
        const a = interpolate(f, [TL2.trilho[0] + k * 8, TL2.trilho[0] + k * 8 + 12], [0, 1], cl);
        const ok = k < 3 ? interpolate(f, [CARD(k) + 62, CARD(k) + 72], [0, 1], cl) : 0;
        const prox = k === 3 ? interpolate(f, [CARD(3) + 62, CARD(3) + 76], [0, 1], cl) : 0;
        return (
          <g key={k} opacity={a} transform={`translate(${cx(k)}, ${TRILHO_Y})`}>
            {prox > 0 && <circle r={34} fill="none" stroke="#6fb0ee" strokeOpacity={0.35 * prox} strokeWidth={8} />}
            <circle r={26} fill={ok > 0.5 ? COR.tinta : COR.fundo} stroke={ok > 0.5 ? COR.tinta : prox > 0.5 ? "#6fb0ee" : "rgba(255,255,255,.3)"} strokeWidth={2.5} />
            <text y={9} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={ok > 0.5 ? 26 : 20} fill={ok > 0.5 ? COR.fundo : prox > 0.5 ? "#6fb0ee" : COR.tinta2}>
              {ok > 0.5 ? "✓" : `0${k + 1}`}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- botão + cursor
const BOTAO = { cx: 960, cy: 968, w: 420, h: 86 };
const Botao = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [TL2.botao, TL2.botao + 20], [0, 1], { ...cl, easing: saida });
  const hover = interpolate(f, [TL2.chega - 4, TL2.chega + 6], [0, 1], cl);
  const press = interpolate(f, [TL2.aperta, TL2.aperta + 3, TL2.clique, TL2.clique + 4], [0, 1, 1, 0], cl);
  return (
    <g opacity={a} transform={`translate(${BOTAO.cx}, ${BOTAO.cy + (1 - a) * 16}) scale(${1 - 0.035 * press})`}>
      {hover > 0 && <rect x={-BOTAO.w / 2 - 10} y={-BOTAO.h / 2 - 10} width={BOTAO.w + 20} height={BOTAO.h + 20} rx={(BOTAO.h + 20) / 2} fill="none" stroke={COR.tinta} strokeOpacity={0.18 * hover} strokeWidth={6} />}
      <rect x={-BOTAO.w / 2} y={-BOTAO.h / 2} width={BOTAO.w} height={BOTAO.h} rx={BOTAO.h / 2} fill={press > 0.5 ? "#d9d9d6" : COR.tinta} />
      <path d="M-150,-14 L-126,0 L-150,14 Z" fill={COR.fundo} />
      <text x={26} y={11} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={600} fontSize={32} fill={COR.fundo}>Rodar simulação</text>
    </g>
  );
};
const Cursor = () => {
  const f = useCurrentFrame();
  if (f < TL2.cursorEntra || f > M0 + 20) return null;
  const p = interpolate(f, [TL2.cursorEntra, TL2.chega], [0, 1], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const x = interpolate(p, [0, 1], [1640, BOTAO.cx + 70]), y = interpolate(p, [0, 1], [1120, BOTAO.cy + 6]);
  const press = interpolate(f, [TL2.aperta, TL2.aperta + 3, TL2.clique, TL2.clique + 4], [0, 1, 1, 0], cl);
  const onda = interpolate(f, [TL2.clique, TL2.clique + 18], [0, 1], cl);
  const some = interpolate(f, [M0 + 6, M0 + 20], [1, 0], cl);
  return (
    <g opacity={some}>
      {onda > 0 && onda < 1 && <circle cx={x} cy={y} r={14 + 46 * onda} fill="none" stroke={COR.tinta} strokeOpacity={0.6 * (1 - onda)} strokeWidth={3} />}
      <g transform={`translate(${x}, ${y}) scale(${1.25 - 0.1 * press})`}>
        <path d="M0,0 L0,34 L9,25.5 L15,39 L21,36.3 L15,23 L27,23 Z" fill={COR.tinta} stroke={COR.fundo} strokeWidth={2.2} strokeLinejoin="round" />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- estado da rodada no tempo (mecânica real; tempo acelerado)
function estado(f: number): { D: EstadoRodada; jMudou: number; jAnt: number } {
  if (f < FASES_T.montagem) return { D: { situacao: "andamento", fase: "fila", k: null, janelas: null }, jMudou: 0, jAnt: 0 };
  if (f < FASES_T.missao) return { D: { situacao: "andamento", fase: "montagem", k: null, janelas: null }, jMudou: 0, jAnt: 0 };
  if (f < FASES_T.auditoria) {
    const j = Math.min(24, Math.floor((f - FASES_T.missao) / PASSO_J));
    return { D: { situacao: "andamento", fase: "missao", k: j * M_BLOCO, janelas: j }, jMudou: FASES_T.missao + j * PASSO_J, jAnt: Math.max(0, j - 1) };
  }
  if (f < FASES_T.gravando) return { D: { situacao: "andamento", fase: "auditoria", k: N_INT, janelas: 24 }, jMudou: 0, jAnt: 24 };
  if (f < FASES_T.concluida) return { D: { situacao: "andamento", fase: "gravando", k: N_INT, janelas: 24 }, jMudou: 0, jAnt: 24 };
  return { D: { situacao: "concluida", fase: "gravando", k: N_INT, janelas: 24 }, jMudou: FASES_T.concluida, jAnt: 24 };
}

// ---------------------------------------------------------------- FECHAR (adaptação do filme) + cursor no próprio controle
const CursorSeta: React.FC<{ escala: number }> = ({ escala }) => (
  <svg width={40} height={48} viewBox="-3 -3 34 46" style={{ display: "block", scale: String(escala), transformOrigin: "0 0", overflow: "visible" }}>
    <path d="M0,0 L0,34 L9,25.5 L15,39 L21,36.3 L15,23 L27,23 Z" fill={COR.tinta} stroke={COR.fundo} strokeWidth={2.2} strokeLinejoin="round" />
  </svg>
);
const Fechar = () => {
  const f = useCurrentFrame();
  const T = TOKENS_MX, px = (v: number) => v * S;
  const a = interpolate(f, [TL_FECHAR.surge, TL_FECHAR.surge + 12], [0, 1], { ...cl, easing: saida });
  const hover = interpolate(f, [TL_FECHAR.chega - 4, TL_FECHAR.chega + 6], [0, 1], cl);
  const press = interpolate(f, [TL_FECHAR.aperta, TL_FECHAR.aperta + 3, TL_FECHAR.clique, TL_FECHAR.clique + 4], [0, 1, 1, 0], cl);
  // cursor posicionado em relação ao PRÓPRIO controle (sem medir o DOM): entra do canto inferior direito
  const p = interpolate(f, [TL_FECHAR.entra, TL_FECHAR.chega], [0, 1], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const cx = interpolate(p, [0, 1], [520, px(56)]), cy = interpolate(p, [0, 1], [330, px(20)]);
  const onda = interpolate(f, [TL_FECHAR.clique, TL_FECHAR.clique + 18], [0, 1], cl);
  return (
    <span style={{ position: "relative", display: "inline-flex", opacity: a, translate: `0px ${(1 - a) * 8}px` }}>
      {hover > 0 && <span style={{ position: "absolute", inset: -8, borderRadius: 999, border: `6px solid rgba(243,243,241,${0.18 * hover})` }} />}
      <span style={{ display: "inline-flex", alignItems: "center", gap: px(8), height: px(34), padding: `0 ${px(20)}px`, borderRadius: 999,
        background: press > 0.5 ? "#d9d9d6" : T.on, color: T.onInk, fontFamily: FONTE.texto, fontWeight: 700, fontSize: px(12), letterSpacing: ".08em",
        whiteSpace: "nowrap", scale: String(1 - 0.04 * press) }}>
        <svg viewBox="0 0 12 12" width={px(10)} height={px(10)}><path d="M2 2l8 8M10 2l-8 8" stroke={T.onInk} strokeWidth={1.8} strokeLinecap="round" /></svg>
        FECHAR
      </span>
      {f >= TL_FECHAR.entra && (
        <span style={{ position: "absolute", left: cx, top: cy, pointerEvents: "none" }}>
          {onda > 0 && onda < 1 && <span style={{ position: "absolute", left: -(14 + 46 * onda), top: -(14 + 46 * onda), width: 2 * (14 + 46 * onda), height: 2 * (14 + 46 * onda),
            borderRadius: "50%", border: `3px solid rgba(243,243,241,${0.6 * (1 - onda)})` }} />}
          <CursorSeta escala={1.25 - 0.1 * press} />
        </span>
      )}
    </span>
  );
};

const Execucao = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < M0) return null;
  const { D, jMudou, jAnt } = estado(f);
  const sobe = interpolate(f, [M0, M0 + 8], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) });      // mx-sobe .26 s
  const fecha = interpolate(f, [TL_FECHAR.fecha, TL_FECHAR.fechado], [0, 1], { ...cl, easing: (x) => x * x });  // fechamento ≈ 0,4 s
  if (fecha >= 1) return null;
  // barra: transição .6 s entre o valor anterior e o atual (como `transition: width .6s` no app)
  let barra: number | null = null;
  if (D.situacao === "concluida") barra = transicao(f, jMudou, (100 * N_INT) / N_INT, 100, fps);
  else if (D.fase === "missao" && D.k != null && D.k < N_INT) barra = transicao(f, jMudou, Math.floor((100 * jAnt * M_BLOCO) / N_INT), Math.floor((100 * D.k) / N_INT), fps);
  const kAnt = jAnt * M_BLOCO, kAt = D.k ?? 0;
  const feito = D.fase === "missao" || D.situacao === "concluida" || D.fase === "auditoria" || D.fase === "gravando"
    ? transicao(f, jMudou, (100 * Math.min(kAnt, N_INT)) / N_INT, (100 * Math.min(kAt, N_INT)) / N_INT, fps) : 0;
  const janIni = (100 * kAt) / N_INT, janW = (100 * Math.min(N_JAN, Math.max(0, N_INT - kAt))) / N_INT;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: sobe * (1 - fecha), translate: `0px ${(1 - sobe) * 18 + 10 * fecha}px`, scale: String((0.98 + 0.02 * sobe) * (1 - 0.06 * fecha)),
        filter: fecha > 0 ? `blur(${3 * fecha}px)` : undefined }}>
        <ModalExecucao D={D} t={(f - M0) / fps} larguraBarra={barra} horFeito={feito} horJan={[janIni, janW]}
          textoConcluido="Resultados prontos para abrir." acaoConcluida={<Fechar />} />
      </div>
    </AbsoluteFill>
  );
};

export const Capitulo2Filme = () => {
  const f = useCurrentFrame();
  // fundo do modal do app: blur(3px) + véu escuro de 30 % — ampliado para o vídeo
  const fundo = interpolate(f, [M0, M0 + 8], [0, 1], cl);
  // desfecho: o capítulo 2 inteiro (fundo desfocado, legenda, cartão que fecha) dissolve sobre a Partitura que se monta por baixo
  const dissolve = interpolate(f, [TL_FECHAR.fecha, DUR_CAP2F], [1, 0], { ...cl, easing: (x) => x * (2 - x) });
  return (
    <AbsoluteFill style={{ background: COR.fundo, opacity: dissolve }}>
      <AbsoluteFill style={{ filter: fundo > 0 ? `blur(${5 * fundo}px) saturate(${1 - 0.1 * fundo})` : undefined }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <Trilho />
          <Card1 /><Card2 /><Card3 /><Card4 />
          <Botao />
        </svg>
        <TituloQueSobe texto={TEXTO_PASSO2} tamanho={84} ritmo={RITMO_RAPIDO} sobe={SOBE} escalaFinal={0.7} alturaFinal={118} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(11,12,13,${0.55 * fundo})` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><Cursor /></svg>
      <Execucao />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontFamily: FONTE.texto, fontSize: 20, color: COR.tinta3,
        opacity: interpolate(f, [M0 + 20, M0 + 36, TL_FECHAR.fecha, TL_FECHAR.fechado], [0, 1, 1, 0], cl) }}>
        Painel de execução do SEEDS · rodada C6-B 4713c3e1 · 24 janelas MPC · execução real de 42 s, exibida acelerada
      </div>
    </AbsoluteFill>
  );
};
