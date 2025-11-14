'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Tag, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  image: string[];
  category: string;
  discountPercentage: number;
}

export default function DealsSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['helpDeals'],
    queryFn: async () => {
      const res = await fetch('/api/help/deals?limit=8');
      if (!res.ok) throw new Error('Failed to fetch deals');
      return res.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (error) return null;

  const products: Product[] = data?.products || [];

  return (
    <section className="py-16 sm:py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 mb-4">
            <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
              Featured Deals
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Trending Products & Deals
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Check out our best offers while getting help
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-white dark:bg-neutral-800 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="group"
                >
                  <Link
                    href={`/product/${product._id}`}
                    className="block rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                      {product.image && product.image[0] && (
                        <Image
                          src={product.image[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      )}
                      
                      {/* Discount Badge */}
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-lg">
                          {product.discountPercentage}% OFF
                        </div>
                      )}

                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 text-white text-sm font-medium">
                          View Deal
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Category */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                          {product.category}
                        </span>
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      </div>

                      {/* Product Name */}
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-neutral-900 dark:text-white">
                          ₹{product.offerPrice.toLocaleString()}
                        </span>
                        {product.price > product.offerPrice && (
                          <span className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Savings */}
                      {product.price > product.offerPrice && (
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                          Save ₹{(product.price - product.offerPrice).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 active:scale-95"
              >
                View All Deals
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Tag className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              No deals available at the moment. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
