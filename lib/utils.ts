import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
  console.log("Date updated:", newDate)
}


// utils/formatPrice.ts

const currencyMap: { [key: string]: string } = {
  'en-US': 'USD',
  'en-GB': 'GBP',
  'fr-FR': 'EUR',
  'de-DE': 'EUR',
  'ja-JP': 'JPY',
  'en-NG': 'NGN', 
  'es-ES': 'EUR', 
  'it-IT': 'EUR', 
};

export const formatPrice = (value: number | string | null | undefined): string => {
  // Handle invalid or zero values
  if (!value || value === '0' || value === 0 || isNaN(Number(value))) {
    return 'Price on request';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Handle NaN or zero after conversion
  if (isNaN(numericValue) || numericValue === 0) {
    return 'Price on request';
  }

  const userLocale = navigator.language || 'en-US'; 
  
  // Get the currency for the detected locale
  const currency = currencyMap[userLocale] || 'USD';

  // Create a new formatter for the currency
  const numberFormat = new Intl.NumberFormat(userLocale, {
    style: 'currency',
    currency: currency, // Dynamic currency based on user locale
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return numberFormat.format(numericValue);
};

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

// Helper function to get property price with fallbacks
export const getPropertyPrice = (property: any): string => {
  // Try different price fields in order of preference
  const price = property?.price || property?.rentalFee || property?.marketValue || property?.rentalPrice;
  
  // If we have a valid price, format it
  if (price && price !== '0' && price !== 0) {
    return formatPrice(price);
  }
  
  // Check for nested property structure
  if (property?.property) {
    return getPropertyPrice(property.property);
  }
  
  return 'Price on request';
};

// Helper function to safely get bedroom count
export const getBedroomCount = (property: any): string => {
  const bedrooms = property?.bedrooms || property?.noBedRoom || property?.bedRooms;
  return bedrooms ? String(bedrooms) : 'N/A';
};

// Helper function to safely get bathroom count
export const getBathroomCount = (property: any): string => {
  const bathrooms = property?.bathrooms || property?.noBathRoom || property?.bathRooms;
  return bathrooms ? String(bathrooms) : 'N/A';
};

// Helper function to get property location
export const getPropertyLocation = (property: any): string => {
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