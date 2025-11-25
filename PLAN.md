# Clawdance 開発計画

## 概要

Claude Codeの「*Clauding...」スピナーメッセージをオレンジ色のClaw'D君ダンスアニメーションに置き換える拡張機能。

## 技術調査結果

### Claude Codeのカスタマイズ方法

1. **Status Line System** - ステータスラインをシェルスクリプトでカスタマイズ可能
2. **tweakcc** - 既存ツール。`cli-spinners`ライブラリから70+のスピナーアニメーションを選択可能
3. **Plugins System** - プラグインとして配布可能（ベータ版）

### 参考プロジェクト

- [tweakcc](https://github.com/Piebald-AI/tweakcc) - スピナーアニメーションのカスタマイズ
- [ccstatusline](https://github.com/sirmalloc/ccstatusline) - ステータスライン全体のカスタマイズ

## 実装方針

### 方針A: tweakcc風のスピナー置換（推奨）

tweakccと同様のアプローチで、Claude Codeのスピナー表示部分をパッチし、カスタムアニメーションを注入する。

**メリット:**
- スピナー自体を直接置き換えられる
- アニメーションフレームを自由に定義できる

**デメリット:**
- Claude Codeのアップデートで動作しなくなる可能性

### 方針B: Status Line拡張

Status Lineにアニメーションを追加表示する。

**メリット:**
- 公式にサポートされた方法
- アップデートに強い

**デメリット:**
- 元のスピナーは残る（置換ではなく追加）

### 採用方針: A（tweakcc風）

ユーザー体験として「置き換え」が求められているため。

## Claw'dアニメーション設計

### キャラクター: Claw'd

Claude Codeの公式マスコット。8-bitスタイルのオレンジ色のカニキャラクター。

参考: [Clawd紹介記事](https://www.starkinsider.com/2025/10/clawd-ai-retro-mascot-command-line.html)

### ベースASCIIアート（README.mdより）

```
 ▐▛███▜▌
▝▜█████▛▘
  ▘▘ ▝▝
```

### ダンスアニメーションフレーム（足の動き + 傾き + 音符）

```
Frame 1 (左傾き):    Frame 2 (右傾き):    Frame 3 (左傾き):    Frame 4 (右傾き):
♪                            ♫          ♬                            ♪
  ▐▛███▜▌            ▐▛███▜▌              ▐▛███▜▌            ▐▛███▜▌
 ▝▜█████▛▘            ▝▜█████▛▘          ▝▜█████▛▘            ▝▜█████▛▘
  ▘▘ ▝▝                 ▘▝▘▝              ▘▘ ▝▝                 ▘▝▘▝
```

4フレームループ:
- Frame 1: 左傾き + 足開き + ♪
- Frame 2: 右傾き + 足閉じ + ♫
- Frame 3: 左傾き + 足開き + ♬
- Frame 4: 右傾き + 足閉じ + ♪

### カラーリング

- ANSI エスケープシーケンスでオレンジ色を実現
- `\x1b[38;5;208m` (256色オレンジ) または `\x1b[38;2;255;165;0m` (truecolorオレンジ)

## 技術スタック

- **言語**: TypeScript/Node.js（tweakccと同様）
- **配布**: npm パッケージ
- **依存**: Claude Code CLI

## ファイル構成

```
Clawdance/
├── src/
│   ├── index.ts          # メインエントリポイント
│   ├── patcher.ts        # Claude Codeパッチ処理
│   ├── animation.ts      # アニメーションフレーム定義
│   └── colors.ts         # ANSIカラー定義
├── package.json
├── tsconfig.json
├── README.md
├── CLAUDE.md
└── PLAN.md
```

## 実装タスク

### Phase 1: プロジェクトセットアップ
- [ ] package.json作成（npm init）
- [ ] TypeScript設定
- [ ] ESLint/Prettier設定

### Phase 2: コア機能実装
- [ ] Claude Codeのスピナー表示箇所を特定
- [ ] パッチ機構の実装
- [ ] Claw'Dアニメーションフレームの作成
- [ ] ANSIカラー適用

### Phase 3: CLI実装
- [ ] インストールコマンド
- [ ] アンインストールコマンド
- [ ] アニメーションプレビュー

### Phase 4: 配布準備
- [ ] READMEドキュメント
- [ ] npm publish設定
- [ ] デモGIF作成

## 次のステップ

1. tweakccのソースコードを調査し、スピナーパッチの実装方法を確認
2. Claw'Dのアニメーションフレームを詳細設計
3. プロジェクト基盤のセットアップ

## 参考リンク

- https://github.com/Piebald-AI/tweakcc
- https://docs.claude.com/en/docs/claude-code/statusline
- https://code.claude.com/docs/en/hooks-guide
