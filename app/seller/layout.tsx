'use client';

import React from 'react';
import { SellerNavbar } from '@/components/seller/SellerNavbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SellerNavbar />
      {children}
    </div>
  );
}
