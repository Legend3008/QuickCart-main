'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingCart, Heart, Star, Truck } from 'lucide-react';
import type { Product } from '@/types';
import { useUIStore, useCartStore, useWishlistStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, calculateDiscount } from '@/lib/utils';

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = React.useState(1);
  const { openCart } = useUIStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { isInWishlist, toggle: toggleWishlist } = useWishlistStore();

  React.useEffect(() => {
    if (open) {
      setQuantity(1);
    }
  }, [open]);

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);
  const discountPercent = calculateDiscount(product.originalPrice, product.sellingPrice);
  const hasDiscount = discountPercent > 0;

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
    onClose();
    openCart();
  };

  const incrementQuantity = () => {
    if (product.stock && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else if (!product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Quick View</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
            {hasDiscount && (
              <Badge variant="destructive" className="absolute top-4 left-4 font-bold">
                {discountPercent}% OFF
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-4">
            {/* Category & Featured */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
              {product.featured && (
                <Badge variant="warning" className="text-xs">
                  Featured
                </Badge>
              )}
            </div>

            {/* Product Name */}
            <h2 className="text-2xl font-bold leading-tight">{product.name}</h2>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating?.toFixed(1) || '0.0'} out of 5
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatCurrency(product.sellingPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <Badge variant="success" className="text-sm">
                    Save {formatCurrency(product.originalPrice - product.sellingPrice)}
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400" />
                    <span className="text-sm font-medium">
                      In Stock ({product.stock} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2 text-sm">Description</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}

            {/* Shipping Info */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Free shipping on orders over $50</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={incrementQuantity}
                  disabled={product.stock ? quantity >= product.stock : false}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant={isWishlisted ? 'default' : 'outline'}
                className="px-6"
                onClick={() => toggleWishlist(product._id)}
              >
                <Heart className={cn('h-5 w-5', isWishlisted && 'fill-current')} />
              </Button>
            </div>

            {/* View Full Details Link */}
            <Button variant="link" asChild className="w-full">
              <a href={`/product/${product._id}`}>View full product details →</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
