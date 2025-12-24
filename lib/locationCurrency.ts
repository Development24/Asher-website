/**
 * Location-based Currency Detection
 * Detects user's location and maps it to their local currency
 * 
 * Uses IP-based geolocation to detect country, then maps country to currency
 * Falls back to browser locale if IP detection fails
 */

/**
 * Country to Currency Mapping
 * Maps ISO country codes to their primary currency
 */
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // North America
  'US': 'USD',
  'CA': 'CAD',
  'MX': 'MXN',
  
  // Europe
  'GB': 'GBP',
  'IE': 'EUR',
  'FR': 'EUR',
  'DE': 'EUR',
  'IT': 'EUR',
  'ES': 'EUR',
  'PT': 'EUR',
  'NL': 'EUR',
  'BE': 'EUR',
  'AT': 'EUR',
  'GR': 'EUR',
  'FI': 'EUR',
  'SE': 'SEK',
  'NO': 'NOK',
  'DK': 'DKK',
  'PL': 'PLN',
  'CZ': 'CZK',
  'CH': 'CHF',
  
  // Africa
  'NG': 'NGN',
  'ZA': 'ZAR',
  'KE': 'KES',
  'GH': 'GHS',
  'EG': 'EGP',
  
  // Asia
  'JP': 'JPY',
  'CN': 'CNY',
  'IN': 'INR',
  'KR': 'KRW',
  'SG': 'SGD',
  'MY': 'MYR',
  'TH': 'THB',
  'ID': 'IDR',
  'PH': 'PHP',
  'VN': 'VND',
  'AE': 'AED',
  'SA': 'SAR',
  'IL': 'ILS',
  'TR': 'TRY',
  
  // Oceania
  'AU': 'AUD',
  'NZ': 'NZD',
  
  // South America
  'BR': 'BRL',
  'AR': 'ARS',
  'CL': 'CLP',
  'CO': 'COP',
  'PE': 'PEN',
  
  // Add more as needed
};

/**
 * Browser locale to currency mapping (fallback)
 */
const LOCALE_TO_CURRENCY: Record<string, string> = {
  'en-US': 'USD',
  'en-GB': 'GBP',
  'en-CA': 'CAD',
  'en-AU': 'AUD',
  'en-NG': 'NGN',
  'en-ZA': 'ZAR',
  'en-IN': 'INR',
  'fr-FR': 'EUR',
  'fr-CA': 'CAD',
  'de-DE': 'EUR',
  'es-ES': 'EUR',
  'es-MX': 'MXN',
  'it-IT': 'EUR',
  'pt-BR': 'BRL',
  'ja-JP': 'JPY',
  'zh-CN': 'CNY',
  'ko-KR': 'KRW',
  'ar-SA': 'SAR',
  'ar-AE': 'AED',
};

/**
 * Get user's currency based on location
 * Tries IP-based geolocation first, falls back to browser locale
 * 
 * @returns Promise that resolves to currency code (e.g., 'USD', 'GBP', 'NGN')
 */
export async function getUserCurrency(): Promise<string> {
  // Try IP-based geolocation first (more accurate)
  try {
    const countryCode = await detectCountryFromIP();
    if (countryCode && COUNTRY_TO_CURRENCY[countryCode]) {
      return COUNTRY_TO_CURRENCY[countryCode];
    }
  } catch (error) {
    console.warn('IP-based geolocation failed, falling back to browser locale:', error);
  }

  // Fallback to browser locale
  if (typeof navigator !== 'undefined' && navigator.language) {
    const locale = navigator.language;
    
    // Try exact match first
    if (LOCALE_TO_CURRENCY[locale]) {
      return LOCALE_TO_CURRENCY[locale];
    }
    
    // Try language code match (e.g., 'en' from 'en-US')
    const languageCode = locale.split('-')[0];
    for (const [key, currency] of Object.entries(LOCALE_TO_CURRENCY)) {
      if (key.startsWith(languageCode)) {
        return currency;
      }
    }
  }

  // Final fallback to USD
  return 'USD';
}

/**
 * Detect country code from user's IP address
 * Uses free IP geolocation APIs
 * 
 * @returns Promise that resolves to ISO country code (e.g., 'US', 'GB', 'NG')
 */
async function detectCountryFromIP(): Promise<string | null> {
  // Option 1: ipapi.co (free, 1000 requests/day)
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.country_code) {
        return data.country_code;
      }
    }
  } catch (error) {
    console.warn('ipapi.co geolocation failed:', error);
  }

  // Option 2: ip-api.com (free, 45 requests/minute)
  try {
    const response = await fetch('http://ip-api.com/json/?fields=countryCode', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.countryCode) {
        return data.countryCode;
      }
    }
  } catch (error) {
    console.warn('ip-api.com geolocation failed:', error);
  }

  // Option 3: ipgeolocation.io (requires API key, but has free tier)
  // You can add this if needed

  return null;
}

/**
 * Get currency for a specific country code
 * 
 * @param countryCode - ISO country code (e.g., 'US', 'GB', 'NG')
 * @returns Currency code or 'USD' as fallback
 */
export function getCurrencyForCountry(countryCode: string): string {
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] || 'USD';
}

/**
 * Cache user's detected currency in localStorage
 * This avoids repeated API calls
 */
const CURRENCY_CACHE_KEY = 'user_currency';
const CURRENCY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function getCachedUserCurrency(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CURRENCY_CACHE_KEY);
    if (cached) {
      const { currency, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid (24 hours)
      if (now - timestamp < CURRENCY_CACHE_DURATION) {
        return currency;
      }
    }
  } catch (error) {
    console.warn('Failed to read currency cache:', error);
  }
  
  return null;
}

export function setCachedUserCurrency(currency: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cache = {
      currency,
      timestamp: Date.now(),
    };
    localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to cache currency:', error);
  }
}

/**
 * Get user currency with caching
 * Checks cache first, then detects if needed
 */
export async function getUserCurrencyCached(): Promise<string> {
  // Check cache first
  const cached = getCachedUserCurrency();
  if (cached) {
    return cached;
  }

  // Detect and cache
  const currency = await getUserCurrency();
  setCachedUserCurrency(currency);
  
  return currency;
}
