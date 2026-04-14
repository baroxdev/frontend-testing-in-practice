import { test } from "vitest";
import {
  formatCurrency,
  InvalidAmountError,
  InvalidCurrencyError,
} from "./format-currency";
// make sure the default locale is en-US, default symbol is shown and standard sign notation for negatives.

test("FR-1: positive US amount shows $ symbol and two decimal places by default", () => {
  expect(formatCurrency(10, "USD")).toBe("$10.00");
});

test("FR-2: decimal US amount shows $ symbol as prefix and two decimal places behinds the . by default", () => {
  expect(formatCurrency(1234.56, "USD")).toEqual("$1,234.56");
});

test("FR-2: EUR uses dot as thousands sepatator an comma as decimal separator", () => {
  expect(
    formatCurrency(1234.56, "EUR", {
      locale: "de-DE",
    }).endsWith("€"),
  ).toBe(true);

  expect(
    formatCurrency(1234.56, "EUR", {
      locale: "de-DE",
    }),
  ).toContain("1.234,56");
});

test("FR-2: JPY with .5 fractional amount rounds up to nearest integer", () => {
  expect(formatCurrency(1234.56, "JPY")).toEqual("¥1,235");
});
test("FR-2: JPY with .4 fractional amount rounds down to nearest integer", () => {
  expect(formatCurrency(1234.43, "JPY")).toEqual("¥1,234");
});

test("FR-2: VND with .5 fractional amount rounds up to nearest integer", () => {
  expect(formatCurrency(1234.56, "VND")).toEqual("₫1,235");
});
test("FR-2: KWD with .5 fractional amount rounds up to nearest integer", () => {
  expect(formatCurrency(1234.56, "KWD").startsWith("KWD")).toBe(true);

  expect(formatCurrency(1234.56, "KWD")).toContain("1,234.560");
});

test("FR-3: negative USD amount display in standard format", () => {
  expect(formatCurrency(-10, "USD")).toEqual("-$10.00");
});
test("FR-3: negative USD amount display in accounting format", () => {
  expect(formatCurrency(-10, "USD", { useParentheses: true })).toEqual(
    "($10.00)",
  );
});

test("FR-4: zeroDisplay is display when the amount is exactly 0", () => {
  expect(formatCurrency(0, "USD", { zeroDisplay: "Free" })).toEqual("Free");
});

test.each`
  a        | expected
  ${0.01}  | ${"$0.01"}
  ${0.006} | ${"$0.01"}
  ${0.004} | ${"$0.00"}
  ${1}     | ${"$1.00"}
  ${-0.5}  | ${"-$0.50"}
  ${-0.09} | ${"-$0.09"}
`("FR-4: zeroDisplay is ignored when the amount is $a", ({ a, expected }) => {
  expect(formatCurrency(a, "USD", { zeroDisplay: "Free" })).toEqual(expected);
});

const INVALID_AMOUNTS = [NaN, Infinity, -Infinity];
test.each(INVALID_AMOUNTS)("throws on %s amount", (amount) => {
  expect(() => formatCurrency(amount, "VND")).toThrowError(InvalidAmountError);
});

const INVALID_CURRENCIES = ["dong", "jhsf", "currency", "invalid"];
test.each(INVALID_CURRENCIES)('throws on invalid currency "%s"', (cur) => {
  expect(() => formatCurrency(99999, cur)).toThrowError(InvalidCurrencyError);
});
