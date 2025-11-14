import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders - Track Your Purchases | SmartBazar',
  description: 'View and track all your SmartBazar orders in one place. Check order status, delivery information, and manage your purchases with ease.',
  keywords: [
    'my orders',
    'order history',
    'track order',
    'order status',
    'purchase history',
    'SmartBazar orders',
    'order tracking',
    'delivery status',
    'order management'
  ],
  openGraph: {
    title: 'My Orders - Track Your Purchases | SmartBazar',
    description: 'Manage and track all your purchases with SmartBazar\'s intuitive order management system.',
    type: 'website',
    url: '/my-orders',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Orders - SmartBazar',
    description: 'View and track all your SmartBazar orders in one place.',
  },
  alternates: {
    canonical: '/my-orders',
  },
};

export { default } from './page';
