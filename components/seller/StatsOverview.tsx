'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Clock, Star } from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalSales: number;
  pendingOrders: number;
  customerRating: number;
}

interface StatsOverviewProps {
  stats: Stats;
}

const statCards = [
  {
    icon: Package,
    label: 'Total Products',
    key: 'totalProducts' as keyof Stats,
    gradient: 'from-orange-500 to-pink-500',
    bgGradient: 'from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20',
    borderColor: 'border-orange-200/50 dark:border-orange-700/30',
    iconBg: 'bg-orange-500/10 dark:bg-orange-500/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: DollarSign,
    label: 'Total Sales',
    key: 'totalSales' as keyof Stats,
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    borderColor: 'border-green-200/50 dark:border-green-700/30',
    iconBg: 'bg-green-500/10 dark:bg-green-500/20',
    iconColor: 'text-green-600 dark:text-green-400',
    prefix: '$',
  },
  {
    icon: Clock,
    label: 'Pending Orders',
    key: 'pendingOrders' as keyof Stats,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    borderColor: 'border-blue-200/50 dark:border-blue-700/30',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Star,
    label: 'Customer Rating',
    key: 'customerRating' as keyof Stats,
    gradient: 'from-yellow-500 to-orange-500',
    bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
    borderColor: 'border-yellow-200/50 dark:border-yellow-700/30',
    iconBg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    suffix: '★',
  },
];

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Performance Overview
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Track your store's key metrics at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const value = stats[card.key];

          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group"
            >
              <div
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} p-6 shadow-sm hover:shadow-xl transition-all duration-300`}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${card.iconColor}`} />
                  </div>

                  {/* Label */}
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {card.label}
                  </p>

                  {/* Value with animated counter */}
                  <div className="flex items-baseline gap-1">
                    {card.prefix && (
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {card.prefix}
                      </span>
                    )}
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + 0.1 * index }}
                      className="text-3xl font-bold text-gray-900 dark:text-white"
                    >
                      {typeof value === 'number' && value % 1 !== 0
                        ? value.toFixed(1)
                        : value}
                    </motion.span>
                    {card.suffix && (
                      <span className="text-2xl font-bold text-yellow-500">
                        {card.suffix}
                      </span>
                    )}
                  </div>

                  {/* Growth indicator (placeholder) */}
                  <div className="mt-3 flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      +12% this month
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
