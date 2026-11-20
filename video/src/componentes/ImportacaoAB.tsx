// Importação no PCC: C6-A (sem BESS) × C6-B (com BESS), SOBREPOSTAS, desenhadas a partir das séries GRAVADAS.
// Convenções da Partitura (trama.js): grandeza de intervalo = DEGRAU em [t_k, t_k+1) (nunca linha inclinada entre médias);
// rede em vermelho; bateria em violeta — descarga cheia, carga hachurada. A faixa violeta entre as curvas é exatamente
// carga − descarga do BESS (B − A, conferido em preparar_dados.py). Nenhum valor é interpolado: a animação só revela
// (máscara da esquerda para a direita), muda opacidade e foco.
import { Easing, interpolate, useCurrentFrame } from "remotion";
import A from "../dados/c6a.json";
import B from "../dados/c6b.json";
import { COR, FONTE } from "../tema";

export type TemposAB = {
  eixos: number;      // entrada da grade/eixos/legenda
  curvaA: [number, number];  // revelação da C6-A
  curvaB: [number, number];  // revelação da C6-B e da faixa do BESS
  ponta: number;      // faixa da ponta tarifária + foco
  reducao: number;    // cota «−200 MW»
  transicao: number;  // marcação das 21:00 (fim do foco)
};

const N = 96;
const L = 230, R = 1690, TOPO = 300, BASE = 880;        // área do gráfico (px no quadro 1920×1080)
const YMAX = 1_200_000;                                  // = limite de importação declarado do PCC (1.200 MW)
const x = (i: number) => L + (i / N) * (R - L);
const y = (kW: number) => BASE - (kW / YMAX) * (BASE - TOPO);
const impA: number[] = A.importacao_kW, impB: number[] = B.importacao_kW, tar: number[] = B.tarifa_R_kWh;
const degraus = (s: number[]) => s.reduce((d, v, i) => d + (i === 0 ? `M${x(0)},${y(v)}` : `V${y(v)}`) + `H${x(i + 1)}`, "");
const PONTA = tar.map((t, i) => (t === 1.5 ? i : -1)).filter((i) => i >= 0);       // 18:00–20:45 (12 intervalos)
const P0 = PONTA[0], P1 = PONTA[PONTA.length - 1] + 1;                                // [P0, P1) = 18:00–21:00
// pt-BR sem depender do ICU do navegador de render (o headless shell formata «1,000»): milhar com ponto
const MW = (kW: number) => String(Math.round(kW / 1000)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.33, 0, 0.2, 1);

export const ImportacaoAB: React.FC<{ t: TemposAB }> = ({ t }) => {
  const f = useCurrentFrame();
  const eixos = interpolate(f, [t.eixos, t.eixos + 20], [0, 1], cl);
  const revA = interpolate(f, t.curvaA, [x(0), x(N)], { ...cl, easing: suave });
  const revB = interpolate(f, t.curvaB, [x(0), x(N)], { ...cl, easing: suave });
  const faixa = interpolate(f, [t.ponta, t.ponta + 15], [0, 1], cl);
  // foco na ponta: fora dela as curvas esmaecem (como o destaque da Partitura) e voltam na transição das 21:00
  const foco = interpolate(f, [t.ponta, t.ponta + 15, t.transicao, t.transicao + 15], [1, 0.3, 0.3, 1], cl);
  const cota = interpolate(f, [t.reducao, t.reducao + 15], [0, 1], { ...cl, easing: suave });
  const marca = interpolate(f, [t.transicao, t.transicao + 15], [0, 1], { ...cl, easing: suave });
  const playA = f > t.curvaA[0] && f < t.curvaA[1] + 6 ? revA : null, playB = f > t.curvaB[0] && f < t.curvaB[1] + 6 ? revB : null;
  const play = playB ?? playA;
  const hora = (px: number) => { const i = Math.min(N - 1, Math.max(0, Math.floor(((px - L) / (R - L)) * N))); return A.inicio_local[i]; };
  const iCota = P0 + 6;                                    // 19:30, meio da ponta
  const j21 = P1;                                          // 21:00: primeiro intervalo após a ponta

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <pattern id="hach-bat" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={10} height={10} fill={COR.fundo} /><rect width={4.8} height={10} fill={COR.bat} />
        </pattern>
        <clipPath id="revA"><rect x={0} y={0} width={revA} height={1080} /></clipPath>
        <clipPath id="revB"><rect x={0} y={0} width={revB} height={1080} /></clipPath>
        <clipPath id="foraDaPonta"><rect x={0} y={0} width={x(P0)} height={1080} /><rect x={x(P1)} y={0} width={1920} height={1080} /></clipPath>
        <clipPath id="naPonta"><rect x={x(P0)} y={0} width={x(P1) - x(P0)} height={1080} /></clipPath>
      </defs>

      {/* grade, eixos e legenda */}
      <g opacity={eixos} fontFamily={FONTE.texto}>
        {[0, 250_000, 500_000, 750_000, 1_000_000].map((v) => (
          <g key={v}>
            <line x1={L} x2={R} y1={y(v)} y2={y(v)} stroke={v === 0 ? "rgba(255,255,255,.28)" : COR.linha} strokeWidth={v === 0 ? 2 : 1.5} />
            <text x={L - 18} y={y(v) + 8} textAnchor="end" fontSize={24} fill={COR.tinta3}>{MW(v)}</text>
          </g>
        ))}
        <text x={L - 18} y={TOPO - 30} textAnchor="end" fontSize={22} fill={COR.tinta3}>MW</text>
        {Array.from({ length: 9 }, (_, k) => k * 12).map((i) => (
          <text key={i} x={x(i)} y={BASE + 40} textAnchor="middle" fontSize={24} fill={COR.tinta3}>{String((i / 4) | 0).padStart(2, "0")}h</text>
        ))}
        <g transform={`translate(${L}, ${TOPO - 62})`} fontSize={25} fill={COR.tinta2}>
          <line x1={0} x2={44} y1={-8} y2={-8} stroke={COR.grid} strokeWidth={3} strokeDasharray="9 7" opacity={0.85} />
          <text x={56} y={0}>sem BESS · C6-A</text>
          <line x1={270} x2={314} y1={-8} y2={-8} stroke={COR.grid} strokeWidth={5} />
          <text x={326} y={0}>com BESS · C6-B</text>
          <rect x={552} y={-20} width={24} height={24} rx={3} fill={COR.bat} />
          <text x={588} y={0}>descarga</text>
          <rect x={712} y={-20} width={24} height={24} rx={3} fill="url(#hach-bat)" />
          <text x={748} y={0}>carga</text>
        </g>
      </g>

      {/* faixa da ponta tarifária (sintética): 18:00–21:00 */}
      <g opacity={faixa}>
        <rect x={x(P0)} y={TOPO - 10} width={x(P1) - x(P0)} height={BASE - TOPO + 10} fill={COR.tar} opacity={0.07} />
        <line x1={x(P0)} x2={x(P0)} y1={TOPO - 10} y2={BASE} stroke={COR.tar} strokeOpacity={0.5} strokeDasharray="3 6" strokeWidth={2} />
        <line x1={x(P1)} x2={x(P1)} y1={TOPO - 10} y2={BASE} stroke={COR.tar} strokeOpacity={0.5} strokeDasharray="3 6" strokeWidth={2} />
        <text x={(x(P0) + x(P1)) / 2} y={BASE - 52} textAnchor="middle" fontFamily={FONTE.texto} fontSize={24} fill={COR.tar}>ponta tarifária</text>
        <text x={(x(P0) + x(P1)) / 2} y={BASE - 20} textAnchor="middle" fontFamily={FONTE.texto} fontSize={24} fill={COR.tar}>1,50 R$/kWh</text>
      </g>

      {/* curvas: duas cópias recortadas (fora × dentro da ponta) para o foco sem alterar o desenho */}
      {(["foraDaPonta", "naPonta"] as const).map((zona) => (
        <g key={zona} clipPath={`url(#${zona})`} opacity={zona === "foraDaPonta" ? foco : 1}>
          <g clipPath="url(#revB)">
            {impB.map((b, i) => {
              const a = impA[i], d = b - a;
              if (Math.abs(d) < 1) return null;
              return <rect key={i} x={x(i)} width={x(i + 1) - x(i)} y={y(Math.max(a, b))} height={Math.abs(y(a) - y(b))}
                fill={d > 0 ? "url(#hach-bat)" : COR.bat} opacity={d > 0 ? 0.9 : 0.85} />;
            })}
          </g>
          <path d={degraus(impA)} fill="none" stroke={COR.grid} strokeWidth={3} strokeDasharray="9 7" opacity={0.85} clipPath="url(#revA)" />
          <path d={degraus(impB)} fill="none" stroke={COR.grid} strokeWidth={5} strokeLinejoin="round" clipPath="url(#revB)" />
        </g>
      ))}

      {/* cabeça de leitura durante a revelação */}
      {play !== null && (
        <g>
          <line x1={play} x2={play} y1={TOPO - 10} y2={BASE} stroke={COR.tinta} strokeOpacity={0.35} strokeWidth={2} />
          <text x={play} y={BASE + 74} textAnchor="middle" fontFamily={FONTE.texto} fontSize={24} fill={COR.tinta2}>{hora(play)}</text>
        </g>
      )}

      {/* cota −200 MW no meio da ponta (valor gravado: 200.000 kW em todos os 12 intervalos) */}
      <g opacity={cota} transform={`translate(${(1 - cota) * -12}, 0)`}>
        <line x1={x(iCota)} x2={x(iCota)} y1={y(impA[iCota]) + 6} y2={y(impB[iCota]) - 6} stroke={COR.tinta} strokeWidth={2.5} />
        <line x1={x(iCota) - 12} x2={x(iCota) + 12} y1={y(impA[iCota]) + 6} y2={y(impA[iCota]) + 6} stroke={COR.tinta} strokeWidth={2.5} />
        <line x1={x(iCota) - 12} x2={x(iCota) + 12} y1={y(impB[iCota]) - 6} y2={y(impB[iCota]) - 6} stroke={COR.tinta} strokeWidth={2.5} />
        {/* rótulo no espaço livre acima de 1,05 GW (nenhuma série passa ali), ligado à cota por um fio */}
        <polyline points={`${x(P0) - 20},${y(1_120_000) - 18} ${x(iCota)},${y(1_120_000) - 18} ${x(iCota)},${y(impA[iCota]) + 6}`} fill="none" stroke={COR.tinta} strokeOpacity={0.5} strokeWidth={1.5} />
        <text x={x(P0) - 32} y={y(1_120_000)} textAnchor="end" fontFamily={FONTE.titulo} fontWeight={600} fontSize={64} fill={COR.tinta}>−200 MW</text>
        <text x={x(P0) - 32} y={y(1_120_000) + 36} textAnchor="end" fontFamily={FONTE.texto} fontSize={25} fill={COR.tinta2}>em cada intervalo da ponta</text>
      </g>

      {/* 21:00 — fim da descarga: o degrau de subida do C6-B fica visível e marcado */}
      <g opacity={marca}>
        <line x1={x(j21)} x2={x(j21)} y1={y(impB[j21 - 1])} y2={y(impB[j21])} stroke={COR.tinta} strokeWidth={5} />
        <circle cx={x(j21)} cy={y(impB[j21])} r={9} fill={COR.fundo} stroke={COR.tinta} strokeWidth={3} />
        <text x={x(j21) + 26} y={y(impB[j21]) - 54} fontFamily={FONTE.titulo} fontWeight={600} fontSize={40} fill={COR.tinta}>21:00 · +{MW(impB[j21] - impB[j21 - 1])} MW</text>
        <text x={x(j21) + 26} y={y(impB[j21]) - 20} fontFamily={FONTE.texto} fontSize={25} fill={COR.tinta2}>em 15 min · fim da descarga</text>
      </g>
    </svg>
  );
};
