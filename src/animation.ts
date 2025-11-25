/**
 * Claw'd dance animation frames
 * オレンジ色のClaw'dがダンスするアニメーション
 */

// ANSIカラーコード（オレンジ）
export const ORANGE = '\x1b[38;5;208m';
export const RESET = '\x1b[0m';

// ダンスアニメーションフレーム（4フレーム）
export const DANCE_FRAMES = [
  // Frame 1: 左傾き + 足開き + ♪
  `♪
  ▐▛███▜▌
 ▝▜█████▛▘
  ▘▘ ▝▝`,

  // Frame 2: 右傾き + 足閉じ + ♫
  `        ♫
    ▐▛███▜▌
     ▝▜█████▛▘
       ▘▝▘▝`,

  // Frame 3: 左傾き + 足開き + ♬
  `♬
  ▐▛███▜▌
 ▝▜█████▛▘
  ▘▘ ▝▝`,

  // Frame 4: 右傾き + 足閉じ + ♪
  `        ♪
    ▐▛███▜▌
     ▝▜█████▛▘
       ▘▝▘▝`,
];

// シンプルな1行版スピナーシンボル（cli.jsのスピナー配列置換用）
export const SPINNER_SYMBOLS = [
  '▐▛█▜▌♪',
  '▐▛█▜▌♫',
  '▐▛█▜▌♬',
  '▐▛█▜▌♩',
];

// カラー付きスピナーシンボル
export const COLORED_SPINNER_SYMBOLS = SPINNER_SYMBOLS.map(
  (symbol) => `${ORANGE}${symbol}${RESET}`
);

/**
 * アニメーションをプレビュー表示
 */
export function previewAnimation(): void {
  let frameIndex = 0;

  console.log('\n🦀 Claw\'d Dance Preview (Ctrl+C to stop)\n');

  const interval = setInterval(() => {
    // 画面クリア
    process.stdout.write('\x1b[4A\x1b[0J');

    // フレーム表示（オレンジ色）
    console.log(`${ORANGE}${DANCE_FRAMES[frameIndex]}${RESET}`);

    frameIndex = (frameIndex + 1) % DANCE_FRAMES.length;
  }, 300);

  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('\n');
    process.exit(0);
  });
}
