import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import {blueprintScenes} from './blueprintTimeline';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const createStars = () => {
  let seed = 24681357;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({length: 48}, (_, i) => ({
    id: `star-${i}`,
    x: 4 + next() * 92,
    y: 8 + next() * 82,
    size: 1 + next() * 2.4,
    phase: next() * Math.PI * 2
  }));
};

const stars = createStars();

const getScene = (sec: number) => {
  const found = blueprintScenes.find((scene) => sec >= scene.startSec && sec < scene.endSec);
  return found ?? blueprintScenes[blueprintScenes.length - 1];
};

export const BlueprintPromo = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const scene = getScene(sec);
  const startFrame = scene.startSec * fps;
  const endFrame = scene.endSec * fps;
  const localFrame = frame - startFrame;
  const sceneFrames = Math.max(1, endFrame - startFrame);
  const sceneProgress = clamp01(localFrame / sceneFrames);

  const zoom = interpolate(sceneProgress, [0, 1], [1.03, 1.15]);
  const panX = interpolate(sceneProgress, [0, 1], [scene.panFromX, scene.panToX]);
  const panY = interpolate(sceneProgress, [0, 1], [scene.panFromY, scene.panToY]);

  const emblemScale = spring({
    fps,
    frame: frame - 2,
    config: {damping: 180, stiffness: 180}
  });
  const emblemOpacity = interpolate(frame, [0, fps * 0.9, fps * 7], [0, 1, 0.34], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const titleIn = spring({
    fps,
    frame: localFrame - fps * 0.15,
    config: {damping: 180, stiffness: 170}
  });
  const titleOpacity = interpolate(
    localFrame,
    [0, fps * 0.35, sceneFrames - fps * 0.3, sceneFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const titleY = interpolate(titleIn, [0, 1], [28, 0]);
  const sublineOpacity = interpolate(
    localFrame,
    [fps * 0.35, fps * 0.8, sceneFrames - fps * 0.25, sceneFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const flashStrength = blueprintScenes.slice(1).reduce((acc, s) => {
    const start = s.startSec * fps;
    const v = interpolate(frame, [start - 3, start, start + 10], [0, 0.4, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return Math.max(acc, v);
  }, 0);

  const gridOffsetX = (frame * 0.55) % 56;
  const gridOffsetY = (frame * 0.3) % 56;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#031327',
        fontFamily: '"Noto Sans JP", sans-serif',
        color: '#eff8ff'
      }}
    >
      <Img
        src={staticFile(scene.slide)}
        style={{
          position: 'absolute',
          inset: -24,
          width: 'calc(100% + 48px)',
          height: 'calc(100% + 48px)',
          objectFit: 'cover',
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          filter: 'saturate(0.72) hue-rotate(176deg) brightness(0.52)'
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(88,188,255,0.14), rgba(2,10,24,0.93) 66%)'
        }}
      />

      <AbsoluteFill
        style={{
          inset: -120,
          transform: `translate(${gridOffsetX}px, ${gridOffsetY}px)`,
          backgroundImage:
            'linear-gradient(rgba(190,234,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(190,234,255,0.12) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          opacity: 0.42
        }}
      />

      {stars.map((star) => {
        const twinkle = 0.22 + 0.45 * (0.5 + 0.5 * Math.sin(frame * 0.07 + star.phase));
        return (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              backgroundColor: '#f2f9ff',
              opacity: twinkle
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '35%',
          transform: `translate(-50%, -50%) scale(${0.74 + emblemScale * 0.26})`,
          opacity: emblemOpacity
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 220,
            height: 256,
            clipPath: 'polygon(50% 0%, 89% 16%, 89% 63%, 50% 100%, 11% 63%, 11% 16%)',
            border: '3px solid rgba(240,250,255,0.95)',
            background: 'rgba(7,40,78,0.32)',
            boxShadow: '0 0 28px rgba(136,215,255,0.34)'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 18,
              border: '2px solid rgba(233,246,255,0.9)',
              clipPath: 'polygon(50% 0%, 89% 16%, 89% 63%, 50% 100%, 11% 63%, 11% 16%)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '46%',
              width: 102,
              height: 102,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: '2px solid rgba(238,248,255,0.95)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '46%',
              width: 74,
              height: 2,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(238,248,255,0.95)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '46%',
              width: 2,
              height: 74,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(238,248,255,0.95)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 26,
              transform: 'translateX(-50%)',
              fontSize: 39,
              fontFamily: '"Times New Roman", serif',
              letterSpacing: '0.08em',
              color: '#f2fbff'
            }}
          >
            MSRG
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 130,
          transform: `translate(-50%, ${titleY}px)`,
          opacity: titleOpacity,
          textAlign: 'center',
          fontWeight: 700,
          letterSpacing: '0.08em',
          fontSize: 64,
          textShadow: '0 0 24px rgba(112,205,255,0.33)',
          whiteSpace: 'nowrap'
        }}
      >
        {scene.headline}
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 86,
          transform: 'translateX(-50%)',
          opacity: sublineOpacity,
          textAlign: 'center',
          fontSize: 30,
          color: '#d8ecff',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap'
        }}
      >
        {scene.subline}
      </div>

      <AbsoluteFill
        style={{
          backgroundColor: '#dbeeff',
          mixBlendMode: 'screen',
          opacity: flashStrength
        }}
      />
    </AbsoluteFill>
  );
};
