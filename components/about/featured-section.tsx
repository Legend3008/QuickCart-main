import * as React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ProductGrid } from '@/components/product-grid';
import { QuickViewModal } from '@/components/quick-view-modal';
import { transformProduct } from '@/lib/utils';
import type { Product } from '@/types';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeaturedSection() {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  // Fetch featured products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await fetch('/api/product/list');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const result = await response.json();
      
      // Get first 4 products as featured
      const allProducts = result.data.map(transformProduct);
      return allProducts.slice(0, 4);
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section className="py-20 lg:py-28 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 dark:bg-primary-900/30 px-5 py-2.5 mb-6">
              <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-semibold tracking-wide text-primary-600 dark:text-primary-400">
                HANDPICKED FOR YOU
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
              Featured Products
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Discover our curated selection of premium products with unbeatable deals
            </p>
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-4" />
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-3" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ProductGrid
                products={products}
                onQuickView={setSelectedProduct}
              />
            </motion.div>
          )}

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              onClick={() => window.location.href = '/all-products'}
            >
              View All Products
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
