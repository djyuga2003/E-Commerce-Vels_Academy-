import { CURRENCY, LOCALE } from '../config';

const wholeAmount = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const exactAmount = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY });

// ₹1,499 for whole amounts, ₹99.50 when there are paise.
export function formatPrice(amount) {
  return Number.isInteger(amount) ? wholeAmount.format(amount) : exactAmount.format(amount);
}

export function pluralize(count, word) {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}
