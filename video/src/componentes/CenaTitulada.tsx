// Padrão aprovado na prova v1: título digitado no centro → sobe e reduz para o topo → conteúdo entra.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Ritmo, TituloDigitado, fimDaDigitacao } from "./TituloDigitado";

// mesma lógica do ritmo aprovado (PASSO 1), cadência um pouco mais rápida para títulos de capítulo
export const RITMO_RAPIDO: Ritmo = { inicio: 6, pausaInicial: 10, pausaEspaco: 5, min: 2, max: 4, semente: "cap1" };
export const momentoSubida = (texto: string, r: Ritmo, folga = 18) => fimDaDigitacao(texto, r) + folga;

export const TituloQueSobe: React.FC<{ texto: string; tamanho: number; ritmo: Ritmo; sobe: number; escalaFinal?: number; alturaFinal?: number }> = ({ texto, tamanho, ritmo, sobe, escalaFinal = 0.62, alturaFinal = 130 }) => {
  const f = useCurrentFrame();
  const ease = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) } as const;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center",
      translate: interpolate(f, [sobe, sobe + 30], ["0px 0px", `0px ${alturaFinal - 540}px`], ease),
      scale: interpolate(f, [sobe, sobe + 30], [1, escalaFinal], ease) }}>
      <TituloDigitado texto={texto} tamanho={tamanho} ritmo={ritmo} ocultarCursorEm={sobe} />
    </AbsoluteFill>
  );
};

/** Opacidade de entrada/saída de uma cena (fundo preto entre cenas; sem efeitos exagerados). */
export const opacidadeCena = (f: number, dur: number, entra = 10, sai = 14) =>
  interpolate(f, [0, entra, dur - sai, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
