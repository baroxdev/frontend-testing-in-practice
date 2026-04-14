# /onboard — Beginner Onboarding

Welcome a new visitor to this repo, understand their background and goals, then generate a personalized testing roadmap with app ideas.

## Steps

### Step 1 — Welcome

Greet the user warmly. Briefly explain what this repo is:
> "This is a hands-on frontend testing practice repo. Each app is scaffolded for you — your job is to write the tests. We'll tailor the roadmap to your specific goals."

Then say you'll ask a few quick questions to build their roadmap.

---

### Step 2 — Ask Background Questions

Use `AskUserQuestion` with these questions (ask all at once in a single call):

**Q1 — Frontend experience**
```
How would you describe your frontend development experience?
- Just starting out (< 6 months)
- Some experience (6 months – 2 years)  
- Comfortable (2–4 years)
- Senior / been doing this for years
```

**Q2 — Testing experience**
```
How much testing have you written before?
- None — complete beginner
- A few tests here and there, nothing systematic
- I write tests regularly but want to go deeper
- Experienced tester, here to explore specific levels
```

**Q3 — Primary goal**
```
What's your main reason for being here? (pick the closest)
- I want to learn testing fundamentals from scratch
- I'm preparing for a job / to impress in interviews
- I want to add testing to my current projects
- I want to level up from unit tests to integration / E2E
```

**Q4 — Time availability**
```
How much time can you put in per week?
- 1–2 hours (slow and steady)
- 3–5 hours (moderate pace)
- 5+ hours (I want to move fast)
```

---

### Step 3 — Analyze and Adapt

Based on their answers, determine:

**Experience tier:**
- **Tier A** (no testing experience): Start from Level 1, spend more time there, add extra explanation
- **Tier B** (some experience): Start from Level 1 but move faster, skip basics in explanations  
- **Tier C** (experienced, specific goal): Ask one follow-up to identify the exact gap, potentially skip to Level 2–3

**Relevant context:**
- Job-seeker? → Prioritize React (most in-demand), emphasize Testing Library patterns, mention that interviewers check for isolation and assertions
- Adding to existing projects? → Lean on integration and the "what NOT to test" guidance early
- Learning fundamentals? → Take Level 1 seriously even if it feels simple — explain WHY each anti-pattern matters

---

### Step 4 — Generate Personalized Roadmap

Each testing level has three tiers of complexity: **simple → medium → complex**. The roadmap must include all three tiers for each level the user will practice. This mirrors how real projects work — you don't just write `sum()` tests, you eventually test a full pricing engine with business rules.

Write a roadmap in this format:

```markdown
## Your Roadmap

### Level N — <Level Name>

| Tier | App idea | Domain | What makes it challenging |
|------|----------|--------|--------------------------|
| Simple | <specific app> | <domain> | <one line> |
| Medium | <specific app> | <domain> | <one line> |
| Complex | <specific app> | <domain> | <one line> |

**First app to build:** the Simple tier above.
**Unlock Medium when:** Simple is reviewed and marked complete.
**Unlock Complex when:** Medium is reviewed and marked complete.
**Unlock next level when:** Simple + Medium are both complete.
```

Repeat the table for each level in the roadmap (usually 2–3 levels for the initial plan).

---

**App ideas must be:**
- Realistic, not toy examples — no `sum()`, no TodoMVC, no Counter
- Relevant to what a frontend dev actually builds (auth, search, forms, dashboards, ecommerce, media)
- Scaled correctly to their tier:
  - **Simple**: one concept, one responsibility, clear input/output
  - **Medium**: a few rules, a few cases, starting to feel like real work
  - **Complex**: business rules that interact, edge cases that aren't obvious, something you'd actually encounter in a codebase

**Example ideas by level and tier:**

*Level 1 — Unit:*
- Simple: `formatCurrency(amount, locale)` — formatting with locale and edge cases (zero, negative, large numbers)
- Medium: discount calculator — fixed amount, percentage, buy-X-get-Y, stacking rules, min order threshold
- Complex: cart pricing engine — multiple items, multiple discount types, tax rules, coupon codes, rounding

*Level 2 — Component:*
- Simple: `<Tag>` component — renders label, removable, disabled state, color variants
- Medium: `<SearchInput>` — debounced input, clear button, loading state, no-results state
- Complex: `<DataTable>` — sortable columns, row selection, pagination, empty/loading/error states, keyboard nav

*Level 3 — Integration:*
- Simple: `<UserAvatar>` — fetches user by ID, shows skeleton, shows fallback on 404
- Medium: `<ProductSearch>` — search input + filters + results list, loading/error/empty states
- Complex: `<CheckoutFlow>` — cart → address → payment → confirmation, API calls at each step, error recovery

*Level 4 — E2E:*
- Simple: visit login page → fill credentials → assert redirect to dashboard
- Medium: sign up → email verify → fill profile → assert onboarding complete
- Complex: full checkout — browse → add to cart → checkout → payment → order confirmation → order history

---

### Step 5 — Save the Roadmap

**Always** write the roadmap to the memory CSV at:
`~/.claude/projects/-Users-admin-Learning-front-end-testing-practical-testing/memory/roadmap.csv`

**CSV format** (header row always present):
```
number,name,level,level_name,complexity,scenario,domain,status,date_added
```

- `number`: zero-padded sequence — `01`, `02`, etc. Continue from the last row if the file already exists
- `name`: kebab-case short name (e.g. `cart-pricing`)
- `level`: integer 1–7
- `level_name`: `Unit` / `Component` / `Integration` / `E2E` / `Visual` / `a11y` / `Performance`
- `complexity`: `simple` / `medium` / `complex`
- `scenario`: one sentence — what the app does and what makes it worth testing
- `domain`: the subject area (e.g. `ecommerce`, `auth`, `search`, `forms`, `media`, `dashboard`)
- `status`: always `planned` when added from onboarding
- `date_added`: ISO date (YYYY-MM-DD)

Rows must be ordered by `level` ascending, then `complexity` ascending (simple before medium before complex within each level). This ordering is what makes "what's next?" trivial to answer — it's always the first `planned` row.

If the file already exists, **read it first** — append new rows only, preserve existing ones. Never overwrite or reset existing statuses.

After writing the CSV, ask if they also want a human-readable `ROADMAP.md` in the repo root. If yes, generate it from the CSV data.

---

### Step 6 — Bridge to First Session

End with a clear, concrete next action:

> "Based on your roadmap, your first app is: **<App Name>** — a Level 1 (Unit) project in plain TypeScript. Want to start now, or come back next session?"

- If they want to start now → proceed to scaffold App 01 following the scaffold protocol in `.claude/rules/testing-practice.md`
- If not → remind them that `PROGRESS.md` tracks where they left off, and they can always ask "what's next?" at the start of any session

---

## Tone Guidelines

- Encouraging but not patronizing
- Match vocabulary to their experience tier (Tier A: plain language; Tier C: use the right jargon)
- Be direct about what testing is actually hard (isolation, knowing what NOT to test) — don't oversell it as easy
- If they seem anxious about testing, normalize it: "Most developers don't test confidently — that's exactly why this exists"
