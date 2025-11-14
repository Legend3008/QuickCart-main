import * as React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { OrderStatus } from './order-status-badge';
import { cn } from '@/lib/utils';

interface OrderFilterProps {
  activeFilter: OrderStatus | 'All';
  onFilterChange: (filter: OrderStatus | 'All') => void;
  className?: string;
}

const filters: Array<OrderStatus | 'All'> = [
  'All',
  'Order Placed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export function OrderFilter({ activeFilter, onFilterChange, className }: OrderFilterProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        <Filter className="h-4 w-4" />
        <span>Filter by Status</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterChange(filter)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-200 dark:shadow-primary-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              )}
            >
              {filter}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
