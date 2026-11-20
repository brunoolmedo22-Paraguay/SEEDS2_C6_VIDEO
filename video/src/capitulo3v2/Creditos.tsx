// CRÉDITOS INSTITUCIONAIS — os seis logotipos fornecidos pelo responsável (assets/logos_instituicoes/, originais intocados),
// preparados por ferramentas/preparar_logos.py: só recorte de margens vazias e redimensionamento proporcional (Lanczos) ao
// tamanho EXATO de exibição — nenhuma cor, proporção ou elemento alterado. Cada marca fica num cartão BRANCO idêntico
// (o fundo original da UFPB), que dá contraste às marcas escuras e integra a UFPB sem recortar o brasão.
// Sem texto: nenhum nome, vínculo, apoio ou financiamento é atribuído. Ordem do LEIA.txt (01 → 06), duas linhas de três.
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, saida } from "../componentes/grafico";
import { COR } from "../tema";
import LOGOS from "../creditos/logos.json";

const CW = 400, CH = 240, G = 40;
const X0 = (1920 - 3 * CW - 2 * G) / 2, Y0 = (1080 - 2 * CH - G) / 2;       // 320 · 280 (inteiros)
const T = { entra: 16, passo: 7, dur: 22, sai: 30 };
export const DUR_CREDITOS = T.entra + 5 * T.passo + T.dur + 200 + T.sai;       // ≈ 6,7 s com todas as marcas visíveis

export const Creditos = () => {
  const f = useCurrentFrame();
  const sai = interpolate(f, [DUR_CREDITOS - T.sai, DUR_CREDITOS], [1, 0], cl);
  return (
    <AbsoluteFill style={{ background: COR.fundo }}>
      {LOGOS.map((l, k) => {
        const a = interpolate(f, [T.entra + k * T.passo, T.entra + k * T.passo + T.dur], [0, 1], { ...cl, easing: saida });
        const x = X0 + (k % 3) * (CW + G), y = Y0 + Math.floor(k / 3) * (CH + G);
        return (
          <div key={l.id} style={{ position: "absolute", left: x, top: y, width: CW, height: CH, borderRadius: 20, background: "#ffffff",
            opacity: a * sai, translate: `0px ${Math.round((1 - a) * 12)}px` }}>
            <Img src={staticFile(l.arquivo)} width={l.w} height={l.h}
              style={{ position: "absolute", left: Math.round((CW - l.w) / 2), top: Math.round((CH - l.h) / 2) }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
