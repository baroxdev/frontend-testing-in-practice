export class InvalidAmountError extends Error {
  constructor(amount: number) {
    super(`Amount must be a finite number, received: ${amount}`);
    this.name = 'InvalidAmountError';
  }
}

export class InvalidCurrencyError extends Error {
  constructor(currency: string) {
    super(`Invalid currency code: "${currency}"`);
    this.name = 'InvalidCurrencyError';
  }
}

export interface FormatOptions {
  /** BCP 47 locale tag. Defaults to 'en-US'. */
  locale?: string;
  /** Show the currency symbol. Defaults to true. */
  showSymbol?: boolean;
  /** Display negative amounts as (amount) instead of -amount. Defaults to false. */
  useParentheses?: boolean;
  /** Override the minimum number of fraction digits. */
  minimumFractionDigits?: number;
  /** Override the maximum number of fraction digits. */
  maximumFractionDigits?: number;
  /** Return this string instead of a formatted value when amount === 0. */
  zeroDisplay?: string;
}

function validateCurrency(currency: string): void {
  try {
    new Intl.NumberFormat('en-US', { style: 'currency', currency });
  } catch {
    throw new InvalidCurrencyError(currency);
  }
}

/**
 * Formats a numeric amount as a localized currency string.
 *
 * @param amount   - The monetary value to format. Must be a finite number.
 * @param currency - ISO 4217 currency code (e.g. 'USD', 'EUR', 'JPY').
 * @param options  - Formatting overrides.
 * @returns        Formatted currency string.
 * @throws {InvalidAmountError}   When amount is NaN or Infinity.
 * @throws {InvalidCurrencyError} When the currency code is not recognized.
 */
export function formatCurrency(
  amount: number,
  currency: string,
  options: FormatOptions = {},
): string {
  if (!Number.isFinite(amount)) {
    throw new InvalidAmountError(amount);
  }

  validateCurrency(currency);

  const {
    locale = 'en-US',
    showSymbol = true,
    useParentheses = false,
    minimumFractionDigits,
    maximumFractionDigits,
    zeroDisplay,
  } = options;

  if (zeroDisplay !== undefined && amount === 0) {
    return zeroDisplay;
  }

  const numberFormatOptions: Intl.NumberFormatOptions = {
    style: showSymbol ? 'currency' : 'decimal',
    ...(showSymbol ? { currency } : {}),
    ...(minimumFractionDigits !== undefined ? { minimumFractionDigits } : {}),
    ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
  };

  const formatter = new Intl.NumberFormat(locale, numberFormatOptions);

  if (useParentheses && amount < 0) {
    return `(${formatter.format(Math.abs(amount))})`;
  }

  return formatter.format(amount);
}
