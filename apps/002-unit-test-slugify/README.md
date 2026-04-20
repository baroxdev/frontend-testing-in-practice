# slugify

## What this app does

A `slugify(input, options)` utility that converts arbitrary text into a URL-safe slug. It handles unicode transliteration, whitespace, special characters, consecutive separators, and optional length limiting. Designed to power URL generation for titles, tags, and search queries.

## Testing level

Level 1 — Unit

## Test runner

Your choice — install and configure it yourself as part of the practice.

## What to test

- **Happy path**
  - A plain ASCII sentence produces a lowercase hyphen-separated slug
  - A single word with no special characters passes through unchanged
  - Mixed case input is lowercased by default

- **Unicode and accents**
  - Accented characters are transliterated to ASCII equivalents (e.g. `é` → `e`, `ü` → `u`, `ñ` → `n`)
  - Non-latin characters with no ASCII equivalent are stripped

- **Special characters and separators**
  - Punctuation and symbols are replaced with the separator
  - Multiple consecutive special characters collapse into a single separator
  - Leading and trailing separators are stripped from the result

- **Options: separator**
  - A custom separator (e.g. `_`) is used in place of `-`
  - Consecutive custom separators still collapse into one

- **Options: preserveCase**
  - `preserveCase: true` keeps the original casing instead of lowercasing

- **Options: maxLength**
  - Output is truncated to `maxLength` at a word boundary
  - Truncation does not leave a trailing separator
  - When the first word alone exceeds `maxLength`, it is hard-truncated

- **Edge cases**
  - A string that is entirely special characters produces a valid (non-empty? empty?) result — decide what the correct behaviour is and test it
  - Numbers in the input are preserved
  - A string with only numbers produces a valid slug

- **Error cases**
  - An empty string throws `InvalidInputError`
  - A whitespace-only string throws `InvalidInputError`

## Out of scope

- CJK, Arabic, or other non-latin scripts beyond what `normalize("NFD")` handles
- Emoji handling
- Custom transliteration maps
- Async operation — this is a pure synchronous function
