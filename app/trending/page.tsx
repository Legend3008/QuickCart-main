'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Flame, 
  Star, 
  ShoppingBag, 
  Eye, 
  Heart,
  Zap,
  Award,
  Users,
  Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ProductGrid } from '@/components/product-grid';
import { QuickViewModal } from '@/components/quick-view-modal';
import { transformProduct } from '@/lib/utils';
import type { Product } from '@/types';

// Hero Section Component
function TrendingHero() {
  const stats = [
    {
      icon: Flame,
      label: 'Hot Items',
      value: '500+',
      color: 'text-orange-500'
    },
    {
      icon: Users,
      label: 'Shopping Now',
      value: '10K+',
      color: 'text-blue-500'
    },
    {
      icon: TrendingUp,
      label: 'Trending Categories',
      value: '25+',
      color: 'text-green-500'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 dark:from-primary-900 dark:via-primary-800 dark:to-primary-950">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 mb-6">
              <Flame className="h-5 w-5 text-orange-300 animate-pulse" />
              <span className="text-sm font-medium">What's Hot Right Now</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">
              Trending Products
            </h1>
            
            <p className="text-lg text-white/90 mb-8 max-w-xl">
              Discover what's flying off the shelves! Browse the most popular products that everyone's talking about.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20"
                >
                  <stat.icon className={`h-6 w-6 mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Floating Icons */}
              {[
                { Icon: Star, delay: 0, position: 'top-10 left-10', color: 'text-yellow-300' },
                { Icon: Heart, delay: 0.2, position: 'top-20 right-10', color: 'text-pink-300' },
                { Icon: ShoppingBag, delay: 0.4, position: 'bottom-20 left-20', color: 'text-blue-300' },
                { Icon: Zap, delay: 0.6, position: 'bottom-10 right-20', color: 'text-purple-300' }
              ].map(({ Icon, delay, position, color }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delay + 0.5, duration: 0.5 }}
                  className={`absolute ${position}`}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`rounded-full bg-white/20 backdrop-blur-sm p-4 ${color}`}
                  >
                    <Icon className="h-8 w-8" />
                  </motion.div>
                </motion.div>
              ))}

              {/* Center Circle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/30"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-white/20 backdrop-blur-sm p-12">
                  <TrendingUp className="h-24 w-24 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Why Shop Trending Section
function WhyShopTrending() {
  const features = [
    {
      icon: Award,
      title: 'Popular Choice',
      description: 'Products loved and trusted by thousands of customers'
    },
    {
      icon: Eye,
      title: 'Most Viewed',
      description: 'Items with the highest views and engagement'
    },
    {
      icon: Clock,
      title: 'Updated Hourly',
      description: 'Fresh trending list updated every hour'
    },
    {
      icon: Star,
      title: 'Top Rated',
      description: 'High-quality products with excellent reviews'
    }
  ];

  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Why Shop Trending Products?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Join thousands of smart shoppers who discover the best products before everyone else
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="rounded-xl bg-white dark:bg-neutral-800 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="rounded-full bg-primary-100 dark:bg-primary-900/30 w-12 h-12 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold mb-2 text-neutral-900 dark:text-neutral-100">{feature.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default function TrendingPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/product/list');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const result = await response.json();
      
      // Transform products
      const allProducts = result.data.map(transformProduct);
      
      // Sort by trending criteria (you can customize this logic):
      // - Products with higher view counts
      // - Recently added products
      // - Products with good ratings
      // For now, we'll show all products sorted by newest first
      return allProducts.sort((a: Product, b: Product) => {
        // If you have a createdAt field, use that
        // Otherwise, just return the products as is
        return 0;
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <TrendingHero />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-500">Error loading products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <TrendingHero />

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                Trending Now
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                {products.length} products trending today
              </p>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-4" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <TrendingUp className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">No Trending Products Yet</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Check back soon for trending items!
              </p>
            </div>
          ) : (
            <ProductGrid
              products={products}
              onQuickView={setSelectedProduct}
            />
          )}
        </div>
      </section>

      {/* Why Shop Trending */}
      <WhyShopTrending />

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
