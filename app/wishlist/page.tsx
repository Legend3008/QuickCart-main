'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  Heart, 
  ShoppingCart, 
  X, 
  Sparkles,
  Package,
  TrendingUp,
  Search,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

// Fetch all products
async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/product/list');
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch products');
  }
  
  return data.products || [];
}

// Hero Section Component
function WishlistHero({ itemCount }: { itemCount: number }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 dark:from-rose-900 dark:via-pink-900 dark:to-purple-950">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }} 
        />
      </div>

      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/20"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: '100%',
              scale: 0.5 + Math.random() * 0.5,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: '-20%',
              rotate: 360 + Math.random() * 360
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear'
            }}
          >
            <Heart className="w-8 h-8 fill-current" />
          </motion.div>
        ))}
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center text-white space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-5 py-2.5 border border-white/30"
            >
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold tracking-wide">YOUR FAVORITES</span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] flex items-center justify-center gap-4">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 fill-current animate-pulse" />
                My Wishlist
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                All your saved favorites in one place
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex justify-center gap-8 pt-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="rounded-2xl bg-white/10 backdrop-blur-md px-8 py-5 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="text-3xl font-bold mb-1">{itemCount}</div>
                <div className="text-sm text-white/80 font-medium">
                  {itemCount === 1 ? 'Item Saved' : 'Items Saved'}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Empty State Component
function EmptyWishlist() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: 'spring', 
          duration: 0.8,
          delay: 0.2 
        }}
        className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 mb-8"
      >
        <Heart className="h-16 w-16 text-rose-400 dark:text-rose-500" />
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold mb-3 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent"
      >
        Your wishlist is empty
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8 text-lg"
      >
        Save your favorite items and revisit them anytime. <br />
        Start exploring amazing products now!
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button 
          size="lg" 
          onClick={() => router.push('/all-products')}
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/40 transition-all duration-300 text-base px-8 py-6 rounded-xl"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Start Shopping
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Loading Skeleton
function WishlistLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i} 
          className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-neutral-200 dark:bg-neutral-800" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full w-3/4" />
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full w-1/2" />
            <div className="flex gap-2">
              <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-xl flex-1" />
              <div className="h-10 w-10 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Wishlist Product Card
interface WishlistProductCardProps {
  product: Product;
  onRemove: () => void;
  index: number;
}

function WishlistProductCard({ product, onRemove, index }: WishlistProductCardProps) {
  const { addItem: addToCart } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product._id, 1);
    toast.success('Added to cart!', {
      icon: '🛒',
      duration: 2000,
      style: {
        borderRadius: '12px',
        background: '#10B981',
        color: '#fff',
        fontWeight: '600',
      },
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    setTimeout(() => {
      onRemove();
      toast.success('Removed from wishlist', {
        icon: '💔',
        duration: 2000,
        style: {
          borderRadius: '12px',
          background: '#EF4444',
          color: '#fff',
          fontWeight: '600',
        },
      });
    }, 300);
  };

  const discount = product.price > product.offerPrice 
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  const inStock = product.stock === undefined || product.stock > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isRemoving ? 0 : 1, 
        y: isRemoving ? -20 : 0,
        scale: isRemoving ? 0.9 : 1
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div 
        className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:shadow-2xl hover:shadow-rose-500/10 dark:hover:shadow-rose-500/20 transition-all duration-300 cursor-pointer"
        onClick={() => router.push(`/product/${product._id}`)}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 + index * 0.05 }}
            className="absolute top-4 left-4 z-10 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg"
          >
            {discount}% OFF
          </motion.div>
        )}

        {/* Remove Button */}
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.3 + index * 0.05 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRemove}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shadow-lg hover:bg-rose-500 hover:border-rose-500 dark:hover:bg-rose-500 dark:hover:border-rose-500 transition-all duration-300 group/remove"
        >
          <X className="h-5 w-5 text-neutral-700 dark:text-neutral-300 group-hover/remove:text-white transition-colors" />
        </motion.button>

        {/* Product Image */}
        <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
          <Image
            src={product.image[0] || '/placeholder.png'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            priority={index < 4}
          />
          
          {/* Stock Badge */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-4">
          {/* Category */}
          <div className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
              {formatCurrency(product.offerPrice)}
            </span>
            {product.price > product.offerPrice && (
              <span className="text-sm text-neutral-400 dark:text-neutral-500 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              inStock ? "bg-green-500" : "bg-red-500"
            )} />
            <span className={cn(
              "text-sm font-medium",
              inStock ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={cn(
                "flex-1 rounded-xl font-semibold shadow-md transition-all duration-300",
                inStock 
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hover:shadow-lg hover:shadow-rose-500/25" 
                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
              )}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main Wishlist Page
export default function WishlistPage() {
  const { items: wishlistIds, removeItem } = useWishlistStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'discount'>('recent');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all products
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter products that are in wishlist
  const wishlistProducts = useMemo(() => {
    if (!allProducts || !mounted) return [];
    return allProducts.filter(product => wishlistIds.includes(product._id));
  }, [allProducts, wishlistIds, mounted]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...wishlistProducts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.offerPrice - b.offerPrice;
        case 'price-high':
          return b.offerPrice - a.offerPrice;
        case 'discount':
          const discountA = a.price > a.offerPrice ? ((a.price - a.offerPrice) / a.price) * 100 : 0;
          const discountB = b.price > b.offerPrice ? ((b.price - b.offerPrice) / b.price) * 100 : 0;
          return discountB - discountA;
        case 'recent':
        default:
          return 0;
      }
    });

    return filtered;
  }, [wishlistProducts, searchQuery, sortBy]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <WishlistHero itemCount={wishlistIds.length} />

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Search and Filter Bar */}
            {!isLoading && wishlistProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      type="text"
                      placeholder="Search your wishlist..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-base bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 transition-all"
                    />
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent outline-none transition-all cursor-pointer"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Highest Discount</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
                  <span>
                    Showing {filteredAndSortedProducts.length} of {wishlistProducts.length} items
                  </span>
                </div>
              </motion.div>
            )}

            {/* Products Grid or Empty State */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <WishlistLoading />
                </motion.div>
              ) : wishlistProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyWishlist />
                </motion.div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <Package className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">
                    No items found
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Try adjusting your search
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredAndSortedProducts.map((product, index) => (
                    <WishlistProductCard
                      key={product._id}
                      product={product}
                      onRemove={() => removeItem(product._id)}
                      index={index}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
