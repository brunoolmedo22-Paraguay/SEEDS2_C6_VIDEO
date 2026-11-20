// R4 · FILME v2 — SEM × COM BATERIA, SÓ LADO A LADO (decisão do responsável após o filme v1: sem a etapa de sobreposição,
// sem tela isolada de PEAK SHAVING). A R4 do capítulo 3 v2 (capitulo3v2/R4Comparacao2.tsx) fica intacta.
//   Importação no PCC das duas rodadas oficiais (séries GRAVADAS, degrau por intervalo, sem alisamento):
//   esquerda = C6-A 6f164853 (sem BESS) · direita = C6-B 4713c3e1 (com BESS); MESMA escala vertical (0–1.200 MW = limite
//   declarado do PCC) e MESMO eixo do tempo (00h–24h). As duas curvas se desenham EM PARALELO.
//   Ponta tarifária destacada nos dois gráficos; 19:30 marcado nos dois (1.005 MW × 805 MW); no gráfico da direita, a guia
//   da diferença sem − com bateria por intervalo (= descarga gravada, violeta) e a cota −200 MW às 19:30. PEAK SHAVING / −200 MW NA PONTA surgem NO ALTO da mesma composição.
//   O degrau das 21:00 com bateria (+193 MW em 15 min) fica marcado e a nota diz que a rampa máxima do dia NÃO foi reduzida.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cl, saida, suave } from "../componentes/grafico";
import { COR, FONTE } from "../tema";
import { I_1930, MW, N, PONTA, hora, impA, impB } from "../capitulo3/dados";

export const TL_R4L = { titulos: 4, eixos: 10, curvas: [24, 84] as const, ponta: 84, valores: 100, guia: 118, cota: 132,
  peak: 152, sub: 176, h21: 204, nota: 222 } as const;
export const DUR_R4L = 372;                                   // PEAK SHAVING visível ≈ 6 s (até a saída)

type G = { L: number; R: number; T: number; B: number };
const ESQ: G = { L: 150, R: 900, T: 430, B: 880 }, DIR: G = { L: 1090, R: 1840, T: 430, B: 880 };
const YMAX = 1_200_000;
const sx = (g: G) => (i: number) => g.L + (i / N) * (g.R - g.L);
const sy = (g: G) => (v: number) => g.B - (v / YMAX) * (g.B - g.T);
const passos = (s: number[], g: G) => { const x = sx(g), y = sy(g); return s.reduce((d, v, i) => d + (i === 0 ? `M${x(0)},${y(v)}` : `V${y(v)}`) + `H${x(i + 1)}`, ""); };
const area = (s: number[], g: G) => passos(s, g) + `V${sy(g)(0)}H${sx(g)(0)}Z`;
const J21 = PONTA[1];
const subida = (a: number[]) => Math.max(...a.slice(1).map((v, i) => v - a[i]));
const subidaA = subida(impA), subidaB = subida(impB);
const ent = (f: number, ini: number, dur = 16, ease = saida) => interpolate(f, [ini, ini + dur], [0, 1], { ...cl, easing: ease });

const Eixos: React.FC<{ g: G; op: number }> = ({ g, op }) => {
  const y = sy(g), x = sx(g);
  return (
    <g opacity={op} fontFamily={FONTE.texto}>
      {[0, 250_000, 500_000, 750_000, 1_000_000].map((v) => (
        <g key={v}>
          <line x1={g.L} x2={g.R} y1={y(v)} y2={y(v)} stroke={v === 0 ? "rgba(255,255,255,.28)" : COR.linha} strokeWidth={v === 0 ? 2 : 1.5} />
          <text x={g.L - 16} y={y(v) + 8} textAnchor="end" fontSize={22} fill={COR.tinta3}>{MW(v)}</text>
        </g>
      ))}
      <text x={g.L - 16} y={g.T - 22} textAnchor="end" fontSize={20} fill={COR.tinta3}>MW</text>
      {[0, 24, 48, 72, 96].map((i) => <text key={i} x={x(i)} y={g.B + 36} textAnchor="middle" fontSize={22} fill={COR.tinta3}>{String(i / 4).padStart(2, "0")}h</text>)}
    </g>
  );
};

const FaixaPonta: React.FC<{ g: G; op: number }> = ({ g, op }) => {
  const x = sx(g);
  return (
    <g opacity={op}>
      <rect x={x(PONTA[0])} y={g.T - 6} width={x(PONTA[1]) - x(PONTA[0])} height={g.B - g.T + 6} fill={COR.tar} opacity={0.09} />
      {[PONTA[0], PONTA[1]].map((i) => <line key={i} x1={x(i)} x2={x(i)} y1={g.T - 6} y2={g.B} stroke={COR.tar} strokeOpacity={0.5} strokeDasharray="3 6" strokeWidth={2} />)}
      <text x={(x(PONTA[0]) + x(PONTA[1])) / 2} y={g.B - 16} textAnchor="middle" fontFamily={FONTE.texto} fontSize={20} fill={COR.tar}>ponta</text>
    </g>
  );
};

const Curva: React.FC<{ s: number[]; g: G; rev: number; id: string }> = ({ s, g, rev, id }) => (
  <g clipPath={`url(#${id})`}>
    <defs><clipPath id={id}><rect x={0} y={0} width={g.L + (g.R - g.L) * rev} height={1080} /></clipPath></defs>
    <path d={area(s, g)} fill={COR.grid} opacity={0.16} />
    <path d={passos(s, g)} fill="none" stroke={COR.grid} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

export const R4LadoALado = () => {
  const f = useCurrentFrame();
  const T = TL_R4L;
  const tit = ent(f, T.titulos, 18), eixos = ent(f, T.eixos, 18);
  const rev = interpolate(f, T.curvas, [0, 1], { ...cl, easing: suave });
  const ponta = ent(f, T.ponta), val = ent(f, T.valores, 18), guia = ent(f, T.guia, 20, suave), cota = ent(f, T.cota, 16, suave);
  const peak = ent(f, T.peak, 22), sub = ent(f, T.sub, 18), marca = ent(f, T.h21, 16, suave), nota = ent(f, T.nota, 20);
  const xA = sx(ESQ), yA = sy(ESQ), xB = sx(DIR), yB = sy(DIR);
  const cx = (x: (i: number) => number) => (x(I_1930) + x(I_1930 + 1)) / 2;
  const cab = (g: G) => (rev > 0 && rev < 1 ? g.L + (g.R - g.L) * rev : null);
  return (
    <AbsoluteFill style={{ background: COR.fundo, opacity: interpolate(f, [0, 12], [0, 1], cl) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* PEAK SHAVING — no alto da MESMA composição, sem cobrir os gráficos */}
        <g textAnchor="middle">
          <text x={960} y={132} fontFamily={FONTE.titulo} fontWeight={700} fontSize={100} letterSpacing="0.03em" fill={COR.tinta}
            opacity={peak} transform={`translate(960 132) scale(${0.96 + 0.04 * peak}) translate(-960 -132)`}>PEAK SHAVING</text>
          <text x={960} y={198} fontFamily={FONTE.titulo} fontWeight={600} fontSize={44} letterSpacing="0.04em" fill={COR.tar} opacity={sub}>−200 MW NA PONTA</text>
        </g>

        {/* títulos dos dois cenários */}
        <g opacity={tit} textAnchor="middle">
          <text x={(ESQ.L + ESQ.R) / 2} y={294} fontFamily={FONTE.titulo} fontWeight={600} fontSize={48} letterSpacing="0.02em" fill={COR.tinta}>SEM BATERIA</text>
          <text x={(DIR.L + DIR.R) / 2} y={294} fontFamily={FONTE.titulo} fontWeight={600} fontSize={48} letterSpacing="0.02em" fill={COR.tinta}>COM BATERIA</text>
          <text x={(ESQ.L + ESQ.R) / 2} y={330} fontFamily={FONTE.texto} fontSize={22} fill={COR.tinta3}>importação da rede · rodada C6-A 6f164853</text>
          <text x={(DIR.L + DIR.R) / 2} y={330} fontFamily={FONTE.texto} fontSize={22} fill={COR.tinta3}>importação da rede · rodada C6-B 4713c3e1</text>
        </g>
        <Eixos g={ESQ} op={eixos} /><Eixos g={DIR} op={eixos} />
        <FaixaPonta g={ESQ} op={ponta} /><FaixaPonta g={DIR} op={ponta} />
        <Curva s={impA} g={ESQ} rev={rev} id="r4l-a" />
        <Curva s={impB} g={DIR} rev={rev} id="r4l-b" />

        {/* cabeças de leitura durante o desenho paralelo */}
        {[ESQ, DIR].map((g, k) => { const p = cab(g); return p === null ? null : (
          <g key={k}>
            <line x1={p} x2={p} y1={g.T - 6} y2={g.B} stroke={COR.tinta} strokeOpacity={0.35} strokeWidth={2} />
            <text x={p} y={g.B + 70} textAnchor="middle" fontFamily={FONTE.texto} fontSize={22} fill={COR.tinta2}>{hora(Math.min(N - 1, Math.floor(rev * N)))}</text>
          </g>); })}

        {/* direita: em cada intervalo da ponta, a diferença sem − com bateria (= descarga gravada, 200 MW) acima da curva */}
        <g opacity={guia}>
          {Array.from({ length: PONTA[1] - PONTA[0] }, (_, k) => PONTA[0] + k).map((i) => (
            <rect key={i} x={xB(i) + 1} y={yB(impA[i])} width={xB(i + 1) - xB(i) - 2} height={yB(impB[i]) - yB(impA[i])} rx={2} fill={COR.bat} opacity={0.75} />
          ))}
          <text x={xB(PONTA[0]) - 14} y={yB(impA[I_1930]) - 30} textAnchor="end" fontFamily={FONTE.texto} fontSize={21} fill={COR.bat}>descarga da bateria</text>
        </g>
        <g opacity={cota}>
          {(() => { const x = cx(xB), y1 = yB(impA[I_1930]) + 5, y2 = yB(impB[I_1930]) - 9; return (
            <g>
              <g stroke={COR.tinta} strokeWidth={2.5}>
                <line x1={x} x2={x} y1={y1} y2={y2} /><line x1={x - 10} x2={x + 10} y1={y1} y2={y1} /><line x1={x - 10} x2={x + 10} y1={y2} y2={y2} />
              </g>
              <text x={xB(PONTA[0]) - 14} y={(y1 + y2) / 2 + 12} textAnchor="end" fontFamily={FONTE.titulo} fontWeight={700} fontSize={34} fill={COR.tinta}>−200 MW</text>
            </g>); })()}
        </g>

        {/* valores às 19:30 nos dois gráficos */}
        <g opacity={val} fontFamily={FONTE.titulo} fontWeight={600} fill={COR.tinta} textAnchor="middle">
          <circle cx={cx(xA)} cy={yA(impA[I_1930])} r={8} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
          <text x={cx(xA)} y={yA(impA[I_1930]) - 26} fontSize={34}>{MW(impA[I_1930])} MW</text>
          <text x={cx(xA)} y={yA(impA[I_1930]) + 40} fontFamily={FONTE.texto} fontWeight={400} fontSize={21} fill={COR.tinta2}>19:30</text>
          <circle cx={cx(xB)} cy={yB(impB[I_1930])} r={8} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
          <text x={cx(xB)} y={yB(impB[I_1930]) + 50} fontSize={34}>{MW(impB[I_1930])} MW</text>
          <text x={cx(xB)} y={yB(impB[I_1930]) + 80} fontFamily={FONTE.texto} fontWeight={400} fontSize={21} fill={COR.tinta2}>19:30</text>
        </g>

        {/* 21:00 — fim da descarga: degrau de subida da C6-B marcado (trecho após 21:00 inteiro visível) */}
        <g opacity={marca}>
          <line x1={xB(J21)} x2={xB(J21)} y1={yB(impB[J21 - 1])} y2={yB(impB[J21])} stroke={COR.tinta} strokeWidth={5} />
          <circle cx={xB(J21)} cy={yB(impB[J21])} r={8} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
          <text x={DIR.R} y={DIR.T - 44} textAnchor="end" fontFamily={FONTE.titulo} fontWeight={600} fontSize={28} fill={COR.tinta}>21:00 · +{MW(impB[J21] - impB[J21 - 1])} MW</text>
          <text x={DIR.R} y={DIR.T - 14} textAnchor="end" fontFamily={FONTE.texto} fontSize={20} fill={COR.tinta2}>em 15 min · fim da descarga</text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 976, textAlign: "center", fontFamily: FONTE.texto, fontSize: 24, color: COR.tinta2, opacity: nota }}>
        redução restrita à ponta tarifária · a rampa máxima do dia não foi reduzida (+{MW(subidaB)} MW às 21:00 com bateria × +{MW(subidaA)} MW sem)
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: FONTE.texto, fontSize: 19, color: COR.tinta3 }}>
        Importação no PCC · C6-A 6f164853 (sem BESS) × C6-B 4713c3e1 (com BESS) · médias de 15 min gravadas · mesma escala · tarifa sintética
      </div>
    </AbsoluteFill>
  );
};
