// R0 · PONTE — continua o capítulo 2 a partir do ÚLTIMO quadro não esmaecido dele (Freeze): o fundo (PASSO 2 desfocado)
// sai, o painel «Concluída» permanece (mesmo componente, mesma posição, animação decorativa contínua), encolhe e dissolve.
// Depois, no preto: «SIMULAÇÃO CONCLUÍDA» digitado e uma linha pequena com o estado gravado da rodada.
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DUR_CAP2, TL2, Capitulo2 } from "../capitulo2/Capitulo2";
import { ModalExecucao, N_INT } from "../capitulo2/ModalExecucao";
import { RITMO_RAPIDO } from "../componentes/CenaTitulada";
import { TituloDigitado, fimDaDigitacao } from "../componentes/TituloDigitado";
import { cl, saida } from "../componentes/grafico";
import { COR, FONTE } from "../tema";

const ULTIMO = DUR_CAP2 - 16;                 // último quadro do capítulo 2 antes da saída (opacidade 1)
const M0 = TL2.clique + 6;                    // abertura do modal no capítulo 2
export const TEXTO_R0 = "SIMULAÇÃO CONCLUÍDA";
const DIG = 70;                               // início da digitação (quadro da cena)
const RIT = { ...RITMO_RAPIDO, inicio: RITMO_RAPIDO.inicio + DIG, semente: "cap3-r0" };
const FIM_DIG = fimDaDigitacao(TEXTO_R0, RIT);
export const DUR_R0 = FIM_DIG + 110;

export const R0Concluida = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fundo = interpolate(f, [4, 30], [1, 0], { ...cl, easing: saida });
  const modal = interpolate(f, [30, 58], [0, 1], { ...cl, easing: (x) => x * x });
  const linha = interpolate(f, [FIM_DIG + 14, FIM_DIG + 34], [0, 1], { ...cl, easing: saida });
  const sai = interpolate(f, [DUR_R0 - 16, DUR_R0], [1, 0], cl);
  return (
    <AbsoluteFill style={{ background: COR.fundo }}>
      {fundo > 0 && <AbsoluteFill style={{ opacity: fundo }}><Freeze frame={ULTIMO}><Capitulo2 /></Freeze></AbsoluteFill>}
      {modal < 1 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ opacity: 1 - modal, scale: String(1 - 0.08 * modal), filter: modal > 0 ? `blur(${4 * modal}px)` : undefined }}>
            <ModalExecucao D={{ situacao: "concluida", fase: "gravando", k: N_INT, janelas: 24 }} t={(ULTIMO + f - M0) / fps}
              larguraBarra={100} horFeito={100} horJan={[100, 0]} />
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ opacity: sai }}>
        {f >= DIG && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", translate: "0px -20px" }}>
            <TituloDigitado texto={TEXTO_R0} tamanho={96} ritmo={RIT} ocultarCursorEm={FIM_DIG + 40} />
          </AbsoluteFill>
        )}
        <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", fontFamily: FONTE.texto, fontSize: 30,
          color: COR.tinta2, opacity: linha, translate: `0px ${(1 - linha) * 10}px`, letterSpacing: "0.02em" }}>
          96 de 96 intervalos · 24 de 24 janelas MPC · auditoria integral aprovada
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
