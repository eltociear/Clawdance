# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Clawdance - An extension that replaces Claude Code's spinner (*Clauding...) with a Claw'd dance animation.

## Build Commands

```bash
npm install    # Install dependencies
npm run build  # Build TypeScript
npm run dev    # Build in watch mode
```

## Test Commands

```bash
node dist/index.js help      # Show help
node dist/index.js preview   # Preview animation
node dist/index.js status    # Check installation status
node dist/index.js install   # Apply patch
node dist/index.js uninstall # Remove patch
```

## Architecture

```
src/
├── index.ts      # CLI entry point
├── animation.ts  # Claw'd animation frame definitions
└── patcher.ts    # Claude Code cli.js patch handler
```

### Key Components

- **animation.ts**: 4-frame dance animation (left/right lean + foot movements + music notes)
- **patcher.ts**: Detects and replaces spinner array in Claude Code's `cli.js`
- **index.ts**: Provides install/uninstall/status/preview commands

### Patch Mechanism

1. Detect Claude Code's `cli.js` file
2. Backup the original
3. Replace spinner symbol array (`["·","✢","*",...]`) with Claw'd symbols
