/**
 * Pricing engine: apply markup, commission, tax from Settings.
 * API: finalPrice = apiPrice + markup% + tax%
 * Manual: finalPrice = basePrice + contractMargin% + tax%
 */

/**
 * @param {number} basePrice - Raw price (API or manual base)
 * @param {Object} opts - { markupPercent, taxPercent, contractMarginPercent, source: 'api'|'manual' }
 * @returns {{ subtotal, tax, total, breakdown: Object }}
 */
export function calculateFinalPrice(basePrice, opts = {}) {
  const {
    markupPercent = 0,
    taxPercent = 0,
    contractMarginPercent = 0,
    source = 'manual',
  } = opts;
  const subtotal =
    source === 'api'
      ? basePrice * (1 + (markupPercent || 0) / 100)
      : basePrice * (1 + (contractMarginPercent || 0) / 100);
  const tax = subtotal * ((taxPercent || 0) / 100);
  const total = Math.round((subtotal + tax) * 100) / 100;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total,
    breakdown: {
      basePrice,
      markupPercent: source === 'api' ? markupPercent : 0,
      contractMarginPercent: source === 'manual' ? contractMarginPercent : 0,
      taxPercent,
    },
  };
}

/**
 * Apply settings to a price. Use after getSettings().
 * @param {number} basePrice
 * @param {Object} settings - { markupPercentage, taxPercentage }
 * @param {'api'|'manual'} source
 * @param {number} [contractMarginPercent] - For manual only
 */
export function applySettingsToPrice(basePrice, settings, source, contractMarginPercent = 0) {
  return calculateFinalPrice(basePrice, {
    markupPercent: settings?.markupPercentage ?? 0,
    taxPercent: settings?.taxPercentage ?? 0,
    contractMarginPercent,
    source,
  });
}
