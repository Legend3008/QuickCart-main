import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Arrivals - Latest Products | SmartBazar',
  description: 'Discover the latest products freshly added to SmartBazar. Browse new arrivals across electronics, fashion, home, beauty, and more. Shop the newest trending items before anyone else.',
  keywords: [
    'new arrivals',
    'latest products',
    'new items',
    'fresh stock',
    'newly added',
    'trending products',
    'new electronics',
    'new fashion',
    'latest deals',
    'SmartBazar new'
  ],
  openGraph: {
    title: 'New Arrivals - Latest Products | SmartBazar',
    description: 'Be the first to discover our latest products. Fresh items added daily across all categories.',
    type: 'website',
    url: '/new-arrivals',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Arrivals - Latest Products | SmartBazar',
    description: 'Discover the latest products freshly added to SmartBazar.',
  },
  alternates: {
    canonical: '/new-arrivals',
  },
};

export { default } from './page';
