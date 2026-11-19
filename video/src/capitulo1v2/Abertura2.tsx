// ABERTURA v2 — mesma coreografia da v1 (medida em `seeds intro.mp4`), agora com geometria DETERMINÍSTICA.
//
// Diagnóstico da vibração na v1 (MP4 analisado quadro a quadro, docs/CAPITULO1_v2.md): a largura da palavra era MEDIDA no
// DOM durante o render; o Remotion renderiza com várias abas em paralelo e as abas mediam larguras diferentes (≈ 13 px),
// então quadros pares e ímpares tinham máscara e centro diferentes ⇒ o logotipo alternava de posição a cada quadro, mesmo
// parado. Correção: nada é medido em tempo de render. A largura de «SEEDS» vem das métricas da própria fonte (Archivo,
// wght 800: avanços 697 + 699 + 699 + 755 + 697 ⇒ 797,3 px a 228 px com −0,01 em de espaçamento) e é TRAVADA no SVG
// (`textLength`); a altura das maiúsculas (0,686 em) centraliza a palavra. As posições finais são pixels inteiros.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cl, saida } from "../componentes/grafico";
import { VIOLETA_MARCA } from "../componentes/LogoSeeds";
import { COR, FONTE } from "../tema";

export const DUR_ABERTURA2 = 210;
const GRANDE = 520, PEQUENO = 300, GAP = 58, CORPO = 228;
const LARG_TEXTO = 797;                         // px — avanços da fonte (797,3), arredondados
const ALT_MAIUSC = Math.round(0.686 * CORPO);   // 156 px
const CX = 960, CY = 540;
const GRUPO = PEQUENO + GAP + LARG_TEXTO;       // 1.155 px
const ICONE_FINAL_ESQ = Math.round(CX - GRUPO / 2);   // 383 px (inteiro)

// Glifo oficial (topbar.js) como <svg> aninhado, posicionado por coordenadas — sem layout do navegador.
const Glifo: React.FC<{ x: number; y: number; lado: number }> = ({ x, y, lado }) => (
  <svg x={x} y={y} width={lado} height={lado} viewBox="0 0 32 32" style={{ color: VIOLETA_MARCA }} overflow="visible">
    <rect x="2" y="2" width="28" height="28" rx="8" fill={COR.fundo} />
    <rect x="2" y="2" width="28" height="28" rx="8" fill="currentColor" opacity=".13" />
    <path d="M6 16h20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M10 16V9M16 16V7M22 16V10M12 16v7M20 16v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".75" />
    <circle cx="10" cy="8" r="2" fill="currentColor" /><circle cx="16" cy="6" r="2" fill="currentColor" /><circle cx="22" cy="9" r="2" fill="currentColor" />
    <rect x="10" y="23" width="4" height="3" rx="1" fill="currentColor" /><circle cx="20" cy="23.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const Abertura2 = () => {
  const f = useCurrentFrame();
  const entrada = interpolate(f, [0, 20], [0, 1], { ...cl, easing: saida });
  const escalaEntrada = interpolate(f, [0, 20], [0.94, 1], { ...cl, easing: saida });
  const lado = interpolate(f, [56, 96], [GRANDE, PEQUENO], { ...cl, easing: saida });
  const p = interpolate(f, [108, 166], [0, 1], { ...cl, easing: saida });            // termina no quadro 166, exatamente em 1
  const sai = interpolate(f, [DUR_ABERTURA2 - 16, DUR_ABERTURA2], [1, 0], cl);
  // ícone: centrado na tela até a revelação; depois desliza até a posição final inteira
  const iconeEsq = interpolate(p, [0, 1], [CX - PEQUENO / 2, ICONE_FINAL_ESQ]);
  const iconeX = p > 0 ? iconeEsq : CX - lado / 2;
  const bordaDir = iconeX + lado;
  // palavra: sai de TRÁS do ícone (máscara a partir da borda direita do ícone), ancorada pelo fim — primeiro as letras finais
  const textoEsq = bordaDir + GAP - (1 - p) * (GAP + LARG_TEXTO);
  const base = CY + ALT_MAIUSC / 2;
  return (
    <AbsoluteFill style={{ background: COR.fundo, opacity: entrada * sai }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="abertura-mascara"><rect x={bordaDir} y={0} width={1920} height={1080} /></clipPath></defs>
        <g transform={`translate(${CX} ${CY}) scale(${escalaEntrada}) translate(${-CX} ${-CY})`}>
          {p > 0 && (
            <text x={textoEsq} y={base} textLength={LARG_TEXTO} lengthAdjust="spacingAndGlyphs" clipPath="url(#abertura-mascara)"
              fontFamily={FONTE.titulo} fontWeight={800} fontSize={CORPO} letterSpacing="-0.01em" fill={COR.tinta}>SEEDS</text>
          )}
          <Glifo x={iconeX} y={CY - lado / 2} lado={lado} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
