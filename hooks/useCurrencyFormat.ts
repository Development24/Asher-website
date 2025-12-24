/**
 * React hook for currency formatting with automatic conversion
 * Detects user's location and converts property prices to their local currency
 * 
 * Usage:
 * const formattedPrice = useCurrencyFormat(3000000, 'NGN');
 * // Returns: "£2,400.00" (if user is in UK) or "₦3,000,000.00" (if user is in Nigeria)
 */

import { useState, useEffect } from 'react';
import { formatPriceWithConversion, formatPriceSync, formatCurrency } from '@/lib/currencyFormatters';
import { getUserCurrencyCached } from '@/lib/locationCurrency';

/**
 * Hook to format price with automatic currency conversion
 * 
 * @param amount - The amount to format
 * @param fromCurrency - Source currency (property's currency)
 * @returns Formatted price string (shows "Loading..." while converting)
 * 
 * @example
 * const price = useCurrencyFormat(3000000, 'NGN');
 * // Returns formatted string in user's detected currency
 */
export function useCurrencyFormat(
  amount: number | string | null | undefined,
  fromCurrency?: string
): string {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let isMounted = true;

    const format = async () => {
      // Handle null/undefined
      if (amount === null || amount === undefined) {
        if (isMounted) setFormatted('Price on request');
        return;
      }

      // Convert to number
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      
      // Only show "Price on request" for truly invalid values (NaN or empty string)
      if (isNaN(numericAmount)) {
        if (typeof amount === 'string' && amount.trim() === '') {
          if (isMounted) setFormatted('Price on request');
          return;
        }
        if (isMounted) setFormatted('Price on request');
        return;
      }
      
      // Show 0 as 0, not "Price on request"
      if (numericAmount === 0) {
        const userCurrency = await getUserCurrencyCached();
        const formatted = formatCurrency(0, userCurrency);
        if (isMounted) setFormatted(formatted);
        return;
      }

      try {
        if (fromCurrency) {
          // Convert from property currency to user's currency
          const result = await formatPriceWithConversion(amount, fromCurrency);
          if (isMounted) setFormatted(result);
        } else {
          // Use user's detected currency directly (no conversion needed)
          const userCurrency = await getUserCurrencyCached();
          const result = formatPriceSync(amount, userCurrency);
          if (isMounted) setFormatted(result);
        }
      } catch (error) {
        console.error('Currency formatting error:', error);
        // Fallback to synchronous formatting
        if (isMounted) {
          const fallback = formatPriceSync(amount, fromCurrency);
          setFormatted(fallback);
        }
      }
    };

    format();

    return () => {
      isMounted = false;
    };
  }, [amount, fromCurrency]);

  return formatted;
}

/**
 * Hook to get user's detected currency
 * 
 * @returns Currency code (e.g., 'USD', 'GBP', 'NGN')
 */
export function useUserCurrency(): string {
  const [currency, setCurrency] = useState<string>('USD');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    getUserCurrencyCached().then(setCurrency).catch(() => {
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
        setCurrency(localeMap[locale] || localeMap[locale.split('-')[0]] || 'USD');
      }
    });
  }, []);

  return currency;
}
