# format-currency

## What this app does
A `formatCurrency(amount, currency, options)` utility that converts a numeric amount into a localized currency string. It wraps the native `Intl.NumberFormat` API but adds business rules on top: accounting-style negative notation, zero override display, symbol toggling, and strict validation for invalid inputs.

## Testing level
Level 1 — Unit

## Test runner
Vitest 3

## What to test

- **Happy path — standard formatting**
  - A typical positive USD amount renders with symbol, thousands separator, and two decimal places
  - A EUR amount renders correctly using a European locale (e.g. `de-DE`)
  - A JPY amount renders with zero decimal places (JPY has no minor unit)

- **Zero handling**
  - Zero formats as `$0.00` by default
  - Zero with `zeroDisplay: 'Free'` returns the override string instead of `$0.00`
  - `zeroDisplay` is ignored when the amount is non-zero

- **Negative amounts**
  - A negative amount renders with a minus sign by default
  - A negative amount with `useParentheses: true` renders as `($X.XX)` not `-$X.XX`
  - `useParentheses` has no effect on positive amounts

- **Symbol control**
  - `showSymbol: false` removes the currency symbol from output
  - The numeric formatting (thousands separator, decimals) is still applied when symbol is hidden

- **Fraction digit overrides**
  - `minimumFractionDigits: 0` removes trailing zeroes on a whole number
  - `maximumFractionDigits: 0` rounds to the nearest integer

- **Large numbers**
  - A value in the millions formats with correct thousands separators

- **Invalid inputs — errors**
  - `NaN` throws `InvalidAmountError`
  - `Infinity` throws `InvalidAmountError`
  - `-Infinity` throws `InvalidAmountError`
  - An unrecognized currency code (e.g. `'XYZ'`, `'FAKE'`) throws `InvalidCurrencyError`
  - An empty string as currency throws `InvalidCurrencyError`

- **Locale variation**
  - The same amount and currency produce different string representations in `en-US` vs `fr-FR` vs `de-DE`

## Out of scope
- Crypto or non-ISO currency codes
- Real-time exchange rate conversion
- Rendering in a browser or React component — this is pure logic only
- Persistence or side effects of any kind
