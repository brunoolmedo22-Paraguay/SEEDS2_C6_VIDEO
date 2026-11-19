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
import "./fontes";

export const RemotionRoot = () => (
  <>
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
