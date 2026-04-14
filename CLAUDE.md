# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Frontend testing in practice** — an Nx monorepo of sample frontend projects ordered from simple to complex, each purpose-built for hands-on testing practice across all levels: unit, integration, and E2E. The repo is public on GitHub as a portfolio piece and reference for others learning frontend testing.

Each app under `apps/` is a self-contained sample project. They progress from framework-agnostic TypeScript all the way to full frontend apps with browser-level E2E tests.

---

## Collaboration Rules

**Claude's role (per app):**
- Scaffold a realistic, purposeful sample app
- Write a `README.md` inside the app describing: what the app does, which testing level it targets, and hints on *what* to test (not *how*)
- Leave all test files absent or as empty stubs — the user writes them

**User's role:**
- Write all tests from scratch against the scaffolded app
- Target ≥ 80% coverage on unit and integration apps
- Commit tests separately from app code when possible

**Review loop:**
- User asks Claude to review → Claude reads test files and gives structured feedback on: coverage gaps, test isolation, assertion quality, and naming

---

## Testing Levels

Full reference: [`docs/testing-levels.md`](docs/testing-levels.md) — treat it as the source of truth.

| # | Level | Scope |
|---|-------|-------|
| 1 | Unit | Pure functions, utilities, custom hooks |
| 2 | Component | Rendering, user events, accessibility |
| 3 | Integration | Network, API contracts, wired-up features |
| 4 | E2E | Full browser user flows |
| 5 | Visual regression | Screenshot diffs vs baseline |
| 6 | Accessibility | ARIA, keyboard, labels, screen reader |
| 7 | Performance | Bundle size, Core Web Vitals |

Tools are **not locked** — each app chooses its own. Test runner is decided per app.

---

## App Progression

Apps are numbered and named in `apps/`. Start with low numbers when exploring unfamiliar testing concepts. Each app's own `README.md` is the source of truth for what to test.

---

## Key Commands

### Per app
```sh
npx nx test <app-name>        # Run tests
npx nx build <app-name>       # Build
npx nx typecheck <app-name>   # Type-check
```

### Workspace
```sh
npx nx run-many -t test       # Test all apps
npx nx graph                  # Visualize dependency graph
npx nx sync                   # Sync TypeScript project references
```

### Generate a new app
```sh
npx nx g @nx/js:lib apps/<name> --publishable --importPath=@practical-testing/<name>
```

---

## Architecture

- **Monorepo tool**: Nx 22.6.5 with `@nx/js/typescript` plugin (tasks auto-inferred)
- **Compiler**: SWC (`@swc-node/register` / `@swc/core`) — declaration-only emit
- **Module system**: `"module": "nodenext"` / `"moduleResolution": "nodenext"` — use `.js` extensions in imports for `.ts` source files
- **Custom condition**: `@practical-testing/source` — exposes source entry points for in-repo consumption
- **TypeScript**: `strict`, `noUnusedLocals`, `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch` all enabled
- **Build output**: `emitDeclarationOnly: true` — only `.d.ts` + `declarationMap` emitted; runtime run via SWC

Each app has its own `tsconfig.json`, `tsconfig.lib.json`, and optionally `project.json` for non-inferred targets. Nx auto-maintains `tsconfig.json` project references.
