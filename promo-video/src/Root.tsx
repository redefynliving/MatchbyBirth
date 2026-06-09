import "./index.css";
import { Composition } from "remotion";
import { PromoVideo } from "./Composition";

const fps = 30;
const durationInFrames = 15 * fps;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MatchByBirth-Vertical"
        component={PromoVideo}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="MatchByBirth-Landscape"
        component={PromoVideo}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
      />
    </>
  );
};
