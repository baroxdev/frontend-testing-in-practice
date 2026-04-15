import { test } from "vitest";
import {
  formatCurrency,
  InvalidAmountError,
  InvalidCurrencyError,
} from "./format-currency";
// make sure the default locale is en-US, default symbol is shown and standard sign notation for negatives.

// FR-1: Default formatting
test("formats a whole USD amount with leading symbol and 2 decimal places", () => {
  expect(formatCurrency(10, "USD")).toBe("$10.00");
});

test("formats a large USD amount with comma thousands separator", () => {
  expect(formatCurrency(1234.56, "USD")).toEqual("$1,234.56");
});

// FR-2: Currency-specific formatting

test("places EUR symbol after the amount when locale is de-DE", () => {
  expect(
    formatCurrency(1234.56, "EUR", {
      locale: "de-DE",
    }).endsWith("€"),
  ).toBe(true);
});

test("formats EUR with dot thousands and comma decimal separator when locale is de-DE", () => {
  expect(
    formatCurrency(1234.56, "EUR", {
      locale: "de-DE",
    }),
  ).toContain("1.234,56");
});

test("places EUR symbol after the amount when locale is fr-FR", () => {
  expect(
    formatCurrency(1234.56, "EUR", {
      locale: "fr-FR",
    }).endsWith("€"),
  ).toBe(true);
});

test("formats EUR correctly for fr-FR locale", () => {
  expect(
    formatCurrency(1234.56, "EUR", {
      locale: "fr-FR",
    }),
  ).toEqual(
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(1234.56),
  );
});

test("rounds a JPY amount up to the nearest integer", () => {
  expect(formatCurrency(1234.56, "JPY")).toEqual("¥1,235");
});
test("rounds a JPY amount down to the nearest integer", () => {
  expect(formatCurrency(1234.43, "JPY")).toEqual("¥1,234");
});

test("rounds a VND amount up to the nearest integer", () => {
  expect(formatCurrency(1234.56, "VND")).toEqual("₫1,235");
});

test("rounds a VND amount down to the nearest integer", () => {
  expect(formatCurrency(1234.43, "VND")).toEqual("₫1,234");
});

test("rounds a KWD up to the nearest integer", () => {
  expect(formatCurrency(1234.56, "KWD").startsWith("KWD")).toBe(true);
});

test("formats a KWD amount with 3 decimal places", () => {
  expect(formatCurrency(1234.56, "KWD")).toContain("1,234.560");
});

// FR-3: Negative amounts

test("formats a negative USD amount with a leading minus sign", () => {
  expect(formatCurrency(-10, "USD")).toEqual("-$10.00");
});

test("wraps a negative USD amount in parentheses when useParentheses is true", () => {
  expect(formatCurrency(-10, "USD", { useParentheses: true })).toEqual(
    "($10.00)",
  );
});

// FR-4: Zero display override

test("returns the zeroDisplay string when amount is exactly zero", () => {
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
`(
  "ignores zeroDisplay and formats normally when amount is $a",
  ({ a, expected }) => {
    expect(formatCurrency(a, "USD", { zeroDisplay: "Free" })).toEqual(expected);
  },
);

test("formats a USD amount without the currency symbol when showSymbol is false", () => {
  expect(formatCurrency(1234.5, "USD", { showSymbol: false })).toEqual(
    "1,234.5",
  );
});

test("formats a USD amount with the currency symbole when showSymbol is true", () => {
  expect(formatCurrency(1234.5, "USD", { showSymbol: true })).toEqual(
    "$1,234.50",
  );
});

test("formats a EUR amount without the currency symbol when showSymbol is false", () => {
  expect(formatCurrency(1234.5, "EUR", { showSymbol: false })).toEqual(
    "1,234.5",
  );
});
test("pads a USD amount to 3 decimal places when minimumFractionDigits is 3", () => {
  expect(formatCurrency(1234.5, "USD", { minimumFractionDigits: 3 })).toEqual(
    "$1,234.500",
  );
});
test("pads a USD amount to 3 decimal places when minimumFractionDigits is 10", () => {
  expect(formatCurrency(1234.5, "USD", { minimumFractionDigits: 10 })).toEqual(
    "$1,234.5000000000",
  );
});

test("trims trailing decimals to minimumFractionDigits when amount has more precision", () => {
  expect(
    formatCurrency(1234.500000000001, "USD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    }),
  ).toEqual("$1,234.50");
});

test("throws RangeError when minimumFractionDigits exceeds maximumFractionDigits", () => {
  expect(() => {
    formatCurrency(1234.5, "USD", {
      minimumFractionDigits: 10,
      maximumFractionDigits: 4,
    });
  }).toThrowError(RangeError);
});

const INVALID_AMOUNTS = [NaN, Infinity, -Infinity];
test.each(INVALID_AMOUNTS)("throws InvalidAmountError for %s", (amount) => {
  expect(() => formatCurrency(amount, "VND")).toThrowError(InvalidAmountError);
});

const INVALID_CURRENCIES = ["dong", "jhsf", "currency", "invalid"];
test.each(INVALID_CURRENCIES)(
  'throws InvalidCurrencyError for unrecognised currency "%s"',
  (cur) => {
    expect(() => formatCurrency(99999, cur)).toThrowError(InvalidCurrencyError);
  },
);
