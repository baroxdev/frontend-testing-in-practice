export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
  }
}

export interface SlugifyOptions {
  /** Maximum length of the output slug. Truncates at a word boundary. Default: unlimited. */
  maxLength?: number;
  /** Character used to replace spaces and separators. Default: `-`. */
  separator?: string;
  /** Preserve the original casing instead of lowercasing. Default: false. */
  preserveCase?: boolean;
}

/**
 * Converts an arbitrary string into a URL-safe slug.
 *
 * Rules applied in order:
 * 1. Throws `InvalidInputError` for non-string input, empty string, or whitespace-only string.
 * 2. Transliterates common accented/unicode characters to their ASCII equivalents (e.g. é → e, ñ → n, ü → u).
 * 3. Lowercases the result (unless `preserveCase` is true).
 * 4. Replaces any sequence of non-alphanumeric characters with the separator.
 * 5. Strips leading and trailing separators.
 * 6. Collapses consecutive separators into one.
 * 7. Truncates to `maxLength` characters at a word boundary (does not cut mid-word).
 *    If the entire first word exceeds `maxLength`, it is hard-truncated at `maxLength`.
 * 8. Strips trailing separator after truncation.
 */
export function slugify(input: string, options: SlugifyOptions = {}): string {
  if (typeof input !== "string") {
    throw new InvalidInputError("Input must be a string");
  }

  if (input.trim().length === 0) {
    throw new InvalidInputError("Input must not be empty or whitespace-only");
  }

  const { maxLength, separator = "-", preserveCase = false } = options;

  // Transliterate accented characters to ASCII equivalents
  const transliterated = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[øØ]/g, "o")
    .replace(/[æÆ]/g, "ae")
    .replace(/[þÞ]/g, "th")
    .replace(/[ðÐ]/g, "d")
    .replace(/[ß]/g, "ss")
    .replace(/[œŒ]/g, "oe")
    .replace(/[łŁ]/g, "l");

  const cased = preserveCase ? transliterated : transliterated.toLowerCase();

  // Escape separator for use in regex
  const escapedSep = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Replace non-alphanumeric characters with the separator
  const separated = cased
    .replace(/[^a-zA-Z0-9]+/g, separator)
    .replace(new RegExp(`^${escapedSep}+|${escapedSep}+$`, "g"), "")
    .replace(new RegExp(`${escapedSep}{2,}`, "g"), separator);

  if (!maxLength || separated.length <= maxLength) {
    return separated;
  }

  // Truncate at word boundary
  const truncated = separated.slice(0, maxLength);
  const lastSep = truncated.lastIndexOf(separator);

  if (lastSep <= 0) {
    // No word boundary found — hard truncate
    return truncated;
  }

  return truncated.slice(0, lastSep);
}
