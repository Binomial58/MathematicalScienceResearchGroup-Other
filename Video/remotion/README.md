# Remotionで`slide.pdf`を編集する手順

このフォルダは、`../slide.pdf`を背景にしつつ、テキストを時間指定で重ねるための最小構成です。

## 0. 前提

- Node.js 20+ と npm が必要
- `pdftoppm` が必要（PDFをPNG化）

Ubuntu例:

```bash
sudo apt-get update
sudo apt-get install -y nodejs npm poppler-utils
```

## 1. 初期セットアップ

```bash
cd /home/binomial/Github/MathematicalScienceResearchGroup-Other/Video/remotion
npm install
npm run extract:slides
npm run dev
```

`npm run dev`でRemotion Studioが立ち上がります。  
コンポジションは以下から選べます。

- `SlidePdfEdit`: 文字重ね中心のシンプル版
- `BlueprintPromo`: 青基調・グリッド演出のPV風テンプレ
- `NaturalPromo20s`: スライド画像なしの自然な20秒版

## 2. 「この文字をこのタイミングで出す」の編集場所

編集ファイル:

- `src/timeline.ts`

主な項目:

- `slides`: 各スライド画像の表示区間（秒）
- `textCues`: テキストの表示開始/終了時刻、位置、サイズ、色、アニメーション

例:

```ts
{
  id: 'example',
  startSec: 8.0,
  endSec: 11.5,
  text: 'この文章を表示',
  xPercent: 50,
  yPercent: 20,
  fontSize: 42,
  animation: 'slide-up'
}
```

## 3. Codexへの依頼テンプレ

以下をそのまま投げれば調整しやすいです。

```text
Video/remotion/src/timeline.tsを編集して。
1) 0.8秒〜4.0秒で「タイトル」を中央上(50%, 15%)、サイズ64で表示
2) 6.2秒〜10.5秒で「ポイントA」を左上(18%, 18%)、サイズ44で表示
3) 12.0秒〜17.0秒で「参加募集中」を下中央(50%, 84%)、サイズ40で表示
animationは順に pop, slide-up, fade にして。
```

## 4. レンダリング

```bash
npm run render
```

出力先:

- `../slide-edit.mp4`（= `Video/slide-edit.mp4`）

## 5. 参考動画風テンプレ（BlueprintPromo）

AtCoderPVのような「青基調＋設計図グリッド＋エンブレム風」演出は、
`BlueprintPromo`で調整できます。

編集ファイル:

- `src/blueprintTimeline.ts`

出力:

```bash
npm run render:blueprint
```

- `../slide-blueprint.mp4`（= `Video/slide-blueprint.mp4`）

## 6. 自然な20秒版（NaturalPromo20s）

スライド画像を使わず、内容のみで20秒動画を作る版です。

編集ファイル:

- `src/naturalTimeline.ts`
- `src/NaturalPromo20s.tsx`

出力:

```bash
npm run render:natural
```

- `../slide-natural.mp4`（= `Video/slide-natural.mp4`）

## 7. PDFを差し替えるとき

`../slide.pdf`を新しいPDFに置き換えたあと、再度:

```bash
npm run extract:slides
```

で画像を更新できます。
