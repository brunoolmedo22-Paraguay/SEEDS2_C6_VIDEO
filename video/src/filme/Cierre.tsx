// FECHAMENTO UNIFICADO (filme v3) — UMA cena final sobre PRETO, substituindo «Marca» + «Créditos»:
//   esquerda: glifo oficial + «OTIMIZADO NO SEEDS» (mesma digitação da Marca aprovada, alinhada à esquerda) e, em pequeno,
//             «Smart Energy Ecosystem for Decision Support» e a frase aprovada do EMS hierárquico MILP–MPC;
//   direita:  os seis logotipos (ordem do LEIA.txt, duas linhas de três), entrando EM PARALELO com a digitação.
// Legibilidade sobre preto (docs/FILME_MONTAGEM_v3.md): direto no preto, o texto «UFPB» (preto) desaparece e LACA/UNILA
// (roxo-escuro) ficam com contraste ≈ 1,5. Por isso as marcas ficam num ÚNICO painel discreto no cinza neutro já
// testado no filme v2 (#949494; LACA/UNILA ≈ 4,6, CEAR ≈ 4,0, UFPB ≈ 6,9), com o resto da tela em preto. Sem cartões
// individuais e sem branco. Logotipos de ferramentas/preparar_logos_v3.py (cores e proporções oficiais).
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RITMO_RAPIDO } from "../componentes/CenaTitulada";
import { GlifoSeeds } from "../componentes/LogoSeeds";
import { TituloDigitado, fimDaDigitacao } from "../componentes/TituloDigitado";
import { cl, saida } from "../componentes/grafico";
import { COR, FONTE } from "../tema";
import { SUBTITULO_SEEDS } from "../capitulo1v2/Abertura2";
import { CINZA_CREDITOS } from "./Creditos2";
import LOGOS from "../creditos/logos_v3.json";

const MARCA = "OTIMIZADO NO SEEDS";                      // filme v8 (antes «SIMULADO NO SEEDS»)
const T = { logo: 6, dig: 34, painel: 10, logos: 22, passo: 7, durLogo: 22 };
const RIT = { ...RITMO_RAPIDO, inicio: RITMO_RAPIDO.inicio + T.dig, semente: "cap3-r5" };     // = digitação da Marca aprovada
const FIM_DIG = fimDaDigitacao(MARCA, RIT);
const T_SUB = FIM_DIG + 18, T_FRASE = FIM_DIG + 34;
export const DUR_CIERRE = T_FRASE + 22 + 180 + 30;       // ≈ 6 s com tudo visível + saída de 1 s

// esquerda
const XE = 150;
// direita: painel e células
const PW = 840, PH = 440, PX = 990, PY = (1080 - PH) / 2;
const CW = 240, CH = 180, GX = 26, GY = 24;
const CX0 = PX + (PW - (3 * CW + 2 * GX)) / 2, CY0 = PY + (PH - (2 * CH + GY)) / 2;

export const Cierre = () => {
  const f = useCurrentFrame();
  const logo = interpolate(f, [T.logo, T.logo + 26], [0, 1], { ...cl, easing: saida });
  const painel = interpolate(f, [T.painel, T.painel + 26], [0, 1], { ...cl, easing: saida });
  const sub = interpolate(f, [T_SUB, T_SUB + 22], [0, 1], cl);
  const frase = interpolate(f, [T_FRASE, T_FRASE + 22], [0, 1], cl);
  const sai = interpolate(f, [DUR_CIERRE - 30, DUR_CIERRE], [1, 0], cl);
  return (
    <AbsoluteFill style={{ background: COR.fundo }}>
      <AbsoluteFill style={{ opacity: sai }}>
        {/* esquerda */}
        <div style={{ position: "absolute", left: XE, top: 362, opacity: logo, scale: String(0.94 + 0.06 * logo), transformOrigin: "0 50%" }}><GlifoSeeds tamanho={104} /></div>
        {f >= T.dig && (
          <div style={{ position: "absolute", left: XE - 2, top: 504 }}>
            <TituloDigitado texto={MARCA} tamanho={64} ritmo={RIT} ocultarCursorEm={FIM_DIG + 30} />
          </div>
        )}
        <div style={{ position: "absolute", left: XE, top: 622, fontFamily: FONTE.texto, fontSize: 31, letterSpacing: "0.03em", color: COR.tinta2,
          opacity: sub, translate: `0px ${(1 - sub) * 8}px` }}>{SUBTITULO_SEEDS}</div>
        <div style={{ position: "absolute", left: XE, top: 674, fontFamily: FONTE.texto, fontSize: 24, color: COR.tinta3, opacity: frase }}>
          Despacho energético otimizado por EMS hierárquico MILP–MPC.
        </div>
        {/* direita */}
        <div style={{ position: "absolute", left: PX, top: PY, width: PW, height: PH, borderRadius: 28, background: CINZA_CREDITOS, opacity: painel,
          scale: String(0.985 + 0.015 * painel) }} />
        {LOGOS.map((l, k) => {
          const a = interpolate(f, [T.logos + k * T.passo, T.logos + k * T.passo + T.durLogo], [0, 1], { ...cl, easing: saida });
          const x = CX0 + (k % 3) * (CW + GX), y = CY0 + Math.floor(k / 3) * (CH + GY);
          return (
            <div key={l.id} style={{ position: "absolute", left: x, top: y, width: CW, height: CH, opacity: a, translate: `0px ${Math.round((1 - a) * 10)}px` }}>
              <Img src={staticFile(l.arquivo)} width={l.w} height={l.h} style={{ position: "absolute", left: Math.round((CW - l.w) / 2), top: Math.round((CH - l.h) / 2) }} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
