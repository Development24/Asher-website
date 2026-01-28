import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// Currency formatting - now uses location-based detection
import { formatPriceSync, formatPrice as formatPriceAsync } from './currencyFormatters';
import { getCurrencyForCountry } from './locationCurrency';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const updateDate = (part: 'year' | 'month' | 'day', value: string, field: any) => {
  const currentParts = field.value ? field.value.toString().split('-') : ['', '', '']
  const [cyear, cmonth, cday] = currentParts
  
  const newParts = {
    year: part === 'year' ? value : cyear,
    month: part === 'month' ? value : cmonth,
    day: part === 'day' ? value : cday
  }
  
  // Always update the field, even if not all parts are present
  const newDate = `${newParts.year}-${newParts.month}-${newParts.day}`
  field.onChange(newDate)
  
  // If field has a trigger function (from our wrapped onChange), it will be called
  // Otherwise, trigger validation after a short delay to allow all date parts to update
  if (field.trigger) {
    setTimeout(() => field.trigger(), 100);
  }
}

/**
 * Format price - synchronous version (uses cached currency, no conversion)
 * For backward compatibility and immediate formatting needs
 * 
 * NOTE: This does NOT convert currencies - it only formats in the detected/cached currency.
 * For currency conversion, use formatPriceWithConversion() from currencyFormatters.ts
 * 
 * @param value - The amount to format
 * @param currency - Optional currency override (uses detected currency if not provided)
 * @returns Formatted currency string
 */
export const formatPrice = (value: number | string | null | undefined, currency?: string): string => {
  // Use the synchronous formatter with cached currency
  return formatPriceSync(value, currency);
};

/**
 * Format price with automatic currency conversion (async)
 * Use this when you need to convert property prices to user's detected currency
 * 
 * @param value - The amount to format
 * @param fromCurrency - Property's currency (will convert to user's currency)
 * @returns Promise that resolves to formatted currency string
 * 
 * @example
 * const formatted = await formatPriceWithConversion(3000000, 'NGN');
 */
export const formatPriceWithConversion = formatPriceAsync;

// Helper function to safely format names
export const formatName = (firstName?: string | null, lastName?: string | null, fullName?: string | null): string => {
  if (fullName && fullName.trim()) {
    return fullName.trim();
  }
  
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  
  if (!first && !last) {
    return 'Name not available';
  }
  
  return `${first} ${last}`.trim();
};

// Helper function to extract price value from property (checks all possible fields)
const extractPriceValue = (property: any): number | null => {
  if (!property) return null;
  
  // Check all possible price fields in order of preference
  const priceFields = [
    property?.price,
    property?.rentalFee,
    property?.rentalPrice,
    property?.marketValue,
    property?.listingEntity?.price,
    property?.property?.price,
    property?.property?.rentalFee,
    property?.property?.rentalPrice,
    property?.property?.marketValue,
  ];
  
  for (const price of priceFields) {
    // Accept 0 as a valid price value
    if (price !== null && price !== undefined && price !== '') {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      if (!isNaN(numPrice)) {
        return numPrice; // Return even if 0
      }
    }
  }
  
  return null;
};

// Helper function to extract currency from property
const extractCurrency = (property: any): string => {
  return (
    property?.currency ||
    property?.property?.currency ||
    inferCurrencyFromCountry(property?.country || property?.property?.country) ||
    'USD'
  );
};

/**
 * Infer currency from a country value that might be:
 * - ISO country code (e.g. "NG", "GB", "US")
 * - Country name (e.g. "Nigeria", "United Kingdom", "United States")
 */
export const inferCurrencyFromCountry = (country?: string | null): string | undefined => {
  if (!country) return undefined;
  const raw = String(country).trim();
  if (!raw) return undefined;

  // If it's already an ISO-2 code
  if (raw.length === 2) {
    return getCurrencyForCountry(raw);
  }

  // Common country names we use in our APIs/UI
  const normalized = raw.toLowerCase();
  const nameToCode: Record<string, string> = {
    'nigeria': 'NG',
    'united kingdom': 'GB',
    'uk': 'GB',
    'great britain': 'GB',
    'england': 'GB',
    'scotland': 'GB',
    'wales': 'GB',
    'united states': 'US',
    'united states of america': 'US',
    'usa': 'US',
    'canada': 'CA',
    'australia': 'AU',
    'new zealand': 'NZ',
    'ireland': 'IE',
    'ghana': 'GH',
    'kenya': 'KE',
    'south africa': 'ZA',
  };

  const code = nameToCode[normalized];
  return code ? getCurrencyForCountry(code) : undefined;
};

/**
 * Infer the currency code for any property-like object.
 * Prefer explicit `currency`, then fallback to country-based inference.
 */
export const inferCurrencyFromProperty = (property: any): string => {
  return (
    property?.currency ||
    property?.property?.currency ||
    inferCurrencyFromCountry(property?.country || property?.property?.country) ||
    'USD'
  );
};

// Helper function to get property price with fallbacks
export const getPropertyPrice = (property: any): string => {
  if (!property) return 'Price on request';
  
  // Extract price value from all possible locations
  const priceValue = extractPriceValue(property);
  
  if (priceValue === null) {
    return 'Price on request';
  }
  
  // Get currency
  const currency = extractCurrency(property);
  
  // Format the price
  return formatPrice(priceValue, currency);
};

// Helper function to safely get bedroom count
export const getBedroomCount = (property: any): string => {
  if (!property) return 'N/A';
  const bedrooms = property?.bedrooms || property?.noBedRoom || property?.bedRooms;
  return bedrooms ? String(bedrooms) : 'N/A';
};

// Helper function to safely get bathroom count
export const getBathroomCount = (property: any): string => {
  if (!property) return 'N/A';
  const bathrooms = property?.bathrooms || property?.noBathRoom || property?.bathRooms;
  return bathrooms ? String(bathrooms) : 'N/A';
};

// Helper function to get property location
export const getPropertyLocation = (property: any): string => {
  if (!property) return 'Location not available';
  const parts = [
    property?.address,
    property?.address2,
    property?.city,
    property?.state?.name,
    property?.country
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(', ') : 'Location not specified';
};

      // Generate days, months, and years for dropdowns
      export const days = Array.from({ length: 31 }, (_, i) => i + 1);
      export const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      export const currentYear = new Date().getFullYear();
      export const years = Array.from({ length: 100 }, (_, i) => currentYear - i);