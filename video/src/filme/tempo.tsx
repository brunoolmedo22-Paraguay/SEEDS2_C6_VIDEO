// Remapeamento do tempo de uma cena APROVADA, sem reescrevê-la: o quadro de saída f mostra o componente no quadro de origem
// mapa(f) (interpolação linear por trechos, quadros fracionários — sem pular nem duplicar quadros). Trechos com fator > 1
// aceleram animações; trechos em que a cena está ESTÁTICA podem ser percorridos depressa (= pausa mais curta).
// Só o RITMO muda: geometria, cores, textos e dados de cada quadro são os da cena original naquele instante.
import { Freeze, interpolate, useCurrentFrame } from "remotion";

export type Mapa = readonly (readonly [number, number])[];      // [quadro de saída, quadro de origem], crescentes
export const duracaoMapa = (m: Mapa) => m[m.length - 1][0];

export const Remapear: React.FC<{ mapa: Mapa; children: React.ReactNode }> = ({ mapa, children }) => {
  const f = useCurrentFrame();
  const src = interpolate(f, mapa.map((p) => p[0]), mapa.map((p) => p[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Freeze frame={src}>{children}</Freeze>;
};

/** Bloco com construção acelerada, leitura curta e saída: [a, a + fimConstrucao] → `construcao` quadros; trecho estável até
 *  b − saidaOrig → `leitura` quadros; [b − saidaOrig, b] → `saida` quadros. Devolve os pontos a partir do quadro de saída o0. */
export const bloco = (o0: number, a: number, b: number, fimConstrucao: number, construcao: number, leitura: number, saidaOrig: number, saida: number): [number, number][] => [
  [o0 + construcao, a + fimConstrucao], [o0 + construcao + leitura, b - saidaOrig], [o0 + construcao + leitura + saida, b],
];
