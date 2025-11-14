'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, TrendingDown, Zap, Tag } from 'lucide-react';
import { ProductGrid } from '@/components/product-grid';
import { QuickViewModal } from '@/components/quick-view-modal';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { transformProduct } from '@/lib/utils';
import type { Product } from '@/types';

const DealOfTheDay = () => {
  return (
    <section className="bg-gradient-to-br from-destructive/10 via-destructive/5 to-background py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="destructive" className="mb-4">
            <Clock className="w-4 h-4 mr-2" />
            Limited Time Offer
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Today's <span className="text-destructive">Hot Deals</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't miss out on these amazing deals! Limited quantities available. 
            Grab them before they're gone! 🔥
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: TrendingDown,
              title: 'Up to 70% OFF',
              description: 'Massive discounts on top brands',
              color: 'text-destructive',
            },
            {
              icon: Zap,
              title: 'Flash Sales',
              description: 'New deals every hour',
              color: 'text-yellow-500',
            },
            {
              icon: Tag,
              title: 'Extra Savings',
              description: 'Stack coupons for more discounts',
              color: 'text-green-500',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DealsPage = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = React.useState(false);

  // Fetch products and filter those with significant discounts
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['deals-products'],
    queryFn: async () => {
      const response = await fetch('/api/product/list');
      const result = await response.json();

      if (!result.success || !result.data) return [];

      // Transform products and filter for deals (products with discounts)
      const allProducts = result.data.map(transformProduct);
      
      // Filter products that have a discount (originalPrice > sellingPrice)
      const dealsProducts = allProducts.filter(
        (product: Product) => product.originalPrice > product.sellingPrice
      );

      // If no deals found, return all products (for demo purposes)
      return dealsProducts.length > 0 ? dealsProducts : allProducts;
    },
  });

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  return (
    <>
      <DealOfTheDay />

      {/* Deals Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">All Deals</h2>
              <p className="text-muted-foreground">
                {products.length} amazing deals available now
              </p>
            </div>
          </div>

          <ProductGrid
            products={products}
            loading={isLoading}
            onQuickView={handleQuickView}
          />

          {!isLoading && products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">No deals available right now</h3>
              <p className="text-muted-foreground">
                Check back soon for amazing offers!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Shop Deals Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Shop Our Deals?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Verified Deals</h3>
                  <p className="text-sm text-muted-foreground">
                    All discounts are genuine and verified by our team
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    ⚡
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Fast Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    Free shipping on orders over $50
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    🔒
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    100% secure payment processing
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    ↩️
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Easy Returns</h3>
                  <p className="text-sm text-muted-foreground">
                    30-day hassle-free return policy
                  </p>
                </div>
              </div>
            </div>
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

export default DealsPage;
