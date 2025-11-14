import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Product } from '@/types';
import { PLACEHOLDER_IMAGE } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | number): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(typeof date === 'number' ? new Date(date) : date);
}

export function calculateDiscount(originalPrice: number, sellingPrice: number): number {
  if (originalPrice <= sellingPrice) return 0;
  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Transform raw product data from API to include computed fields
export function transformProduct(rawProduct: any): Product {
  // Get the first image or use placeholder if empty/invalid
  const imageUrl = Array.isArray(rawProduct.image) && rawProduct.image.length > 0 
    ? (rawProduct.image[0]?.trim() || PLACEHOLDER_IMAGE)
    : PLACEHOLDER_IMAGE;

  return {
    ...rawProduct,
    originalPrice: rawProduct.price,
    sellingPrice: rawProduct.offerPrice,
    imageUrl,
    stock: rawProduct.stock ?? 0,
    sellerId: rawProduct.sellerId || rawProduct.userId,
  };
}

