// R4 v2 · igual à v1 aprovada (capitulo3/R4Comparacao.tsx, preservada), com: revelação das curvas ≈ 15 % mais rápida
// (130 → 110 quadros; pausas e a transição para a sobreposição com a mesma duração) e um FECHAMENTO limpo: o gráfico sai e
// «PEAK SHAVING / −200 MW NA PONTA» desce ao centro e cresce — conclusão energética, sem resultados econômicos.
// (v1:) R4 · SEM × COM BATERIA → PEAK SHAVING — importação no PCC das duas rodadas oficiais (séries GRAVADAS, degrau por
// intervalo). Fase A: lado a lado, MESMA escala vertical (0–1.200 MW = limite declarado do PCC) e MESMO eixo do tempo.
// Fase B: as duas caixas se movem até a geometria da prova de conceito aprovada (ImportacaoAB: L 230, R 1690, topo 300,
// base 880) e se SOBREPÕEM — só a geometria muda; os valores são os gravados. Fase C: faixa violeta = B − A = carga −
// descarga do BESS; ponta tarifária; «PEAK SHAVING · −200 MW NA PONTA»; a subida das 21:00 fica marcada e visível.
// Não se afirma redução do pico diário nem suavização da rampa (o maior degrau do dia é o das 21:00 na C6-B).
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cl, saida, suave } from "../componentes/grafico";
import { COR, FONTE } from "../tema";
import { I_1930, MW, N, PONTA, hora, impA, impB } from "../capitulo3/dados";

export const TL_R4 = { titulos: 8, eixos: 20, curvas: [46, 156] as const, valores: 176, guia: 206, morfo: [400, 480] as const, faixa: 486,
  ponta: 510, titulo: 540, cota: 590, h21: 680, nota: 730, fecha: 940, centro: [950, 1000] as const };
export const DUR_R4_2 = 1110;

type G = { L: number; R: number; T: number; B: number };
const ESQ: G = { L: 150, R: 900, T: 320, B: 860 }, DIR: G = { L: 1090, R: 1840, T: 320, B: 860 }, POC: G = { L: 230, R: 1690, T: 300, B: 880 };
const mix = (a: G, b: G, t: number): G => ({ L: a.L + (b.L - a.L) * t, R: a.R + (b.R - a.R) * t, T: a.T + (b.T - a.T) * t, B: a.B + (b.B - a.B) * t });
const YMAX = 1_200_000;
const sx = (g: G) => (i: number) => g.L + (i / N) * (g.R - g.L);
const sy = (g: G) => (v: number) => g.B - (v / YMAX) * (g.B - g.T);
const passos = (s: number[], g: G) => { const x = sx(g), y = sy(g); return s.reduce((d, v, i) => d + (i === 0 ? `M${x(0)},${y(v)}` : `V${y(v)}`) + `H${x(i + 1)}`, ""); };
const area = (s: number[], g: G) => passos(s, g) + `V${sy(g)(0)}H${sx(g)(0)}Z`;
const J21 = PONTA[1];
const subida = (a: number[]) => Math.max(...a.slice(1).map((v, i) => v - a[i]));   // maior degrau de subida do dia
const subidaA = subida(impA), subidaB = subida(impB);                                                   // 21:00, primeiro intervalo após a ponta

const Eixos: React.FC<{ g: G; op: number; passoH: number }> = ({ g, op, passoH }) => {
  const y = sy(g), x = sx(g);
  return (
    <g opacity={op} fontFamily={FONTE.texto}>
      {[0, 250_000, 500_000, 750_000, 1_000_000].map((v) => (
        <g key={v}>
          <line x1={g.L} x2={g.R} y1={y(v)} y2={y(v)} stroke={v === 0 ? "rgba(255,255,255,.28)" : COR.linha} strokeWidth={v === 0 ? 2 : 1.5} />
          <text x={g.L - 16} y={y(v) + 8} textAnchor="end" fontSize={22} fill={COR.tinta3}>{MW(v)}</text>
        </g>
      ))}
      <text x={g.L - 16} y={g.T - 26} textAnchor="end" fontSize={20} fill={COR.tinta3}>MW</text>
      {Array.from({ length: 24 / passoH + 1 }, (_, k) => k * passoH * 4).map((i) => (
        <text key={i} x={x(i)} y={g.B + 36} textAnchor="middle" fontSize={22} fill={COR.tinta3}>{String(i / 4).padStart(2, "0")}h</text>
      ))}
    </g>
  );
};

const FaixaPonta: React.FC<{ g: G; op: number; rot: boolean }> = ({ g, op, rot }) => {
  const x = sx(g);
  return (
    <g opacity={op}>
      <rect x={x(PONTA[0])} y={g.T - 10} width={x(PONTA[1]) - x(PONTA[0])} height={g.B - g.T + 10} fill={COR.tar} opacity={0.07} />
      {[PONTA[0], PONTA[1]].map((i) => <line key={i} x1={x(i)} x2={x(i)} y1={g.T - 10} y2={g.B} stroke={COR.tar} strokeOpacity={0.5} strokeDasharray="3 6" strokeWidth={2} />)}
      {rot && <>
        <text x={(x(PONTA[0]) + x(PONTA[1])) / 2} y={g.B - 52} textAnchor="middle" fontFamily={FONTE.texto} fontSize={23} fill={COR.tar}>ponta tarifária</text>
        <text x={(x(PONTA[0]) + x(PONTA[1])) / 2} y={g.B - 22} textAnchor="middle" fontFamily={FONTE.texto} fontSize={23} fill={COR.tar}>1,50 R$/kWh</text>
      </>}
    </g>
  );
};

export const R4Comparacao2 = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, TL_R4.morfo, [0, 1], { ...cl, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
  const gA = mix(ESQ, POC, z), gB = mix(DIR, POC, z);
  const tit = interpolate(f, [TL_R4.titulos, TL_R4.titulos + 18, TL_R4.morfo[0], TL_R4.morfo[0] + 20], [0, 1, 1, 0], cl);
  const eixos = interpolate(f, [TL_R4.eixos, TL_R4.eixos + 18], [0, 1], cl);
  const rev = interpolate(f, TL_R4.curvas, [0, 1], { ...cl, easing: suave });
  const val = interpolate(f, [TL_R4.valores, TL_R4.valores + 18, TL_R4.morfo[0], TL_R4.morfo[0] + 16], [0, 1, 1, 0], cl);
  const guia = interpolate(f, [TL_R4.guia, TL_R4.guia + 24, TL_R4.morfo[0], TL_R4.morfo[0] + 16], [0, 1, 1, 0], { ...cl, easing: suave });
  const ponta1 = interpolate(f, [TL_R4.curvas[1] - 10, TL_R4.curvas[1] + 10, TL_R4.morfo[0], TL_R4.morfo[0] + 16], [0, 1, 1, 0], cl);
  const tracejado = interpolate(f, [TL_R4.morfo[0] + 20, TL_R4.morfo[1]], [0, 1], cl);
  const preench = 1 - interpolate(f, TL_R4.morfo, [0, 1], cl);
  const faixa = interpolate(f, [TL_R4.faixa, TL_R4.faixa + 20], [0, 1], cl);
  const ponta2 = interpolate(f, [TL_R4.ponta, TL_R4.ponta + 16], [0, 1], cl);
  const foco = interpolate(f, [TL_R4.ponta, TL_R4.ponta + 16, TL_R4.h21, TL_R4.h21 + 16], [1, 0.32, 0.32, 1], cl);
  const titulo = interpolate(f, [TL_R4.titulo, TL_R4.titulo + 22], [0, 1], { ...cl, easing: saida });
  const sub = interpolate(f, [TL_R4.titulo + 26, TL_R4.titulo + 44], [0, 1], cl);
  const cota = interpolate(f, [TL_R4.cota, TL_R4.cota + 16], [0, 1], { ...cl, easing: suave });
  const marca = interpolate(f, [TL_R4.h21, TL_R4.h21 + 16], [0, 1], { ...cl, easing: suave });
  const nota = interpolate(f, [TL_R4.nota, TL_R4.nota + 20], [0, 1], cl);
  const leg = interpolate(f, [TL_R4.morfo[1] - 10, TL_R4.morfo[1] + 10], [0, 1], cl);
  const sai = interpolate(f, [DUR_R4_2 - 20, DUR_R4_2], [1, 0], cl);
  const fecha = interpolate(f, [TL_R4.fecha, TL_R4.fecha + 30], [1, 0], { ...cl, easing: suave });        // gráfico e notas saem
  const m = interpolate(f, TL_R4.centro, [0, 1], { ...cl, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
  const xP = sx(POC), yP = sy(POC);
  const revPx = (g: G) => g.L + (g.R - g.L) * rev;
  const cab = (g: G) => (rev > 0 && rev < 1 ? revPx(g) : null);
  return (
    <AbsoluteFill style={{ background: COR.fundo, opacity: interpolate(f, [0, 12], [0, 1], cl) * sai }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
       <g opacity={fecha}>
        <defs>
          <pattern id="r4-h" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={4.8} height={10} fill={COR.bat} /></pattern>
          <clipPath id="r4-a"><rect x={0} y={0} width={revPx(gA)} height={1080} /></clipPath>
          <clipPath id="r4-b"><rect x={0} y={0} width={revPx(gB)} height={1080} /></clipPath>
          <clipPath id="r4-fora"><rect x={0} y={0} width={xP(PONTA[0])} height={1080} /><rect x={xP(PONTA[1])} y={0} width={1920} height={1080} /></clipPath>
          <clipPath id="r4-dentro"><rect x={xP(PONTA[0])} y={0} width={xP(PONTA[1]) - xP(PONTA[0])} height={1080} /></clipPath>
        </defs>

        {/* fase A: títulos dos dois cenários */}
        <g opacity={tit} textAnchor="middle">
          <text x={(ESQ.L + ESQ.R) / 2} y={190} fontFamily={FONTE.titulo} fontWeight={600} fontSize={56} letterSpacing="0.02em" fill={COR.tinta}>SEM BATERIA</text>
          <text x={(DIR.L + DIR.R) / 2} y={190} fontFamily={FONTE.titulo} fontWeight={600} fontSize={56} letterSpacing="0.02em" fill={COR.tinta}>COM BATERIA</text>
          <text x={(ESQ.L + ESQ.R) / 2} y={232} fontFamily={FONTE.texto} fontSize={24} fill={COR.tinta3}>importação da rede · rodada C6-A 6f164853</text>
          <text x={(DIR.L + DIR.R) / 2} y={232} fontFamily={FONTE.texto} fontSize={24} fill={COR.tinta3}>importação da rede · rodada C6-B 4713c3e1</text>
        </g>
        <Eixos g={gA} op={eixos * (1 - z)} passoH={6} />
        <Eixos g={gB} op={eixos} passoH={z > 0.5 ? 3 : 6} />
        <FaixaPonta g={gA} op={ponta1 * 0.8} rot={false} />
        <FaixaPonta g={gB} op={ponta1 * 0.8} rot={false} />
        <FaixaPonta g={POC} op={ponta2} rot />

        {/* fase C: faixa B − A (= ação do BESS), recortada fora × dentro da ponta para o foco */}
        {(["r4-fora", "r4-dentro"] as const).map((zona) => (
          <g key={zona} clipPath={`url(#${zona})`} opacity={zona === "r4-fora" ? foco : 1}>
            <g opacity={faixa}>
              {impB.map((b, i) => {
                const a = impA[i], d = b - a;
                if (Math.abs(d) < 1) return null;
                return <rect key={i} x={xP(i)} width={xP(i + 1) - xP(i)} y={yP(Math.max(a, b))} height={Math.abs(yP(a) - yP(b))} fill={d > 0 ? "url(#r4-h)" : COR.bat} opacity={d > 0 ? 0.9 : 0.85} />;
              })}
            </g>
            {/* sem bateria: cheia à esquerda → tracejada na sobreposição */}
            <g clipPath="url(#r4-a)">
              <path d={area(impA, gA)} fill={COR.grid} opacity={0.16 * preench} />
              <path d={passos(impA, gA)} fill="none" stroke={COR.grid} strokeWidth={4} opacity={1 - tracejado} />
              <path d={passos(impA, gA)} fill="none" stroke={COR.grid} strokeWidth={3} strokeDasharray="9 7" opacity={0.85 * tracejado} />
            </g>
            <g clipPath="url(#r4-b)">
              <path d={area(impB, gB)} fill={COR.grid} opacity={0.16 * preench} />
              <path d={passos(impB, gB)} fill="none" stroke={COR.grid} strokeWidth={4 + tracejado} strokeLinejoin="round" />
            </g>
          </g>
        ))}

        {/* cabeças de leitura (fase A) */}
        {[gA, gB].map((g, k) => { const p = cab(g); return p === null ? null : (
          <g key={k}>
            <line x1={p} x2={p} y1={g.T - 10} y2={g.B} stroke={COR.tinta} strokeOpacity={0.35} strokeWidth={2} />
            <text x={p} y={g.B + 70} textAnchor="middle" fontFamily={FONTE.texto} fontSize={22} fill={COR.tinta2}>{hora(Math.min(N - 1, Math.floor(rev * N)))}</text>
          </g>); })}

        {/* valores às 19:30 e guia horizontal na MESMA escala */}
        <g opacity={guia}>
          {[[sx(gA)(I_1930 + 0.5), ESQ.R], [DIR.L, DIR.R]].map(([x1, x2], k) => (
            <line key={k} x1={x1} x2={x2} y1={sy(gA)(impA[I_1930])} y2={sy(gA)(impA[I_1930])} stroke={COR.tinta3} strokeWidth={1.8} strokeDasharray="4 8" />))}
        </g>
        <g opacity={val} fontFamily={FONTE.titulo} fontWeight={600} fill={COR.tinta}>
          {([[gA, impA], [gB, impB]] as const).map(([g, s], k) => {
            const cx = (sx(g)(I_1930) + sx(g)(I_1930 + 1)) / 2, cy = sy(g)(s[I_1930]);
            return (
              <g key={k}>
                <circle cx={cx} cy={cy} r={8} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
                <text x={cx} y={k === 0 ? cy - 24 : cy + 48} textAnchor="middle" fontSize={32}>{MW(s[I_1930])} MW</text>
                <text x={cx} y={k === 0 ? cy + 40 : cy + 78} textAnchor="middle" fontFamily={FONTE.texto} fontWeight={400} fontSize={21} fill={COR.tinta2}>19:30</text>
              </g>
            );
          })}
        </g>

        {/* legenda da sobreposição (como a prova aprovada) */}
        <g opacity={leg} transform={`translate(${POC.L}, ${POC.T - 52})`} fontFamily={FONTE.texto} fontSize={24} fill={COR.tinta2}>
          <line x1={0} x2={44} y1={-8} y2={-8} stroke={COR.grid} strokeWidth={3} strokeDasharray="9 7" opacity={0.85} /><text x={56} y={0}>sem bateria · C6-A</text>
          <line x1={286} x2={330} y1={-8} y2={-8} stroke={COR.grid} strokeWidth={5} /><text x={342} y={0}>com bateria · C6-B</text>
          <g opacity={faixa}>
            <rect x={586} y={-20} width={24} height={24} rx={3} fill={COR.bat} /><text x={620} y={0}>descarga</text>
            <rect x={740} y={-20} width={24} height={24} rx={3} fill="url(#r4-h)" /><text x={774} y={0}>carga</text>
          </g>
        </g>

        <g opacity={cota}>
          {(() => { const cx = xP(I_1930) + (xP(1) - xP(0)) / 2, ya = yP(impA[I_1930]) + 6, yb = yP(impB[I_1930]) - 6; return (
            <g stroke={COR.tinta} strokeWidth={2.5}>
              <line x1={cx} x2={cx} y1={ya} y2={yb} /><line x1={cx - 11} x2={cx + 11} y1={ya} y2={ya} /><line x1={cx - 11} x2={cx + 11} y1={yb} y2={yb} />
            </g>); })()}
        </g>

        {/* 21:00 — fim da descarga: degrau de subida da C6-B marcado */}
        <g opacity={marca}>
          <line x1={xP(J21)} x2={xP(J21)} y1={yP(impB[J21 - 1])} y2={yP(impB[J21])} stroke={COR.tinta} strokeWidth={5} />
          <circle cx={xP(J21)} cy={yP(impB[J21])} r={9} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
          <text x={xP(J21) + 26} y={yP(impB[J21]) - 54} fontFamily={FONTE.titulo} fontWeight={600} fontSize={38} fill={COR.tinta}>21:00 · +{MW(impB[J21] - impB[J21 - 1])} MW</text>
          <text x={xP(J21) + 26} y={yP(impB[J21]) - 20} fontFamily={FONTE.texto} fontSize={24} fill={COR.tinta2}>em 15 min · fim da descarga</text>
        </g>
       </g>
        {/* PEAK SHAVING — no alto durante a sobreposição; no fechamento desce ao centro e cresce */}
        <g textAnchor="middle">
          <g transform={`translate(960 ${118 + (540 - 118) * m}) scale(${(0.96 + 0.04 * titulo) * (1 + 0.6 * m)})`}>
            <text x={0} y={0} fontFamily={FONTE.titulo} fontWeight={700} fontSize={92} letterSpacing="0.03em" fill={COR.tinta} opacity={titulo}>PEAK SHAVING</text>
          </g>
          <g transform={`translate(960 ${176 + (650 - 176) * m}) scale(${1 + 0.45 * m})`}>
            <text x={0} y={0} fontFamily={FONTE.titulo} fontWeight={600} fontSize={40} letterSpacing="0.04em" fill={COR.tar} opacity={sub}>−200 MW NA PONTA</text>
          </g>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 962, textAlign: "center", fontFamily: FONTE.texto, fontSize: 25, color: COR.tinta2, opacity: nota * fecha }}>
        redução restrita à ponta tarifária · a rampa máxima do dia não foi reduzida (+{MW(subidaB)} MW às 21:00 com bateria × +{MW(subidaA)} MW sem)
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: FONTE.texto, fontSize: 19, color: COR.tinta3, opacity: fecha }}>
        Importação no PCC · C6-A 6f164853 (sem BESS) × C6-B 4713c3e1 (com BESS) · médias de 15 min gravadas · tarifa sintética
      </div>
    </AbsoluteFill>
  );
};
