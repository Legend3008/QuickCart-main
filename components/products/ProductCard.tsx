'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useCartStore, useUIStore, useWishlistStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  image: string[];
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const { isInWishlist, toggle: toggleWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product._id);

  const discountPercentage = Math.round(
    ((product.price - product.offerPrice) / product.price) * 100
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product._id);
    openCart();
    toast.success('Added to cart!', {
      icon: '🛒',
      style: {
        borderRadius: '12px',
        background: '#10b981',
        color: '#fff',
      },
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wasInWishlist = isWishlisted;
    toggleWishlist(product._id);
    toast.success(wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: wasInWishlist ? '💔' : '❤️',
      style: {
        borderRadius: '12px',
      },
    });
  };

  const handleCardClick = () => {
    router.push(`/product/${product._id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden cursor-pointer border border-gray-200/50 dark:border-neutral-800/50 hover:border-gray-300 dark:hover:border-neutral-700 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-300"
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -12 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
        >
          {discountPercentage}% OFF
        </motion.div>
      )}

      {/* Wishlist Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWishlist}
        className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-neutral-800 transition-colors duration-200"
      >
        <Heart
          className={`w-5 h-5 transition-colors duration-200 ${
            isWishlisted
              ? 'fill-red-500 text-red-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        />
      </motion.button>

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-neutral-800 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <Image
            src={product.image[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </motion.div>

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Add to Cart - Shows on hover */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-6 py-3 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-full font-semibold text-sm shadow-xl flex items-center gap-2 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </motion.button>
      </div>

      {/* Product Details */}
      <div className="p-5 space-y-3">
        {/* Category */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-orange-500 dark:text-orange-400 uppercase tracking-wider">
            {product.category}
          </span>
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              4.5
            </span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem] leading-tight">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{product.offerPrice.toLocaleString()}
            </span>
            {product.price > product.offerPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Mobile Add to Cart */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="lg:hidden p-2.5 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-200"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Delivery Info */}
        <div className="pt-2 border-t border-gray-200 dark:border-neutral-800">
          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full" />
            Free delivery on orders above ₹499
          </p>
        </div>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </motion.div>
  );
};
