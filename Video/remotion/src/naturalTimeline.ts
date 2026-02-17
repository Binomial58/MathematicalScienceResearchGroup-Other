export type NaturalScene = {
  id: string;
  startSec: number;
  endSec: number;
  kicker: string;
  title: string;
  lines: string[];
  accent: string;
  layout: 'intro' | 'problem' | 'final';
};

export const naturalConfig = {
  fps: 30,
  width: 1920,
  height: 1080,
  durationSec: 20
} as const;

export const naturalScenes: NaturalScene[] = [
  {
    id: 'intro',
    startSec: 0,
    endSec: 3,
    kicker: 'SIT_mathclub',
    title: '数理科学研究会',
    lines: [],
    accent: '#8de4ff',
    layout: 'intro'
  },
  {
    id: 'problem',
    startSec: 3,
    endSec: 15,
    kicker: 'Weekly Challenge',
    title: '今週の問題',
    lines: ['色が付いている角の大きさの和を求めよ'],
    accent: '#b6f39f',
    layout: 'problem'
  },
  {
    id: 'final',
    startSec: 15,
    endSec: 20,
    kicker: '',
    title: '新入部員募集中',
    lines: [
      '毎週月曜日 5号館で活動中',
      '数学・物理・競技プログラミングに興味のある方、大歓迎',
      '新入生歓迎会 4/6・4/7（2号館）'
    ],
    accent: '#f6a8c9',
    layout: 'final'
  }
];
