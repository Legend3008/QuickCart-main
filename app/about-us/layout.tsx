import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Our Story & Mission | SmartBazar',
  description: 'Discover the SmartBazar story. Learn about our mission to revolutionize online shopping through technology, trust, and exceptional customer experience. Join millions of smart shoppers worldwide.',
  keywords: [
    'about smartbazar',
    'our story',
    'company mission',
    'our values',
    'e-commerce platform',
    'online shopping',
    'smartbazar team',
    'company vision',
    'customer first',
    'trusted marketplace'
  ],
  openGraph: {
    title: 'About Us - Our Story & Mission | SmartBazar',
    description: 'Empowering smart shopping. Learn how SmartBazar is transforming e-commerce with technology and trust.',
    type: 'website',
    url: '/about-us',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'SmartBazar - About Us'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - SmartBazar',
    description: 'Empowering smart shopping. Learn about our mission and values.',
    images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop']
  },
  alternates: {
    canonical: '/about-us',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export { default } from './page';
