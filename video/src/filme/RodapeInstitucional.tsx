// RODAPÉ INSTITUCIONAL GLOBAL (filme v4) — assinatura discreta com os seis logotipos (ordem do LEIA.txt), numa única fileira
// centrada na faixa inferior reservada (o conteúdo do filme é reduzido uniformemente para liberar essa faixa — nada é
// coberto). Logotipos de ferramentas/preparar_logos_rodape.py: mesmo tratamento dos logotipos do fechamento (cores e
// proporções oficiais; UFPB sem o branco externo nem os miolos do texto; franja semitransparente de CEAR/GPEnSE), mesma
// área óptica por marca (UNILA × 1,55), alturas de 28 a 44 px, tamanho EXATO de exibição.
// Legibilidade: direto no preto, LACA/UNILA (roxo-escuro, contraste ≈ 1,5) somem e o texto «UFPB» (preto) desaparece; por
// isso a fileira fica sobre UMA faixa estreita no cinza neutro já aprovado (#949494) — sem cartões individuais.
import { Img, staticFile } from "remotion";
import LOGOS from "../creditos/logos_rodape.json";
import { CINZA_CREDITOS } from "./Creditos2";

export const FAIXA_RODAPE = 72;                         // px reservados na base do quadro 1920×1080
const GAP = 34, PAD_X = 24, ALT = 56, H_MAX = 44;
const LARGURA = LOGOS.reduce((s, l) => s + l.w, 0) + GAP * (LOGOS.length - 1);
const X0 = Math.round((1920 - LARGURA) / 2), Y_FAIXA = 1080 - FAIXA_RODAPE, Y_PILULA = Y_FAIXA + Math.round((FAIXA_RODAPE - ALT) / 2);

export const RodapeInstitucional: React.FC<{ opacidade: number }> = ({ opacidade }) => {
  let x = X0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: opacidade, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: X0 - PAD_X, top: Y_PILULA, width: LARGURA + 2 * PAD_X, height: ALT, borderRadius: ALT / 2, background: CINZA_CREDITOS }} />
      {LOGOS.map((l) => {
        const el = <Img key={l.id} src={staticFile(l.arquivo)} width={l.w} height={l.h}
          style={{ position: "absolute", left: x, top: Y_PILULA + Math.round((ALT - H_MAX) / 2) + Math.round((H_MAX - l.h) / 2) }} />;
        x += l.w + GAP;
        return el;
      })}
    </div>
  );
};
