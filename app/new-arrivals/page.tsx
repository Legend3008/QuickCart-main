'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  Filter,
  SlidersHorizontal,
  Grid3x3,
  LayoutGrid,
  ChevronDown,
  Clock,
  Star,
  Package,
  Shield
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ProductGrid } from '@/components/product-grid';
import { QuickViewModal } from '@/components/quick-view-modal';
import { transformProduct } from '@/lib/utils';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';

// Types
type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'name';
type ViewMode = 'grid-4' | 'grid-3';

// Hero Section with Premium Design
function NewArrivalsHero() {
  const stats = [
    {
      icon: Sparkles,
      label: 'Fresh Products',
      value: '150+',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      icon: Clock,
      label: 'Added Today',
      value: '25+',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: TrendingUp,
      label: 'Categories',
      value: '12+',
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 dark:from-primary-900 dark:via-primary-800 dark:to-purple-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container relative mx-auto px-4 py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-white space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-5 py-2.5 border border-white/30"
            >
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide">JUST DROPPED</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              New Arrivals
            </motion.h1>
            
            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-white/90 max-w-xl leading-relaxed"
            >
              Discover the latest products freshly added to our collection. 
              Be the first to explore cutting-edge items across all categories.
            </motion.p>

            {/* Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className={`rounded-xl ${stat.bgColor} w-12 h-12 flex items-center justify-center mb-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs text-white/80 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Floating Product Icons */}
              {[
                { Icon: Package, position: 'top-10 left-10', delay: 0 },
                { Icon: Star, position: 'top-20 right-10', delay: 0.2 },
                { Icon: Shield, position: 'bottom-20 left-20', delay: 0.4 },
                { Icon: Sparkles, position: 'bottom-10 right-20', delay: 0.6 }
              ].map(({ Icon, position, delay }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delay + 0.8, duration: 0.6, ease: 'backOut' }}
                  className={`absolute ${position} z-10`}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, 8, 0, -8, 0]
                    }}
                    transition={{ 
                      duration: 4 + index,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="rounded-2xl bg-white/20 backdrop-blur-md p-5 border border-white/30 shadow-2xl"
                  >
                    <Icon className="h-10 w-10 text-white" />
                  </motion.div>
                </motion.div>
              ))}

              {/* Center Feature */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/30"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="rounded-3xl bg-white/20 backdrop-blur-lg p-16 border border-white/30 shadow-2xl"
                >
                  <Calendar className="h-32 w-32 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Feature Benefits Section
function FeatureSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Latest Products',
      description: 'Get access to brand new items added within the last 30 days',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Every product is verified and meets our strict quality standards',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Trend Setters',
      description: 'Stay ahead with products that define the latest market trends',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: 'Fresh Updates',
      description: 'New products added daily to keep our collection current',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
            Why Shop New Arrivals?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Be among the first to discover and own the latest products before they become mainstream
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative rounded-2xl bg-white dark:bg-neutral-800 p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700 h-full">
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative rounded-xl bg-gradient-to-br ${feature.gradient} w-14 h-14 flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default function NewArrivalsPage() {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [sortBy, setSortBy] = React.useState<SortOption>('newest');
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid-4');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch products with React Query
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['new-arrivals', sortBy],
    queryFn: async () => {
      const response = await fetch('/api/product/list');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const result = await response.json();
      
      // Transform and sort products
      let transformedProducts = result.data.map(transformProduct);
      
      // Sort based on selected option
      switch (sortBy) {
        case 'newest':
          // Assuming products have a createdAt or similar field
          // If not available, reverse the array to show newest first
          transformedProducts = [...transformedProducts].reverse();
          break;
        case 'oldest':
          // Keep original order (oldest first)
          break;
        case 'price-low':
          transformedProducts.sort((a: Product, b: Product) => a.sellingPrice - b.sellingPrice);
          break;
        case 'price-high':
          transformedProducts.sort((a: Product, b: Product) => b.sellingPrice - a.sellingPrice);
          break;
        case 'name':
          transformedProducts.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
          break;
      }
      
      return transformedProducts;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const sortOptions = [
    { value: 'newest' as const, label: 'Newest First' },
    { value: 'oldest' as const, label: 'Oldest First' },
    { value: 'price-low' as const, label: 'Price: Low to High' },
    { value: 'price-high' as const, label: 'Price: High to Low' },
    { value: 'name' as const, label: 'Name: A to Z' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <NewArrivalsHero />
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">Unable to Load Products</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              We're having trouble loading the new arrivals. Please try again in a moment.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <NewArrivalsHero />

      {/* Products Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          {/* Controls Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
          >
            {/* Product Count */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3 text-neutral-900 dark:text-neutral-100">
                <Sparkles className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                Fresh Collection
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                {isLoading ? (
                  <span className="inline-block w-32 h-5 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                ) : (
                  <span className="font-medium">{products.length} products</span>
                )} available now
              </p>
            </div>

            {/* Filters & View Controls */}
            {mounted && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Sort Select */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggles */}
                <div className="hidden md:flex items-center gap-1 border rounded-lg p-1 bg-white dark:bg-neutral-800">
                  <button
                    onClick={() => setViewMode('grid-4')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid-4'
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                    aria-label="4 column grid"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid-3')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid-3'
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                    aria-label="3 column grid"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  viewMode === 'grid-4' ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3'
                } gap-6`}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-4" />
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-3" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-2/3 mb-3" />
                    <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-1/2" />
                  </div>
                ))}
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-6"
                >
                  <Sparkles className="h-12 w-12 text-neutral-400" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">No New Arrivals Right Now</h3>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8">
                  Check back soon for the latest additions! We're constantly adding fresh products to our collection.
                </p>
                <Button size="lg" onClick={() => window.location.href = '/'}>
                  Explore All Products
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductGrid
                  products={products}
                  onQuickView={setSelectedProduct}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Feature Section */}
      {!isLoading && products.length > 0 && <FeatureSection />}

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
