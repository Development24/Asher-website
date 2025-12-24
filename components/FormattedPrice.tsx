/**
 * FormattedPrice Component
 * Displays price with automatic currency conversion based on user location
 * 
 * Usage:
 * <FormattedPrice amount={3000000} currency="NGN" />
 * 
 * Note: This component is client-side
 */

"use client";

import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { useEffect, useState } from "react";

interface FormattedPriceProps {
  amount: number | string | null | undefined;
  currency?: string;
  className?: string;
}

export function FormattedPrice({ amount, currency, className }: FormattedPriceProps) {
  const formatted = useCurrencyFormat(amount, currency);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show empty during SSR to avoid hydration mismatch
  if (!isClient) {
    return <span className={className}></span>;
  }
  
  return <span className={className}>{formatted || ''}</span>;
}
