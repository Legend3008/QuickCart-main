# SmartBazar: Enterprise System Architecture

## Architecture Overview

SmartBazar employs a modern, cloud-native architecture built on microservices principles, event-driven patterns, and domain-driven design. The system is architected for extreme scalability, fault tolerance, and global deployment.

## Architecture Principles

### Core Tenets

1. **Domain-Driven Design (DDD)**: Business logic organized around bounded contexts
2. **Microservices Architecture**: Independently deployable, loosely coupled services
3. **Event-Driven Architecture (EDA)**: Asynchronous communication via event streams
4. **CQRS Pattern**: Separate read and write operations for optimal performance
5. **API-First Design**: All functionality exposed via versioned REST/GraphQL APIs
6. **Zero Trust Security**: Every request authenticated and authorized
7. **Cloud-Native**: Infrastructure as code, containerized deployments
8. **Observability by Default**: Comprehensive logging, monitoring, and tracing

## System Architecture Layers

### 1. Client Layer (Presentation Tier)

#### Web Application (Next.js 15 + React 19)
```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
├─────────────────────────────────────────────────────────┤
│  Next.js App Router (Server Components + Client)       │
│  • Server Components: SEO-optimized, data fetching     │
│  • Client Components: Interactive UI, state management │
│  • Streaming SSR: Progressive hydration                │
│  • Edge Runtime: Middleware, auth, rate limiting       │
├─────────────────────────────────────────────────────────┤
│  React 19 Features                                      │
│  • Server Actions: Form submissions, mutations         │
│  • Suspense Boundaries: Loading states                 │
│  • Concurrent Rendering: Non-blocking updates          │
├─────────────────────────────────────────────────────────┤
│  UI Framework                                           │
│  • Tailwind CSS: Utility-first styling                 │
│  • Framer Motion: Micro-interactions, animations       │
│  • Radix UI: Accessible component primitives           │
│  • shadcn/ui: Production-ready components              │
└─────────────────────────────────────────────────────────┘
```

**Performance Optimizations:**
- Code splitting per route (automatic with Next.js)
- Image optimization with next/image (WebP, AVIF)
- Font optimization with next/font
- Lazy loading for non-critical components
- Prefetching for anticipated navigation
- Service Worker for offline capabilities

**Accessibility:**
- WCAG 2.2 Level AA compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader optimization
- Focus management

### 2. CDN & Edge Layer

```
┌─────────────────────────────────────────────────────────┐
│                  Global CDN Layer                       │
├─────────────────────────────────────────────────────────┤
│  Vercel Edge Network                                    │
│  • 200+ edge locations globally                        │
│  • Static asset caching (images, CSS, JS)              │
│  • Edge middleware execution                           │
│  • DDoS protection                                      │
├─────────────────────────────────────────────────────────┤
│  Cloudflare (Optional Layer)                            │
│  • Additional CDN caching                               │
│  • Web Application Firewall (WAF)                       │
│  • Bot management                                       │
│  • Rate limiting                                        │
└─────────────────────────────────────────────────────────┘
```

### 3. API Gateway Layer

```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                          │
├─────────────────────────────────────────────────────────┤
│  Responsibilities                                       │
│  • Request routing and load balancing                  │
│  • Authentication & authorization                       │
│  • Rate limiting per client/endpoint                   │
│  • Request/response transformation                     │
│  • API versioning (v1, v2)                             │
│  • Circuit breaking                                     │
│  • Request validation                                   │
├─────────────────────────────────────────────────────────┤
│  Implementation (Next.js API Routes)                    │
│  /api/v1/products/*      → Product Service             │
│  /api/v1/users/*         → User Service                │
│  /api/v1/orders/*        → Order Service               │
│  /api/v1/payments/*      → Payment Service             │
│  /api/v1/vendors/*       → Vendor Service              │
│  /api/v1/delivery/*      → Logistics Service           │
│  /api/v1/analytics/*     → Analytics Service           │
└─────────────────────────────────────────────────────────┘
```

### 4. Application Services Layer (Business Logic)

#### Service Domains (Bounded Contexts)

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Product Service │  │   User Service   │  │  Order Service   │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ • CRUD products  │  │ • User profiles  │  │ • Order creation │
│ • Search/filter  │  │ • Authentication │  │ • Order tracking │
│ • Categories     │  │ • Authorization  │  │ • Order history  │
│ • Inventory sync │  │ • Cart management│  │ • Status updates │
│ • Price updates  │  │ • Wishlist       │  │ • Cancellations  │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Vendor Service  │  │ Payment Service  │  │ Logistics Service│
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ • Seller onboard │  │ • Payment proc.  │  │ • Route optimize │
│ • Store mgmt     │  │ • Refunds        │  │ • Agent assign   │
│ • Sales analytics│  │ • Wallet         │  │ • Delivery track │
│ • Payout mgmt    │  │ • Invoicing      │  │ • Proof delivery │
│ • Compliance     │  │ • Reconciliation │  │ • SLA monitoring │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Analytics Service│  │   AI/ML Service  │  │ Notification Svc │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ • User behavior  │  │ • Recommendations│  │ • Email (SES)    │
│ • Sales metrics  │  │ • Price optimize │  │ • SMS (Twilio)   │
│ • Platform health│  │ • Fraud detect   │  │ • Push (FCM)     │
│ • Business intel │  │ • Demand forecast│  │ • In-app alerts  │
│ • Reports        │  │ • Search relevnce│  │ • Webhooks       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### 5. Data Layer

#### Primary Database (MongoDB Atlas)

```
┌─────────────────────────────────────────────────────────┐
│              MongoDB Atlas (Primary Datastore)          │
├─────────────────────────────────────────────────────────┤
│  Collections (Document-Oriented)                        │
│  • users           → User profiles, auth data           │
│  • products        → Product catalog, inventory         │
│  • orders          → Order transactions, line items     │
│  • vendors         → Seller information, stores         │
│  • deliveries      → Delivery assignments, tracking     │
│  • payments        → Payment transactions, receipts     │
│  • reviews         → Product reviews, ratings           │
│  • analytics       → Event logs, user activities        │
├─────────────────────────────────────────────────────────┤
│  Optimization Features                                  │
│  • Compound indexes on frequently queried fields       │
│  • Text indexes for search capabilities                │
│  • TTL indexes for session/cache expiration            │
│  • Read replicas for read-heavy operations             │
│  • Sharding strategy for horizontal scaling            │
│  • Connection pooling (min: 10, max: 100)              │
├─────────────────────────────────────────────────────────┤
│  Backup & Recovery                                      │
│  • Continuous backup (Point-in-Time Recovery)          │
│  • Automated snapshots every 6 hours                   │
│  • Cross-region backup replication                     │
│  • 30-day retention policy                             │
└─────────────────────────────────────────────────────────┘
```

#### Caching Layer (Redis/Upstash)

```
┌─────────────────────────────────────────────────────────┐
│                  Redis Cache Layer                      │
├─────────────────────────────────────────────────────────┤
│  Use Cases                                              │
│  • Session storage (JWT tokens, user sessions)         │
│  • API response caching (5-60 min TTL)                 │
│  • Product catalog cache (hot products)                │
│  • Rate limiting counters                              │
│  • Real-time inventory counts                          │
│  • Shopping cart state                                  │
│  • Leaderboards (delivery agents)                      │
├─────────────────────────────────────────────────────────┤
│  Cache Strategies                                       │
│  • Cache-Aside: Read-through caching                   │
│  • Write-Through: Immediate cache updates              │
│  • Cache Invalidation: TTL + event-driven              │
│  • Distributed locking for concurrency                 │
└─────────────────────────────────────────────────────────┘
```

### 6. Event Streaming & Async Processing

```
┌─────────────────────────────────────────────────────────┐
│              Event Streaming (Inngest)                  │
├─────────────────────────────────────────────────────────┤
│  Event Types                                            │
│  • user.created        → Sync user, send welcome email │
│  • user.updated        → Update profile across services│
│  • order.created       → Process payment, notify vendor│
│  • order.confirmed     → Assign delivery, update inv.  │
│  • payment.completed   → Confirm order, send receipt   │
│  • product.updated     → Invalidate cache, reindex     │
│  • delivery.assigned   → Notify agent, create route    │
├─────────────────────────────────────────────────────────┤
│  Processing Patterns                                    │
│  • Fan-out: One event triggers multiple handlers       │
│  • Saga Pattern: Distributed transactions              │
│  • Retry Logic: Exponential backoff (3 retries)        │
│  • Dead Letter Queue: Failed events for analysis       │
│  • Event Replay: Reprocess events for debugging        │
└─────────────────────────────────────────────────────────┘
```

### 7. Authentication & Authorization

```
┌─────────────────────────────────────────────────────────┐
│              Auth Layer (Clerk)                         │
├─────────────────────────────────────────────────────────┤
│  Authentication Methods                                 │
│  • Email/Password                                       │
│  • Magic Links                                          │
│  • OAuth (Google, Apple, GitHub)                       │
│  • Multi-Factor Authentication (TOTP)                  │
├─────────────────────────────────────────────────────────┤
│  Authorization (RBAC)                                   │
│  Roles:                                                 │
│  • customer    → Browse, purchase, review              │
│  • seller      → Manage products, view analytics       │
│  • delivery    → View assignments, update status       │
│  • admin       → Full platform access                  │
│  • super_admin → System configuration                  │
├─────────────────────────────────────────────────────────┤
│  Session Management                                     │
│  • JWT tokens (access: 15min, refresh: 7days)         │
│  • Redis-backed session store                          │
│  • Automatic token rotation                            │
│  • Device fingerprinting                               │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

### 1. User Registration Flow

```
User → Next.js → Clerk → Webhook → Inngest → MongoDB
                                       ↓
                                  Welcome Email
```

### 2. Product Purchase Flow

```
Customer → Add to Cart → Checkout → Payment Gateway
    ↓                                    ↓
 Update Cache                      Payment Success
    ↓                                    ↓
  Redis                           Create Order (MongoDB)
                                         ↓
                                   Trigger Events
                                    ↓         ↓
                             Vendor Notif  Assign Delivery
```

### 3. Real-Time Inventory Sync

```
Vendor Updates → API → MongoDB Write → Event Emitted
                                            ↓
                                    Multiple Handlers
                                   ↓       ↓       ↓
                            Cache Clear  Reindex  Analytics
```

## Scalability Architecture

### Horizontal Scaling Strategy

```
┌─────────────────────────────────────────────────────────┐
│                  Load Balancing                         │
├─────────────────────────────────────────────────────────┤
│  Vercel Edge Network                                    │
│  • Automatic traffic distribution                       │
│  • Health checks every 30s                              │
│  • Failover to healthy regions                          │
│  • Session affinity (sticky sessions)                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              Auto-Scaling Configuration                 │
├─────────────────────────────────────────────────────────┤
│  Serverless Functions (Vercel)                          │
│  • Auto-scale based on request volume                   │
│  • Cold start optimization (<50ms)                      │
│  • Concurrent execution limits                          │
│  • Regional deployment (multi-region)                   │
├─────────────────────────────────────────────────────────┤
│  Database Scaling                                       │
│  • Read replicas for read-heavy operations             │
│  • Sharding for write distribution                      │
│  • Connection pooling                                   │
└─────────────────────────────────────────────────────────┘
```

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time (P95) | < 100ms | TBD |
| API Response Time (P99) | < 200ms | TBD |
| Time to First Byte | < 1.5s | TBD |
| Largest Contentful Paint | < 2.5s | TBD |
| Cumulative Layout Shift | < 0.1 | TBD |
| First Input Delay | < 100ms | TBD |

## Disaster Recovery & High Availability

### Multi-Region Deployment

```
Primary Region: us-east-1 (N. Virginia)
Secondary Region: eu-west-1 (Ireland)
Tertiary Region: ap-southeast-1 (Singapore)

RPO (Recovery Point Objective): < 5 minutes
RTO (Recovery Time Objective): < 15 minutes
```

### Backup Strategy

1. **Database Backups**
   - Continuous backup with point-in-time recovery
   - Automated snapshots every 6 hours
   - Cross-region replication
   - 30-day retention

2. **Application State**
   - Session data in Redis with replication
   - File uploads in S3 with versioning
   - Configuration in version control

3. **Disaster Recovery Plan**
   - Automated failover to secondary region
   - Database restore from latest snapshot
   - DNS failover (< 5 minutes)
   - Runbook for manual intervention

## Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Network Security                              │
│  • DDoS protection (Cloudflare/Vercel)                  │
│  • IP whitelisting for admin routes                     │
│  • Rate limiting per IP/user                            │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Application Security                          │
│  • Input validation & sanitization                      │
│  • SQL injection prevention (parameterized queries)     │
│  • XSS protection (Content Security Policy)             │
│  • CSRF tokens for state-changing operations            │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Authentication & Authorization                │
│  • JWT with short expiration (15min)                    │
│  • Refresh token rotation                               │
│  • Role-based access control (RBAC)                     │
│  • Multi-factor authentication                          │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Data Security                                 │
│  • Encryption at rest (AES-256)                         │
│  • Encryption in transit (TLS 1.3)                      │
│  • Sensitive data masking in logs                       │
│  • PCI DSS compliant payment processing                 │
└─────────────────────────────────────────────────────────┘
```

### Security Headers

```javascript
// Implemented in middleware.ts
{
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Content-Security-Policy': "default-src 'self'; ..."
}
```

## API Architecture

### RESTful API Design

```
Base URL: https://smartbazar.com/api/v1

Endpoints:
GET    /products              → List products (paginated)
GET    /products/:id          → Get product details
POST   /products              → Create product (seller)
PUT    /products/:id          → Update product (seller)
DELETE /products/:id          → Delete product (seller)

GET    /users/me              → Get current user
PUT    /users/me              → Update profile
GET    /users/me/orders       → List user orders
GET    /users/me/cart         → Get cart contents
POST   /users/me/cart         → Add to cart

POST   /orders                → Create order
GET    /orders/:id            → Get order details
PUT    /orders/:id/cancel     → Cancel order
GET    /orders/:id/tracking   → Get tracking info

POST   /payments              → Process payment
GET    /payments/:id          → Get payment status
POST   /payments/:id/refund   → Initiate refund
```

### API Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-11-10T17:14:24.806Z",
    "version": "1.0.0",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "The requested product does not exist",
    "details": {},
    "timestamp": "2025-11-10T17:14:24.806Z",
    "requestId": "req_abc123"
  }
}
```

## Observability Architecture

### Monitoring Stack

```
┌─────────────────────────────────────────────────────────┐
│               Vercel Analytics (Built-in)               │
│  • Real User Monitoring (RUM)                           │
│  • Core Web Vitals tracking                             │
│  • Function execution metrics                           │
│  • Error tracking                                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│          External Monitoring (Future)                   │
│  • Sentry: Error tracking & performance                │
│  • Datadog: Infrastructure monitoring                   │
│  • LogRocket: Session replay                            │
└─────────────────────────────────────────────────────────┘
```

### Logging Strategy

```
┌─────────────────────────────────────────────────────────┐
│                 Structured Logging                      │
├─────────────────────────────────────────────────────────┤
│  Log Levels                                             │
│  • ERROR:   System failures, exceptions                │
│  • WARN:    Degraded performance, retries              │
│  • INFO:    Business events, API calls                 │
│  • DEBUG:   Detailed execution flow                    │
├─────────────────────────────────────────────────────────┤
│  Log Format (JSON)                                      │
│  {                                                      │
│    "timestamp": "ISO-8601",                            │
│    "level": "ERROR",                                    │
│    "service": "product-service",                       │
│    "requestId": "req_abc123",                          │
│    "userId": "user_xyz",                               │
│    "message": "Product not found",                     │
│    "context": { ... }                                   │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                  GitHub Actions                         │
├─────────────────────────────────────────────────────────┤
│  1. Code Push to GitHub                                 │
│  2. Run linters (ESLint, Prettier)                     │
│  3. Run type checking (TypeScript)                     │
│  4. Run unit tests                                      │
│  5. Build Next.js application                          │
│  6. Run integration tests                               │
│  7. Security scanning (Snyk)                           │
│  8. Deploy to Vercel (preview/production)              │
│  9. Run smoke tests                                     │
│  10. Notify team (Slack)                               │
└─────────────────────────────────────────────────────────┘
```

### Environment Strategy

```
Development  → localhost:3000
Preview      → pr-123.smartbazar.vercel.app
Staging      → staging.smartbazar.com
Production   → smartbazar.com
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 + React 19 | SSR, routing, rendering |
| Styling | Tailwind CSS | Utility-first CSS |
| Animation | Framer Motion | Micro-interactions |
| Auth | Clerk | User authentication |
| Database | MongoDB Atlas | Primary datastore |
| Cache | Redis/Upstash | Session, API caching |
| Events | Inngest | Async processing |
| Storage | Cloudinary | Image hosting |
| Deployment | Vercel | Hosting, edge functions |
| Monitoring | Vercel Analytics | Performance tracking |
| Email | SendGrid/SES | Transactional emails |

## Future Architecture Evolution

### Phase 1 (Current)
- Monolithic Next.js app with API routes
- MongoDB for all data
- Clerk for authentication
- Vercel deployment

### Phase 2 (6-12 months)
- Extract microservices (Recommendations, Analytics)
- Add GraphQL layer for complex queries
- Implement full-text search (Algolia/Elasticsearch)
- Add real-time features (WebSocket/Server-Sent Events)

### Phase 3 (12-24 months)
- Kubernetes orchestration for microservices
- Service mesh (Istio) for inter-service communication
- Event sourcing for order management
- Machine learning pipeline deployment

---

*Document Version: 1.0.0*  
*Last Updated: 2025-11-10*  
*Owner: Engineering Architecture Team*
