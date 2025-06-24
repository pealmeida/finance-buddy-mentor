import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number using European/Brazilian format (5.512,75)
 * - Thousands separator: period (.)
 * - Decimal separator: comma (,)
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format number for currency display without symbol
 */
export function formatCurrencyValue(value: number): string {
  return formatNumber(value, 2);
}

/**
 * Format number for display purposes (no decimal places for integers)
 */
export function formatDisplayNumber(value: number): string {
  return value % 1 === 0 ? formatNumber(value, 0) : formatNumber(value, 2);
}
