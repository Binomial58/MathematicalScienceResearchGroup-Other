import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import {slides, textCues} from './timeline';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const getActiveSlide = (sec: number) => {
  const found = slides.find((s) => sec >= s.startSec && sec < s.endSec);
  return found ?? slides[slides.length - 1];
};

export const SlidePdfEdit = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const activeSlide = getActiveSlide(sec);

  return (
    <AbsoluteFill style={{backgroundColor: '#020617', fontFamily: '"Noto Sans JP", sans-serif'}}>
      <Img
        src={staticFile(activeSlide.imagePath)}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />

      {textCues.map((cue) => {
        const startFrame = cue.startSec * fps;
        const endFrame = cue.endSec * fps;
        if (frame < startFrame || frame > endFrame) {
          return null;
        }

        const enterOpacity = interpolate(
          frame,
          [startFrame, startFrame + fps * 0.35],
          [0, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        );
        const exitOpacity = interpolate(
          frame,
          [endFrame - fps * 0.25, endFrame],
          [1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        );
        const opacity = clamp01(Math.min(enterOpacity, exitOpacity));

        const springIn = spring({
          fps,
          frame: frame - startFrame,
          config: {damping: 200}
        });

        const popScale = cue.animation === 'pop' ? interpolate(springIn, [0, 1], [0.88, 1]) : 1;
        const slideUpY =
          cue.animation === 'slide-up' ? interpolate(springIn, [0, 1], [24, 0]) : 0;

        return (
          <div
            key={cue.id}
            style={{
              position: 'absolute',
              left: `${cue.xPercent}%`,
              top: `${cue.yPercent}%`,
              transform: `translate(-50%, -50%) translateY(${slideUpY}px) scale(${popScale})`,
              opacity,
              color: cue.color ?? '#ffffff',
              background: cue.background ?? 'transparent',
              textAlign: cue.align ?? 'center',
              fontSize: cue.fontSize,
              fontWeight: 700,
              padding: cue.background ? '8px 16px' : 0,
              borderRadius: cue.background ? 12 : 0,
              maxWidth: '86%',
              lineHeight: 1.25,
              letterSpacing: '0.04em'
            }}
          >
            {cue.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
