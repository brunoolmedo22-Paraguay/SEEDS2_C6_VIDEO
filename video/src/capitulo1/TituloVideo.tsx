// TÍTULO DO VÍDEO — digitado no centro (padrão aprovado na prova v1), cursor piscando, saída suave.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RITMO_RAPIDO } from "../componentes/CenaTitulada";
import { cl } from "../componentes/grafico";
import { TituloDigitado, fimDaDigitacao } from "../componentes/TituloDigitado";
import { COR } from "../tema";

export const TEXTO_TITULO = "ALIVIANDO A CURVA DE PATO";
export const DUR_TITULO = fimDaDigitacao(TEXTO_TITULO, RITMO_RAPIDO) + 40;   // ≈ 1 s de cursor piscando + saída

export const TEXTO_TITULO_V4 = "SUAVIZANDO A CURVA DE PATO";      // capítulo 1 v4 (pedido do responsável)
export const DUR_TITULO_V4 = fimDaDigitacao(TEXTO_TITULO_V4, RITMO_RAPIDO) + 40;

// `dur` (opcional; capítulo 1 v2) prolonga a exibição; `texto` (opcional; v4) troca o título.
// Os padrões são os da v1, que fica inalterada (v2 e v3 também).
export const TituloVideo: React.FC<{ dur?: number; texto?: string }> = ({ dur = DUR_TITULO, texto = TEXTO_TITULO }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: COR.fundo, alignItems: "center", justifyContent: "center",
      opacity: interpolate(f, [dur - 16, dur], [1, 0], cl),
      translate: interpolate(f, [dur - 16, dur], ["0px 0px", "0px -14px"], cl) }}>
      <TituloDigitado texto={texto} tamanho={100} ritmo={RITMO_RAPIDO} />
    </AbsoluteFill>
  );
};
