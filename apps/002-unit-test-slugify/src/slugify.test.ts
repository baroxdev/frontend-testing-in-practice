import { expect, test } from "vitest";
import { InvalidInputError, slugify } from "./slugify";

test("throws InvalidInputError when input is not string", () => {
  expect(() => slugify(2134 as any)).toThrowError(InvalidInputError);
});

test("throws InvalidInputError when input is an empty string", () => {
  expect(() => slugify("")).toThrowError(InvalidInputError);
});

test("replaces whitespaces with replacement", () => {
  expect(slugify("foo bar baz")).toEqual("foo-bar-baz");
  expect(
    slugify("foo bar baz", {
      separator: "_",
    }),
  ).toEqual("foo_bar_baz");
});

test("lowers all letters", () => {
  expect(slugify("Foo BAR BaZ")).toEqual("foo-bar-baz");
});

test("preserves case when options.preserveCase", () => {
  expect(
    slugify("Foo BAR BaZ", {
      preserveCase: true,
    }),
  ).toEqual("Foo-BAR-BaZ");
});

test("removes not allow chars", () => {
  const NOT_ALLOW_CHARS = [
    ".",
    "*",
    "+",
    "?",
    "^",
    "$",
    "{",
    "}",
    "(",
    ")",
    "|",
    "[",
    "]",
    "\\",
  ];
  for (const char of NOT_ALLOW_CHARS) {
    expect(slugify("foo bar" + char + " baz")).toEqual("foo-bar-baz");
  }
});

test("truncates at options.maxLength", () => {
  expect(
    slugify("foo bar baz", {
      maxLength: 8,
    }),
  ).toEqual("foo-bar");
});
test("truncates to the nearest word boundary when maxLength is set", () => {
  expect(
    slugify("foo bar baz", {
      maxLength: 3,
    }),
  ).toEqual("foo");
});
