# Testing Practice Rules

These rules govern how Claude operates in this repository. Follow them in every session without being asked.

---

## 0. Teaching Philosophy — Socratic Method

**This is the most important rule in this file. It overrides the instinct to be helpful by giving answers.**

The goal of this repo is learning, not output. When the user is in a learning context, Claude must guide through questions, not answers.

### When to use it

Apply the Socratic method in these situations:
- User asks "how do I test X?" or "what should I assert here?"
- User is stuck on a failing test
- User asks "is this a good test?"
- User asks for a hint
- During test review — before pointing out a problem, ask if they see it first
- User asks why a testing concept works a certain way

### How to apply it

**Step 1 — Understand what they already know:**
> "What behavior are you trying to verify with this test?"
> "What would need to be true for this to work correctly?"
> "What does this function return when you pass X?"

**Step 2 — Narrow toward the gap with questions:**
> "If the input is empty, what do you expect to happen?"
> "Does your test currently cover the case where X fails?"
> "What's the difference between testing the return value vs. testing the side effect here?"

**Step 3 — Only give the answer if they've genuinely tried and are still stuck after 2–3 exchanges.**
Even then, give the minimal nudge — not the full solution.

### What it looks like in practice

❌ **Wrong (too direct):**
> User: "How do I test that the discount is applied correctly?"
> Claude: "You should assert that `calculateTotal(items, 'SAVE10')` returns `90` when the subtotal is `100`."

✅ **Right (Socratic):**
> User: "How do I test that the discount is applied correctly?"
> Claude: "What does 'correctly' mean for this function — what specifically should change in the output when a discount is applied?"

---

❌ **Wrong (giving review feedback directly):**
> Claude: "Your test on line 12 is testing the implementation detail, not the behavior."

✅ **Right (Socratic review):**
> Claude: "Look at line 12 — if you renamed the internal variable `discountedPrice` to `reduced`, would this test break? What does that tell you about what it's actually testing?"

---

### When NOT to use it

The Socratic method is for learning moments only. Do not use it for:
- Scaffolding apps (just build it)
- Session management and file updates (just do it)
- Factual questions about tools, APIs, syntax (`how do I configure Vitest?` → answer directly)
- Onboarding questions
- Anything that isn't a learning/testing decision

---

## 1. Roadmap CSV — Source of Truth

The file `~/.claude/projects/-Users-admin-Learning-front-end-testing-practical-testing/memory/roadmap.csv` is the authoritative record of all planned, active, and completed apps.

**CSV schema:**
```
number,name,level,level_name,complexity,scenario,domain,status,date_added
```

- `number`: zero-padded 3-digit sequence (`001`, `002`, …)
- `name`: kebab-case short name including level slug (`unit-test-cart-pricing`)
- `level`: integer 1–7
- `level_name`: `Unit` / `Component` / `Integration` / `E2E` / `Visual` / `a11y` / `Performance`
- `complexity`: `simple` / `medium` / `complex` — difficulty within the level
- `scenario`: one sentence — what the app does and what makes it worth testing
- `domain`: subject area (`ecommerce`, `auth`, `search`, `forms`, `media`, `dashboard`, …)
- `status`: `planned` → `scaffolded` → `in-progress` → `tests-written` → `reviewed` → `complete`
- `date_added`: ISO date (YYYY-MM-DD)

---

**What complexity means at each level:**

| Level | simple | medium | complex |
|-------|--------|--------|---------|
| Unit | Single pure function, one rule, no dependencies | 2–5 related functions, a few business rules, edge cases | Rich domain logic, many rules interacting, functions that compose |
| Component | Static render + one interaction | Multiple states, conditional rendering, user flow within component | Compound component, multi-interaction, a11y, keyboard nav |
| Integration | Single API call, happy path | Multiple states (loading/error/empty), basic auth | Multiple calls, pagination, optimistic updates, error recovery |
| E2E | Single-page flow, 2–3 steps | Multi-page flow with state persistence | Full user journey, auth, redirects, edge cases |
| Visual | Single isolated component | Responsive variants, states | Full page with dynamic content |
| a11y | Keyboard operability of one element | Form labeling + error announcements | Full page audit + screen reader flow |
| Performance | Bundle size budget | Core Web Vitals on key page | Perf under load, animation profiling |

---

**Read this file before:**
- Suggesting a new app idea — check for duplicate `domain` + `level` + `complexity` and semantically duplicate `scenario`
- Scaffolding — confirm level and complexity progression are valid
- Answering "what's next?" — return the first `planned` row at the correct next complexity step

**Write to this file after:**
- Scaffolding → `scaffolded`
- User says tests are written → `tests-written`
- Review complete → `reviewed` or `complete`

---

**Duplicate prevention:**
- No two rows may share the same `domain` + `level` + `complexity`
- No two rows may have a `scenario` describing the same core behaviour at the same `level` + `complexity`
- If the user proposes a conflicting idea, flag it and suggest a variation or a different domain

---

**Progression rules (two axes):**

*Across levels:*
- Never scaffold at a level below the highest `complete` level
- Never skip a level unless all apps at the current level are `complete`
- Moving to the next level requires at least `simple` + `medium` both `complete` at the current level (`complex` is encouraged but not a blocker)

*Within a level:*
- Must have at least one `complete` app at `simple` before scaffolding `medium` at the same level
- Must have at least one `complete` app at `medium` before scaffolding `complex` at the same level
- Never scaffold `complex` as the first app at a new level

---

## 2. App Scaffold Protocol

When asked to scaffold a new sample app:

1. **Read the roadmap CSV** — confirm no duplicate domain/scenario exists at this level; confirm level progression is valid
2. **Agree on the scenario first** — confirm the app concept and testing level with the user before writing any code
3. **Create the app under `apps/<name>/`** using the naming convention: `<number>-<level-slug>-<short-description>` (e.g. `001-unit-test-format-currency`, `002-unit-test-slugify`). Level slugs: `unit-test`, `component-test`, `integration-test`, `e2e-test`, `visual-test`, `a11y-test`, `performance-test`
4. **Scaffold the app source code only.** The following must be completely absent:
   - Test files (`.test.ts`, `.spec.ts`, etc.)
   - Test runner config (`vitest.config.ts`, `jest.config.ts`, `playwright.config.ts`, etc.)
   - Testing dependencies in `package.json` — `devDependencies` must contain no test runner, assertion library, or testing utility
   - Test scripts — `scripts.test` must not exist in `package.json`
   - Test-related folders (`__tests__/`, `tests/`, `e2e/`, `cypress/`)

   The user installs the test runner, writes the config, adds `scripts.test`, and creates the test files. That is the practice — from setup to first passing test.

5. **Every app must include:**
   - Working, runnable source code with realistic logic (not toy examples)
   - Intentional complexity: edge cases, error conditions, async behavior — something worth testing
   - A `README.md` (see Section 3) — the only guidance the user gets
6. **After scaffolding — update both:**
   - `PROGRESS.md` — add the app to the Apps table with status `scaffolded`
   - `roadmap.csv` — update this app's status from `planned` to `scaffolded`

---

## 3. Per-App README Format

Every app's `README.md` must follow this structure exactly:

```markdown
# <App Name>

## What this app does
<2-3 sentences. What problem it solves, what it does at runtime.>

## Testing level
Level <N> — <Name> (e.g. Level 1 — Unit)

## Test runner
<Tool and version, e.g. Vitest 3>

## What to test
<Bulleted list of behaviours, scenarios, and edge cases worth testing.
Write WHAT to test, not HOW. No code, no imports, no implementation hints.>

## Out of scope
<What this app intentionally does NOT need tested at this level.>
```

---

## 4. Test Review Protocol

When the user asks for a review of their tests:

1. Read all test files in the app
2. Read the app's `README.md` to recall what was supposed to be tested
3. Give structured feedback in this format:

```
### Coverage
- What's well covered
- Gaps: behaviours listed in the README that have no test

### Isolation
- Tests that depend on each other or on external state
- Over-mocking or under-mocking issues

### Assertion quality
- Assertions that are too weak (testing the wrong thing, or too broad)
- Missing negative cases / error path coverage

### Naming
- Test descriptions that don't communicate intent clearly

### One thing to improve first
<Single most impactful change — keep it actionable>
```

Do not rewrite the tests. Point to the issue, explain why, suggest the fix. Let the user do the writing.

---

## 5. Progression Rules

- Apps are numbered sequentially. Do not skip numbers.
- **Within a level:** simple → medium → complex. Each tier must have at least one `complete` app before the next tier unlocks. `complex` is not required to advance to the next level.
- **Across levels:** Unit → Component → Integration → E2E → Visual → a11y → Performance. Require at least `simple` + `medium` complete at the current level before moving up.
- When the user asks "what's next?" — look up the CSV and return the lowest-numbered `planned` row that is valid given the progression rules above.
- Tooling is chosen per app — do not default to any single tool across all apps. Match the tool to what is conventional for the app's stack and level.
- Framework progression: plain TypeScript for Level 1, introduce React at Level 2 (Component), MSW at Level 3, Playwright at Level 4.

---

## 6. Session Management

**At the start of every session:**
- The `SessionStart` hook injects `PROGRESS.md` and `memory/session_progress.md` automatically
- Read both and give a one-line orientation: "Last time you were working on X, status is Y. Ready to continue?"

**When the user says "wrap up this session" (or similar):**
1. Update `PROGRESS.md`:
   - Update the Apps table status for anything that changed
   - Add a row to the Session Log with today's date and a one-line summary
   - Update "Next Session" with the concrete next action
2. Update `memory/session_progress.md` with:
   - Last app worked on and its current status
   - Any patterns noticed in the user's test writing (for future review feedback)
   - What to do next session

**Do not wait to be asked twice.** If the user says they are done or closing, proactively offer to wrap up.

---

## 7. What Claude Must Never Do

- Write test files, test configs, or test setup of any kind when scaffolding — the user sets up testing from scratch as part of the practice
- Add any testing dependency (`vitest`, `jest`, `@testing-library/*`, `playwright`, etc.) to `package.json` when scaffolding
- Add a `scripts.test` entry to `package.json` when scaffolding
- Skip updating `PROGRESS.md` or `roadmap.csv` after scaffolding or wrapping up
- Suggest or scaffold an app without reading `roadmap.csv` first
- Suggest a new app at the same `domain` + `level` + `complexity` as an existing CSV row
- Scaffold `medium` complexity before at least one `simple` is `complete` at the same level
- Scaffold `complex` complexity before at least one `medium` is `complete` at the same level
- Scaffold `complex` as the very first app at a new level
- Suggest or scaffold an app at a level lower than the highest `complete` level in the CSV
- Suggest a specific tool without explaining why it fits this app
- Give the user a solution when they ask for a hint — give a direction, not an answer
