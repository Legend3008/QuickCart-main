'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { ProductGrid } from '@/components/products/ProductGrid';
import { FilterBar } from '@/components/products/FilterBar';
import { HeroSection } from '@/components/products/HeroSection';
import Footer from '@/components/Footer';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating';
type Category = 'all' | 'Earphone' | 'Headphone' | 'Watch' | 'Smartphone' | 'Laptop' | 'Camera' | 'Accessories';

const AllProductsPage = () => {
  const { products } = useAppContext();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.offerPrice - b.offerPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.offerPrice - a.offerPrice);
        break;
      case 'rating':
        filtered.sort((a, b) => 4.5 - 4.5); // Placeholder since all have same rating
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.date - a.date);
        break;
    }

    return filtered;
  }, [products, sortBy, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-neutral-950 dark:via-neutral-900/50 dark:to-neutral-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="relative">
        {/* Filter Bar */}
        <FilterBar
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          productCount={filteredProducts.length}
        />

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or search query
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AllProductsPage;
