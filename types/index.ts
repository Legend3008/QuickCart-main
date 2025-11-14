// Core type definitions for SmartBazar

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number; // Original price
  offerPrice: number; // Discounted price
  image: string[];
  category: string;
  subCategory?: string;
  stock?: number;
  sellerId?: string;
  userId?: string;
  rating?: number;
  date?: number;
  featured?: boolean;
  // Computed/convenience getters
  originalPrice: number; // Alias for price
  sellingPrice: number; // Alias for offerPrice
  imageUrl: string; // First image from array
}

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name?: string;
  cartItems: Record<string, number>;
  wishlist?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UIStore {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
}

export interface CartStore {
  items: Record<string, number>;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export interface WishlistStore {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggle: (productId: string) => void;
}
