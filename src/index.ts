#!/usr/bin/env node

/**
 * Clawdance - Claude Code spinner replacement
 * Claw'dがダンスするスピナーに置き換えます
 */

import {
  findClaudeCliPath,
  createBackup,
  restoreBackup,
  applyPatch,
  isPatchApplied,
  getBackupPath,
} from './patcher';
import { previewAnimation, ORANGE, RESET, DANCE_FRAMES } from './animation';
import * as fs from 'fs';

const VERSION = '1.0.0';

const HELP = `
${ORANGE}🦀 Clawdance v${VERSION}${RESET}

Replace Claude Code's spinner with dancing Claw'd animation!

${ORANGE}Usage:${RESET}
  clawdance install     Install Claw'd dance animation
  clawdance uninstall   Restore original spinner
  clawdance status      Check if patch is applied
  clawdance preview     Preview the dance animation
  clawdance help        Show this help message

${ORANGE}Examples:${RESET}
  $ clawdance install   # Install the dancing Claw'd
  $ clawdance preview   # See Claw'd dance!
`;

function printBanner(): void {
  console.log(`
${ORANGE}${DANCE_FRAMES[0]}${RESET}

${ORANGE}Clawdance${RESET} v${VERSION}
`);
}

function install(): void {
  printBanner();
  console.log('Installing Claw\'d dance animation...\n');

  const cliPath = findClaudeCliPath();
  if (!cliPath) {
    console.error('❌ Could not find Claude Code installation.');
    console.error('   Make sure Claude Code is installed globally via npm:');
    console.error('   npm install -g @anthropic-ai/claude-code');
    process.exit(1);
  }

  console.log(`Found Claude Code at: ${cliPath}\n`);

  // バックアップ作成
  if (!createBackup(cliPath)) {
    console.error('❌ Failed to create backup. Aborting.');
    process.exit(1);
  }

  // パッチ適用
  if (applyPatch(cliPath)) {
    console.log(`\n${ORANGE}✓ Claw'd dance animation installed!${RESET}`);
    console.log('\nRestart Claude Code to see Claw\'d dance! 🦀');
  } else {
    console.error('\n❌ Failed to apply patch.');
    process.exit(1);
  }
}

function uninstall(): void {
  printBanner();
  console.log('Uninstalling Claw\'d dance animation...\n');

  const cliPath = findClaudeCliPath();
  if (!cliPath) {
    console.error('❌ Could not find Claude Code installation.');
    process.exit(1);
  }

  const backupPath = getBackupPath(cliPath);
  if (!fs.existsSync(backupPath)) {
    console.log('No backup found. Claw\'d dance may not be installed.');
    process.exit(0);
  }

  if (restoreBackup(cliPath)) {
    console.log(`\n${ORANGE}✓ Original spinner restored!${RESET}`);
  } else {
    console.error('\n❌ Failed to restore backup.');
    process.exit(1);
  }
}

function status(): void {
  printBanner();

  const cliPath = findClaudeCliPath();
  if (!cliPath) {
    console.log('Status: Claude Code not found');
    process.exit(1);
  }

  console.log(`Claude Code: ${cliPath}`);

  if (isPatchApplied(cliPath)) {
    console.log(`Status: ${ORANGE}Claw'd dance is active! 🦀${RESET}`);
  } else {
    console.log('Status: Original spinner (Claw\'d dance not installed)');
  }
}

function preview(): void {
  printBanner();
  previewAnimation();
}

function help(): void {
  console.log(HELP);
}

// Main
const command = process.argv[2];

switch (command) {
  case 'install':
    install();
    break;
  case 'uninstall':
    uninstall();
    break;
  case 'status':
    status();
    break;
  case 'preview':
    preview();
    break;
  case 'help':
  case '--help':
  case '-h':
    help();
    break;
  default:
    if (command) {
      console.error(`Unknown command: ${command}\n`);
    }
    help();
    process.exit(command ? 1 : 0);
}
