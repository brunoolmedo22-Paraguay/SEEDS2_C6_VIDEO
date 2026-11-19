import { Composition } from "remotion";
import { TesteTecnico } from "./TesteTecnico";
import "./fontes";

export const RemotionRoot = () => (
  <Composition id="TesteTecnico" component={TesteTecnico} durationInFrames={120} fps={30} width={1920} height={1080} />
);
