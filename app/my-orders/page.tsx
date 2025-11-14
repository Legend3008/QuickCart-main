'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ShoppingBag, 
  Search,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { OrderCard } from '@/components/orders/order-card';
import { OrderFilter } from '@/components/orders/order-filter';
import { OrderStatus } from '@/components/orders/order-status-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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

// Map API status to OrderStatus
function mapApiStatusToOrderStatus(apiStatus: string): OrderStatus {
  const statusMap: Record<string, OrderStatus> = {
    'Processing': 'Pending',
    'Confirmed': 'Order Placed',
    'Shipped': 'Shipped',
    'Out for Delivery': 'Out for Delivery',
    'Delivered': 'Delivered',
    'Cancelled': 'Cancelled',
  };
  return statusMap[apiStatus] || 'Pending';
}

// Hero Section Component
function OrdersHero({ totalOrders, pendingOrders, deliveredOrders }: { totalOrders: number; pendingOrders: number; deliveredOrders: number }) {
  const stats = [
    {
      icon: Package,
      label: 'Total Orders',
      value: totalOrders.toString(),
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: pendingOrders.toString(),
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30'
    },
    {
      icon: TrendingUp,
      label: 'Delivered',
      value: deliveredOrders.toString(),
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 dark:from-primary-900 dark:via-primary-800 dark:to-purple-950">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center text-white space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-5 py-2.5 border border-white/30"
            >
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold tracking-wide">ORDER MANAGEMENT</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
            >
              My Orders
            </motion.h1>
            
            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
            >
              Track and manage all your purchases in one place
            </motion.p>

            {/* Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className={`rounded-xl ${stat.bgColor} w-12 h-12 flex items-center justify-center mb-3 mx-auto`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs text-white/80 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Empty State Component
function EmptyOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-6"
      >
        <ShoppingBag className="h-12 w-12 text-neutral-400" />
      </motion.div>
      <h3 className="text-2xl font-bold mb-3">No Orders Yet</h3>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8">
        You haven't placed any orders yet. Start shopping and discover amazing deals!
      </p>
      <Button size="lg" onClick={() => window.location.href = '/'}>
        Start Shopping
      </Button>
    </motion.div>
  );
}

// Loading Skeleton
function OrdersLoading() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
            <div className="flex justify-between">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div>
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="w-20 h-20 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main Page Component
export default function MyOrdersPage() {
  const { isSignedIn } = useUser();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<OrderStatus | 'All'>('All');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch orders from real API
  const { data: ordersData, isLoading: loading } = useQuery({
    queryKey: ['orders', activeFilter !== 'All' ? activeFilter : undefined],
    queryFn: async () => {
      const url =
        activeFilter === 'All'
          ? '/api/orders/place'
          : `/api/orders/place?status=${activeFilter}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch orders');
      }

      // Transform API data to match OrderCard expected format
      const transformedOrders = (result.orders || []).map((order: any) => ({
        _id: order._id,
        items: order.items.map((item: any) => ({
          _id: item._id || item.productId,
          product: {
            _id: item.productId,
            name: item.name,
            image: [item.image],
            offerPrice: item.price,
          },
          quantity: item.quantity,
        })),
        amount: order.orderTotal,
        address: {
          fullName: order.shippingAddress.fullName,
          phoneNumber: order.shippingAddress.phone,
          area: order.shippingAddress.area,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pincode: Number(order.shippingAddress.pincode),
        },
        status: mapApiStatusToOrderStatus(order.status),
        date: new Date(order.orderDate).getTime(),
      }));

      return transformedOrders;
    },
    enabled: isSignedIn && mounted,
  });

  const orders = ordersData || [];

  // Calculate stats for hero
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o: Order) => 
    o.status === 'Pending' || o.status === 'Order Placed'
  ).length;
  const deliveredOrders = orders.filter((o: Order) => o.status === 'Delivered').length;

  // Filter orders based on search and status
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order: Order) => {
      // Status filter
      const statusMatch = activeFilter === 'All' || order.status === activeFilter;
      
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const searchMatch = !searchQuery || 
        order._id.toLowerCase().includes(searchLower) ||
        order.items.some((item: OrderItem) => item.product.name.toLowerCase().includes(searchLower));

      return statusMatch && searchMatch;
    });
  }, [orders, activeFilter, searchQuery]);

  const handleViewDetails = (orderId: string) => {
    // Navigate to order details page
    console.log('View order:', orderId);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <OrdersHero 
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        deliveredOrders={deliveredOrders}
      />

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Search and Filter */}
            {!loading && orders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 mb-10"
              >
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search by order ID or product name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl"
                  />
                </div>

                {/* Filter */}
                <OrderFilter
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />

                {/* Results Count */}
                <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
                  <span>
                    Showing {filteredOrders.length} of {orders.length} orders
                  </span>
                </div>
              </motion.div>
            )}

            {/* Orders List */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <OrdersLoading />
                </motion.div>
              ) : orders.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyOrders />
                </motion.div>
              ) : filteredOrders.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <Package className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Try adjusting your search or filters
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {filteredOrders.map((order: Order, index: number) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                      <OrderCard
                        order={order}
                        onViewDetails={handleViewDetails}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
