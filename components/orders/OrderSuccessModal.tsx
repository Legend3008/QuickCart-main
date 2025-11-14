'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Package, Calendar, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: {
    orderNumber: string;
    orderTotal: number;
    estimatedDelivery: string;
    items: number;
  };
}

export function OrderSuccessModal({ isOpen, onClose, orderData }: OrderSuccessModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Auto-redirect after 3 seconds
      const timer = setTimeout(() => {
        router.push('/my-orders');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, router]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-md"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>

                {/* Success Animation */}
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8">
                  {/* Animated Circles */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-48 h-48 rounded-full bg-green-500" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-32 h-32 rounded-full bg-green-400" />
                  </motion.div>

                  {/* Check Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.8, delay: 0.1 }}
                    className="relative flex items-center justify-center mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50"
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Order Placed Successfully!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 dark:text-gray-400 mb-6"
                  >
                    Thank you for your purchase. We'll send you an update once your items are shipped.
                  </motion.p>

                  {/* Order Details */}
                  {orderData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-4 mb-6"
                    >
                      {/* Order Number */}
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Order Number</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              #{orderData.orderNumber}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Items & Total */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-left">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Items</p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {orderData.items}
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-left">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Order Total</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            ₹{orderData.orderTotal}
                          </p>
                        </div>
                      </div>

                      {/* Delivery Date */}
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20">
                        <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <div className="text-left flex-1">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Estimated Delivery</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {new Date(orderData.estimatedDelivery).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    <button
                      onClick={() => router.push('/my-orders')}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 transition-all"
                    >
                      View My Orders
                    </button>

                    <button
                      onClick={() => router.push('/all-products')}
                      className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>

                  {/* Auto-redirect message */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-xs text-gray-500 dark:text-gray-400 mt-4"
                  >
                    Redirecting to My Orders in 3 seconds...
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
