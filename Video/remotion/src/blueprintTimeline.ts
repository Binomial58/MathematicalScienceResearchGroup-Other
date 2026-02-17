export type BlueprintScene = {
  id: string;
  startSec: number;
  endSec: number;
  slide: string;
  headline: string;
  subline: string;
  panFromX: number;
  panToX: number;
  panFromY: number;
  panToY: number;
};

export const blueprintConfig = {
  fps: 30,
  width: 1280,
  height: 720,
  durationSec: 20
} as const;

export const blueprintScenes: BlueprintScene[] = [
  {
    id: 'opening',
    startSec: 0,
    endSec: 6.6,
    slide: 'slides/slide-1.png',
    headline: '解けた！を世界に届ける。',
    subline: 'Mathematical Science Research Group',
    panFromX: -30,
    panToX: 28,
    panFromY: -12,
    panToY: 16
  },
  {
    id: 'core',
    startSec: 6.6,
    endSec: 13.3,
    slide: 'slides/slide-2.png',
    headline: '研究 × 実装 × 発表',
    subline: 'アルゴリズムを実戦で磨く',
    panFromX: 24,
    panToX: -20,
    panFromY: -10,
    panToY: 10
  },
  {
    id: 'cta',
    startSec: 13.3,
    endSec: 20,
    slide: 'slides/slide-3.png',
    headline: '見学・参加はいつでも歓迎',
    subline: '次の一手を、ここから。',
    panFromX: -20,
    panToX: 30,
    panFromY: 10,
    panToY: -14
  }
];
