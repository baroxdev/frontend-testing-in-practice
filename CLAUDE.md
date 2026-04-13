# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Frontend testing in practice** — an Nx monorepo of sample frontend projects ordered from simple to complex, each purpose-built for hands-on testing practice across all levels: unit, integration, and E2E. The repo is public on GitHub as a portfolio piece and reference for others learning frontend testing.

Each package under `packages/` is a self-contained sample project. They are added progressively — from a plain utility function all the way to a full frontend app — so that testing concepts build on each other. All packages live under `packages/` and are managed via npm workspaces. The workspace currently has no packages — they are added via Nx generators.

## Key Commands

### Nx Tasks (run per package)
```sh
npx nx build <pkg-name>       # Build a package (emits .d.ts only, no JS)
npx nx typecheck <pkg-name>   # Type-check a package
npx nx test <pkg-name>        # Run tests for a package
npx nx <target> <pkg-name>    # Run any inferred or defined target
```

### Workspace-wide
```sh
npx nx graph                  # Visualize project/task dependency graph
npx nx sync                   # Sync TypeScript project references
npx nx release                # Version and release packages
```

### Generating new packages
```sh
npx nx g @nx/js:lib packages/<name> --publishable --importPath=@practical-testing/<name>
```

## Architecture

- **Monorepo tool**: Nx 22.6.5 with the `@nx/js/typescript` plugin (tasks inferred automatically)
- **Compiler**: SWC (`@swc-node/register` / `@swc/core`) — no `tsc` emit, declaration-only output
- **Module system**: `"module": "nodenext"` / `"moduleResolution": "nodenext"` — use `.js` extensions in imports even for `.ts` source files
- **Custom condition**: `@practical-testing/source` — package exports can expose source entry points under this condition for in-repo consumption
- **TypeScript strictness**: `strict`, `noUnusedLocals`, `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch` all enabled
- **Build output**: `emitDeclarationOnly: true` — packages emit only `.d.ts` + `declarationMap` files; runtime code is run directly via SWC

Each package under `packages/` has its own `tsconfig.json`, `tsconfig.lib.json`, and optionally `project.json` for non-inferred targets. Nx automatically maintains `tsconfig.json` references across packages.
