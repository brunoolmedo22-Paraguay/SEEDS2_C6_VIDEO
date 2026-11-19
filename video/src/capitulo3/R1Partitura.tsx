// R1 · A INTERFACE SE MONTA — reconstrução vetorial da Partitura do SEEDS (lente Operação, tema escuro) com os dados
// GRAVADOS da rodada C6-B. Fontes da reconstrução (somente leitura): SEEDS_Energy_multimodel `main` a51fa5e —
// seeds2/ui/static/trama/partitura.js (cabeçalho `bar`/`ctx`, LENTES, inspetor, barra de estado `status`), trama.css
// (tokens do tema escuro) e o quadro de referência `resultados 1.mp4` (legenda, sete raias, eixos em kW).
// Só aparecem textos que a própria interface mostra; nada é medido no DOM em tempo de render.
// Sequência: cabeçalho → lentes → legenda → sete raias (uma a uma) → inspetor → barra de estado → varredura do cursor
// (11:00 → 19:00) → ampliação da raia Atendimento até a geometria exata do gráfico da R2.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cl, saida, suave } from "../componentes/grafico";
import { COR, FONTE } from "../tema";
import { Atendimento, GEO_R2, Geo, fx, fy, misturaGeo } from "./Atendimento";
import { N, acumB, cusB, custoB, dec, dem, eBat, energia, fv, fvPot, hora, impB, milhar, pc, pd, reais, tar } from "./dados";

// tokens do tema escuro (trama.css .pt[data-theme="dark"])
const T = { bg: "#0a0a0a", surface: "#1c1c1c", surface2: "#262626", field: "rgba(255,255,255,.05)", field2: "rgba(255,255,255,.1)",
  line: "rgba(255,255,255,.09)", line2: "rgba(255,255,255,.2)", ok: "#4cc38a", warn: "#e3a53d" };

export const TL_R1 = { header: 8, palco: 44, legenda: 56, raias: 86, passoRaia: 24, inspetor: 250, estado: 290, varre: [372, 446] as const, zoom: [560, 626] as const };
export const DUR_R1 = TL_R1.zoom[1] + 4;

// palco (painel das raias) e geometria das raias
const P = { x: 24, y: 138, w: 1428, h: 852 };
const L = 142, R = P.x + P.w - 20;
type Raia = { id: string; t: string; dir?: string; h: number; ymin: number; ymax: number; ticks: number[]; fmt?: (v: number) => string };
const RAIAS: Raia[] = [
  { id: "dec", t: "Decisões do MPC · bloco aplicado", dir: "cheio = com valor futuro", h: 30, ymin: 0, ymax: 1, ticks: [] },
  { id: "atend", t: "Atendimento · injeção por recurso × demanda realizada [kW]", h: 182, ymin: -250_000, ymax: 1_500_000, ticks: [1_500_000, 750_000, 0, -250_000] },
  { id: "renov", t: "Renováveis · aproveitado + vertido = potencial utilizável [kW]", h: 56, ymin: 0, ymax: 600_000, ticks: [600_000, 300_000, 0] },
  { id: "bat", t: "Bateria · energia interna nas fronteiras [kWh] ↗", h: 56, ymin: 0, ymax: 1_003_000, ticks: [1_003_000, 501_500, 0] },
  { id: "rede", t: "Rede · importação realizada [kW] ↗", dir: "limite 1.200.000 kW", h: 56, ymin: 0, ymax: 1_500_000, ticks: [1_500_000, 750_000, 0] },
  { id: "tar", t: "Tarifa de decisão [R$/kWh] · degrau por intervalo [t_k, t_k+1) ↗", h: 52, ymin: 0, ymax: 2, ticks: [2, 1, 0], fmt: (v) => dec(v, 2) },
  { id: "cus", t: "Custo realizado por intervalo [R$] · total gravado ↗", dir: `total ${reais(custoB)}`, h: 56, ymin: 0, ymax: 420_000, ticks: [400_000, 200_000, 0] },
];
const TOPO_RAIAS = P.y + 92, TIT = 24, VAO = 10;
const GEO: Record<string, Geo> = {};
{
  let y = TOPO_RAIAS;
  for (const r of RAIAS) { GEO[r.id] = { L, R, T: y + TIT, B: y + TIT + r.h, ymin: r.ymin, ymax: r.ymax }; y += TIT + r.h + VAO; }
}
const EIXO_T = GEO.cus.B + 26;

// ---------------------------------------------------------------- utilitários
const ent = (f: number, ini: number, dur = 16) => interpolate(f, [ini, ini + dur], [0, 1], { ...cl, easing: saida });
const revX = (f: number, ini: number, dur = 40) => L + (R - L) * interpolate(f, [ini, ini + dur], [0, 1], { ...cl, easing: suave });
const passos = (s: number[], x: (i: number) => number, y: (v: number) => number) =>
  s.reduce((d, v, i) => d + (i === 0 ? `M${x(0)},${y(v)}` : `V${y(v)}`) + `H${x(i + 1)}`, "");

const Ticks: React.FC<{ r: Raia; op: number }> = ({ r, op }) => {
  const g = GEO[r.id], y = fy(g), fmt = r.fmt ?? milhar;
  return (
    <g opacity={op} fontFamily={FONTE.texto}>
      <text x={g.L - 4} y={g.T - 8} fontSize={17} fontWeight={600} fill={COR.tinta2}>{r.t}</text>
      {r.dir && <text x={g.R} y={g.T - 8} textAnchor="end" fontSize={15} fill={COR.tinta3}>{r.dir}</text>}
      {r.ticks.map((v) => (
        <g key={v}>
          <line x1={g.L} x2={g.R} y1={y(v)} y2={y(v)} stroke={v === 0 ? T.line2 : T.line} strokeWidth={1} />
          <text x={g.L - 10} y={y(v) + 5} textAnchor="end" fontSize={14} fill={COR.tinta3}>{fmt(v)}</text>
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- raias (exceto Atendimento, desenhada por Atendimento.tsx)
const Decisoes: React.FC<{ f: number; ini: number; cur: number | null }> = ({ f, ini, cur }) => {
  const g = GEO.dec, x = fx(g);
  return (
    <g fontFamily={FONTE.texto}>
      {Array.from({ length: 24 }, (_, j) => {
        const a = ent(f, ini + 6 + j * 1.6, 10), ativo = cur !== null && Math.floor(cur / 4) === j;
        return (
          <g key={j} opacity={a}>
            <rect x={x(4 * j) + 2} y={g.T + 2} width={x(4) - x(0) - 4} height={g.B - g.T - 4} rx={5}
              fill={ativo ? COR.tinta : "#e9e9e6"} stroke={ativo ? COR.tinta : "none"} strokeWidth={2} />
            <text x={x(4 * j + 2)} y={g.B - 9} textAnchor="middle" fontSize={15} fontWeight={600} fill="#111">j{j}</text>
          </g>
        );
      })}
    </g>
  );
};

const Barras: React.FC<{ id: string; s: number[]; cor: string; rev: number }> = ({ id, s, cor, rev }) => {
  const g = GEO[id], x = fx(g), y = fy(g), cw = x(1) - x(0);
  return (
    <g clipPath={`url(#r1-rev-${id})`}>
      <defs><clipPath id={`r1-rev-${id}`}><rect x={0} y={0} width={rev} height={1080} /></clipPath></defs>
      {s.map((v, i) => (v > 1 ? <rect key={i} x={x(i) + 1.5} y={y(v)} width={cw - 3} height={y(0) - y(v)} rx={2} fill={cor} /> : null))}
    </g>
  );
};

const RaiaBateria: React.FC<{ rev: number }> = ({ rev }) => {
  const g = GEO.bat, y = fy(g), xb = (k: number) => g.L + (k / N) * (g.R - g.L);
  return <g>{eBat.map((e, k) => (xb(k) <= rev ? <circle key={k} cx={xb(k)} cy={y(e)} r={2.6} fill={COR.bat} /> : null))}</g>;
};

const RaiaRede: React.FC<{ rev: number; op: number }> = ({ rev, op }) => {
  const g = GEO.rede, y = fy(g);
  return (
    <g>
      <line x1={g.L} x2={g.R} y1={y(1_200_000)} y2={y(1_200_000)} stroke={COR.grid} strokeOpacity={0.7 * op} strokeDasharray="5 5" strokeWidth={1.5} />
      <Barras id="rede" s={impB} cor={COR.grid} rev={rev} />
    </g>
  );
};

const RaiaTarifa: React.FC<{ rev: number }> = ({ rev }) => {
  const g = GEO.tar, x = fx(g), y = fy(g);
  const mud = tar.map((v, i) => (i === 0 || v !== tar[i - 1] ? i : -1)).filter((i) => i >= 0);
  return (
    <g clipPath="url(#r1-rev-tar)" fontFamily={FONTE.texto}>
      <defs><clipPath id="r1-rev-tar"><rect x={0} y={0} width={rev} height={1080} /></clipPath></defs>
      <path d={passos(tar, x, y)} fill="none" stroke={COR.tar} strokeWidth={2.6} />
      {mud.map((i) => <text key={i} x={x(i) + 4} y={y(tar[i]) - 5} fontSize={14} fontWeight={700} fill={COR.tar}>{dec(tar[i], 2)}</text>)}
    </g>
  );
};

// ---------------------------------------------------------------- HTML: cabeçalho, legenda, inspetor, barra de estado
const Cabecalho: React.FC<{ f: number }> = ({ f }) => {
  const a = (k: number) => ({ opacity: ent(f, TL_R1.header + k * 9), translate: `0px ${(1 - ent(f, TL_R1.header + k * 9)) * 8}px` });
  const b = (t: string) => <b style={{ color: COR.tinta, fontWeight: 700 }}>{t}</b>;
  return (
    <div style={{ position: "absolute", left: 40, top: 26, right: 24, display: "flex", alignItems: "flex-start", fontFamily: FONTE.texto }}>
      <div>
        <div style={{ ...a(0), fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 32, color: COR.tinta, letterSpacing: "-0.01em" }}>Cenario 2 - BESS + FV + REDE</div>
        <div style={{ ...a(1), fontSize: 18, color: COR.tinta3, marginTop: 6 }}>rodada 4713c3e1 · cenário v5 · inventário rev. 15 · 96 intervalos de 15 min · N 8 · m 4 · H_L 96</div>
        <div style={{ ...a(2), fontSize: 18, color: COR.tinta3, marginTop: 2 }}>
          {b(reais(custoB))} realizados · {b(`${milhar(energia(dem))} kWh`)} atendidos · déficit {b("0,0 kWh")} · valor futuro em {b("24 de 24")} decisões
        </div>
      </div>
      <span style={{ flex: 1 }} />
      <div style={{ ...a(3), display: "flex", gap: 4, padding: 4, borderRadius: 999, background: T.field, marginTop: 6 }}>
        {["Operação", "Decisão", "Economia", "Evidência", "Visão Geral"].map((n, k) => (
          <span key={n} style={{ padding: "8px 16px", borderRadius: 999, fontSize: 17, fontWeight: 600, whiteSpace: "nowrap",
            background: k === 0 ? T.field2 : "transparent", color: k === 0 ? COR.tinta : COR.tinta2 }}>{n}</span>
        ))}
      </div>
    </div>
  );
};

const LEG: { t: string; c: string; tipo: "q" | "l" | "h" }[] = [
  { t: "Rede", c: COR.grid, tipo: "q" }, { t: "Solar", c: COR.fv, tipo: "q" }, { t: "Bateria", c: COR.bat, tipo: "q" }, { t: "Demanda", c: COR.tinta, tipo: "l" },
  { t: "hachura = carga da bateria, exportação e vertimento", c: COR.tinta2, tipo: "h" }, { t: "tarifa de importação [R$/kWh]", c: COR.tar, tipo: "l" },
  { t: "custo realizado [R$]", c: COR.cus, tipo: "q" },
];
const Legenda: React.FC<{ f: number }> = ({ f }) => {
  const chip = (l: (typeof LEG)[number], k: number) => (
    <span key={l.t} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "5px 10px", borderRadius: 8, opacity: ent(f, TL_R1.legenda + k * 5, 12), whiteSpace: "nowrap" }}>
      {l.tipo === "q" && <i style={{ width: 15, height: 15, borderRadius: 4, background: l.c }} />}
      {l.tipo === "l" && <i style={{ width: 20, height: 3, borderRadius: 2, background: l.c }} />}
      {l.tipo === "h" && <i style={{ width: 15, height: 15, borderRadius: 4, background: `repeating-linear-gradient(45deg, ${COR.tinta2} 0 2px, transparent 2px 5px)` }} />}
      <span style={{ fontSize: 17, color: COR.tinta2 }}>{l.t}</span>
    </span>
  );
  return (
    <div style={{ position: "absolute", left: P.x + 14, top: P.y + 12, width: P.w - 28, fontFamily: FONTE.texto }}>
      <div style={{ display: "flex", gap: 6 }}>{LEG.slice(0, 6).map(chip)}</div>
      <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
        {chip(LEG[6], 6)}
        <span style={{ flex: 1 }} />
        <span style={{ display: "flex", gap: 2, padding: 3, borderRadius: 10, background: T.field, opacity: ent(f, TL_R1.legenda + 36, 12) }}>
          {["tudo", "12 h", "6 h"].map((z, k) => <span key={z} style={{ padding: "4px 14px", borderRadius: 8, fontSize: 16, fontWeight: 600, background: k === 0 ? T.field2 : "transparent", color: k === 0 ? COR.tinta : COR.tinta2 }}>{z}</span>)}
        </span>
      </div>
    </div>
  );
};

const Cartao: React.FC<{ op: number; titulo: string; tag?: string; tagCor?: string; children: React.ReactNode }> = ({ op, titulo, tag, tagCor, children }) => (
  <div style={{ opacity: op, translate: `0px ${(1 - op) * 10}px`, background: T.surface, borderRadius: 14, padding: "14px 18px", border: `1px solid ${T.line}` }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 16, fontWeight: 600, color: COR.tinta2 }}>
      <span>{titulo}</span>
      {tag && <span style={{ fontSize: 13, fontWeight: 700, padding: "2px 9px", borderRadius: 999, background: T.field, color: tagCor ?? COR.tinta3 }}>{tag}</span>}
    </div>
    {children}
  </div>
);

const Inspetor: React.FC<{ f: number; g: number }> = ({ f, g }) => {
  const op = (k: number) => ent(f, TL_R1.inspetor + k * 9, 14);
  const inj = impB[g] + fv[g] + pd[g], j = Math.floor(g / 4);
  const seg = (v: number, c: string, ht = false) => (v > 1e-6 ? <i style={{ width: `${(100 * v) / inj}%`, height: "100%", background: ht ? `repeating-linear-gradient(45deg, ${c} 0 2px, transparent 2px 5px)` : c }} /> : null);
  const barra = (rot: string, partes: React.ReactNode) => (
    <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", alignItems: "center", gap: 8, marginTop: 8 }}>
      <span style={{ fontSize: 14, color: COR.tinta3 }}>{rot}</span>
      <div style={{ display: "flex", height: 14, borderRadius: 4, overflow: "hidden", background: T.field }}>{partes}</div>
    </div>
  );
  const linha = (c: string, nome: string, sub: string, val: string) => (
    <div style={{ display: "grid", gridTemplateColumns: "14px 1fr auto", alignItems: "center", gap: 10, padding: "6px 0", borderTop: `1px solid ${T.line}` }}>
      <i style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
      <span style={{ fontSize: 16, color: COR.tinta }}>{nome} <small style={{ fontSize: 13, color: COR.tinta3 }}>{sub}</small></span>
      <b style={{ fontSize: 16, color: COR.tinta, fontVariantNumeric: "tabular-nums" }}>{val} <small style={{ fontSize: 12, color: COR.tinta3, fontWeight: 400 }}>kW</small></b>
    </div>
  );
  const kv = (k: string, v: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderTop: `1px solid ${T.line}`, fontSize: 15 }}>
      <span style={{ color: COR.tinta3 }}>{k}</span><b style={{ color: COR.tinta, fontVariantNumeric: "tabular-nums" }}>{v}</b>
    </div>
  );
  const bat = pc[g] > 0 ? ["−" + dec(pc[g], 1), "carga"] : pd[g] > 0 ? [dec(pd[g], 1), "descarga"] : ["0,0", "repouso"];
  return (
    <div style={{ position: "absolute", left: 1472, top: P.y, width: 424, display: "flex", flexDirection: "column", gap: 12, fontFamily: FONTE.texto }}>
      <Cartao op={op(0)} titulo={`Intervalo ${g}`}>
        <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 34, color: COR.tinta, marginTop: 4 }}>{hora(g)}–{hora(g + 1)}</div>
        <div style={{ fontSize: 14, color: COR.tinta3, marginTop: 2 }}>médias do intervalo · America/Sao_Paulo · decidido na janela {j}</div>
        {barra("injeta", <>{seg(impB[g], COR.grid)}{seg(fv[g], COR.fv)}{seg(pd[g], COR.bat)}</>)}
        {barra("consome", <>{seg(dem[g], COR.tinta)}{seg(pc[g], COR.bat, true)}</>)}
        <div style={{ fontSize: 14, color: COR.tinta3, marginTop: 8 }}>Σ injeção (derivado) = <b style={{ color: COR.tinta }}>{dec(inj, 2)} kW</b></div>
      </Cartao>
      <Cartao op={op(1)} titulo="Recursos neste intervalo" tag="clique para abrir">
        <div style={{ marginTop: 8 }}>
          {linha(COR.tinta, "Demanda", "", dec(dem[g], 1))}
          {linha(COR.fv, "Solar", `de ${dec(fvPot[g], 1)}`, dec(fv[g], 1))}
          {linha(COR.bat, "Bateria", bat[1], bat[0])}
          {linha(COR.grid, "Rede", "", dec(impB[g], 1))}
        </div>
      </Cartao>
      <Cartao op={op(2)} titulo="Estados e custos">
        <div style={{ marginTop: 8 }}>
          {kv("Energia armazenada", `${dec(eBat[g], 1)} → ${dec(eBat[g + 1], 1)} kWh`)}
          {kv("Vertimento renovável", `${dec(fvPot[g] - fv[g], 1)} kW`)}
          {kv("Tarifa de decisão", `${dec(tar[g], 2)} R$/kWh`)}
          {kv("Custo realizado", reais(cusB[g]))}
          {kv("Acumulado", reais(acumB[g]))}
        </div>
      </Cartao>
      <Cartao op={op(3)} titulo={`Decisão · janela ${j}`} tag="com valor futuro" tagCor={T.ok}>
        <div style={{ fontSize: 14, color: COR.tinta3, marginTop: 6 }}>decidida às {hora(4 * j)}</div>
      </Cartao>
    </div>
  );
};

const Estado: React.FC<{ f: number; g: number }> = ({ f, g }) => {
  const a = ent(f, TL_R1.estado, 16);
  const pt = (c: string, t: string) => <span style={{ display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}><i style={{ width: 9, height: 9, borderRadius: 9, background: c }} />{t}</span>;
  return (
    <div style={{ position: "absolute", left: 24, right: 24, top: 1006, height: 48, display: "flex", alignItems: "center", gap: 22, padding: "0 18px",
      borderRadius: 12, background: T.surface, border: `1px solid ${T.line}`, fontFamily: FONTE.texto, fontSize: 15, color: COR.tinta2, opacity: a }}>
      <span style={{ whiteSpace: "nowrap" }}><b style={{ color: COR.tinta }}>RODADA 4713c3e1</b> · concluída · somente leitura</span>
      {pt(T.ok, "algébrico aprovado")}{pt(COR.tinta3, "dinâmico não aplicável")}{pt(COR.tinta3, "físico não validado")}
      {pt(T.ok, "evidência verificada (20 de 20) sem solver")}{pt(T.warn, "dados sintéticos de ensaio")}
      <span style={{ flex: 1 }} />
      <span style={{ whiteSpace: "nowrap" }}>instante <b style={{ color: COR.tinta }}>{hora(g)}–{hora(g + 1)}</b></span>
      <span style={{ padding: "6px 14px", borderRadius: 999, border: `1px solid ${T.line2}`, color: COR.tinta, fontWeight: 600, whiteSpace: "nowrap" }}>Explorar recursos</span>
    </div>
  );
};

// ---------------------------------------------------------------- cena
const G_INI = 44, G_FIM = 76;                 // 11:00 (carga da bateria) → 19:00 (ponta, descarga)
const ini = (k: number) => TL_R1.raias + k * TL_R1.passoRaia;

export const R1Partitura = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, TL_R1.zoom, [0, 1], { ...cl, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
  const resto = 1 - interpolate(f, [TL_R1.zoom[0], TL_R1.zoom[0] + 22], [0, 1], cl);      // tudo menos as barras do Atendimento
  const palco = ent(f, TL_R1.palco, 18) * (1 - interpolate(f, [TL_R1.zoom[0], TL_R1.zoom[0] + 40], [0, 1], cl));
  const g = Math.round(interpolate(f, TL_R1.varre, [G_INI, G_FIM], { ...cl, easing: suave }));
  const cursor = ent(f, TL_R1.inspetor, 14) * resto;
  const ga = misturaGeo(GEO.atend, GEO_R2, z);
  const k1 = ini(1);
  return (
    <AbsoluteFill style={{ background: COR.fundo }}>
      <AbsoluteFill style={{ background: T.bg, opacity: ent(f, 0, 16) * resto }} />
      <div style={{ position: "absolute", left: P.x, top: P.y, width: P.w, height: P.h, borderRadius: 16, background: T.surface, opacity: palco }} />
      <AbsoluteFill style={{ opacity: resto }}>
        <Cabecalho f={f} />
        <Legenda f={f} />
        <Inspetor f={f} g={g} />
        <Estado f={f} g={g} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g opacity={resto}>
          {/* cursor: coluna do intervalo em todas as raias (como o instante da Partitura) */}
          <rect x={fx(GEO.dec)(g)} y={GEO.dec.T - 2} width={fx(GEO.dec)(1) - fx(GEO.dec)(0)} height={GEO.cus.B - GEO.dec.T + 4} fill="#fff" opacity={0.09 * cursor} />
          {RAIAS.map((r, k) => <Ticks key={r.id} r={r} op={ent(f, ini(k), 12)} />)}
          <Decisoes f={f} ini={ini(0)} cur={cursor > 0 ? g : null} />
          <Barras id="renov" s={fv} cor={COR.fv} rev={revX(f, ini(2) + 6)} />
          <RaiaBateria rev={revX(f, ini(3) + 6)} />
          <RaiaRede rev={revX(f, ini(4) + 6)} op={ent(f, ini(4), 12)} />
          <RaiaTarifa rev={revX(f, ini(5) + 6)} />
          <Barras id="cus" s={cusB} cor={COR.cus} rev={revX(f, ini(6) + 6)} />
          <g opacity={ent(f, ini(6) + 10, 14)} fontFamily={FONTE.texto} fontSize={14} fill={COR.tinta3}>
            {Array.from({ length: 9 }, (_, k) => k * 12).map((i) => <text key={i} x={fx(GEO.cus)(i)} y={EIXO_T} textAnchor="middle">{hora(i)}</text>)}
          </g>
        </g>
        <Atendimento g={ga} id="r1a" hach={6 + 4 * z} linha={2 + z}
          cresce={(i) => interpolate(f, [k1 + 6 + i * 0.42, k1 + 16 + i * 0.42], [0, 1], { ...cl, easing: saida })}
          rev={interpolate(f, [k1 + 10, k1 + 56], [ga.L, ga.R + 2], { ...cl, easing: suave })} />
      </svg>
    </AbsoluteFill>
  );
};
