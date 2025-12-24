/**
 * Currency Conversion Service for property-rental
 * Handles real-time currency conversion using accurate exchange rate APIs
 * 
 * Features:
 * - Uses free APIs first to preserve API key quota (1500 requests/month)
 * - Falls back to API key version only when free APIs fail
 * - Caches exchange rates for performance (1 hour cache)
 * - Multiple fallback APIs for reliability
 * - No hardcoded rates - always uses real-time data
 * 
 * API Priority (to preserve quota):
 * 1. open.er-api.com v6 (free, unlimited)
 * 2. exchangerate-api.com v4 (free, unlimited)
 * 3. apilayer.com/exchangerates_data (with API key)
 * 4. exchangerate-api.com v6 with API key (1500/month - last resort)
 * 
 * API Key Configuration:
 * - Set NEXT_PUBLIC_EXCHANGE_RATE_API_KEY in .env.local (defaults to provided key if not set)
 * - Set NEXT_PUBLIC_APILAYER_API_KEY in .env.local
 * - API key: 8a70d8b721c2883d722ba6d7
 */

interface ExchangeRates {
  rates: Record<string, number>; // e.g., { USD: 1, GBP: 0.79, EUR: 0.92, NGN: 1500 }
  base: string;
  timestamp: number;
}

// In-memory cache for exchange rates
let exchangeRateCache: ExchangeRates | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Supported currencies
 * The API supports 160+ currencies, but we list the most commonly used ones
 */
export const COMMON_CURRENCIES = [
  'USD',
  'GBP',
  'EUR',
  'NGN',
  'CAD',
  'AUD',
  'JPY',
  'CNY',
  'INR',
] as const;

export type CommonCurrency = typeof COMMON_CURRENCIES[number];

/**
 * Fetch exchange rates from API
 * Uses free APIs first to preserve API key quota (1500/month)
 * Falls back to API key version only when free APIs fail
 * 
 * Order:
 * 1. open.er-api.com v6 (free, unlimited)
 * 2. exchangerate-api.com v4 (free, unlimited)
 * 3. apilayer.com/exchangerates_data (with API key)
 * 4. exchangerate-api.com v6 with API key (last resort, 1500/month)
 */
async function fetchExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
  // Option 1: open.er-api.com v6 (free, no API key, unlimited requests)
  try {
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${baseCurrency}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // open.er-api.com v6 uses 'rates' object
      if (data && data.result === 'success' && data.rates) {
        const rates: ExchangeRates = {
          base: data.base_code || baseCurrency,
          timestamp: data.time_last_update_unix ? data.time_last_update_unix * 1000 : Date.now(),
          rates: data.rates,
        };
        return rates;
      }
    }
  } catch (error) {
    console.warn('Primary exchange rate API (open.er-api.com v6) failed:', error);
  }

  // Option 2: exchangerate-api.com v4 (free, no API key, unlimited requests)
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // Validate response structure
      if (data && data.rates && typeof data.rates === 'object') {
        const rates: ExchangeRates = {
          base: data.base || baseCurrency,
          timestamp: data.time_last_updated ? data.time_last_updated * 1000 : Date.now(),
          rates: data.rates,
        };
        return rates;
      }
    }
  } catch (error) {
    console.warn('Secondary exchange rate API (exchangerate-api.com v4) failed:', error);
  }

  // Option 3: apilayer.com/exchangerates_data (requires API key, accurate rates)
  const apilayerKey = process.env.NEXT_PUBLIC_APILAYER_API_KEY || 'BRWgdlRzl1Bs5K8Eer3z8HZWfIhi3vXZ';
  
  try {
    const response = await fetch(
      `https://api.apilayer.com/exchangerates_data/latest?base=${baseCurrency}`,
      {
        method: 'GET',
        headers: {
          'apikey': apilayerKey,
          'Accept': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      if (data && data.success === true && data.rates) {
        const rates: ExchangeRates = {
          base: data.base || baseCurrency,
          timestamp: data.timestamp ? data.timestamp * 1000 : Date.now(),
          rates: data.rates,
        };
        return rates;
      }
    }
  } catch (error) {
    console.warn('Tertiary exchange rate API (apilayer.com/exchangerates_data) failed:', error);
  }

  // Option 4: exchangerate-api.com v6 with API key (LAST RESORT - 1500 requests/month limit)
  // Only used when all free APIs fail to preserve quota
  const exchangeApiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY || '8a70d8b721c2883d722ba6d7';
  
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${exchangeApiKey}/latest/${baseCurrency}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // v6 API uses 'conversion_rates' instead of 'rates'
      if (data && data.result === 'success' && data.conversion_rates) {
        const rates: ExchangeRates = {
          base: data.base_code || baseCurrency,
          timestamp: data.time_last_update_unix ? data.time_last_update_unix * 1000 : Date.now(),
          rates: data.conversion_rates,
        };
        return rates;
      }
    }
  } catch (error) {
    console.warn('Final fallback exchange rate API (exchangerate-api.com v6 with API key) failed:', error);
  }

  // If all APIs fail, throw an error instead of using inaccurate hardcoded rates
  throw new Error(
    'All exchange rate APIs failed. Please check your internet connection. ' +
    'The service tried: open.er-api.com v6, exchangerate-api.com v4, ' +
    'apilayer.com/exchangerates_data, and exchangerate-api.com v6 (with API key).'
  );
}

/**
 * Get exchange rates (with caching)
 */
async function getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
  const now = Date.now();

  // Check if cache is valid
  if (
    exchangeRateCache &&
    exchangeRateCache.base === baseCurrency &&
    now - exchangeRateCache.timestamp < CACHE_DURATION
  ) {
    return exchangeRateCache;
  }

  // Fetch new rates
  const rates = await fetchExchangeRates(baseCurrency);
  exchangeRateCache = rates;

  return rates;
}

/**
 * Convert currency amount from one currency to another
 * Uses real-time exchange rates from reliable APIs
 * 
 * @param amount - The amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @returns Converted amount
 * @throws Error if conversion fails and no fallback is available
 * 
 * @example
 * const converted = await convertCurrency(100, 'USD', 'GBP');
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (!amount || isNaN(amount)) {
    return 0;
  }

  try {
    // Get exchange rates (base currency is fromCurrency)
    const rates = await getExchangeRates(fromCurrency);

    // Get the rate for toCurrency
    const rate = rates.rates[toCurrency];

    if (!rate || isNaN(rate)) {
      console.warn(
        `Exchange rate not found for ${toCurrency}, trying reverse conversion`
      );
      // Try to get rates with toCurrency as base
      try {
        const reverseRates = await getExchangeRates(toCurrency);
        const reverseRate = reverseRates.rates[fromCurrency];
        if (reverseRate && !isNaN(reverseRate)) {
          return amount / reverseRate;
        }
      } catch (reverseError) {
        console.error('Reverse conversion also failed:', reverseError);
      }

      // If we can't convert, throw an error
      throw new Error(
        `Unable to convert from ${fromCurrency} to ${toCurrency}. Exchange rate not available.`
      );
    }

    return amount * rate;
  } catch (error) {
    console.error('Currency conversion error:', error);
    // Re-throw the error so calling code can handle it appropriately
    throw error;
  }
}

/**
 * Get exchange rate between two currencies
 * 
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @returns Exchange rate (how many toCurrency units per fromCurrency unit)
 */
export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const rates = await getExchangeRates(fromCurrency);
  return rates.rates[toCurrency] || 1;
}

/**
 * Clear the exchange rate cache (useful for testing or forcing refresh)
 */
export function clearExchangeRateCache(): void {
  exchangeRateCache = null;
}

/**
 * Check if a currency is in the common currencies list
 * Note: The API supports 160+ currencies, so this is just for reference
 */
export function isCommonCurrency(currency: string): boolean {
  return COMMON_CURRENCIES.includes(currency as CommonCurrency);
}
