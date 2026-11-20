// EXECUÇÃO DA RODADA — reprodução fiel do modal de acompanhamento do SEEDS (UI-RUNNING-01):
//   SEEDS_Energy_multimodel `main` a51fa5e · seeds2/ui/static/trama/execucao.js (estrutura, textos, regras do progresso)
//   + trama.css `.pt.mx` (tema escuro: cores, raios, tipografia, animações mx-pulso/mx-brilho/mx-respira/mx-indet/mx-sobe)
//   + integracao_v2/ui.py `dados_modal`/`FASES` (rótulos das fases e do motor).
// As animações CSS do app (infinitas) são reproduzidas QUADRO A QUADRO (Remotion não usa transições CSS). Tudo é ampliado
// por S para o vídeo 1080p. Única troca de marca: «SEEDS2» → «SEEDS» no cabeçalho (decisão do responsável para o vídeo).
// Estado da rodada = mecânica REAL da C6-B (rodada 4713c3e1): n = 96 intervalos, N = 8, m = 4 ⇒ 24 janelas; k = 4·j. O
// progresso do app só mostra porcentagem na fase «missão» com k < n; 100 % só com a rodada concluída (mesma regra aqui).
// O TEMPO é acelerado (rodada real: 42 s), declarado na legenda da cena.
import { interpolate } from "remotion";
import { COR, FONTE } from "../tema";

export const S = 1.75;                                    // ampliação do cartão do app (680 px) para o vídeo
const T = {                                               // tokens do tema escuro de trama.css (.pt[data-theme="dark"])
  surface: "#1c1c1c", surface2: "#262626", field: "rgba(255,255,255,.05)", field2: "rgba(255,255,255,.1)", ink: "#f3f3f1",
  ink2: "#a9afb5", ink3: "#777e85", line2: "rgba(255,255,255,.2)", on: "#f3f3f1", onInk: "#111", info: "#6fb0ee", ok: "#4cc38a",
  bad: "#f0707a", grid: "#e05a5a", kpv: "#E0891E", kwind: "#2F6FED", kbat: "#3C9D5D", kpemfc: "#0E7C86",
};
const FASES = ["fila", "montagem", "missao", "auditoria", "gravando"] as const;
const ROTULO_FASE: Record<string, string> = { fila: "Fila", montagem: "Montagem", missao: "Missão MPC", auditoria: "Auditoria", gravando: "Gravação" };
const FASE_TXT: Record<string, string> = { fila: "Aguardando o motor (outra execução neste servidor)", montagem: "Montando a missão e verificando o solver",
  missao: "Missão MILP–MPC (janela a janela)", auditoria: "Auditoria integral independente da missão", gravando: "Gravando registros selados e vistas" };

export type EstadoRodada = { situacao: "andamento" | "concluida"; fase: (typeof FASES)[number]; k: number | null; janelas: number | null };
export const N_INT = 96, N_JAN = 8, M_BLOCO = 4;

/** progressoMx do app (PURO): nunca inventa porcentagem; 100 % só concluída. */
function progresso(D: EstadoRodada) {
  const determinado = D.situacao === "andamento" && D.fase === "missao" && D.k != null && D.k < N_INT;
  const pct = determinado ? Math.floor((100 * (D.k as number)) / N_INT) : null;
  let rotulo: string;
  if (D.situacao === "concluida") rotulo = `Intervalos ${N_INT} de ${N_INT} · missão concluída e gravada`;
  else if (D.fase === "missao" && D.k != null) rotulo = `Intervalo ${D.k} de ${N_INT}` + (D.janelas != null ? ` · ${D.janelas} janela(s) resolvida(s)` : "");
  else rotulo = FASE_TXT[D.fase];
  return { pct, rotulo, largura: D.situacao === "concluida" ? 100 : pct };
}

// ícones (cópias EXATAS: ICONS de static/inventory.js e REDE_MX/MARCA_MX de execucao.js)
const ICO = {
  pv: <><path d="M5 22l4-12h14l4 12z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M7 16h18M14 10l-2 12M18 10l2 12" stroke="currentColor" strokeWidth="1.5" opacity=".7" /><path d="M16 22v5M11 27h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  wind: <><path d="M16 14v15M13 29h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="16" cy="12" r="2" fill="currentColor" /><path d="M16 10c-1-4 0-7 2-8 1 3 0 6-2 8zM18 13c4 1 6 3 6 5-3 0-5-2-6-5zM14 13c-3 2-6 3-8 2 1-3 5-3 8-2z" fill="currentColor" opacity=".85" /></>,
  pemfc: <><rect x="6" y="7" width="14" height="18" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M10 7v18M13 7v18M16 7v18" stroke="currentColor" strokeWidth="1.3" opacity=".6" /><path d="M20 12h4c2 0 3 1 3 3v2c0 2-1 3-3 3h-4" fill="none" stroke="currentColor" strokeWidth="2" /><text x="23" y="30" fontSize="7" fill="currentColor" fontWeight="700">H₂</text></>,
  battery: <><rect x="5" y="9" width="20" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><rect x="25" y="13" width="3" height="6" rx="1" fill="currentColor" /><rect x="8" y="12" width="5" height="8" rx="1" fill="currentColor" opacity=".8" /><rect x="14" y="12" width="5" height="8" rx="1" fill="currentColor" opacity=".45" /></>,
  grid: <><path d="M16 3l-7 26M16 3l7 26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M8 10h16M6.5 16.5h19M10.5 23h11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>,
};
const MARCA_MX = "M3 12h18M7 12V6M12 12V4M17 12V7M9 12v6M15 12v5";

/** svgMx do app: fontes → barramento → armazenamento/rede, com pulsos (decorativo; não representa fluxos). */
const DiagramaMx: React.FC<{ t: number; parado: boolean }> = ({ t, parado }) => {
  const fio = (d: string, cor: string, i: number, sai = false) => {
    const per = sai ? 2.6 : 2.2, fase = (((t + 0.55 * i) % per) + per) % per / per;     // delay −0,55·i s
    return (
      <g key={d}>
        <path d={d} fill="none" stroke={cor} strokeWidth={2} opacity={0.28} />
        <path d={d} fill="none" stroke={cor} strokeWidth={2.6} strokeLinecap="round" strokeDasharray="6 120" strokeDashoffset={parado ? 63 : 126 * (1 - fase)} opacity={parado ? 0.35 : 1} />
      </g>
    );
  };
  const respira = (k: number) => (parado ? 1 : 1 - 0.22 * (0.5 - 0.5 * Math.cos((2 * Math.PI * (t + (k % 2 ? 1.1 : 0))) / 3.2)));
  const no = (x: number, y: number, cor: string, ico: React.ReactNode, k: number) => (
    <g key={k} transform={`translate(${x - 17} ${y - 17})`} opacity={respira(k)}>
      <circle cx={17} cy={17} r={17} fill={`color-mix(in srgb, ${cor} 16%, ${T.surface})`} stroke={`color-mix(in srgb, ${cor} 35%, transparent)`} />
      <svg x={6} y={6} width={22} height={22} viewBox="0 0 32 32" style={{ color: cor }}>{ico}</svg>
    </g>
  );
  const brilho = parado ? 0 : 0.55 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 2.2));
  return (
    <svg viewBox="0 0 260 150" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs><linearGradient id="mxg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={T.ink} stopOpacity=".15" /><stop offset=".5" stopColor={T.ink} stopOpacity=".9" /><stop offset="1" stopColor={T.ink} stopOpacity=".15" /></linearGradient></defs>
      {fio("M51 28 C 90 28, 100 52, 128 60", T.kpv, 0)}{fio("M51 75 L 128 75", T.kwind, 1)}{fio("M51 122 C 90 122, 100 98, 128 90", T.kpemfc, 2)}
      {fio("M132 64 C 160 52, 175 44, 209 44", T.kbat, 3, true)}{fio("M132 86 C 160 98, 175 106, 209 106", T.grid, 4, true)}
      <rect x={125} y={18} width={10} height={114} rx={5} fill={T.ink} opacity={0.85} />
      <rect x={125} y={18} width={10} height={114} rx={5} fill="url(#mxg)" opacity={brilho} />
      {no(34, 28, T.kpv, ICO.pv, 0)}{no(34, 75, T.kwind, ICO.wind, 1)}{no(34, 122, T.kpemfc, ICO.pemfc, 2)}
      {no(226, 44, T.kbat, ICO.battery, 3)}{no(226, 106, T.grid, ICO.grid, 4)}
    </svg>
  );
};

/** Cartão do modal no estado D; `t` = segundos (animações contínuas); `larguraAnim` = largura exibida da barra (transição .6 s). */
// Opcionais (montagem integral do filme, src/filme/): `acaoConcluida` substitui as pílulas do rodapé no estado concluído e
// `textoConcluido` o texto do rodapé. Ausentes ⇒ cartão idêntico ao aprovado (capítulo 2 v1 / capítulo 3).
export const ModalExecucao: React.FC<{ D: EstadoRodada; t: number; larguraBarra: number | null; horFeito: number; horJan: [number, number];
  acaoConcluida?: React.ReactNode; textoConcluido?: string }> = ({ D, t, larguraBarra, horFeito, horJan, acaoConcluida, textoConcluido }) => {
  const P = progresso(D);
  const conc = D.situacao === "concluida";
  const ia = FASES.indexOf(D.fase);
  const pil = conc ? { t: "Concluída", c: T.ok } : { t: "Em execução", c: T.info };
  const px = (v: number) => v * S;
  const pill = (txt: string, perigo = false, desab = false) => (
    <span style={{ display: "inline-flex", alignItems: "center", height: px(34), padding: `0 ${px(14)}px`, borderRadius: 999, border: `1px solid ${perigo ? `color-mix(in srgb, ${T.bad} 45%, ${T.line2})` : T.line2}`,
      background: T.surface, color: perigo ? T.bad : T.ink, fontFamily: FONTE.texto, fontWeight: 700, fontSize: px(12), letterSpacing: ".04em", whiteSpace: "nowrap", opacity: desab ? 0.45 : 1 }}>{txt}</span>
  );
  const indet = P.largura == null && D.situacao === "andamento";
  const indetX = -110 + 420 * ((Math.sin(Math.PI * ((t % 1.5) / 1.5) - Math.PI / 2) + 1) / 2);   // mx-indet (ease-in-out)
  return (
    <div style={{ width: px(680), display: "flex", flexDirection: "column", gap: px(12), padding: `${px(16)}px ${px(20)}px ${px(14)}px`, borderRadius: px(20),
      background: T.surface, color: T.ink, border: `1px solid ${T.line2}`, boxShadow: "0 24px 64px rgba(0,0,0,.6)", fontFamily: FONTE.texto }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: px(9) }}>
          <svg viewBox="0 0 24 24" width={px(22)} height={px(22)} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d={MARCA_MX} /></svg>
          <b style={{ fontFamily: FONTE.titulo, fontWeight: 800, fontSize: px(17), letterSpacing: ".02em" }}>SEEDS</b>
          <span style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: px(10.5), letterSpacing: ".2em", color: T.ink3, paddingLeft: px(10), borderLeft: `1px solid ${T.line2}` }}>RUNNING SIMULATION</span>
        </span>
        <span style={{ padding: `${px(3)}px ${px(9)}px`, borderRadius: 999, background: T.field, fontFamily: FONTE.titulo, fontWeight: 600, fontSize: px(10), letterSpacing: ".08em", textTransform: "uppercase", color: pil.c }}>{pil.t}</span>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "46% 1fr", gap: px(16), alignItems: "center" }}>
        <div style={{ background: T.surface2, borderRadius: px(14), padding: `${px(8)}px ${px(10)}px` }}><DiagramaMx t={t} parado={conc} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: px(5) }}>
          <div style={{ fontFamily: FONTE.titulo, fontWeight: 750, fontSize: px(19), letterSpacing: "-.01em" }}>{conc ? "Concluída" : "Simulação em andamento"}</div>
          <div style={{ fontSize: px(14), fontWeight: 600, color: T.ink2 }}>Cenario 2 - BESS + FV + REDE · versão 5</div>
          <div style={{ fontSize: px(12), color: T.ink3, lineHeight: 1.45 }}>rodada <span style={{ color: T.ink2 }}>4713c3e1…</span> · EMS V2 · MILP–MPC hierárquico (experimental) · N = 8 · m = 4 · H_L = 96 · iniciada 19/11 16:31</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: px(4), marginTop: px(4) }}>
            {FASES.map((fz, i) => {
              const ok = conc || i < ia, on = !conc && i === ia;
              return <span key={fz} style={{ fontFamily: FONTE.titulo, fontWeight: 600, fontSize: px(10), letterSpacing: ".03em", padding: `${px(2)}px ${px(7)}px`, borderRadius: 999,
                color: on ? T.onInk : ok ? T.ink2 : T.ink3, background: on ? T.on : T.field }}>{ok ? "✓ " : ""}{ROTULO_FASE[fz]}</span>;
            })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: px(6) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: px(13), fontWeight: 600 }}>
          <span>{P.rotulo}</span><span style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: px(15), fontVariantNumeric: "tabular-nums" }}>{P.pct != null ? `${P.pct} %` : ""}</span>
        </div>
        <div style={{ position: "relative", height: px(10), borderRadius: 999, background: T.field2, overflow: "hidden" }}>
          <span style={{ position: "absolute", top: 0, bottom: 0, left: 0, borderRadius: 999, background: `linear-gradient(90deg, ${T.kpv}, ${T.kwind} 45%, ${T.kbat})`,
            width: indet ? "34%" : `${larguraBarra ?? 0}%`, translate: indet ? `${indetX}% 0` : "0 0" }} />
        </div>
        <div style={{ position: "relative", height: px(6), borderRadius: 3, background: `repeating-linear-gradient(90deg, ${T.field2} 0 ${px(6)}px, transparent ${px(6)}px ${px(8)}px)` }}>
          <span style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${horFeito}%`, borderRadius: 3, background: T.ink3, opacity: 0.55 }} />
          {!conc && D.fase === "missao" && <span style={{ position: "absolute", top: -2, bottom: -2, left: `${horJan[0]}%`, width: `${horJan[1]}%`, borderRadius: 4,
            border: `1.5px solid ${T.ink}`, background: "color-mix(in srgb, #f3f3f1 10%, transparent)" }} />}
        </div>
        <div style={{ fontSize: px(11.5), color: T.ink3 }}>
          {!conc && D.fase === "missao" && D.k != null && D.k < N_INT ? `Horizonte MPC: próxima janela de ${Math.min(N_JAN, N_INT - D.k)} intervalo(s) a partir de ${D.k}` : "Horizonte MPC"}
        </div>
      </div>
      <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: px(14), paddingTop: px(8) }}>
        <span style={{ fontSize: px(11.5), color: T.ink3, flex: "1 1 auto" }}>
          {conc ? (textoConcluido ?? "Abrindo os resultados gravados…") : "A execução continua no servidor mesmo que o painel seja ocultado ou a página recarregada."}
        </span>
        {conc && acaoConcluida ? acaoConcluida : (
          <span style={{ display: "flex", gap: px(8) }}>
            {pill("OCULTAR PAINEL")}
            {!conc && pill("CANCELAR EXECUÇÃO", true, D.fase === "auditoria" || D.fase === "gravando")}
          </span>
        )}
      </footer>
    </div>
  );
};

/** Transição .6 s cubic-bezier(.2,.8,.2,1) da barra/horizonte do app, quadro a quadro: valor exibido entre o anterior e o atual. */
export const transicao = (f: number, mudouEm: number, de: number, para: number, fps: number) =>
  interpolate(f, [mudouEm, mudouEm + 0.6 * fps], [de, para], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
export { T as TOKENS_MX, COR };
