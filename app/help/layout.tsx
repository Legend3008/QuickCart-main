import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center - SmartBazar | 24/7 Support & FAQs',
  description: 'Get instant help with SmartBazar. Find answers to common questions, browse help topics, contact our support team, or submit feedback. Available 24/7 to assist you.',
  keywords: [
    'SmartBazar help',
    'customer support',
    'FAQs',
    'help center',
    'contact support',
    'order help',
    'shipping information',
    'returns policy',
    'payment help',
    'technical support',
    '24/7 support'
  ],
  openGraph: {
    title: 'Help Center - SmartBazar | 24/7 Support',
    description: 'Get instant help with orders, shipping, payments, and more. Our support team is available 24/7.',
    type: 'website',
    images: [
      {
        url: '/og-help.jpg',
        width: 1200,
        height: 630,
        alt: 'SmartBazar Help Center'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help Center - SmartBazar',
    description: 'Get instant help with SmartBazar. Available 24/7 to assist you.'
  }
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
