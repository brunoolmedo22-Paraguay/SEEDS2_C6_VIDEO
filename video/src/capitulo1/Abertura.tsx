// ABERTURA — marca SEEDS (sem «2» na marca exibida; decisão do responsável). Movimento medido em `seeds intro.mp4`:
//   ícone grande central (≈ 524 px) → reduz para ≈ 300 px com desaceleração (≈ 1,3 s) → pausa → o ícone desliza para a
//   esquerda enquanto «SEEDS» sai DE TRÁS dele para a direita (≈ 1,8 s, desaceleração forte) → pausa.
// A palavra fica ancorada à DIREITA de uma máscara que cresce: aparecem primeiro as letras finais, como no morph original.
// O grupo [ícone · palavra] permanece centralizado em todo o movimento (flexbox).
import { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, useCurrentFrame } from "remotion";
import { cl, saida } from "../componentes/grafico";
import { GlifoSeeds } from "../componentes/LogoSeeds";
import { fontesProntas } from "../fontes";
import { COR, FONTE } from "../tema";

export const DUR_ABERTURA = 178;
const GRANDE = 520, PEQUENO = 300, GAP = 58, CORPO = 228;   // px (proporções da referência: palavra ≈ 161 px de altura de letra)

/** Largura real do texto, medida no DOM depois do carregamento das fontes (o render espera a medição). */
function useLargura() {
  const ref = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState<number | null>(null);
  const [h] = useState(() => delayRender("medir a palavra SEEDS"));
  useLayoutEffect(() => {
    fontesProntas.then(() => document.fonts.ready).then(() => { if (ref.current) setW(ref.current.getBoundingClientRect().width); continueRender(h); });
  }, [h]);
  return [ref, w] as const;
}

export const Abertura = () => {
  const f = useCurrentFrame();
  const [ref, larg] = useLargura();
  const entrada = interpolate(f, [0, 20], [0, 1], { ...cl, easing: saida });
  const lado = interpolate(f, [56, 96], [GRANDE, PEQUENO], { ...cl, easing: saida });
  const revela = interpolate(f, [108, 162], [0, 1], { ...cl, easing: saida });
  const sai = interpolate(f, [DUR_ABERTURA - 16, DUR_ABERTURA], [1, 0], cl);
  const total = larg ?? 0;   // a largura medida já inclui o espaço (paddingLeft = GAP) entre o ícone e a palavra
  return (
    <AbsoluteFill style={{ background: COR.fundo, alignItems: "center", justifyContent: "center", opacity: entrada * sai }}>
      <div style={{ display: "flex", alignItems: "center", scale: interpolate(f, [0, 20], [0.94, 1], { ...cl, easing: saida }) }}>
        <div style={{ position: "relative", zIndex: 2, width: lado, height: lado, background: COR.fundo, borderRadius: lado * 0.25 }}>
          <GlifoSeeds tamanho={lado} />
        </div>
        <div style={{ width: total * revela, overflow: "hidden", display: "flex", justifyContent: "flex-end", zIndex: 1 }}>
          <span ref={ref} style={{ flexShrink: 0, paddingLeft: GAP, fontFamily: FONTE.titulo, fontWeight: 800, fontSize: CORPO, lineHeight: 1, letterSpacing: "-0.01em",
            color: COR.tinta, whiteSpace: "pre" }}>SEEDS</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
