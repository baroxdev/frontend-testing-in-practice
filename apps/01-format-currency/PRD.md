# PRD: formatCurrency Utility

## Problem

Across the product, monetary amounts are displayed in multiple currencies for multiple markets. Without a single formatting utility, each team formats amounts differently — inconsistent symbols, wrong decimal precision, broken negative notation in accounting views. This causes user confusion and occasional financial display errors.

## Goal

A single `formatCurrency(amount, currency, options)` function that produces a consistent, locale-aware currency string for any valid ISO 4217 currency code.

---

## Functional Requirements

### FR-1 — Standard formatting
The function must render an amount with the correct currency symbol, thousands separator, and decimal precision for the given currency and locale.

- Default locale: `en-US`
- Default: symbol is shown
- Default: standard sign notation for negatives (e.g. `-$10.00`)

### FR-2 — Currency precision
Each currency has a defined number of minor units. The function must respect it:

| Currency | Minor units | Example |
|----------|-------------|---------|
| USD | 2 | `$1,234.56` |
| EUR | 2 | `1.234,56 €` (de-DE locale — symbol follows the amount) |
| JPY | 0 | `¥1,235` |
| VND | 0 | `₫1,235` |
| KWD | 3 | `KWD 1,234.567` |

When an amount has more decimal places than the currency allows, it must be **rounded to the nearest integer unit** (standard half-up rounding).

### FR-3 — Negative amounts
Two display modes must be supported:

- **Standard** (default): `-$10.00`
- **Accounting** (`useParentheses: true`): `($10.00)`

Accounting notation is used in financial reports and invoices. The parentheses replace the minus sign entirely.

### FR-4 — Zero display override
When `zeroDisplay` is provided and the amount is exactly `0`, return the override string as-is.

- `formatCurrency(0, 'USD', { zeroDisplay: 'Free' })` → `'Free'`
- `zeroDisplay` must be ignored for any non-zero amount, including very small amounts like `0.001`

### FR-5 — Symbol toggle
When `showSymbol: false`, the currency symbol must be omitted. Thousands separators and decimal precision still apply.

- `formatCurrency(1234.5, 'USD', { showSymbol: false })` → `'1,234.50'`

### FR-6 — Fraction digit overrides
The caller may override the default decimal precision via `minimumFractionDigits` and `maximumFractionDigits`. These follow the same semantics as `Intl.NumberFormat`.

### FR-7 — Locale variation
The same amount and currency must produce locale-appropriate output when `locale` is changed:

- `en-US`: `$1,234.56` (comma thousands, dot decimal)
- `de-DE`: `1.234,56 €` (dot thousands, comma decimal, symbol after)
- `fr-FR`: `1 234,56 €` (space thousands, comma decimal)

---

## Error Requirements

### ER-1 — Invalid amount
If `amount` is `NaN`, `Infinity`, or `-Infinity`, throw `InvalidAmountError` with a descriptive message. Do not silently return a string.

### ER-2 — Invalid currency
If the currency code is not a recognized ISO 4217 code, throw `InvalidCurrencyError`. Examples of invalid codes: `'XYZ'`, `'FAKE'`, `''`, `'usd'` (lowercase).

---

## Out of Scope

- Cryptocurrency or non-ISO codes
- Exchange rate conversion
- Formatting for print or PDF
- Any UI rendering — this is a pure function
