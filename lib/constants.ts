export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y1ZjVmNSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pgo8L3N2Zz4=';

// Export categories for reuse
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books',
  'Toys',
  'Beauty',
  'Automotive',
] as const;

// Export navigation links
export const NAV_LINKS = [
  { href: '/all-products', label: 'All Products' },
  { href: '/deals', label: "Today's Deals" },
  { href: '/trending', label: 'Trending' },
  { href: '/new-arrivals', label: 'New Arrivals' },
] as const;

// Export site metadata
export const SITE_CONFIG = {
  name: 'SmartBazar',
  description: 'Your One-Stop E-Commerce Shop',
  url: 'https://smartbazar.com',
  freeShippingThreshold: 50,
  defaultShippingCost: 5.99,
  currency: 'USD',
  locale: 'en-US',
} as const;
