import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const colors = {
  cream: "#fbf8f3",
  paper: "#fffdf9",
  ink: "#26212b",
  muted: "#756b82",
  lavender: "#6d4ca0",
  pale: "#f1ebf6",
  line: "#e6ded4",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const appear = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const sceneOpacity = (frame: number, duration: number) => {
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [duration - 14, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(fadeIn, fadeOut);
};

const Shell: React.FC<{ children: React.ReactNode; opacity?: number }> = ({
  children,
  opacity = 1,
}) => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.cream,
        color: colors.ink,
        fontFamily: "Outfit, Arial, sans-serif",
        padding: vertical ? 72 : 92,
        opacity,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: vertical ? 900 : 980,
          height: vertical ? 900 : 980,
          borderRadius: "50%",
          background: colors.pale,
          filter: "blur(24px)",
          opacity: 0.65,
          top: vertical ? -380 : -560,
          left: vertical ? 90 : width / 2 - 490,
        }}
      />
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Brand: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: compact ? 12 : 18,
      fontWeight: 600,
      letterSpacing: -0.5,
      fontSize: compact ? 26 : 34,
    }}
  >
    <div
      style={{
        width: compact ? 30 : 40,
        height: compact ? 30 : 40,
        border: `2px solid ${colors.lavender}`,
        borderRadius: "50%",
        position: "relative",
      }}
    >
      <div
        style={{
          width: compact ? 7 : 9,
          height: compact ? 7 : 9,
          borderRadius: "50%",
          background: colors.lavender,
          position: "absolute",
          inset: 0,
          margin: "auto",
        }}
      />
    </div>
    Match by Birth
  </div>
);

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  const duration = 75;
  const first = appear(frame, 4, 22);
  const second = appear(frame, 20, 24);

  return (
    <Shell opacity={sceneOpacity(frame, duration)}>
      <div style={{ transform: `translateY(${interpolate(first, [0, 1], [28, 0])}px)`, opacity: first }}>
        <Brand />
      </div>
      <div
        style={{
          position: "absolute",
          top: vertical ? 390 : 210,
          left: 0,
          width: vertical ? "100%" : "72%",
          opacity: second,
          transform: `translateY(${interpolate(second, [0, 1], [42, 0])}px)`,
        }}
      >
        <div
          style={{
            color: colors.lavender,
            textTransform: "uppercase",
            letterSpacing: 5,
            fontWeight: 600,
            fontSize: vertical ? 24 : 22,
            marginBottom: 24,
          }}
        >
          The connection behind every relationship
        </div>
        <div
          style={{
            fontSize: vertical ? 88 : 82,
            lineHeight: 1.02,
            fontWeight: 600,
            letterSpacing: -3,
            maxWidth: vertical ? 900 : 1080,
          }}
        >
          See how your connection naturally fits.
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: vertical ? 34 : 30,
            lineHeight: 1.35,
            color: colors.muted,
          }}
        >
          Two people or the whole friend group.
        </div>
      </div>
    </Shell>
  );
};

const Field: React.FC<{ label: string; value: string; progress: number }> = ({
  label,
  value,
  progress,
}) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: 18, color: colors.muted, marginBottom: 10 }}>{label}</div>
    <div
      style={{
        height: 62,
        border: `1.5px solid ${colors.line}`,
        borderRadius: 15,
        background: colors.paper,
        padding: "17px 20px",
        fontSize: 23,
        color: colors.ink,
      }}
    >
      {value.slice(0, Math.ceil(value.length * progress))}
      {progress < 1 && <span style={{ color: colors.lavender }}>|</span>}
    </div>
  </div>
);

const CalculatorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  const duration = 120;
  const cardIn = appear(frame, 4, 22);
  const nameOne = appear(frame, 28, 22);
  const nameTwo = appear(frame, 52, 22);
  const button = appear(frame, 78, 18);

  return (
    <Shell opacity={sceneOpacity(frame, duration)}>
      <Brand compact />
      <div
        style={{
          display: vertical ? "block" : "flex",
          alignItems: "center",
          gap: 90,
          height: vertical ? "auto" : "calc(100% - 40px)",
          marginTop: vertical ? 100 : 0,
        }}
      >
        <div style={{ flex: 0.8, marginBottom: vertical ? 50 : 0 }}>
          <div
            style={{
              fontSize: vertical ? 62 : 58,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: -2,
            }}
          >
            Your score,
            <br />
            in seconds.
          </div>
          <div style={{ color: colors.muted, fontSize: 27, marginTop: 22 }}>
            No signup. Birth dates are not stored.
          </div>
        </div>

        <div
          style={{
            flex: 1.2,
            background: colors.paper,
            border: `1.5px solid ${colors.line}`,
            borderRadius: 34,
            padding: vertical ? 38 : 42,
            boxShadow: "0 28px 80px rgba(67, 48, 78, 0.12)",
            opacity: cardIn,
            transform: `translateY(${interpolate(cardIn, [0, 1], [48, 0])}px) scale(${interpolate(cardIn, [0, 1], [0.96, 1])})`,
          }}
        >
          <div
            style={{
              display: "flex",
              background: colors.pale,
              borderRadius: 14,
              padding: 6,
              marginBottom: 30,
              fontSize: 19,
              fontWeight: 600,
            }}
          >
            <div style={{ flex: 1, background: colors.paper, padding: 13, borderRadius: 10, textAlign: "center" }}>
              Just Us (2)
            </div>
            <div style={{ flex: 1, padding: 13, textAlign: "center", color: colors.muted }}>
              Friend Group
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, marginBottom: 24 }}>
            <Field label="Name" value="Alex" progress={nameOne} />
            <Field label="Birth Date" value="03 / 21 / 1990" progress={nameOne} />
          </div>
          <div style={{ display: "flex", gap: 18, marginBottom: 30 }}>
            <Field label="Name" value="Jordan" progress={nameTwo} />
            <Field label="Birth Date" value="09 / 23 / 1992" progress={nameTwo} />
          </div>
          <div
            style={{
              background: colors.lavender,
              color: "white",
              height: 66,
              borderRadius: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 600,
              opacity: button,
              transform: `scale(${interpolate(button, [0, 1], [0.96, 1])})`,
            }}
          >
            Calculate Compatibility
          </div>
        </div>
      </div>
    </Shell>
  );
};

const ResultScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const vertical = height > width;
  const duration = 120;
  const cardIn = appear(frame, 2, 20);
  const scoreProgress = appear(frame, 20, 36);
  const score = Math.round(82 * scoreProgress);
  const bars = [
    ["Chemistry", 86],
    ["Communication", 80],
    ["Stability", 76],
    ["Growth", 84],
  ];

  return (
    <Shell opacity={sceneOpacity(frame, duration)}>
      <Brand compact />
      <div
        style={{
          display: vertical ? "block" : "flex",
          alignItems: "center",
          gap: 80,
          height: vertical ? "auto" : "calc(100% - 40px)",
          marginTop: vertical ? 80 : 0,
        }}
      >
        <div style={{ flex: 0.85, marginBottom: vertical ? 44 : 0 }}>
          <div style={{ color: colors.lavender, fontSize: 23, textTransform: "uppercase", letterSpacing: 4, fontWeight: 600 }}>
            More than a number
          </div>
          <div style={{ fontSize: vertical ? 64 : 60, lineHeight: 1.05, fontWeight: 600, letterSpacing: -2, marginTop: 20 }}>
            See what makes the connection work.
          </div>
        </div>
        <div
          style={{
            flex: 1.15,
            background: colors.paper,
            border: `1.5px solid ${colors.line}`,
            borderRadius: 34,
            padding: vertical ? 40 : 42,
            boxShadow: "0 28px 80px rgba(67, 48, 78, 0.12)",
            opacity: cardIn,
            transform: `translateY(${interpolate(cardIn, [0, 1], [42, 0])}px)`,
          }}
        >
          <div style={{ textAlign: "center", paddingBottom: 28, borderBottom: `1px solid ${colors.line}` }}>
            <div style={{ fontSize: 25, fontWeight: 600 }}>Alex & Jordan</div>
            <div style={{ fontSize: vertical ? 108 : 96, color: colors.lavender, fontWeight: 600, letterSpacing: -5, lineHeight: 1.15, marginTop: 16 }}>
              {score}%
            </div>
            <div style={{ fontSize: 27, fontWeight: 600 }}>High Romantic Harmony</div>
          </div>
          <div style={{ paddingTop: 26 }}>
            {bars.map(([label, value], index) => {
              const bar = appear(frame, 50 + index * 10, 22);
              return (
                <div key={label} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, marginBottom: 8 }}>
                    <span>{label}</span>
                    <span style={{ color: colors.muted }}>{value}%</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 10, background: colors.pale, overflow: "hidden" }}>
                    <div style={{ width: `${Number(value) * bar}%`, height: "100%", background: colors.lavender }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Shell>
  );
};

const GroupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const vertical = height > width;
  const duration = 100;
  const cardIn = appear(frame, 2, 20);
  const pairs = [
    ["Alex & Jordan", "82%"],
    ["Morgan & Casey", "76%"],
    ["Alex & Casey", "71%"],
  ];

  return (
    <Shell opacity={sceneOpacity(frame, duration)}>
      <Brand compact />
      <div style={{ textAlign: "center", marginTop: vertical ? 110 : 50 }}>
        <div style={{ color: colors.lavender, fontSize: 23, textTransform: "uppercase", letterSpacing: 4, fontWeight: 600 }}>
          Friend Group Mode
        </div>
        <div style={{ fontSize: vertical ? 68 : 62, fontWeight: 600, letterSpacing: -2, marginTop: 18 }}>
          Bring the whole group.
        </div>
        <div style={{ color: colors.muted, fontSize: 27, marginTop: 14 }}>
          Every unique connection, ranked clearly.
        </div>
      </div>
      <div
        style={{
          maxWidth: vertical ? 850 : 980,
          margin: vertical ? "90px auto 0" : "45px auto 0",
          background: colors.paper,
          border: `1.5px solid ${colors.line}`,
          borderRadius: 32,
          padding: 38,
          boxShadow: "0 28px 80px rgba(67, 48, 78, 0.12)",
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [40, 0])}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 24, borderBottom: `1px solid ${colors.line}` }}>
          <div>
            <div style={{ color: colors.muted, fontSize: 17, textTransform: "uppercase", letterSpacing: 3 }}>Group Vibe</div>
            <div style={{ fontSize: 32, fontWeight: 600, marginTop: 5 }}>Strong Friendship Match</div>
          </div>
          <div style={{ fontSize: 70, color: colors.lavender, fontWeight: 600 }}>74%</div>
        </div>
        {pairs.map(([names, value], index) => {
          const row = appear(frame, 28 + index * 12, 18);
          return (
            <div
              key={names}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "22px 4px",
                borderBottom: index < pairs.length - 1 ? `1px solid ${colors.line}` : undefined,
                fontSize: 23,
                opacity: row,
                transform: `translateX(${interpolate(row, [0, 1], [30, 0])}px)`,
              }}
            >
              <span>{index + 1}. &nbsp;{names}</span>
              <span style={{ color: colors.lavender, fontWeight: 600 }}>{value}</span>
            </div>
          );
        })}
      </div>
    </Shell>
  );
};

const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const vertical = height > width;
  const duration = 95;
  const main = appear(frame, 3, 22);
  const cta = appear(frame, 28, 20);

  return (
    <Shell opacity={sceneOpacity(frame, duration)}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          opacity: main,
          transform: `scale(${interpolate(main, [0, 1], [0.96, 1])})`,
        }}
      >
        <Brand />
        <div style={{ fontSize: vertical ? 76 : 72, lineHeight: 1.03, fontWeight: 600, letterSpacing: -3, maxWidth: 1050, marginTop: 70 }}>
          Discover the connection.
        </div>
        <div style={{ fontSize: vertical ? 34 : 31, color: colors.muted, marginTop: 22 }}>
          Free results. Private sharing. Full reports for $9.99.
        </div>
        <div
          style={{
            marginTop: 55,
            background: colors.lavender,
            color: "white",
            borderRadius: 18,
            padding: vertical ? "24px 54px" : "22px 58px",
            fontSize: vertical ? 31 : 29,
            fontWeight: 600,
            opacity: cta,
            transform: `translateY(${interpolate(cta, [0, 1], [24, 0])}px)`,
          }}
        >
          MatchbyBirth.com
        </div>
        <div style={{ marginTop: 28, fontSize: 21, color: colors.muted }}>
          Results in seconds. No signup required.
        </div>
      </div>
    </Shell>
  );
};

export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("matchbybirth-bed.wav")} volume={0.9} />
      <Sequence durationInFrames={75} premountFor={30}>
        <IntroScene />
      </Sequence>
      <Sequence from={60} durationInFrames={120} premountFor={30}>
        <CalculatorScene />
      </Sequence>
      <Sequence from={165} durationInFrames={120} premountFor={30}>
        <ResultScene />
      </Sequence>
      <Sequence from={270} durationInFrames={100} premountFor={30}>
        <GroupScene />
      </Sequence>
      <Sequence from={355} durationInFrames={95} premountFor={30}>
        <CtaScene />
      </Sequence>
    </AbsoluteFill>
  );
};
