# Practical Testing

> Frontend testing in practice — a progressive collection of sample projects for hands-on testing at every level.

## What is this?

This monorepo contains a series of frontend sample projects, ordered from simple to complex. Each project is designed to practice a specific layer of testing: unit tests for pure logic, component tests for UI, integration tests for wired-up features, and E2E tests for full user flows.

The goal is not just to write tests that pass — but to build the muscle memory of **how** to test frontend code well: what to test, what not to test, and how to structure tests so they stay maintainable.

## Structure

```
packages/
  01-pure-functions/       # Unit testing: pure logic, no dependencies
  02-...                   # More projects added progressively
```

Each package is self-contained with its own dependencies, test setup, and README explaining what testing concepts it covers.

## Testing Levels Covered

| Level | What it tests | Tools |
|-------|--------------|-------|
| Unit | Pure functions, utilities, hooks | Vitest / Jest |
| Component | UI rendering, user interaction | Testing Library |
| Integration | Features with real dependencies wired up | Vitest / Jest + MSW |
| E2E | Full user flows in a real browser | Playwright / Cypress |

## Running Tests

```sh
# Test a specific package
npx nx test <package-name>

# Test all packages
npx nx run-many -t test
```

## Workspace

Built with [Nx](https://nx.dev) — TypeScript monorepo, SWC compiler, `nodenext` module resolution.

```sh
# Visualize the project graph
npx nx graph

# Generate a new sample project
npx nx g @nx/js:lib packages/<name> --publishable --importPath=@practical-testing/<name>
```

## Why public?

Learning in public keeps me accountable, and a well-tested codebase is one of the clearest signals of engineering craft. If you're learning frontend testing yourself, feel free to use any project here as a reference or starting point.
