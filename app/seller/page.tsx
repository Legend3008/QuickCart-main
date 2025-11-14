'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { SellerHeader } from '@/components/seller/SellerHeader';
import { StatsOverview } from '@/components/seller/StatsOverview';
import { AddProductForm } from '@/components/seller/AddProductForm';
import { QuickActions } from '@/components/seller/QuickActions';

export default function SellerDashboard() {
  const { getToken, isSeller, setIsSeller, user } = useAppContext();
  const [checkingRole, setCheckingRole] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    pendingOrders: 0,
    customerRating: 4.8,
  });

  // Check and set seller role on component mount
  useEffect(() => {
    const checkAndSetSellerRole = async () => {
      try {
        const token = await getToken();

        // Check current role
        const { data: roleData } = await axios.get('/api/seller/set-role', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (roleData.success && roleData.role !== 'seller') {
          // Set seller role
          const { data: setRoleData } = await axios.post(
            '/api/seller/set-role',
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (setRoleData.success) {
            setIsSeller(true);
            toast.success('🎉 Seller access granted!', {
              style: {
                background: '#10B981',
                color: '#fff',
              },
            });
          }
        } else if (roleData.success && roleData.role === 'seller') {
          setIsSeller(true);
        }
      } catch (error) {
        console.error('Error checking/setting seller role:', error);
        toast.error('Failed to verify seller access');
      } finally {
        setCheckingRole(false);
      }
    };

    checkAndSetSellerRole();
  }, [getToken, setIsSeller]);

  // Fetch seller stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get('/api/product/seller-list', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setStats((prev) => ({
            ...prev,
            totalProducts: data.products.length,
          }));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (user && isSeller) {
      fetchStats();
    }
  }, [user, isSeller, getToken]);

  if (checkingRole) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-orange-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Verifying Access
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Setting up your seller dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <SellerHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Stats Overview */}
          <StatsOverview stats={stats} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Add Product Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AddProductForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
