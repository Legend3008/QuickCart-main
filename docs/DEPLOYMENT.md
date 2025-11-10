# SmartBazar: Deployment & Infrastructure Guide

## Deployment Architecture

SmartBazar is deployed on Vercel's Edge Network with serverless functions, providing global distribution, automatic scaling, and zero-downtime deployments.

## Deployment Strategy

### Environment Strategy

```
┌──────────────────────────────────────────────────────────┐
│                    Environment Tiers                     │
├──────────────────────────────────────────────────────────┤
│  Development (Local)                                     │
│  • localhost:3000                                        │
│  • Local MongoDB or Atlas Dev                           │
│  • Mock payment gateway                                  │
│  • Debug logging enabled                                 │
├──────────────────────────────────────────────────────────┤
│  Preview (PR Deployments)                                │
│  • pr-{number}.smartbazar.vercel.app                    │
│  • Staging database                                      │
│  • Isolated environment per PR                           │
│  • Automatic deployment on PR                            │
├──────────────────────────────────────────────────────────┤
│  Staging                                                 │
│  • staging.smartbazar.com                               │
│  • Production-like environment                           │
│  • Staging database with production data clone          │
│  • Full integration testing                              │
├──────────────────────────────────────────────────────────┤
│  Production                                              │
│  • smartbazar.com                                       │
│  • Production database with backups                      │
│  • Real payment processing                               │
│  • Performance monitoring                                │
└──────────────────────────────────────────────────────────┘
```

## Vercel Configuration

### Project Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Set up environment variables
vercel env pull .env.local
```

### vercel.json Configuration

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "installCommand": "npm install",
  "regions": ["iad1", "sfo1", "cdg1", "hnd1", "sin1"],
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

### Environment Variables

#### Required Variables

```bash
# Application
NEXT_PUBLIC_APP_URL=https://smartbazar.com
NEXT_PUBLIC_CURRENCY=INR

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Event Processing (Inngest)
INNGEST_EVENT_KEY=your_inngest_key
INNGEST_SIGNING_KEY=your_signing_key

# Payment Gateway (Production)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
# OR
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Email Service
SENDGRID_API_KEY=your_sendgrid_key
# OR
AWS_SES_ACCESS_KEY=your_access_key
AWS_SES_SECRET_KEY=your_secret_key
AWS_SES_REGION=us-east-1

# Monitoring (Optional)
SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=your_token

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
        env:
          NODE_ENV: test

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [lint, type-check, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          NODE_ENV: production

  deploy-preview:
    name: Deploy Preview
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy to Vercel
        id: deploy
        run: |
          url=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT
      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `✅ Preview deployment ready: ${{ steps.deploy.outputs.url }}`
            })

  deploy-staging:
    name: Deploy Staging
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    needs: [build, security-scan]
    steps:
      - uses: actions/checkout@v4
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy to Staging
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    name: Deploy Production
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: [build, security-scan]
    environment:
      name: production
      url: https://smartbazar.com
    steps:
      - uses: actions/checkout@v4
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy to Production
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Notify Success
        if: success()
        run: |
          echo "🚀 Deployment successful!"
          # Add Slack notification here
```

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] All tests passing
- [ ] Security scan passed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Changelog prepared

### Deployment

- [ ] Code merged to main branch
- [ ] CI/CD pipeline triggered
- [ ] Build successful
- [ ] Automated tests passed
- [ ] Preview deployment verified

### Post-Deployment

- [ ] Production deployment verified
- [ ] Health checks passing
- [ ] Error monitoring active
- [ ] Performance metrics normal
- [ ] User acceptance testing
- [ ] Rollback plan ready

## Rollback Strategy

### Automatic Rollback

Vercel automatically maintains previous deployments and allows instant rollback:

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url> --prod
```

### Manual Rollback

```bash
# Option 1: Revert git commit
git revert <commit-hash>
git push origin main

# Option 2: Deploy previous version
vercel deploy --prod <previous-deployment-url>
```

## Performance Optimization

### Build Optimization

```javascript
// next.config.mjs
export default {
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};
```

### Edge Configuration

```javascript
// app/api/product/list/route.js
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // ISR: Revalidate every 60 seconds
```

## Monitoring & Alerting

### Health Check Endpoint

```javascript
// app/api/health/route.js
import connectDB from '@/config/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {}
  };
  
  // Database check
  try {
    await connectDB();
    health.checks.database = 'healthy';
  } catch (error) {
    health.checks.database = 'unhealthy';
    health.status = 'degraded';
  }
  
  // Add more checks (Redis, external APIs, etc.)
  
  return NextResponse.json(health, {
    status: health.status === 'healthy' ? 200 : 503
  });
}
```

### Vercel Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics
```

```javascript
// app/layout.js
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Scaling Considerations

### Serverless Function Limits

- **Execution Time**: 30 seconds (Pro), 60 seconds (Enterprise)
- **Memory**: 1024 MB default, up to 3008 MB
- **Payload Size**: 4.5 MB request, 6 MB response
- **Concurrent Executions**: Auto-scaled based on traffic

### Database Scaling

```javascript
// Connection pool configuration
const opts = {
  maxPoolSize: 100,    // Increase for high traffic
  minPoolSize: 10,     // Minimum connections
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000
};
```

### Caching Strategy

```javascript
// Static page caching
export const revalidate = 3600; // 1 hour

// API route caching
export async function GET(request) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });
}
```

## Disaster Recovery

### Backup Strategy

1. **Database Backups**
   - Automated daily backups (MongoDB Atlas)
   - Point-in-time recovery (48 hours)
   - Cross-region replication

2. **Application State**
   - Git repository (source of truth)
   - Environment variables (Vercel dashboard)
   - Deployment history (Vercel automatic)

3. **Recovery Time Objectives**
   - RPO (Recovery Point Objective): 5 minutes
   - RTO (Recovery Time Objective): 15 minutes

### Incident Response

1. **Detection** → Automated monitoring alerts
2. **Assessment** → Check logs and metrics
3. **Communication** → Notify stakeholders
4. **Resolution** → Rollback or hotfix
5. **Post-Mortem** → Document and improve

---

*Document Version: 1.0.0*  
*Last Updated: 2025-11-10*  
*Owner: DevOps & Platform Engineering*
