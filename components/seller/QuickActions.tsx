'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Package, List, ShoppingCart, ArrowRight } from 'lucide-react';

const actions = [
  {
    icon: Package,
    title: 'Add New Product',
    description: 'List a new item in your store',
    href: '/seller',
    gradient: 'from-orange-500 to-pink-500',
    bgGradient: 'from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20',
    borderColor: 'border-orange-200/50 dark:border-orange-700/30',
  },
  {
    icon: List,
    title: 'View Products',
    description: 'Manage your product listings',
    href: '/seller/product-list',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    borderColor: 'border-blue-200/50 dark:border-blue-700/30',
  },
  {
    icon: ShoppingCart,
    title: 'Orders',
    description: 'Check pending and completed orders',
    href: '/seller/orders',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    borderColor: 'border-purple-200/50 dark:border-purple-700/30',
  },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Navigate to key areas of your dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(action.href)}
              className="group relative"
            >
              <div
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${action.bgGradient} border ${action.borderColor} p-6 text-left shadow-sm hover:shadow-xl transition-all duration-300`}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Icon with gradient */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {action.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {action.description}
                  </p>

                  {/* Arrow icon */}
                  <div className="flex items-center text-orange-600 dark:text-orange-400 text-sm font-medium">
                    <span className="mr-2">Go to {action.title.toLowerCase()}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
