import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch | SmartBazar',
  description: 'Contact SmartBazar for customer support, feedback, or partnerships. We\'re here to help 24/7 with any questions or concerns about your shopping experience.',
  keywords: [
    'contact SmartBazar',
    'customer support',
    'get in touch',
    'SmartBazar help',
    'contact form',
    'customer service',
    'support email',
    'phone number',
    'business hours',
    'SmartBazar location'
  ],
  openGraph: {
    title: 'Contact Us - Get in Touch | SmartBazar',
    description: 'Reach out to SmartBazar\'s customer support team. We\'re here to make your shopping experience exceptional.',
    type: 'website',
    url: '/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact SmartBazar',
    description: 'Get in touch with our support team. We\'re here to help!',
  },
  alternates: {
    canonical: '/contact',
  },
};

export { default } from './page';
