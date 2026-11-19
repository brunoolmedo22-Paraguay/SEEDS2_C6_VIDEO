import { Composition } from "remotion";
import { Capitulo1, DUR_CAP1 } from "./capitulo1/Capitulo1";
import { Abertura2, DUR_ABERTURA2 } from "./capitulo1v2/Abertura2";
import { Capitulo1v2, DUR_CAP1V2 } from "./capitulo1v2/Capitulo1v2";
import { DemandaTarifa, DUR_DT } from "./capitulo1v2/DemandaTarifa";
import { DUR_EQ, Equipamentos } from "./capitulo1v2/Equipamentos";
import { DURACAO, ProvaConceito } from "./cenas/ProvaConceito";
import { TesteTecnico } from "./TesteTecnico";
import "./fontes";

export const RemotionRoot = () => (
  <>
    <Composition id="Capitulo1" component={Capitulo1} durationInFrames={DUR_CAP1} fps={30} width={1920} height={1080} />
    <Composition id="Capitulo1v2" component={Capitulo1v2} durationInFrames={DUR_CAP1V2} fps={30} width={1920} height={1080} />
    <Composition id="Abertura2" component={Abertura2} durationInFrames={DUR_ABERTURA2} fps={30} width={1920} height={1080} />
    <Composition id="DemandaTarifa" component={DemandaTarifa} durationInFrames={DUR_DT} fps={30} width={1920} height={1080} />
    <Composition id="Equipamentos" component={Equipamentos} durationInFrames={DUR_EQ} fps={30} width={1920} height={1080} />
    <Composition id="ProvaConceito" component={ProvaConceito} durationInFrames={DURACAO} fps={30} width={1920} height={1080} />
    <Composition id="TesteTecnico" component={TesteTecnico} durationInFrames={120} fps={30} width={1920} height={1080} />
  </>
);
