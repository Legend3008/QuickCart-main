# SmartBazar: Performance Optimization Guide

## Performance Philosophy

SmartBazar is engineered for exceptional performance, targeting sub-second page loads and sub-100ms API responses. Performance is not a feature—it's a fundamental requirement.

## Performance Metrics & Targets

### Core Web Vitals

| Metric | Target | Current | Description |
|--------|--------|---------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | TBD | Main content load time |
| **FID** (First Input Delay) | < 100ms | TBD | Interactivity response time |
| **CLS** (Cumulative Layout Shift) | < 0.1 | TBD | Visual stability |
| **TTFB** (Time to First Byte) | < 600ms | TBD | Server response time |
| **FCP** (First Contentful Paint) | < 1.8s | TBD | First paint time |
| **TTI** (Time to Interactive) | < 3.8s | TBD | Full interactivity time |

### API Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| P50 Response Time | < 50ms | Median response |
| P95 Response Time | < 100ms | 95th percentile |
| P99 Response Time | < 200ms | 99th percentile |
| Error Rate | < 0.1% | Failed requests |
| Throughput | > 10,000 req/s | Requests per second |

## Frontend Optimization

### 1. Code Splitting & Lazy Loading

```javascript
// Dynamic imports for route-based code splitting
import dynamic from 'next/dynamic';

// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false  // Client-side only if needed
});

// Lazy load modals and dialogs
const CheckoutModal = dynamic(() => import('./CheckoutModal'), {
  loading: () => <div>Loading...</div>
});

// Preload on hover for better UX
import { useEffect } from 'react';

function ProductCard({ product }) {
  const handleHover = () => {
    import('./ProductDetails').then(module => {
      // Preload module on hover
    });
  };
  
  return <div onMouseEnter={handleHover}>...</div>;
}
```

### 2. Image Optimization

```javascript
// next/image for automatic optimization
import Image from 'next/image';

function ProductImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={500}
      height={500}
      quality={85}
      priority={false}  // Only true for above-the-fold images
      placeholder="blur"
      blurDataURL="/placeholder.jpg"
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

// Cloudinary optimization
const cloudinaryUrl = (url, transformations) => {
  const base = 'https://res.cloudinary.com/smartbazar/image/upload/';
  return `${base}${transformations}/${url}`;
};

// Usage
const optimizedUrl = cloudinaryUrl('product.jpg', 
  'f_auto,q_auto,w_500,h_500,c_fill'
);
```

### 3. Font Optimization

```javascript
// app/layout.js
import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.className}>
      <body>{children}</body>
    </html>
  );
}
```

### 4. Prefetching & Preloading

```javascript
// Prefetch links on hover
import Link from 'next/link';

function Navigation() {
  return (
    <Link href="/products" prefetch={true}>
      Products
    </Link>
  );
}

// Preload critical resources
export default function Home() {
  return (
    <Head>
      <link
        rel="preload"
        href="/fonts/outfit-regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="dns-prefetch" href="https://api.clerk.dev" />
    </Head>
  );
}
```

### 5. Bundle Size Optimization

```javascript
// next.config.mjs
export default {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'lodash-es'
    ],
  },
  
  webpack: (config, { isServer }) => {
    // Analyze bundle size
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }
    
    return config;
  },
};
```

```bash
# Analyze bundle
ANALYZE=true npm run build
```

### 6. React Performance Optimization

```javascript
// Memoization
import { memo, useMemo, useCallback } from 'react';

const ProductCard = memo(function ProductCard({ product, onAddToCart }) {
  // Memoize computed values
  const discountPercentage = useMemo(() => {
    return Math.round(((product.price - product.offerPrice) / product.price) * 100);
  }, [product.price, product.offerPrice]);
  
  // Memoize callbacks
  const handleAddToCart = useCallback(() => {
    onAddToCart(product._id);
  }, [product._id, onAddToCart]);
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{discountPercentage}% OFF</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
});

// Virtual scrolling for long lists
import { FixedSizeList } from 'react-window';

function ProductList({ products }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ProductCard product={products[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={products.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

## Backend Optimization

### 1. Database Query Optimization

```javascript
// Bad: N+1 query problem
async function getProductsWithSellers() {
  const products = await Product.find();
  for (const product of products) {
    product.seller = await User.findById(product.userId);
  }
  return products;
}

// Good: Use population or aggregation
async function getProductsWithSellers() {
  return await Product.find()
    .populate('userId', 'name email sellerProfile')
    .lean();
}

// Better: Denormalize for frequent reads
// Store seller name directly in product document

// Use indexes for common queries
productSchema.index({ userId: 1, status: 1 });
productSchema.index({ category: 1, 'pricing.current': 1 });

// Compound index for sorting
productSchema.index({ 
  status: 1, 
  isFeatured: -1, 
  createdAt: -1 
});
```

### 2. Caching Strategy

```javascript
// In-memory cache for hot data
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5,  // 5 minutes
  updateAgeOnGet: true
});

// Cache wrapper for API routes
export async function getCachedProducts(filter) {
  const cacheKey = JSON.stringify(filter);
  
  // Check cache
  let products = cache.get(cacheKey);
  if (products) {
    return products;
  }
  
  // Fetch from database
  products = await Product.find(filter).lean();
  
  // Store in cache
  cache.set(cacheKey, products);
  
  return products;
}

// Redis caching for distributed systems
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

export async function getCachedProduct(id) {
  // Try cache first
  const cached = await redis.get(`product:${id}`);
  if (cached) return JSON.parse(cached);
  
  // Fetch from database
  const product = await Product.findById(id).lean();
  
  // Cache for 1 hour
  await redis.setex(`product:${id}`, 3600, JSON.stringify(product));
  
  return product;
}
```

### 3. API Response Optimization

```javascript
// Compression
import { NextResponse } from 'next/server';

export async function GET(request) {
  const data = await getProductList();
  
  const response = NextResponse.json(data);
  
  // Enable compression via headers
  response.headers.set('Content-Encoding', 'gzip');
  
  // Cache headers
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  );
  
  return response;
}

// Pagination to reduce payload
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;
  
  const skip = (page - 1) * limit;
  
  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit).lean(),
    Product.countDocuments()
  ]);
  
  return NextResponse.json({ products, total, page, limit });
}

// Field selection to reduce payload size
const products = await Product.find()
  .select('name price offerPrice image')  // Only needed fields
  .lean();
```

### 4. Connection Pooling

```javascript
// MongoDB connection pool optimization
const mongooseOptions = {
  maxPoolSize: 100,           // Max connections
  minPoolSize: 10,            // Min connections
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000,
};

// Reuse connections
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, mongooseOptions);
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}
```

## CDN & Edge Optimization

### 1. Static Asset Caching

```javascript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 2. Edge Functions

```javascript
// app/api/product/list/route.js
export const runtime = 'edge';  // Run on edge network

export async function GET(request) {
  // Runs closer to users globally
  const products = await getProducts();
  return Response.json(products);
}
```

### 3. ISR (Incremental Static Regeneration)

```javascript
// app/products/[id]/page.jsx
export async function generateStaticParams() {
  const products = await getTopProducts();
  return products.map((product) => ({
    id: product._id,
  }));
}

export const revalidate = 3600;  // Revalidate every hour

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  return <ProductDetails product={product} />;
}
```

## Performance Monitoring

### 1. Web Vitals Tracking

```javascript
// app/layout.js
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

// Custom web vitals reporting
export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    console.log(metric);
    
    // Send to analytics
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body: JSON.stringify(metric),
    });
  }
}
```

### 2. Performance Budget

```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: ['http://localhost:3000/', 'http://localhost:3000/products'],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
  },
};
```

### 3. Real User Monitoring (RUM)

```javascript
// lib/analytics.js
export function trackPerformance() {
  if (typeof window === 'undefined') return;
  
  // Navigation Timing
  window.addEventListener('load', () => {
    const perfData = window.performance.getEntriesByType('navigation')[0];
    
    const metrics = {
      dns: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcp: perfData.connectEnd - perfData.connectStart,
      ttfb: perfData.responseStart - perfData.requestStart,
      download: perfData.responseEnd - perfData.responseStart,
      domInteractive: perfData.domInteractive - perfData.fetchStart,
      domComplete: perfData.domComplete - perfData.fetchStart,
      loadComplete: perfData.loadEventEnd - perfData.fetchStart,
    };
    
    // Send to analytics
    sendToAnalytics('performance', metrics);
  });
}
```

## Performance Checklist

### Development

- [ ] Use Next.js Image component for all images
- [ ] Implement code splitting for large components
- [ ] Memoize expensive computations
- [ ] Use React.memo for pure components
- [ ] Avoid inline function definitions in JSX
- [ ] Implement virtual scrolling for long lists
- [ ] Lazy load below-the-fold content

### API

- [ ] Add database indexes for common queries
- [ ] Implement response caching
- [ ] Use field selection to reduce payload
- [ ] Implement pagination for list endpoints
- [ ] Enable compression
- [ ] Use connection pooling

### Deployment

- [ ] Configure CDN for static assets
- [ ] Enable edge functions where appropriate
- [ ] Set up ISR for semi-static pages
- [ ] Implement service worker for offline support
- [ ] Configure aggressive caching headers
- [ ] Enable HTTP/2 or HTTP/3

### Monitoring

- [ ] Track Core Web Vitals
- [ ] Set up performance budgets
- [ ] Monitor API response times
- [ ] Track error rates
- [ ] Set up alerts for performance degradation

---

*Document Version: 1.0.0*  
*Last Updated: 2025-11-10*  
*Owner: Performance Engineering Team*
