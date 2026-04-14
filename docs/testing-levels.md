# Frontend Testing Levels

A generic reference for the levels of testing in frontend development. Tool choices vary by project — this document defines *what* each level means, not *how* to implement it with any specific framework.

---

## Level 1 — Unit

**Goal:** Verify that a single piece of logic produces the correct output for a given input, in complete isolation.

**Scope**
- In: pure functions, utility helpers, data transformers, custom hooks (logic only), reducers, validators, formatters
- Out: DOM rendering, network calls, browser APIs, framework internals

**Tools (generic)**
- Any test runner with an assertion library (Jest, Vitest, Node test runner, etc.)
- No DOM environment needed for pure logic; use a lightweight DOM if testing hooks that touch state

**Good test targets**
- Edge cases and boundary values (empty input, null, max/min)
- All branches of conditional logic
- Error conditions and thrown exceptions
- Deterministic transformations (input X always produces output Y)

**Anti-patterns**
- Testing implementation details (internal variable names, private methods)
- Over-mocking — if you mock everything, you're testing nothing
- Testing the language/framework itself (`expect(true).toBe(true)`)
- Writing one mega-test instead of isolated cases per behavior

**Example scenario**
> A `formatCurrency(amount, locale)` function — test: positive numbers, zero, negative numbers, non-numeric input, different locales.

---

## Level 2 — Component

**Goal:** Verify that a UI component renders correctly and responds to user interactions as expected, from the user's perspective.

**Scope**
- In: rendered output (HTML structure, text, attributes), user events (click, type, focus), conditional rendering, accessibility semantics, props/state changes
- Out: network calls, routing, global state management internals, CSS visual appearance

**Tools (generic)**
- A DOM testing library that queries by role/label/text (not by CSS class or implementation detail)
- A component renderer (mount/shallow)
- Optional: accessibility auditing tool for a11y assertions

**Good test targets**
- What the user sees: labels, headings, button text, error messages
- What the user can do: typing into a field updates the display, clicking a button triggers the right callback
- Conditional UI: loading states, empty states, error states
- Keyboard navigation and ARIA attributes for accessibility

**Anti-patterns**
- Querying by CSS class, `data-testid` overuse, or internal component state
- Testing that a prop was passed rather than that the UI reflects it
- Snapshot testing entire component trees (fragile, low signal)
- Mocking child components unless they are genuinely expensive to render

**Example scenario**
> A `<SearchBar>` component — test: placeholder text is visible, typing updates the input value, submitting with empty input shows a validation message, results list appears after a valid search.

---

## Level 3 — Integration

**Goal:** Verify that multiple units work correctly together, including communication with external systems (APIs, databases, storage) through controlled substitutes.

**Scope**
- In: wired-up features (component + hook + API call), request/response contracts, data flow across layers, error handling for network failures, loading and success states end-to-end within the app
- Out: real network calls to production systems, browser navigation, full app rendering

**Tools (generic)**
- A network interception/mocking layer (intercepts HTTP at the fetch/XHR level)
- The same test runner used for unit tests
- A DOM environment for rendering the wired feature

**Good test targets**
- Happy path: user action → API call → UI updates with response data
- API error handling: 4xx/5xx responses → correct error message shown
- Loading states: spinner appears during request, disappears after
- Data contracts: the app handles the expected API shape correctly
- Auth flows: protected routes redirect when unauthenticated

**Anti-patterns**
- Hitting real external APIs in tests (flaky, slow, side effects)
- Mocking at the module level instead of the network level (hides real fetch logic)
- Duplicating unit-level assertions (don't re-test the formatter, test the wired flow)
- Ignoring error and edge-case paths

**Example scenario**
> A `<UserProfile>` page — test: on mount, a request is made to `/api/user/:id`; on success, name and avatar render; on 404, a "user not found" message renders; on 500, a generic error renders.

---

## Level 4 — End-to-End (E2E)

**Goal:** Verify complete user journeys through the real application running in a real browser, as close to production as possible.

**Scope**
- In: full browser (real or headless), real navigation, real DOM interactions, real network (or intercepted at the browser level), multi-page flows, authentication
- Out: internal implementation details, unit-level logic (already covered), third-party systems outside your control

**Tools (generic)**
- A browser automation framework that controls a real browser engine (Chromium, Firefox, WebKit)
- Optional: network interception at the browser level for controlled scenarios

**Good test targets**
- Critical user paths: sign up, log in, complete a core task, sign out
- Multi-step flows: forms with multiple steps, wizards, checkout flows
- Cross-page navigation: deep links, back/forward, redirects
- Persistence: data saved in one session appears in another
- Error recovery: what happens if the user submits an invalid form, loses connection, etc.

**Anti-patterns**
- Testing every permutation (leave exhaustive cases to unit/component tests)
- Relying on E2E tests to catch logic bugs (too slow, too brittle for that)
- Using E2E tests as the only test layer
- Hardcoding sleeps/waits instead of waiting for conditions
- Flaky selectors (CSS classes, positional selectors) instead of accessible roles/labels

**Example scenario**
> New user registration flow — test: navigate to `/register`, fill in name/email/password, submit, verify redirect to `/dashboard`, verify welcome message shows the entered name, reload and verify session persists.

---

## Level 5 — Visual Regression

**Goal:** Detect unintended visual changes to UI by comparing screenshots against approved baselines.

**Scope**
- In: pixel-level or component-level screenshot comparison, responsive layout variants, theme variations (light/dark)
- Out: behavior, logic, accessibility — those belong in other levels

**Tools (generic)**
- A screenshot comparison tool that diffs images and highlights changes
- Can be run at component level (Storybook-based) or full-page level (browser automation)

**Good test targets**
- Design system components (buttons, inputs, cards) — high reuse, high regression risk
- Complex layouts that are hard to verify with DOM assertions
- Responsive breakpoints

**Anti-patterns**
- Using visual tests as a substitute for behavioral tests
- Committing baselines without reviewing the screenshot
- Running visual tests on dynamic content (dates, random data) without masking

---

## Level 6 — Accessibility (a11y)

**Goal:** Verify that the application is usable by people who rely on assistive technologies (screen readers, keyboard navigation, etc.).

**Scope**
- In: ARIA roles and attributes, keyboard operability, focus management, color contrast, form labels, landmark regions, live region announcements
- Out: visual design aesthetics, business logic

**Tools (generic)**
- Automated a11y rule engines (integrated into component or E2E tests)
- Manual keyboard-only and screen reader testing for critical flows

**Good test targets**
- Every interactive element is reachable and operable by keyboard
- Every image has meaningful alt text
- Every form input has an associated label
- Error messages are announced to screen readers
- Focus is managed correctly after dynamic content changes (modals, alerts)

**Anti-patterns**
- Treating automated a11y tools as the complete solution (~30% of issues are auto-detectable)
- Adding ARIA attributes to fix failures without understanding what they do
- Only testing with one screen reader/browser combination

---

## Level 7 — Performance

**Goal:** Verify that the application meets defined performance budgets and does not regress on key metrics.

**Scope**
- In: Core Web Vitals (LCP, CLS, INP), bundle size, time to interactive, render performance under load
- Out: server-side performance (separate concern), visual appearance

**Tools (generic)**
- Bundle analysis tools (check output size against budgets)
- Lighthouse / Web Vitals tooling run in CI
- Browser performance profiling for specific interactions

**Good test targets**
- Bundle size does not exceed defined thresholds after each build
- LCP on key landing pages stays within budget
- Animations run at 60fps (no janky scroll/transitions)
- No layout shifts on page load

**Anti-patterns**
- Running perf tests only locally (environment-sensitive results)
- Setting no budgets and treating Lighthouse score as a goal in itself
- Ignoring performance until late in the project

---

## Summary

| Level | What it proves | Feedback speed | Maintenance cost |
|-------|---------------|---------------|-----------------|
| 1 Unit | Logic is correct | Very fast | Low |
| 2 Component | UI behaves from user POV | Fast | Low–Medium |
| 3 Integration | Layers work together | Medium | Medium |
| 4 E2E | Critical flows work end-to-end | Slow | High |
| 5 Visual | No unintended UI changes | Medium | Medium |
| 6 Accessibility | Usable by assistive tech | Fast (auto) + Slow (manual) | Medium |
| 7 Performance | Meets speed/size budgets | Medium | Low |

A healthy frontend test suite is a pyramid: many unit tests, fewer component tests, fewer integration tests, a small number of E2E tests, and targeted visual/a11y/perf checks on top.
