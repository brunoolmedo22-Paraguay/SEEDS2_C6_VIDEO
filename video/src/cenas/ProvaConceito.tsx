// PROVA DE CONCEITO (≈ 14 s, 1920×1080, 30 fps) para avaliar movimento, tipografia, enquadramento e fidelidade.
// Não é cena definitiva. Roteiro de tempo (30 fps; S = fim da digitação + 24 quadros = quadro 129):
//   0–S      título digitado no centro (ritmo PASSO 1), cursor piscando ao final
//   S–S+30   título sobe e reduz  ·  S+15 eixos, legenda e rodapé
//   S+45–135 C6-A (sem BESS) é desenhada  ·  S+135–210 C6-B (com BESS) + faixa violeta do BESS
//   S+215    ponta tarifária + foco  ·  S+230 cota −200 MW  ·  S+258 transição das 21:00 (foco desfeito)  ·  fim S+300
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ImportacaoAB, TemposAB } from "../componentes/ImportacaoAB";
import { TituloDigitado, fimDaDigitacao } from "../componentes/TituloDigitado";
import { COR, FONTE } from "../tema";

export const TITULO = "IMPORTAÇÃO NO PCC";
const SOBE = Math.max(110, fimDaDigitacao(TITULO) + 24);   // título completo + ≈ 0,8 s de cursor piscando
export const DURACAO = SOBE + 300;                          // ≈ 1,4 s de pausa após a marcação das 21:00
const T: TemposAB = { eixos: SOBE + 15, curvaA: [SOBE + 45, SOBE + 135], curvaB: [SOBE + 135, SOBE + 210], ponta: SOBE + 215, reducao: SOBE + 230, transicao: SOBE + 258 };

const Titulo = () => {
  const f = useCurrentFrame();
  const ease = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) } as const;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center",
      translate: interpolate(f, [SOBE, SOBE + 30], ["0px 0px", "0px -410px"], ease),
      scale: interpolate(f, [SOBE, SOBE + 30], [1, 0.62], ease) }}>
      <TituloDigitado texto={TITULO} tamanho={112} ocultarCursorEm={SOBE} />
    </AbsoluteFill>
  );
};

const Rodape = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: FONTE.texto, fontSize: 21, color: COR.tinta3,
      opacity: interpolate(f, [T.eixos, T.eixos + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      Médias de 15 min gravadas · C6-A 6f164853 × C6-B 4713c3e1 · simulação algébrica offline · tarifa sintética
    </div>
  );
};

export const ProvaConceito = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <ImportacaoAB t={T} />
    <Titulo />
    <Rodape />
  </AbsoluteFill>
);
