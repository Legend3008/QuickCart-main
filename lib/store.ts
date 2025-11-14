'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIStore, CartStore, WishlistStore } from '@/types';

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: {},
      addItem: (productId: string, quantity: number = 1) =>
        set((state) => ({
          items: {
            ...state.items,
            [productId]: (state.items[productId] || 0) + quantity,
          },
        })),
      removeItem: (productId: string) =>
        set((state) => {
          const newItems = { ...state.items };
          delete newItems[productId];
          return { items: newItems };
        }),
      updateQuantity: (productId: string, quantity: number) =>
        set((state) => {
          if (quantity === 0) {
            const newItems = { ...state.items };
            delete newItems[productId];
            return { items: newItems };
          }
          return {
            items: { ...state.items, [productId]: quantity },
          };
        }),
      clearCart: () => set({ items: {} }),
      getItemCount: () => {
        const items = get().items;
        return Object.values(items).reduce((acc, qty) => acc + qty, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId: string) =>
        set((state) => ({
          items: state.items.includes(productId) ? state.items : [...state.items, productId],
        })),
      removeItem: (productId: string) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),
      isInWishlist: (productId: string) => get().items.includes(productId),
      toggle: (productId: string) => {
        const isInList = get().isInWishlist(productId);
        if (isInList) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
