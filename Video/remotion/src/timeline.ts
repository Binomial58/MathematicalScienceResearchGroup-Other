export type SlideRange = {
  id: string;
  startSec: number;
  endSec: number;
  imagePath: string;
};

export type TextCue = {
  id: string;
  startSec: number;
  endSec: number;
  text: string;
  xPercent: number;
  yPercent: number;
  fontSize: number;
  color?: string;
  background?: string;
  align?: 'left' | 'center' | 'right';
  animation?: 'fade' | 'slide-up' | 'pop';
};

export const compositionConfig = {
  fps: 30,
  width: 1280,
  height: 960,
  durationSec: 18
} as const;

export const slides: SlideRange[] = [
  {id: 'slide-1', startSec: 0, endSec: 6, imagePath: 'slides/slide-1.png'},
  {id: 'slide-2', startSec: 6, endSec: 12, imagePath: 'slides/slide-2.png'},
  {id: 'slide-3', startSec: 12, endSec: 18, imagePath: 'slides/slide-3.png'}
];

export const textCues: TextCue[] = [
  {
    id: 'intro-title',
    startSec: 0.4,
    endSec: 5.3,
    text: '数理科学研究会',
    xPercent: 50,
    yPercent: 13,
    fontSize: 64,
    color: '#f8fafc',
    background: 'rgba(17,24,39,0.45)',
    align: 'center',
    animation: 'pop'
  },
  {
    id: 'intro-sub',
    startSec: 1.1,
    endSec: 5.3,
    text: '理論と実装を往復するコミュニティ',
    xPercent: 50,
    yPercent: 22,
    fontSize: 36,
    color: '#e2e8f0',
    background: 'rgba(15,23,42,0.35)',
    align: 'center',
    animation: 'slide-up'
  },
  {
    id: 'main-topic',
    startSec: 6.3,
    endSec: 11.6,
    text: '研究テーマ紹介',
    xPercent: 18,
    yPercent: 15,
    fontSize: 54,
    color: '#ffffff',
    background: 'rgba(2,132,199,0.75)',
    align: 'left',
    animation: 'slide-up'
  },
  {
    id: 'cta',
    startSec: 12.4,
    endSec: 17.5,
    text: '見学・参加はいつでも歓迎',
    xPercent: 50,
    yPercent: 83,
    fontSize: 44,
    color: '#ffffff',
    background: 'rgba(22,101,52,0.82)',
    align: 'center',
    animation: 'fade'
  }
];
