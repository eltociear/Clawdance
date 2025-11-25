/**
 * Claude Code cli.js patcher
 * スピナーシンボル配列を検出してClaw'dアニメーションに置換
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { SPINNER_SYMBOLS, ORANGE, RESET } from './animation';

// Claude Codeのスピナーシンボルパターン（デフォルト）
const SPINNER_PATTERN = /"[·✢*✳✶✻✽]"/;

/**
 * Claude Codeのcli.jsファイルパスを取得
 */
export function findClaudeCliPath(): string | null {
  try {
    // npm global installの場合
    const npmRoot = execSync('npm root -g', { encoding: 'utf-8' }).trim();
    const npmCliPath = path.join(npmRoot, '@anthropic-ai', 'claude-code', 'cli.js');
    if (fs.existsSync(npmCliPath)) {
      return npmCliPath;
    }

    // 別のパス候補
    const altPaths = [
      path.join(npmRoot, '@anthropic-ai', 'claude-code', 'dist', 'cli.js'),
      '/usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js',
      path.join(process.env.HOME || '', '.npm-global/lib/node_modules/@anthropic-ai/claude-code/cli.js'),
    ];

    for (const p of altPaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }

    // whichコマンドで探す
    try {
      const claudePath = execSync('which claude', { encoding: 'utf-8' }).trim();
      if (claudePath) {
        // シンボリックリンクを解決
        const realPath = fs.realpathSync(claudePath);
        const cliPath = path.join(path.dirname(realPath), '..', 'lib', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js');
        if (fs.existsSync(cliPath)) {
          return cliPath;
        }
      }
    } catch {
      // whichが見つからない場合は無視
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * バックアップファイルのパスを取得
 */
export function getBackupPath(cliPath: string): string {
  return cliPath + '.clawdance.backup';
}

/**
 * バックアップを作成
 */
export function createBackup(cliPath: string): boolean {
  const backupPath = getBackupPath(cliPath);
  if (!fs.existsSync(backupPath)) {
    try {
      fs.copyFileSync(cliPath, backupPath);
      console.log(`${ORANGE}✓${RESET} Backup created: ${backupPath}`);
      return true;
    } catch (err) {
      console.error(`Failed to create backup: ${err}`);
      return false;
    }
  }
  console.log(`${ORANGE}✓${RESET} Backup already exists`);
  return true;
}

/**
 * バックアップから復元
 */
export function restoreBackup(cliPath: string): boolean {
  const backupPath = getBackupPath(cliPath);
  if (fs.existsSync(backupPath)) {
    try {
      fs.copyFileSync(backupPath, cliPath);
      console.log(`${ORANGE}✓${RESET} Restored from backup`);
      return true;
    } catch (err) {
      console.error(`Failed to restore backup: ${err}`);
      return false;
    }
  }
  console.log('No backup found');
  return false;
}

/**
 * スピナーシンボル配列の位置を検出
 */
function findSpinnerArrayPositions(content: string): Array<{ start: number; end: number }> {
  const positions: Array<{ start: number; end: number }> = [];

  // スピナーシンボルを含む配列を探す
  // パターン: ["·","✢","*","✳","✶","✻","✽"] のような配列
  const arrayPattern = /\[(?:"[·✢*✳✶✻✽]",?\s*)+\]/g;

  let match;
  while ((match = arrayPattern.exec(content)) !== null) {
    positions.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return positions;
}

/**
 * cli.jsにパッチを適用
 */
export function applyPatch(cliPath: string): boolean {
  try {
    // バックアップから読み込み（クリーンな状態から開始）
    const backupPath = getBackupPath(cliPath);
    let content: string;

    if (fs.existsSync(backupPath)) {
      content = fs.readFileSync(backupPath, 'utf-8');
    } else {
      content = fs.readFileSync(cliPath, 'utf-8');
    }

    // スピナー配列の位置を検出
    const positions = findSpinnerArrayPositions(content);

    if (positions.length === 0) {
      console.log('No spinner array found. Claude Code may have been updated.');
      console.log('Trying alternative pattern...');

      // 代替パターンを試す
      return applyAlternativePatch(cliPath, content);
    }

    // 新しいスピナー配列を作成
    const newSpinnerArray = JSON.stringify(SPINNER_SYMBOLS);

    // 逆順で置換（インデックスがずれないように）
    let newContent = content;
    for (const pos of positions.reverse()) {
      newContent =
        newContent.slice(0, pos.start) +
        newSpinnerArray +
        newContent.slice(pos.end);
    }

    // ファイルに書き込み
    fs.writeFileSync(cliPath, newContent, 'utf-8');

    console.log(`${ORANGE}✓${RESET} Patched ${positions.length} spinner array(s)`);
    return true;
  } catch (err) {
    console.error(`Failed to apply patch: ${err}`);
    return false;
  }
}

/**
 * 代替パターンでパッチを適用
 */
function applyAlternativePatch(cliPath: string, content: string): boolean {
  // より汎用的なスピナーパターンを探す
  // 例: frames:["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"] などのスピナーフレーム
  const spinnerFramePatterns = [
    /frames:\s*\[(?:"[^"]+",?\s*)+\]/g,
    /spinner:\s*\{[^}]*frames:\s*\[(?:"[^"]+",?\s*)+\][^}]*\}/g,
  ];

  let newContent = content;
  let patchCount = 0;

  for (const pattern of spinnerFramePatterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const match of matches) {
        // framesの配列部分のみを置換
        const newMatch = match.replace(/\[(?:"[^"]+",?\s*)+\]/, JSON.stringify(SPINNER_SYMBOLS));
        newContent = newContent.replace(match, newMatch);
        patchCount++;
      }
    }
  }

  if (patchCount > 0) {
    fs.writeFileSync(cliPath, newContent, 'utf-8');
    console.log(`${ORANGE}✓${RESET} Patched ${patchCount} spinner(s) using alternative pattern`);
    return true;
  }

  console.log('Could not find any spinner patterns to patch.');
  return false;
}

/**
 * パッチが適用されているかチェック
 */
export function isPatchApplied(cliPath: string): boolean {
  try {
    const content = fs.readFileSync(cliPath, 'utf-8');
    return SPINNER_SYMBOLS.some(symbol => content.includes(symbol));
  } catch {
    return false;
  }
}
