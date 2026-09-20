/**
 * Unified Formatting Utilities for Ghure Ashi Travel Platform
 */

/**
 * Format number as Indian Rupee or International Currency
 * @param {number|string} amount
 * @param {string} currency 'INR' | 'USD'
 * @returns {string}
 */
export const formatCurrency = (amount, currency = "INR") => {
  const num = Number(amount) || 0;
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format ISO Date string into human readable format (e.g. "15 Oct 2026")
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "N/A";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateInput);
  }
};

/**
 * Generates an uppercase reference code (e.g., "BKG-772910")
 * @param {string} prefix
 * @returns {string}
 */
export const generateReference = (prefix = "BKG") => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
};
