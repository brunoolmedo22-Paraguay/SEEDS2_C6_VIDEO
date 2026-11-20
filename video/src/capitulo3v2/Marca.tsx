// ENCERRAMENTO v2 — tela preta com a marca: glifo OFICIAL (topbar.js) + «SIMULADO NO SEEDS» digitado + frase discreta.
// Sem números nem resultados econômicos (decisão do responsável para a v2).
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RITMO_RAPIDO } from "../componentes/CenaTitulada";
import { GlifoSeeds } from "../componentes/LogoSeeds";
import { TituloDigitado, fimDaDigitacao } from "../componentes/TituloDigitado";
import { cl, saida } from "../componentes/grafico";
import { COR, FONTE } from "../tema";

const MARCA = "SIMULADO NO SEEDS";
const T = { logo: 6, dig: 34 };
const RIT = { ...RITMO_RAPIDO, inicio: RITMO_RAPIDO.inicio + T.dig, semente: "cap3-r5" };
const FIM_DIG = fimDaDigitacao(MARCA, RIT);
const T_FRASE = FIM_DIG + 26;
export const DUR_MARCA = FIM_DIG + 190;

export const Marca = () => {
  const f = useCurrentFrame();
  const logo = interpolate(f, [T.logo, T.logo + 26], [0, 1], { ...cl, easing: saida });
  const frase = interpolate(f, [T_FRASE, T_FRASE + 22], [0, 1], cl);
  const sai = interpolate(f, [DUR_MARCA - 22, DUR_MARCA], [1, 0], cl);
  return (
    <AbsoluteFill style={{ background: COR.fundo, opacity: sai }}>
      <div style={{ position: "absolute", left: 885, top: 286, opacity: logo, scale: String(0.94 + 0.06 * logo) }}><GlifoSeeds tamanho={150} /></div>
      {f >= T.dig && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", translate: "0px 60px" }}>
          <TituloDigitado texto={MARCA} tamanho={80} ritmo={RIT} ocultarCursorEm={FIM_DIG + 30} />
        </AbsoluteFill>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: FONTE.texto, fontSize: 30, color: COR.tinta3, opacity: frase }}>
        Despacho energético otimizado por EMS hierárquico MILP–MPC.
      </div>
    </AbsoluteFill>
  );
};
