import { Composition } from "remotion";
import { Capitulo1, DUR_CAP1 } from "./capitulo1/Capitulo1";
import { Abertura2, DUR_ABERTURA2 } from "./capitulo1v2/Abertura2";
import { Capitulo1v2, DUR_CAP1V2 } from "./capitulo1v2/Capitulo1v2";
import { Capitulo1v3, DUR_CAP1V3 } from "./capitulo1v3/Capitulo1v3";
import { Capitulo2, DUR_CAP2 } from "./capitulo2/Capitulo2";
import { Capitulo3, DUR_CAP3 } from "./capitulo3/Capitulo3";
import { Capitulo3v2, DUR_CAP3V2 } from "./capitulo3v2/Capitulo3v2";
import { Creditos, DUR_CREDITOS } from "./capitulo3v2/Creditos";
import { DUR_DESP, ResultadosDespacho } from "./resultados/Despacho";
import { DemandaTarifa, DUR_DT } from "./capitulo1v2/DemandaTarifa";
import { DUR_EQ, Equipamentos } from "./capitulo1v2/Equipamentos";
import { DURACAO, ProvaConceito } from "./cenas/ProvaConceito";
import { TesteTecnico } from "./TesteTecnico";
import { DUR_FILME, Filme } from "./filme/Filme";
import { DUR_FILME2, FilmeV2 } from "./filme/FilmeV2";
import { DUR_FILME3, FilmeV3 } from "./filme/FilmeV3";
import { DUR_FILME4, FilmeV4 } from "./filme/FilmeV4";
import "./fontes";

export const RemotionRoot = () => (
  <>
    <Composition id="PropostaCantos1" component={FilmeV4} defaultProps={{ cantos: { cor: "#5a5a5a" } }} durationInFrames={DUR_FILME4} fps={30} width={1920} height={1080} />
    <Composition id="PropostaCantos2" component={FilmeV4} defaultProps={{ cantos: { cor: null } }} durationInFrames={DUR_FILME4} fps={30} width={1920} height={1080} />
    <Composition id="PropostaCantos3" component={FilmeV4} defaultProps={{ cantos: { cor: "#7a7a7a" } }} durationInFrames={DUR_FILME4} fps={30} width={1920} height={1080} />
    <Composition id="PropostaRodapeE" component={FilmeV4} defaultProps={{ variante: { estilo: "aba", cor: "#5a5a5a", gap: 56, grande: true } }} durationInFrames={DUR_FILME4} fps={30} width={1920} height={1080} />
    <Composition id="PropostaRodapeA" component={FilmeV4} defaultProps={{ variante: { estilo: "pilula", cor: "#5a5a5a", gap: 46 } }} durationInFrames={DUR_FILME4} fps={30} width={1920} height={1080} />
    <Composition id="PropostaRodapeB" component={FilmeV4} defaultProps={{ variante: { estilo: "aba", cor: "#5a5a5a", gap: 50 } }} durationInFrames={DUR_FILME4} fps={30} width={1920} height={1080} />
    <Composition id="PropostaRodapeC" component={FilmeV4} defaultProps={{ variante: { estilo: "faixa", cor: "#555555", gap: 64 } }} durationInFrames={DUR_FILME4} fps={30} width={1920} height={1080} />
    <Composition id="PropostaRodapeD" component={FilmeV4} defaultProps={{ variante: { estilo: "aba", cor: "#7a7a7a", gap: 50 } }} durationInFrames={DUR_FILME4} fps={30} width={1920} height={1080} />
    <Composition id="FilmeSEEDSv5" component={FilmeV4} defaultProps={{ corRodape: "#5a5a5a" }} durationInFrames={DUR_FILME4} fps={30} width={1920} height={1080} />
    <Composition id="FilmeSEEDSv4" component={FilmeV4} durationInFrames={DUR_FILME4} fps={30} width={1920} height={1080} />
    <Composition id="FilmeSEEDSv4SoTempo" component={FilmeV4} defaultProps={{ rodape: false, escala: 1 }} durationInFrames={DUR_FILME4} fps={30} width={1920} height={1080} />
    <Composition id="FilmeSEEDSv3" component={FilmeV3} durationInFrames={DUR_FILME3} fps={30} width={1920} height={1080} />
    <Composition id="FilmeSEEDSv2" component={FilmeV2} durationInFrames={DUR_FILME2} fps={30} width={1920} height={1080} />
    <Composition id="FilmeSEEDS" component={Filme} durationInFrames={DUR_FILME} fps={30} width={1920} height={1080} />
    <Composition id="Capitulo3v2" component={Capitulo3v2} durationInFrames={DUR_CAP3V2} fps={30} width={1920} height={1080} />
    <Composition id="Creditos" component={Creditos} durationInFrames={DUR_CREDITOS} fps={30} width={1920} height={1080} />
    <Composition id="Capitulo3" component={Capitulo3} durationInFrames={DUR_CAP3} fps={30} width={1920} height={1080} />
    <Composition id="Capitulo1" component={Capitulo1} durationInFrames={DUR_CAP1} fps={30} width={1920} height={1080} />
    <Composition id="ProtoResultadosDespacho" component={ResultadosDespacho} durationInFrames={DUR_DESP} fps={30} width={1920} height={1080} />
    <Composition id="Capitulo2" component={Capitulo2} durationInFrames={DUR_CAP2} fps={30} width={1920} height={1080} />
    <Composition id="Capitulo1v3" component={Capitulo1v3} durationInFrames={DUR_CAP1V3} fps={30} width={1920} height={1080} />
    <Composition id="Capitulo1v2" component={Capitulo1v2} durationInFrames={DUR_CAP1V2} fps={30} width={1920} height={1080} />
    <Composition id="Abertura2" component={Abertura2} durationInFrames={DUR_ABERTURA2} fps={30} width={1920} height={1080} />
    <Composition id="DemandaTarifa" component={DemandaTarifa} durationInFrames={DUR_DT} fps={30} width={1920} height={1080} />
    <Composition id="Equipamentos" component={Equipamentos} durationInFrames={DUR_EQ} fps={30} width={1920} height={1080} />
    <Composition id="ProvaConceito" component={ProvaConceito} durationInFrames={DURACAO} fps={30} width={1920} height={1080} />
    <Composition id="TesteTecnico" component={TesteTecnico} durationInFrames={120} fps={30} width={1920} height={1080} />
  </>
);
