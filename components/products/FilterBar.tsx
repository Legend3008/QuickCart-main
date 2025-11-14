'use client';

import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating';
type Category = 'all' | 'Earphone' | 'Headphone' | 'Watch' | 'Smartphone' | 'Laptop' | 'Camera' | 'Accessories';

interface FilterBarProps {
  sortBy: SortOption;
  setSortBy: Dispatch<SetStateAction<SortOption>>;
  selectedCategory: Category;
  setSelectedCategory: Dispatch<SetStateAction<Category>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  productCount: number;
}

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'Earphone', label: 'Earphones' },
  { value: 'Headphone', label: 'Headphones' },
  { value: 'Watch', label: 'Watches' },
  { value: 'Smartphone', label: 'Smartphones' },
  { value: 'Laptop', label: 'Laptops' },
  { value: 'Camera', label: 'Cameras' },
  { value: 'Accessories', label: 'Accessories' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export const FilterBar = ({
  sortBy,
  setSortBy,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  productCount,
}: FilterBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-[73px] z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-neutral-800/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Row: Results count + Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              All Products
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {productCount} {productCount === 1 ? 'product' : 'products'} available
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-neutral-800 border-0 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:bg-white dark:focus:bg-neutral-700 transition-all duration-200"
            />
          </div>
        </div>

        {/* Bottom Row: Categories + Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Categories */}
          <div className="flex-1">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <motion.button
                  key={category.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                    ${
                      selectedCategory === category.value
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }
                  `}
                >
                  {category.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-gray-100 dark:bg-neutral-800 border-0 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 cursor-pointer transition-all duration-200"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
