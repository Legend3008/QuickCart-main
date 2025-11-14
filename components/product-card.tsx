'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { useUIStore, useCartStore, useWishlistStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn, formatCurrency, calculateDiscount } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const { openCart } = useUIStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { isInWishlist, toggle: toggleWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product._id);

  const discountPercent = calculateDiscount(product.originalPrice, product.sellingPrice);
  const hasDiscount = discountPercent > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product._id);
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product._id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickView?.(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${product._id}`}>
        <Card className="group relative overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.imageUrl && product.imageUrl.trim() !== '' ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className={cn(
                  'object-cover transition-all duration-500 group-hover:scale-110',
                  imageLoaded ? 'blur-0' : 'blur-sm'
                )}
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                <div className="text-center p-4">
                  <ShoppingCart className="h-16 w-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-500">No Image</p>
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {hasDiscount && (
                <Badge variant="destructive" className="font-bold">
                  {discountPercent}% OFF
                </Badge>
              )}
              {product.featured && (
                <Badge variant="warning" className="font-bold">
                  Featured
                </Badge>
              )}
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <Button
                  size="icon"
                  variant={isWishlisted ? 'default' : 'secondary'}
                  className="h-9 w-9 rounded-full shadow-lg"
                  onClick={handleWishlist}
                >
                  <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
                </Button>
                {onQuickView && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 rounded-full shadow-lg"
                    onClick={handleQuickView}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <Button
                  className="w-full shadow-lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col flex-1 p-4 space-y-2">
            {/* Category */}
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category}
            </p>

            {/* Title */}
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.rating?.toFixed(1) || '0.0'})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-auto">
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(product.sellingPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div className="pt-2">
                {product.stock > 0 ? (
                  <Badge variant="success" className="text-xs">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    Out of Stock
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
