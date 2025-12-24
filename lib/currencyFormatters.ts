/**
 * Currency Formatters for property-rental
 * Provides unified currency formatting with automatic conversion based on user location
 * 
 * This module:
 * - Detects user's location and currency automatically
 * - Converts property prices to user's local currency
 * - Uses the same exchange rate APIs as ASHEROLD_FE
 * - Provides both synchronous (no conversion) and asynchronous (with conversion) formatters
 */

import { convertCurrency } from './currencyConverter';
import { getUserCurrencyCached, getCurrencyForCountry, getCachedUserCurrency } from './locationCurrency';

/**
 * Format currency synchronously (no conversion)
 * Use this when the amount is already in the target currency
 * 
 * @param amount - The amount to format
 * @param currency - Currency code (defaults to USD)
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | string,
  currency: string = 'USD',
  options?: {
    showSymbol?: boolean;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return options?.showSymbol !== false ? `${currency} 0.00` : '0.00';
  }

  const localeMap: Record<string, string> = {
    USD: 'en-US',
    GBP: 'en-GB',
    EUR: 'en-IE',
    NGN: 'en-NG',
    CAD: 'en-CA',
    AUD: 'en-AU',
    JPY: 'ja-JP',
    CNY: 'zh-CN',
    INR: 'en-IN',
  };

  const locale = options?.locale || localeMap[currency] || 'en-US';

  try {
    return new Intl.NumberFormat(locale, {
      style: options?.showSymbol !== false ? 'currency' : 'decimal',
      currency: currency,
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
      currencyDisplay: 'narrowSymbol',
      notation: Math.abs(numericAmount) >= 1000000 ? 'compact' : 'standard',
    }).format(numericAmount);
  } catch (error) {
    console.warn('Error formatting currency:', error);
    return options?.showSymbol !== false 
      ? `${currency} ${numericAmount.toFixed(2)}` 
      : numericAmount.toFixed(2);
  }
}

/**
 * Format currency with automatic conversion from property currency to user's detected currency
 * This is the main function to use for property prices
 * 
 * @param amount - The amount to format and convert
 * @param fromCurrency - Source currency (property's currency)
 * @param options - Formatting options
 * @returns Promise that resolves to formatted currency string
 * 
 * @example
 * const formatted = await formatPriceWithConversion(3000000, 'NGN'); // Converts NGN to user's currency
 */
export async function formatPriceWithConversion(
  amount: number | string,
  fromCurrency: string,
  options?: {
    showSymbol?: boolean;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): Promise<string> {
  if (amount === null || amount === undefined) {
    return 'Price on request';
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Only show "Price on request" for truly invalid values (NaN)
  if (isNaN(numericAmount)) {
    return 'Price on request';
  }

  // Show 0 as 0, not "Price on request"
  if (numericAmount === 0) {
    const toCurrency = await getUserCurrencyCached();
    return formatCurrency(0, toCurrency, options);
  }

  // Get user's detected currency
  const toCurrency = await getUserCurrencyCached();

  // Convert if needed
  let finalAmount = numericAmount;
  if (fromCurrency !== toCurrency) {
    try {
      finalAmount = await convertCurrency(numericAmount, fromCurrency, toCurrency);
    } catch (error) {
      console.error('Currency conversion failed:', error);
      // If conversion fails, show in original currency with a note
      return `${formatCurrency(numericAmount, fromCurrency, options)} (conversion unavailable)`;
    }
  }

  // Format the converted amount
  return formatCurrency(finalAmount, toCurrency, options);
}

/**
 * Format price - main function for property-rental
 * Automatically converts property prices to user's detected currency
 * Falls back to property currency if conversion fails
 * 
 * @param value - The amount to format
 * @param currency - Property's currency (optional, will use detected currency if not provided)
 * @returns Formatted currency string
 * 
 * @example
 * formatPrice(3000000, 'NGN') // Converts NGN to user's currency
 * formatPrice(3000000) // Uses user's detected currency directly
 */
export async function formatPrice(
  value: number | string | null | undefined,
  currency?: string
): Promise<string> {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return 'Price on request';
  }

  // Convert to number
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  // Only show "Price on request" if truly no valid price (NaN or null)
  if (isNaN(numericValue) || numericValue === null) {
    // Check if it was an empty string - only then show "Price on request"
    if (typeof value === 'string' && value.trim() === '') {
      return 'Price on request';
    }
    return 'Price on request';
  }
  
  // Show 0 as 0, not "Price on request"
  if (numericValue === 0) {
    const userCurrency = await getUserCurrencyCached();
    return formatCurrency(0, currency || userCurrency);
  }

  // If currency provided, convert from property currency to user currency
  if (currency) {
    return formatPriceWithConversion(numericValue, currency);
  }

  // Otherwise, use user's detected currency directly
  const userCurrency = await getUserCurrencyCached();
  return formatCurrency(numericValue, userCurrency);
}

/**
 * Synchronous version of formatPrice (no conversion)
 * Use this when you know the amount is already in the target currency
 * or when you need immediate formatting without async
 * 
 * @param value - The amount to format
 * @param currency - Currency code (defaults to detected currency from cache, or browser locale fallback)
 * @returns Formatted currency string
 */
export function formatPriceSync(
  value: number | string | null | undefined,
  currency?: string
): string {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return 'Price on request';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  // Only show "Price on request" if truly no valid price (NaN or null)
  if (isNaN(numericValue) || numericValue === null) {
    // Check if it was an empty string - only then show "Price on request"
    if (typeof value === 'string' && value.trim() === '') {
      return 'Price on request';
    }
    return 'Price on request';
  }
  
  // Show 0 as 0, not "Price on request"
  if (numericValue === 0) {
    const userCurrency = getCachedUserCurrency() || currency || 'USD';
    return formatCurrency(0, userCurrency);
  }

  // Use provided currency, or get from cache, or fallback to browser locale
  let finalCurrency: string = currency || '';
  
  if (!finalCurrency) {
    // Try cache first
    const cachedCurrency = getCachedUserCurrency();
    finalCurrency = cachedCurrency || '';
    
    // Fallback to browser locale if cache not available
    if (!finalCurrency && typeof navigator !== 'undefined') {
      const locale = navigator.language || 'en-US';
      const localeMap: Record<string, string> = {
        'en-US': 'USD',
        'en-GB': 'GBP',
        'en-CA': 'CAD',
        'en-AU': 'AUD',
        'en-NG': 'NGN',
        'fr-FR': 'EUR',
        'de-DE': 'EUR',
        'ja-JP': 'JPY',
        'zh-CN': 'CNY',
      };
      finalCurrency = localeMap[locale] || localeMap[locale.split('-')[0]] || 'USD';
    }
    
    // Final fallback
    if (!finalCurrency) {
      finalCurrency = 'USD';
    }
  }
  
  return formatCurrency(numericValue, finalCurrency);
}

// Re-export helper for backward compatibility
export { getCachedUserCurrency } from './locationCurrency';
