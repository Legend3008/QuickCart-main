import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Eye,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { OrderStatusBadge, type OrderStatus } from './order-status-badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string[];
    offerPrice: number;
  };
  quantity: number;
  _id: string;
}

interface Address {
  fullName: string;
  phoneNumber: string;
  area: string;
  city: string;
  state: string;
  pincode: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  amount: number;
  address: Address;
  status: OrderStatus;
  date: number;
}

interface OrderCardProps {
  order: Order;
  currency?: string;
  onViewDetails?: (orderId: string) => void;
}

export function OrderCard({ order, currency = '$', onViewDetails }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const orderDate = new Date(order.date);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const firstItem = order.items[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-950/50 transition-all duration-300">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              {/* Order ID and Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={orderDate.toISOString()}>
                    {formatDate(orderDate)}
                  </time>
                </div>
              </div>

              {/* Status Badge */}
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Amount */}
            <div className="text-right">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {formatCurrency(order.amount)}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          {/* Items Preview */}
          <div className="space-y-4 mb-6">
            {order.items.slice(0, isExpanded ? undefined : 2).map((item, index) => (
              <motion.div
                key={item._id}
                initial={isExpanded ? { opacity: 0, height: 0 } : false}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 group/item"
              >
                {/* Product Image */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                  <Image
                    src={item.product.image[0] || PLACEHOLDER_IMAGE}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-1 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                    <span>Qty: {item.quantity}</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {formatCurrency(item.product.offerPrice)}
                    </span>
                  </div>
                </div>

                {/* Item Total */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Subtotal</p>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(item.product.offerPrice * item.quantity)}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Show More Button */}
            {order.items.length > 2 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                <span>{isExpanded ? 'Show less' : `Show ${order.items.length - 2} more items`}</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-100 dark:border-neutral-800 mb-6" />

          {/* Delivery Address */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <MapPin className="h-4 w-4" />
              <span>Delivery Address</span>
            </div>
            <div className="pl-6 text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{order.address.fullName}</p>
              <p>{order.address.area}</p>
              <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
              <p className="flex items-center gap-2 text-neutral-500 dark:text-neutral-500">
                <span>📞</span>
                <span>{order.address.phoneNumber}</span>
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            <CreditCard className="h-4 w-4" />
            <span>Payment: </span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">Cash on Delivery</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              className="flex-1 sm:flex-none"
              onClick={() => onViewDetails?.(order._id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Track Order
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
