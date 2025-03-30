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

export const formatPrice = (value: number): string => {
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

  return numberFormat.format(value);
};
