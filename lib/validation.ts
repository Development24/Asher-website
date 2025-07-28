import { z } from "zod";

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  ukPhone: /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
  postcode: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  currency: /^\d+(\.\d{1,2})?$/,
  namePattern: /^[a-zA-Z\s'-]+$/,
} as const;

// Common validation schemas
export const CommonSchemas = {
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
    
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(ValidationPatterns.phone, "Please enter a valid phone number"),
    
  ukPhone: z.string()
    .min(1, "Phone number is required")
    .regex(ValidationPatterns.ukPhone, "Please enter a valid UK phone number"),
    
  name: z.string()
    .min(1, "This field is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(ValidationPatterns.namePattern, "Name can only contain letters, spaces, hyphens and apostrophes"),
    
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(ValidationPatterns.strongPassword, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
      
  currency: z.string()
    .min(1, "Amount is required")
    .regex(ValidationPatterns.currency, "Please enter a valid amount"),
    
  postcode: z.string()
    .min(1, "Postcode is required")
    .regex(ValidationPatterns.postcode, "Please enter a valid UK postcode"),
    
  date: z.string()
    .min(1, "Date is required")
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, "Please enter a valid date"),
    
  pastDate: z.string()
    .min(1, "Date is required")
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed < new Date();
    }, "Date must be in the past"),
    
  futureDate: z.string()
    .min(1, "Date is required")
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed > new Date();
    }, "Date must be in the future"),
} as const;

// Validation utilities
export const ValidationUtils = {
  // Validate email format
  isValidEmail: (email: string): boolean => {
    return ValidationPatterns.email.test(email);
  },
  
  // Validate phone number
  isValidPhone: (phone: string): boolean => {
    return ValidationPatterns.phone.test(phone);
  },
  
  // Validate UK phone number
  isValidUKPhone: (phone: string): boolean => {
    return ValidationPatterns.ukPhone.test(phone);
  },
  
  // Validate postcode
  isValidPostcode: (postcode: string): boolean => {
    return ValidationPatterns.postcode.test(postcode);
  },
  
  // Validate currency amount
  isValidCurrency: (amount: string): boolean => {
    return ValidationPatterns.currency.test(amount);
  },
  
  // Check if date is valid
  isValidDate: (date: string): boolean => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  },
  
  // Check if date is in the past
  isPastDate: (date: string): boolean => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed < new Date();
  },
  
  // Check if date is in the future
  isFutureDate: (date: string): boolean => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed > new Date();
  },
  
  // Calculate age from date of birth
  calculateAge: (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },
  
  // Format phone number
  formatPhoneNumber: (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format UK mobile numbers
    if (cleaned.startsWith('44') && cleaned.length === 13) {
      return `+44 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    } else if (cleaned.startsWith('07') && cleaned.length === 11) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
    
    return phone; // Return original if no formatting rules match
  },
  
  // Format currency
  formatCurrency: (amount: string | number, currency: string = '£'): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return `${currency}0.00`;
    
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency === '£' ? 'GBP' : 'USD',
    }).format(num);
  },
  
  // Sanitize input for XSS prevention
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove < and > characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },
  
  // Validate file type
  isValidFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },
  
  // Validate file size (in MB)
  isValidFileSize: (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },
} as const;

// Form validation helpers
export const FormValidation = {
  // Get validation error message for a field
  getFieldError: (errors: Record<string, any>, fieldName: string): string | undefined => {
    const error = errors[fieldName];
    if (!error) return undefined;
    
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (Array.isArray(error) && error.length > 0) return error[0];
    
    return 'Invalid value';
  },
  
  // Check if field has error
  hasFieldError: (errors: Record<string, any>, fieldName: string): boolean => {
    return !!errors[fieldName];
  },
  
  // Validate required fields
  validateRequiredFields: (data: Record<string, any>, requiredFields: string[]): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors[field] = 'This field is required';
      }
    });
    
    return errors;
  },
  
  // Combine multiple validation results
  combineValidationResults: (...results: Record<string, string>[]): Record<string, string> => {
    return results.reduce((combined, current) => {
      return { ...combined, ...current };
    }, {});
  },
} as const;

// Export types for TypeScript
export type ValidationPattern = keyof typeof ValidationPatterns;
export type CommonSchema = keyof typeof CommonSchemas;
export type ValidationError = Record<string, string>;