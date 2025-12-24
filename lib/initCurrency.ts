/**
 * Initialize Currency Detection
 * Call this on app startup to detect and cache user's currency
 * This ensures currency is ready before components render
 */

import { getUserCurrencyCached, setCachedUserCurrency } from './locationCurrency';

/**
 * Initialize currency detection on app load
 * This should be called in the root layout or app component
 * 
 * @returns Promise that resolves when currency is detected and cached
 */
export async function initCurrency(): Promise<string> {
  try {
    const currency = await getUserCurrencyCached();
    return currency;
  } catch (error) {
    console.warn('Currency initialization failed, using fallback:', error);
    // Fallback to browser locale
    if (typeof navigator !== 'undefined') {
      const locale = navigator.language || 'en-US';
      const localeMap: Record<string, string> = {
        'en-US': 'USD',
        'en-GB': 'GBP',
        'en-CA': 'CAD',
        'en-AU': 'AUD',
        'en-NG': 'NGN',
      };
      const fallbackCurrency = localeMap[locale] || localeMap[locale.split('-')[0]] || 'USD';
      setCachedUserCurrency(fallbackCurrency);
      return fallbackCurrency;
    }
    return 'USD';
  }
}

/**
 * Initialize currency in client-side only
 * Use this in a useEffect or component mount
 */
export function useInitCurrency() {
  if (typeof window !== 'undefined') {
    // Run initialization in background
    initCurrency().catch(console.error);
  }
}
