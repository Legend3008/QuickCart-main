'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useCartStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, transformProduct } from '@/lib/utils';
import type { Product } from '@/types';

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  const productIds = Object.keys(items);

  // Fetch product details for items in cart
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['cart-products', productIds],
    queryFn: async () => {
      if (productIds.length === 0) return [];
      
      const response = await fetch('/api/product/list');
      const result = await response.json();
      
      if (!result.success || !result.products) return [];
      
      // Filter products that are in the cart and transform them
      const cartProducts = result.products
        .filter((p: any) => productIds.includes(p._id))
        .map(transformProduct);
      
      return cartProducts;
    },
    enabled: productIds.length > 0,
  });

  const subtotal = products.reduce((sum, product) => {
    const quantity = items[product._id] || 0;
    return sum + product.sellingPrice * quantity;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <Dialog open={isCartOpen} onOpenChange={closeCart}>
      <DialogContent className="max-w-md h-full max-h-screen p-0 flex flex-col sm:max-h-[90vh]">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Shopping Cart</span>
              {productIds.length > 0 && (
                <Badge variant="secondary">{productIds.length}</Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Add items to get started
              </p>
              <Button onClick={closeCart} asChild>
                <Link href="/all-products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {products.map((product) => {
                  const quantity = items[product._id] || 0;
                  return (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 pb-4 border-b last:border-b-0"
                    >
                      <Link
                        href={`/product/${product._id}`}
                        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted"
                        onClick={closeCart}
                      >
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={`/product/${product._id}`}
                            className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                            onClick={closeCart}
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm font-semibold mt-1">
                            {formatCurrency(product.sellingPrice)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(product._id, quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(product._id, quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => removeItem(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="border-t px-6 py-4 space-y-4 bg-muted/20">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600 dark:text-green-400">Free</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
              {subtotal > 0 && subtotal < 50 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatCurrency(50 - subtotal)} more for free shipping
                </p>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full" size="lg" asChild>
                <Link href="/cart" onClick={closeCart}>
                  View Cart
                </Link>
              </Button>
              <Button className="w-full" size="lg" variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
