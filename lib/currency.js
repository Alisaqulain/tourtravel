/**
 * Multi-currency support. Rates are placeholder; replace with live API (e.g. exchangerate-api) in production.
 */

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
};

// Placeholder rates (base INR). Replace with API fetch in production.
const RATES = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 };

/**
 * @param {number} amount
 * @param {string} from - e.g. 'INR'
 * @param {string} to - e.g. 'USD'
 * @returns {number}
 */
export function convert(amount, from = 'INR', to = 'INR') {
  if (from === to) return amount;
  const fromRate = RATES[from] ?? 1;
  const toRate = RATES[to] ?? 1;
  return (amount * toRate) / fromRate;
}

/**
 * @param {number} amount
 * @param {string} currency - e.g. 'INR'
 * @param {object} opts - { locale, showCode }
 */
export function formatCurrency(amount, currency = 'INR', opts = {}) {
  const c = CURRENCIES[currency] || CURRENCIES.INR;
  const value = typeof amount === 'number' ? amount : 0;
  if (opts.locale) {
    return new Intl.NumberFormat(opts.locale, {
      style: 'currency',
      currency: c.code,
    }).format(value);
  }
  return `${c.symbol}${value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
