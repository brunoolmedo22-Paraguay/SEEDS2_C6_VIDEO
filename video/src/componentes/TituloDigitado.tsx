// Título digitado caractere a caractere, no ritmo medido em `PASSO 1.mp4`:
//   * o 1º caractere já aparece com o cursor e há uma pausa longa (≈ 0,6 s) antes do resto;
//   * cadência irregular de 3–7 quadros por caractere (determinística: `random(semente)`), pausa extra nos espaços;
//   * linha CENTRALIZADA que cresce simetricamente; cursor fino e alto que pisca com período ≈ 0,65 s quando parado.
import { random, useCurrentFrame } from "remotion";
import { COR, FONTE } from "../tema";

export type Ritmo = { inicio: number; pausaInicial: number; pausaEspaco: number; min: number; max: number; semente: string };
export const RITMO_PASSO1: Ritmo = { inicio: 8, pausaInicial: 16, pausaEspaco: 8, min: 3, max: 6, semente: "passo1" };
const PISCA = 20; // quadros por ciclo (≈ 0,67 s a 30 fps)

/** Quadro em que cada caractere aparece (índice i ⇒ texto.slice(0, i + 1) visível). */
export function agenda(texto: string, r: Ritmo = RITMO_PASSO1): number[] {
  const out: number[] = [];
  let f = r.inicio;
  for (let i = 0; i < texto.length; i++) {
    out.push(f);
    const passo = r.min + Math.floor(random(`${r.semente}-${i}`) * (r.max - r.min + 1));
    f += passo + (i === 0 ? r.pausaInicial : 0) + (texto[i] === " " ? r.pausaEspaco : 0);
  }
  return out;
}
export const fimDaDigitacao = (texto: string, r: Ritmo = RITMO_PASSO1) => agenda(texto, r)[texto.length - 1];

export const TituloDigitado: React.FC<{ texto: string; tamanho: number; ritmo?: Ritmo; ocultarCursorEm?: number }> = ({ texto, tamanho, ritmo = RITMO_PASSO1, ocultarCursorEm }) => {
  const frame = useCurrentFrame();
  const ag = agenda(texto, ritmo);
  const n = ag.filter((q) => q <= frame).length;
  const digitando = n > 0 && n < texto.length && frame - ag[n - 1] < PISCA / 2;
  const aceso = digitando || Math.floor(frame / (PISCA / 2)) % 2 === 0;
  const cursor = ocultarCursorEm === undefined || frame < ocultarCursorEm;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONTE.titulo, fontWeight: 500, fontSize: tamanho,
      letterSpacing: "0.02em", color: COR.tinta, whiteSpace: "pre", lineHeight: 1 }}>
      <span>{texto.slice(0, n)}</span>
      <span style={{ width: Math.max(2, tamanho * 0.035), height: tamanho * 1.35, marginLeft: tamanho * 0.08, background: COR.tinta,
        opacity: cursor && aceso ? 0.9 : 0 }} />
    </div>
  );
};
