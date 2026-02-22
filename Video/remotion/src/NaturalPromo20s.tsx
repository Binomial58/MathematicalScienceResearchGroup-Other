import type {ReactNode} from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import {renderToString} from 'katex';
import 'katex/dist/katex.min.css';
import {naturalScenes} from './naturalTimeline';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const bubbles = [
  {x: 9, y: 16, size: 240, speed: 0.012, alpha: 0.12},
  {x: 27, y: 74, size: 160, speed: 0.015, alpha: 0.09},
  {x: 55, y: 18, size: 200, speed: 0.01, alpha: 0.1},
  {x: 77, y: 66, size: 280, speed: 0.008, alpha: 0.09},
  {x: 89, y: 26, size: 150, speed: 0.013, alpha: 0.1}
];

const sparks = [
  {x: 12, y: 22, size: 20, speed: 0.04, alpha: 0.42},
  {x: 31, y: 14, size: 16, speed: 0.05, alpha: 0.38},
  {x: 66, y: 12, size: 18, speed: 0.045, alpha: 0.36},
  {x: 82, y: 72, size: 20, speed: 0.043, alpha: 0.4},
  {x: 92, y: 24, size: 15, speed: 0.052, alpha: 0.34}
];

const geometryGlyphs = [
  {x: 19, y: 34, size: 146, rot: 14, speed: 0.018, alpha: 0.22},
  {x: 83, y: 31, size: 132, rot: -10, speed: 0.015, alpha: 0.2},
  {x: 25, y: 71, size: 154, rot: -7, speed: 0.014, alpha: 0.18},
  {x: 77, y: 72, size: 140, rot: 12, speed: 0.017, alpha: 0.19}
];

const constellationNodes = [
  {x: 190, y: 132, amp: 20, drift: 0.013},
  {x: 418, y: 248, amp: 14, drift: 0.016},
  {x: 612, y: 165, amp: 16, drift: 0.012},
  {x: 1414, y: 152, amp: 18, drift: 0.014},
  {x: 1656, y: 272, amp: 12, drift: 0.017},
  {x: 312, y: 856, amp: 22, drift: 0.011},
  {x: 540, y: 760, amp: 17, drift: 0.015},
  {x: 1472, y: 826, amp: 19, drift: 0.012},
  {x: 1708, y: 678, amp: 15, drift: 0.016}
];

const constellationLinks: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
  [2, 3],
  [1, 6],
  [4, 8]
];

type MathFragment = {
  x: number;
  y: number;
  latex: string;
  html: string;
  size: number;
  alpha: number;
  rot: number;
  speed: number;
};

const mathFragmentDefs = [
  {
    x: 8,
    y: 14,
    latex: 'e^{i\\pi}+1=0',
    size: 34,
    alpha: 0.16,
    rot: -12,
    speed: 0.016
  },
  {
    x: 68,
    y: 13,
    latex: '\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx=\\sqrt{\\pi}',
    size: 29,
    alpha: 0.15,
    rot: 8,
    speed: 0.013
  },
  {
    x: 18,
    y: 84,
    latex:
      '\\left|\\begin{matrix}1&1&1&1\\\\x_1&x_2&x_3&x_4\\\\x_1^2&x_2^2&x_3^2&x_4^2\\\\x_1^3&x_2^3&x_3^3&x_4^3\\end{matrix}\\right|=\\prod_{1\\le i<j\\le4}(x_j-x_i)',
    size: 20,
    alpha: 0.15,
    rot: -7,
    speed: 0.018
  },
  {
    x: 82,
    y: 82,
    latex: 'f(a)=\\frac{1}{2\\pi i}\\oint_{|z-a|=r}\\frac{f(z)}{z-a}\\,dz',
    size: 24,
    alpha: 0.14,
    rot: 8,
    speed: 0.015
  },
  {
    x: 48,
    y: 11,
    latex: '\\widehat{f}(\\xi)=\\int_{-\\infty}^{\\infty}f(x)e^{-2\\pi i x\\xi}\\,dx',
    size: 24,
    alpha: 0.13,
    rot: -3,
    speed: 0.014
  },
  {
    x: 50,
    y: 89,
    latex: 'A=Q\\Lambda Q^{\\mathsf T}\\quad(A=A^{\\mathsf T})',
    size: 27,
    alpha: 0.13,
    rot: 3,
    speed: 0.014
  }
];

const mathFragments: MathFragment[] = mathFragmentDefs.map((frag) => ({
  ...frag,
  html: renderToString(frag.latex, {
    displayMode: true,
    throwOnError: false,
    strict: 'ignore'
  })
}));

const sceneOpacity = (frame: number, start: number, end: number, fps: number) => {
  return clamp01(
    interpolate(frame, [start, start + fps * 0.7, end - fps * 0.5, end], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    })
  );
};

const SceneFrame = ({
  children,
  opacity,
  yShift
}: {
  children: ReactNode;
  opacity: number;
  yShift: number;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transform: `translateY(${yShift}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 140px'
      }}
    >
      {children}
    </div>
  );
};

export const NaturalPromo20s = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const cuteFontFace = `
@font-face {
  font-family: 'MsrgCute';
  src: url('${staticFile('fonts/ipamp.ttf')}') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
.math-frag .katex-display {
  margin: 0;
}
.math-frag .katex {
  color: inherit;
}
`;
  const sec = frame / fps;
  const activeScene =
    naturalScenes.find((scene) => sec >= scene.startSec && sec < scene.endSec) ??
    naturalScenes[naturalScenes.length - 1];
  const isProblemScene = activeScene.layout === 'problem';
  const progress = frame / Math.max(1, durationInFrames - 1);
  const bgmStartSec = 14;
  const bgmStartFrame = Math.round(bgmStartSec * fps);
  const sceneGain =
    activeScene.layout === 'intro' ? 0.82 : activeScene.layout === 'problem' ? 1.0 : 1.08;
  const bgmFade = interpolate(
    frame,
    [0, fps * 0.6, durationInFrames - fps * 1.1, durationInFrames],
    [0, 0.23, 0.23, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const bgmMotion = 0.96 + Math.sin(frame * 0.045) * 0.04;
  const bgmVolume = bgmFade * sceneGain * bgmMotion;

  const auraX = 56 + Math.sin(frame * 0.012) * 12;
  const auraY = 46 + Math.cos(frame * 0.01) * 11;
  const sweepProgress = (frame % Math.floor(fps * 6)) / (fps * 6);
  const sweepX = -30 + sweepProgress * 160;
  const auraPulse = 0.58 + Math.sin(frame * 0.02) * 0.12;
  const haloRotation = frame * 0.26;
  const haloOpacity = 0.16 + Math.sin(frame * 0.012) * 0.04;
  const mathBoardTilt = Math.sin(frame * 0.0035) * 1.4;
  const latticeShiftX = (frame * 0.42) % 64;
  const latticeShiftY = (frame * 0.26) % 64;
  const scanlineTravel = (frame * 1.8) % 240;
  const scanlineOpacity = 0.1 + Math.sin(frame * 0.03) * 0.03;
  const dashOffsetA = (frame * 2.2) % 340;
  const dashOffsetB = (frame * 1.4) % 200;
  const orbitBreath = 1 + Math.sin(frame * 0.018) * 0.06;
  const wireBend = Math.sin(frame * 0.009) * 20;
  const prismSweepA = -46 + ((frame % Math.floor(fps * 5.6)) / (fps * 5.6)) * 198;
  const prismSweepB = 168 - ((frame % Math.floor(fps * 7.2)) / (fps * 7.2)) * 208;
  const auroraPulse = 0.26 + Math.sin(frame * 0.014) * 0.05;
  const ringSpinA = frame * 0.16;
  const ringSpinB = -frame * 0.21;
  const constellationPoints = constellationNodes.map((node, idx) => ({
    x: node.x + Math.sin(frame * node.drift + idx * 0.8) * node.amp,
    y: node.y + Math.cos(frame * node.drift * 1.3 + idx * 0.6) * node.amp * 0.7
  }));

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(142deg, #0f172a 0%, #10253a 45%, #16353b 100%)',
        color: '#f8fbff',
        fontFamily: '"MsrgCute", "IPAPMincho", "IPA P明朝", "Noto Serif CJK JP", serif'
      }}
    >
      <style>{cuteFontFace}</style>
      <Audio
        src={staticFile('assets/SAMURAI_PUNK.mp3')}
        startFrom={bgmStartFrame}
        endAt={bgmStartFrame + durationInFrames}
        volume={bgmVolume}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${auraX}% ${auraY}%, rgba(139,232,255,0.20), rgba(15,23,42,0.04) 36%, rgba(15,23,42,0.82) 70%)`
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(112deg, rgba(145,225,255,0) ${sweepX - 18}%, rgba(145,225,255,0.12) ${sweepX}%, rgba(145,225,255,0.22) ${sweepX + 9}%, rgba(145,225,255,0.04) ${sweepX + 22}%, rgba(145,225,255,0) ${sweepX + 34}%)`,
          opacity: 0.66,
          mixBlendMode: 'screen'
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(118deg, rgba(109,224,255,0) ${prismSweepA - 24}%, rgba(109,224,255,0.11) ${prismSweepA}%, rgba(109,224,255,0.3) ${prismSweepA + 12}%, rgba(109,224,255,0.08) ${prismSweepA + 34}%, rgba(109,224,255,0) ${prismSweepA + 52}%)`,
          opacity: 0.56,
          mixBlendMode: 'screen'
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(68deg, rgba(255,168,212,0) ${prismSweepB - 20}%, rgba(255,168,212,0.08) ${prismSweepB}%, rgba(255,168,212,0.2) ${prismSweepB + 10}%, rgba(255,168,212,0.06) ${prismSweepB + 28}%, rgba(255,168,212,0) ${prismSweepB + 44}%)`,
          opacity: 0.42,
          mixBlendMode: 'screen'
        }}
      />

      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          backgroundPosition: `${latticeShiftX}px ${latticeShiftY}px`,
          opacity: 0.2
        }}
      />

      <AbsoluteFill
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, rgba(139,214,255,0.16) 0px, rgba(139,214,255,0.02) 2px, rgba(0,0,0,0) 5px, rgba(0,0,0,0) 14px)',
          backgroundPosition: `0 ${scanlineTravel}px`,
          opacity: scanlineOpacity,
          mixBlendMode: 'screen'
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(8,18,34,0.06) 35%, rgba(5,12,25,0.42) 74%, rgba(3,8,19,0.86) 100%)'
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'conic-gradient(from 0deg at 50% 50%, rgba(92,197,245,0.12), rgba(135,222,255,0.02), rgba(151,186,255,0.10), rgba(95,223,255,0.03), rgba(92,197,245,0.12))',
          opacity: haloOpacity,
          transform: `scale(1.32) rotate(${haloRotation}deg)`,
          mixBlendMode: 'screen'
        }}
      />

      <AbsoluteFill
        style={{
          transform: `scale(1.03) rotate(${mathBoardTilt}deg)`,
          opacity: 0.4,
          mixBlendMode: 'screen'
        }}
      >
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="math-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(151,225,255,0.06)" />
              <stop offset="45%" stopColor="rgba(173,232,255,0.28)" />
              <stop offset="100%" stopColor="rgba(151,225,255,0.05)" />
            </linearGradient>
            <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(166,234,255,0.9)" />
              <stop offset="60%" stopColor="rgba(166,234,255,0.26)" />
              <stop offset="100%" stopColor="rgba(166,234,255,0)" />
            </radialGradient>
          </defs>
          <path
            d={`M60 ${780 + wireBend * 0.8} C 320 ${640 + wireBend * 0.6}, 560 ${900 - wireBend * 0.8}, 880 ${
              740 + wireBend * 0.5
            } S 1460 ${640 - wireBend * 0.6}, 1860 ${770 + wireBend * 0.4}`}
            fill="none"
            stroke="url(#math-line)"
            strokeWidth="2.5"
            strokeDasharray="7 10"
            strokeDashoffset={-dashOffsetA}
          />
          <path
            d={`M120 ${260 - wireBend * 0.3} Q 300 ${220 + wireBend * 0.4}, 470 ${300 - wireBend * 0.2} T 820 ${
              280 + wireBend * 0.3
            }`}
            fill="none"
            stroke="url(#math-line)"
            strokeWidth="2"
            strokeDasharray="5 8"
            strokeDashoffset={dashOffsetB}
          />
          <circle
            cx="1480"
            cy="300"
            r={128 * orbitBreath}
            fill="none"
            stroke="rgba(164,229,255,0.22)"
            strokeWidth="2"
          />
          <circle
            cx="1480"
            cy="300"
            r={58 * orbitBreath}
            fill="none"
            stroke="rgba(164,229,255,0.16)"
            strokeWidth="1.5"
          />
          <circle cx="1480" cy="300" r="22" fill="url(#node-glow)" />
          <polygon
            points={`286,338 444,${580 + wireBend * 0.5} 168,${592 - wireBend * 0.3}`}
            fill="none"
            stroke="rgba(164,229,255,0.2)"
            strokeWidth="2"
            strokeDasharray="6 8"
            strokeDashoffset={dashOffsetA * 0.6}
          />
          <line
            x1="286"
            y1="338"
            x2="168"
            y2={592 - wireBend * 0.3}
            stroke="rgba(164,229,255,0.18)"
            strokeWidth="1.8"
          />
          <line
            x1="444"
            y1={580 + wireBend * 0.5}
            x2="168"
            y2={592 - wireBend * 0.3}
            stroke="rgba(164,229,255,0.18)"
            strokeWidth="1.8"
          />
          <line
            x1="286"
            y1="338"
            x2="444"
            y2={580 + wireBend * 0.5}
            stroke="rgba(164,229,255,0.18)"
            strokeWidth="1.8"
          />
          <g transform={`translate(960 540) rotate(${ringSpinA})`}>
            <polygon
              points="0,-190 165,-95 165,95 0,190 -165,95 -165,-95"
              fill="none"
              stroke="rgba(157,230,255,0.19)"
              strokeWidth="1.8"
              strokeDasharray="8 10"
              strokeDashoffset={-dashOffsetA * 0.45}
            />
            <polygon
              points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60"
              fill="none"
              stroke="rgba(157,230,255,0.14)"
              strokeWidth="1.4"
              strokeDasharray="6 8"
              strokeDashoffset={dashOffsetB * 0.4}
            />
          </g>
          <g transform={`translate(960 540) rotate(${ringSpinB}) scale(${1 + auroraPulse * 0.2})`}>
            <circle cx="0" cy="0" r="280" fill="none" stroke="rgba(145,221,255,0.12)" strokeWidth="1.6" />
            <circle
              cx="0"
              cy="0"
              r="332"
              fill="none"
              stroke="rgba(145,221,255,0.1)"
              strokeWidth="1.2"
              strokeDasharray="12 15"
              strokeDashoffset={-dashOffsetB * 0.8}
            />
          </g>
          {constellationLinks.map(([from, to], idx) => (
            <line
              key={`link-${from}-${to}`}
              x1={constellationPoints[from]?.x}
              y1={constellationPoints[from]?.y}
              x2={constellationPoints[to]?.x}
              y2={constellationPoints[to]?.y}
              stroke={`rgba(148,226,255,${0.11 + Math.sin(frame * 0.016 + idx) * 0.04})`}
              strokeWidth={1.4}
            />
          ))}
          {constellationPoints.map((point, idx) => (
            <g key={`node-${idx}`}>
              <circle cx={point.x} cy={point.y} r={3.5} fill="rgba(188,241,255,0.85)" />
              <circle
                cx={point.x}
                cy={point.y}
                r={11 + Math.sin(frame * 0.02 + idx) * 2}
                fill="none"
                stroke="rgba(141,225,255,0.26)"
                strokeWidth="1.1"
              />
            </g>
          ))}
        </svg>
      </AbsoluteFill>

      {mathFragments.map((frag, i) => {
        const driftX = Math.sin(frame * frag.speed + i * 0.8) * 24;
        const driftY = Math.cos(frame * frag.speed * 1.2 + i * 0.65) * 14;
        const pulse = 0.7 + Math.sin(frame * frag.speed * 2.8 + i) * 0.3;
        const scale = 0.92 + pulse * 0.16;
        const depth = Math.sin(frame * frag.speed * 1.8 + i * 0.5) * 3;
        return (
          <div
            key={`math-frag-${i}`}
            className="math-frag"
            style={{
              position: 'absolute',
              left: `calc(${frag.x}% + ${driftX}px)`,
              top: `calc(${frag.y}% + ${driftY}px)`,
              transform: `translate(-50%, -50%) rotate(${frag.rot}deg) scale(${scale}) translateY(${depth}px)`,
              fontSize: frag.size,
              letterSpacing: '0.03em',
              color: `rgba(192,236,255,${frag.alpha * pulse})`,
              textShadow: '0 0 18px rgba(137,220,255,0.35), 0 0 34px rgba(79,186,255,0.16)',
              filter: 'drop-shadow(0 0 10px rgba(102,210,255,0.2))',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 2
            }}
            dangerouslySetInnerHTML={{__html: frag.html}}
          >
          </div>
        );
      })}

      {geometryGlyphs.map((glyph, i) => {
        const driftX = Math.sin(frame * glyph.speed + i * 0.9) * 20;
        const driftY = Math.cos(frame * glyph.speed * 1.1 + i * 0.6) * 16;
        const spin = glyph.rot + frame * (0.03 + i * 0.004);
        const pulse = 0.7 + Math.sin(frame * glyph.speed * 4 + i * 1.4) * 0.3;
        return (
          <div
            key={`glyph-${i}`}
            style={{
              position: 'absolute',
              left: `calc(${glyph.x}% + ${driftX}px)`,
              top: `calc(${glyph.y}% + ${driftY}px)`,
              width: glyph.size,
              height: glyph.size,
              transform: `translate(-50%, -50%) rotate(${spin}deg)`,
              opacity: glyph.alpha * (0.75 + pulse * 0.5),
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 20,
                border: '1.6px solid rgba(158,230,255,0.45)',
                boxShadow: '0 0 20px rgba(100,210,255,0.2)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '18%',
                borderRadius: '50%',
                border: '1.4px dashed rgba(156,222,255,0.38)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                width: 1.4,
                height: '100%',
                transform: 'translateX(-50%)',
                background:
                  'linear-gradient(180deg, rgba(172,236,255,0), rgba(172,236,255,0.9), rgba(172,236,255,0))'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                height: 1.4,
                width: '100%',
                transform: 'translateY(-50%)',
                background:
                  'linear-gradient(90deg, rgba(172,236,255,0), rgba(172,236,255,0.9), rgba(172,236,255,0))'
              }}
            />
          </div>
        );
      })}

      {bubbles.map((bubble, i) => {
        const driftX = Math.sin(frame * bubble.speed + i * 0.8) * 24;
        const driftY = Math.cos(frame * bubble.speed * 1.3 + i * 0.6) * 20;
        return (
          <div
            key={`bubble-${i}`}
            style={{
              position: 'absolute',
              left: `calc(${bubble.x}% + ${driftX}px)`,
              top: `calc(${bubble.y}% + ${driftY}px)`,
              width: bubble.size,
              height: bubble.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(186,240,255,0.35), rgba(132,205,235,0.02) 72%)',
              opacity: bubble.alpha,
              filter: 'blur(2px)',
              transform: 'translate(-50%, -50%)'
            }}
          />
        );
      })}

      {sparks.map((spark, i) => {
        const driftX = Math.sin(frame * spark.speed + i) * 20;
        const driftY = Math.cos(frame * spark.speed * 1.2 + i * 0.7) * 18;
        const flicker = 0.5 + Math.sin(frame * spark.speed * 4 + i * 1.5) * 0.5;
        return (
          <div
            key={`spark-${i}`}
            style={{
              position: 'absolute',
              left: `calc(${spark.x}% + ${driftX}px)`,
              top: `calc(${spark.y}% + ${driftY}px)`,
              width: spark.size,
              height: spark.size,
              transform: 'translate(-50%, -50%) rotate(45deg)',
              opacity: spark.alpha * (0.55 + flicker * 0.45)
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                width: 2,
                height: '100%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(180deg, rgba(196,237,255,0), rgba(196,237,255,0.92), rgba(196,237,255,0))',
                borderRadius: 999
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: '100%',
                height: 2,
                transform: 'translateY(-50%)',
                background: 'linear-gradient(90deg, rgba(196,237,255,0), rgba(196,237,255,0.92), rgba(196,237,255,0))',
                borderRadius: 999
              }}
            />
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 28,
          padding: isProblemScene ? '14px 24px 16px' : '12px 24px',
          borderRadius: 24,
          border: '1px solid rgba(183,228,255,0.58)',
          background: 'linear-gradient(145deg, rgba(8,24,44,0.78), rgba(7,19,34,0.56))',
          boxShadow: `0 12px 30px rgba(0,0,0,0.36), 0 0 ${20 + auraPulse * 12}px rgba(143,225,255,0.16)`,
          backdropFilter: 'blur(6px)',
          color: '#daf0ff',
          fontWeight: 700,
          zIndex: 10
        }}
      >
        <div
          style={{
            fontSize: 45,
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
            textShadow: '0 6px 16px rgba(0,0,0,0.45)'
          }}
        >
          数理科学研究会
        </div>
        {isProblemScene ? (
          <div
            style={{
              marginTop: 4,
              fontSize: 48,
              letterSpacing: '0.04em',
              color: '#eef8ff',
              whiteSpace: 'nowrap',
              textShadow: '0 6px 18px rgba(0,0,0,0.48)'
            }}
          >
            色が付いている角の大きさの和を求めよ
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 56,
          top: 30,
          width: 282,
          borderRadius: 18,
          padding: '12px 12px 14px',
          border: '1px solid rgba(188,230,255,0.55)',
          background: 'linear-gradient(145deg, rgba(7,26,46,0.88), rgba(7,19,34,0.72))',
          boxShadow: '0 14px 34px rgba(0,0,0,0.36), inset 0 0 0 1px rgba(217,239,255,0.15)',
          backdropFilter: 'blur(5px)',
          zIndex: 20
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: '0.04em',
            color: '#eaf7ff',
            textAlign: 'center',
            marginBottom: 10,
            textShadow: '0 4px 14px rgba(0,0,0,0.45)',
            whiteSpace: 'nowrap'
          }}
        >
          数理研ホームページ
        </div>
        <div
          style={{
            width: 252,
            height: 252,
            borderRadius: 12,
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid rgba(218,235,249,0.9)',
            margin: '0 auto',
            boxShadow: '0 10px 22px rgba(0,0,0,0.24)'
          }}
        >
          <Img
            src={staticFile('assets/qrcode.png')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>

      {naturalScenes.map((scene) => {
        const start = scene.startSec * fps;
        const end = scene.endSec * fps;
        const localFrame = frame - start;
        const totalFrame = Math.max(1, end - start);
        const opacity = sceneOpacity(frame, start, end, fps);
        if (opacity <= 0.001) {
          return null;
        }

        const yShift = interpolate(frame, [start, start + fps * 0.7], [24, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        });
        const enterSpring = spring({
          fps,
          frame: localFrame - fps * 0.1,
          config: {damping: 200}
        });
        const titleScale = interpolate(enterSpring, [0, 1], [0.96, 1]);
        const titleGlow = 0.5 + Math.sin(localFrame * 0.05) * 0.5;
        const isFinalScene = scene.layout === 'final';

        if (scene.layout === 'intro') {
          return (
            <SceneFrame key={scene.id} opacity={opacity} yShift={yShift}>
              <div
                style={{
                  maxWidth: 1360,
                  textAlign: 'center',
                  padding: '66px 86px',
                  borderRadius: 36,
                  border: '1px solid rgba(171,227,255,0.36)',
                  background: 'linear-gradient(160deg, rgba(12,35,63,0.62), rgba(6,18,33,0.26))',
                  boxShadow: '0 24px 56px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(193,232,255,0.14)',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    border: `1px solid ${scene.accent}cc`,
                    color: '#d5f5ff',
                    background: 'rgba(8,29,52,0.48)',
                    boxShadow: `0 0 ${14 + titleGlow * 12}px rgba(141,228,255,0.22)`,
                    padding: '12px 26px',
                    borderRadius: 999,
                    letterSpacing: '0.12em',
                    fontSize: 34
                  }}
                >
                  {scene.kicker}
                </div>
                <div
                  style={{
                    marginTop: 34,
                    fontSize: 156,
                    fontWeight: 600,
                    letterSpacing: '0.035em',
                    transform: `scale(${titleScale})`,
                    lineHeight: 1.06,
                    whiteSpace: 'nowrap',
                    color: '#f7fcff',
                    WebkitTextStroke: '1px rgba(214,242,255,0.25)',
                    textShadow: `0 14px 36px rgba(0,0,0,0.48), 0 0 ${18 + titleGlow * 20}px rgba(124,214,255,0.22)`
                  }}
                >
                  {scene.title}
                </div>
              </div>
            </SceneFrame>
          );
        }

        if (scene.layout === 'problem') {
          const problemImageScale = interpolate(localFrame, [0, totalFrame], [1.08, 1.12], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          const problemImageY = Math.sin(localFrame * 0.015) * 2 - 8;
          const panelSweep = -26 + ((localFrame % Math.floor(fps * 3.2)) / (fps * 3.2)) * 170;
          const panelSweepSecondary = 164 - ((localFrame % Math.floor(fps * 4.1)) / (fps * 4.1)) * 220;
          const framePulse = 0.5 + Math.sin(localFrame * 0.05) * 0.5;
          const frameEdge = 0.38 + framePulse * 0.3;
          const cornerPulse = 0.5 + Math.sin(localFrame * 0.08) * 0.4;
          const frameGlow = interpolate(
            localFrame,
            [0, fps * 0.8, totalFrame - fps * 0.6, totalFrame],
            [0.32, 0.72, 0.72, 0.32],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp'
            }
          );
          const answerHintOpacity = clamp01(
            interpolate(
              localFrame,
              [fps * 0.8, fps * 1.6, totalFrame - fps * 0.7, totalFrame],
              [0, 1, 1, 0],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp'
              }
            )
          );
          const answerHintY = interpolate(answerHintOpacity, [0, 1], [14, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          return (
            <div
              key={scene.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity,
                transform: `translateY(${yShift}px)`
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '126px 70px 116px',
                  borderRadius: 28,
                  border: '1px solid rgba(182,229,255,0.52)',
                  background: 'linear-gradient(160deg, rgba(4,24,48,0.74), rgba(3,16,33,0.58))',
                  boxShadow: `0 20px 56px rgba(0,0,0,0.38), 0 0 ${24 + framePulse * 18}px rgba(120,210,255,0.15)`,
                  overflow: 'hidden'
                }}
              >
                <AbsoluteFill
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(24,78,130,0.3), rgba(3,18,36,0.72))',
                    opacity: frameGlow
                  }}
                />
                <AbsoluteFill
                  style={{
                    borderRadius: 28,
                    border: `1px solid rgba(156,224,255,${frameEdge})`,
                    boxShadow: `inset 0 0 ${26 + framePulse * 14}px rgba(121,210,255,0.16)`
                  }}
                />
                <AbsoluteFill
                  style={{
                    background: `linear-gradient(112deg, rgba(136,226,255,0) ${panelSweep - 22}%, rgba(136,226,255,0.12) ${panelSweep}%, rgba(136,226,255,0) ${panelSweep + 18}%)`,
                    opacity: 0.8,
                    mixBlendMode: 'screen'
                  }}
                />
                <AbsoluteFill
                  style={{
                    background: `linear-gradient(72deg, rgba(255,172,222,0) ${panelSweepSecondary - 20}%, rgba(255,172,222,0.09) ${panelSweepSecondary}%, rgba(255,172,222,0.22) ${panelSweepSecondary + 10}%, rgba(255,172,222,0) ${panelSweepSecondary + 28}%)`,
                    opacity: 0.55,
                    mixBlendMode: 'screen'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 18,
                    borderRadius: 20,
                    pointerEvents: 'none'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: 74,
                      height: 74,
                      borderLeft: `2px solid rgba(153,229,255,${0.45 + cornerPulse * 0.25})`,
                      borderTop: `2px solid rgba(153,229,255,${0.45 + cornerPulse * 0.25})`,
                      borderTopLeftRadius: 14
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      width: 74,
                      height: 74,
                      borderRight: `2px solid rgba(153,229,255,${0.45 + cornerPulse * 0.25})`,
                      borderTop: `2px solid rgba(153,229,255,${0.45 + cornerPulse * 0.25})`,
                      borderTopRightRadius: 14
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      width: 74,
                      height: 74,
                      borderLeft: `2px solid rgba(153,229,255,${0.45 + cornerPulse * 0.25})`,
                      borderBottom: `2px solid rgba(153,229,255,${0.45 + cornerPulse * 0.25})`,
                      borderBottomLeftRadius: 14
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                      width: 74,
                      height: 74,
                      borderRight: `2px solid rgba(153,229,255,${0.45 + cornerPulse * 0.25})`,
                      borderBottom: `2px solid rgba(153,229,255,${0.45 + cornerPulse * 0.25})`,
                      borderBottomRightRadius: 14
                    }}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: '52px 120px',
                    borderRadius: 22,
                    background: 'linear-gradient(180deg, #fbfdff 0%, #edf4fc 100%)',
                    border: '1px solid rgba(211,224,242,0.95)',
                    boxShadow: '0 26px 44px rgba(0,0,0,0.34)',
                    overflow: 'hidden'
                  }}
                >
                  <Img
                    src={staticFile('assets/star7.png')}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transform: `translateY(${problemImageY}px) scale(${problemImageScale})`,
                      filter: 'contrast(1.1) saturate(1.08) brightness(1.02)'
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 118,
                  transform: `translateX(-50%) translateY(${answerHintY}px)`,
                  opacity: answerHintOpacity,
                  padding: '11px 26px',
                  borderRadius: 999,
                  border: '1px solid rgba(174,228,255,0.5)',
                  background: 'linear-gradient(145deg, rgba(5,25,47,0.86), rgba(7,18,33,0.66))',
                  color: '#e7f5ff',
                  fontSize: 39,
                  letterSpacing: '0.04em',
                  textShadow: '0 6px 18px rgba(0,0,0,0.48)',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.34)'
                }}
              >
                答えは数理研ホームページで公開中
              </div>
            </div>
          );
        }

        return (
          <SceneFrame key={scene.id} opacity={opacity} yShift={yShift}>
            <div
              style={{
                width: '100%',
                maxWidth: isFinalScene ? 1660 : 1400,
                textAlign: 'center',
                padding: isFinalScene ? '44px 52px' : '56px 70px',
                borderRadius: 32,
                border: '1px solid rgba(240,188,220,0.32)',
                background: 'linear-gradient(160deg, rgba(32,20,42,0.62), rgba(9,18,34,0.28))',
                boxShadow: '0 24px 58px rgba(0,0,0,0.34), inset 0 0 0 1px rgba(252,224,240,0.12)',
                backdropFilter: 'blur(5px)'
              }}
            >
              {scene.kicker ? (
                <div
                  style={{
                    display: 'inline-block',
                    border: `1px solid ${scene.accent}d9`,
                    color: '#ffe6f0',
                    background: 'rgba(58,19,49,0.38)',
                  boxShadow: `0 0 ${12 + titleGlow * 10}px rgba(248,168,203,0.22)`,
                  padding: '12px 28px',
                  borderRadius: 999,
                  letterSpacing: '0.12em',
                  fontSize: 34
                }}
              >
                {scene.kicker}
              </div>
              ) : null}
              <div
                style={{
                  marginTop: scene.kicker ? 24 : 6,
                  fontSize: isFinalScene ? 170 : 132,
                  fontWeight: 600,
                  transform: `scale(${titleScale})`,
                  color: '#fff6fb',
                  lineHeight: 1.08,
                  WebkitTextStroke: '1px rgba(255,228,242,0.2)',
                  textShadow: `0 14px 34px rgba(0,0,0,0.46), 0 0 ${18 + titleGlow * 16}px rgba(255,178,214,0.2)`
                }}
              >
                {scene.title}
              </div>

              <div
                style={{
                  marginTop: isFinalScene ? 34 : 32,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: isFinalScene ? 22 : 18
                }}
              >
                {scene.lines.map((line, lineIndex) => {
                  const lineSpring = spring({
                    fps,
                    frame: localFrame - 8 - lineIndex * 6,
                    config: {damping: 18, stiffness: 120, mass: 0.9}
                  });
                  const lineOpacity = clamp01(lineSpring);
                  const lineShift = interpolate(lineSpring, [0, 1], [20, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp'
                  });
                  const isLongFinalLine = isFinalScene && line.length >= 20;
                  const lineSweep = -40 + (((localFrame + lineIndex * 17) % Math.floor(fps * 2.6)) / (fps * 2.6)) * 220;
                  const linePulse = 0.58 + Math.sin(localFrame * 0.06 + lineIndex * 1.2) * 0.42;
                  return (
                    <div
                      key={line}
                      style={{
                        position: 'relative',
                        minWidth: isFinalScene ? 1320 : undefined,
                        fontSize: isFinalScene ? (isLongFinalLine ? 56 : 66) : 52,
                        padding: isFinalScene ? (isLongFinalLine ? '18px 34px' : '18px 46px') : '16px 36px',
                        borderRadius: isFinalScene ? 18 : 14,
                        background: 'linear-gradient(130deg, rgba(32,16,42,0.72), rgba(11,23,43,0.54))',
                        border: `1px solid rgba(235,203,224,${0.34 + linePulse * 0.18})`,
                        boxShadow: '0 12px 24px rgba(0,0,0,0.28)',
                        transform: `translateY(${lineShift}px)`,
                        opacity: lineOpacity,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 'inherit',
                          background: `linear-gradient(110deg, rgba(143,231,255,0) ${lineSweep - 32}%, rgba(143,231,255,${0.14 + linePulse * 0.16}) ${lineSweep}%, rgba(143,231,255,0) ${lineSweep + 22}%)`,
                          mixBlendMode: 'screen'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 9,
                          bottom: 9,
                          width: 4,
                          borderRadius: 999,
                          background: 'linear-gradient(180deg, rgba(255,214,234,0.94), rgba(255,159,206,0.72))'
                        }}
                      />
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          </SceneFrame>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          bottom: 56,
          height: 10,
          borderRadius: 999,
          background: 'rgba(190,220,248,0.24)',
          boxShadow: 'inset 0 0 0 1px rgba(194,227,255,0.22)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #8ce8ff 0%, #ffd59b 58%, #f6adcd 100%)',
            boxShadow: '0 0 16px rgba(167,234,255,0.52)'
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
