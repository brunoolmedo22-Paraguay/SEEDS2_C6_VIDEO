// PROPOSTAS de posição das marcas LACA e GPEnSE (após o v6): «topo» (LACA no canto superior esquerdo, GPEnSE no superior
// direito, abas presas à borda superior) e «esquerda» (coluna à esquerda, LACA em cima e GPEnSE embaixo). O conteúdo do
// filme é reduzido uniformemente e ancorado do lado oposto, para nada ser coberto. `cor` null = sem fundo.
import { Img, staticFile } from "remotion";
import C from "../creditos/logos_rodape_cantos.json";
import K from "../creditos/logos_marcas_coluna.json";

export type LayoutMarcas = { layout: "topo" | "esquerda"; cor: string | null };
export const FAIXA_TOPO = 160, COLUNA = 340;
export const transformConteudo = (m: LayoutMarcas) =>
  m.layout === "topo" ? { s: (1080 - FAIXA_TOPO) / 1080, origem: "50% 100%" } : { s: (1920 - COLUNA) / 1920, origem: "100% 50%" };

export const Marcas: React.FC<{ m: LayoutMarcas; opacidade: number; entrada: number }> = ({ m, opacidade, entrada }) => {
  const img = (l: { arquivo: string; w: number; h: number }, x: number, y: number) => (
    <Img src={staticFile(l.arquivo)} width={l.w} height={l.h} style={{ position: "absolute", left: x, top: y }} />
  );
  if (m.layout === "topo") {
    const laca = C.find((l) => l.id === "03_LACA")!, gp = C.find((l) => l.id === "04_GPEnSE")!;
    const H = Math.max(laca.h, gp.h), cy = FAIXA_TOPO / 2 - 4, PAD = 30, sobe = Math.round((1 - entrada) * (FAIXA_TOPO + 30));
    const aba = (x: number, w: number) => m.cor && <div style={{ position: "absolute", left: x - PAD, top: -60, width: w + 2 * PAD, height: cy + H / 2 + PAD - 6 + 60, borderRadius: 24, background: m.cor }} />;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: opacidade, translate: `0px ${-sobe}px`, overflow: "hidden" }}>
        {aba(60, laca.w)}{aba(1920 - 60 - gp.w, gp.w)}
        {img(laca, 60, Math.round(cy - laca.h / 2))}{img(gp, 1920 - 60 - gp.w, Math.round(cy - gp.h / 2))}
      </div>
    );
  }
  const laca = K.find((l) => l.id === "03_LACA")!, gp = K.find((l) => l.id === "04_GPEnSE")!;
  const GAP = 64, alt = laca.h + GAP + gp.h, y0 = Math.round((1080 - alt) / 2), cx = COLUNA / 2 + 4, entra = Math.round((1 - entrada) * (COLUNA + 30));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: opacidade, translate: `${-entra}px 0px`, overflow: "hidden" }}>
      {m.cor && <div style={{ position: "absolute", left: -40, top: y0 - 56, width: COLUNA + 40 - 6, height: alt + 112, borderRadius: 28, background: m.cor }} />}
      {img(laca, Math.round(cx - laca.w / 2), y0)}{img(gp, Math.round(cx - gp.w / 2), y0 + laca.h + GAP)}
    </div>
  );
};
