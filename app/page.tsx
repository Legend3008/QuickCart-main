'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  HeroSection,
  CategoriesSection,
  FeaturesSection,
  DealsSection,
} from '@/components/home-sections';
import { ProductGrid } from '@/components/product-grid';
import { QuickViewModal } from '@/components/quick-view-modal';
import { transformProduct } from '@/lib/utils';
import type { Product } from '@/types';

const Home = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = React.useState(false);

  // Fetch featured products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await fetch('/api/product/list');
      const result = await response.json();

      if (!result.success || !result.data) return [];

      // Transform and limit to 8 products
      return result.data.slice(0, 8).map(transformProduct);
    },
  });

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>

          <ProductGrid
            products={products}
            loading={isLoading}
            onQuickView={handleQuickView}
          />
        </div>
      </section>

      <DealsSection />

      {/* Newsletter Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Stay Updated</h2>
            <p className="text-muted-foreground">
              Subscribe to our newsletter and get exclusive deals, product updates, and shopping tips
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md border bg-background"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
};

export default Home;
