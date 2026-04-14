# Practical Testing

> Frontend testing in practice — a progressive series of sample apps for hands-on testing at every level.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## What is this?

A monorepo where each app is a realistic frontend project designed to be tested. The apps are ordered from simple to complex, covering every testing layer: pure logic, UI components, API integration, and full browser flows.

The twist: **the apps come without tests**. Writing them is the whole point.

## How it works

| Who             | Does what                                                              |
| --------------- | ---------------------------------------------------------------------- |
| Claude          | Scaffolds each sample app + writes a per-app README with testing hints |
| Me              | Writes all tests from scratch                                          |
| Claude (review) | Reviews test coverage, isolation, assertion quality, and naming        |

## Testing Levels

| #   | Level       | Scope                                     | Tools                    |
| --- | ----------- | ----------------------------------------- | ------------------------ |
| 1   | Unit        | Pure functions, utilities, custom hooks   | Vitest or Jest           |
| 2   | Component   | Rendering, user events, accessibility     | Testing Library + Vitest |
| 3   | Integration | Network, API contracts, wired-up features | MSW + Vitest             |
| 4   | E2E         | Full browser user flows                   | Playwright               |

## Apps

| App             | Level | Description |
| --------------- | ----- | ----------- |
| _(coming soon)_ |       |             |

Apps progress from framework-agnostic TypeScript → React components → API-integrated features → E2E flows. Each app's `README.md` explains what it does and what to test.

## Running Tests

```sh
# Test a specific app
npx nx test <app-name>

# Test all apps
npx nx run-many -t test
```

## For Visitors

If you're here from a job application or just learning frontend testing yourself:

- Browse the `apps/` folder — each app is self-contained with its own README
- The test files show the progression from basic assertions to full E2E scenarios
- Feel free to fork and use any app as a practice target

### Want to practice yourself?

Fork this repo, open it in [Claude Code](https://claude.ai/code), and run:

```
/onboard
```

Claude will ask about your background and goals, then generate a personalized roadmap with app ideas matched to your level — from writing your first unit test to building full E2E suites.

Built with [Nx](https://nx.dev) · TypeScript · Vitest · Testing Library · Playwright
