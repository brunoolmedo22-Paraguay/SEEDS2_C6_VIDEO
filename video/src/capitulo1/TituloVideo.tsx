// TÍTULO DO VÍDEO — digitado no centro (padrão aprovado na prova v1), cursor piscando, saída suave.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RITMO_RAPIDO } from "../componentes/CenaTitulada";
import { cl } from "../componentes/grafico";
import { TituloDigitado, fimDaDigitacao } from "../componentes/TituloDigitado";
import { COR } from "../tema";

export const TEXTO_TITULO = "ALIVIANDO A CURVA DE PATO";
export const DUR_TITULO = fimDaDigitacao(TEXTO_TITULO, RITMO_RAPIDO) + 40;   // ≈ 1 s de cursor piscando + saída

// `dur` (opcional; capítulo 1 v2) prolonga a exibição; o padrão é a duração da v1, que fica inalterada.
export const TituloVideo: React.FC<{ dur?: number }> = ({ dur = DUR_TITULO }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: COR.fundo, alignItems: "center", justifyContent: "center",
      opacity: interpolate(f, [dur - 16, dur], [1, 0], cl),
      translate: interpolate(f, [dur - 16, dur], ["0px 0px", "0px -14px"], cl) }}>
      <TituloDigitado texto={TEXTO_TITULO} tamanho={100} ritmo={RITMO_RAPIDO} />
    </AbsoluteFill>
  );
};
