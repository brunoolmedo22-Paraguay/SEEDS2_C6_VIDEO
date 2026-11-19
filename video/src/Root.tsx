import { Composition } from "remotion";
import { Capitulo1, DUR_CAP1 } from "./capitulo1/Capitulo1";
import { DURACAO, ProvaConceito } from "./cenas/ProvaConceito";
import { TesteTecnico } from "./TesteTecnico";
import "./fontes";

export const RemotionRoot = () => (
  <>
    <Composition id="Capitulo1" component={Capitulo1} durationInFrames={DUR_CAP1} fps={30} width={1920} height={1080} />
    <Composition id="ProvaConceito" component={ProvaConceito} durationInFrames={DURACAO} fps={30} width={1920} height={1080} />
    <Composition id="TesteTecnico" component={TesteTecnico} durationInFrames={120} fps={30} width={1920} height={1080} />
  </>
);
