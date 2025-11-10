# SmartBazar: Security & Compliance Documentation

## Security Architecture Overview

SmartBazar implements a defense-in-depth security strategy following Zero Trust principles, OWASP Top 10 guidelines, and industry best practices for e-commerce platforms.

## Zero Trust Architecture

### Core Principles

1. **Never Trust, Always Verify**: Every request is authenticated and authorized
2. **Least Privilege Access**: Users and services have minimum necessary permissions
3. **Assume Breach**: Design for containment and rapid recovery
4. **Verify Explicitly**: Use all available data points for access decisions

### Implementation

```
┌─────────────────────────────────────────────────────────┐
│                   Zero Trust Layers                     │
├─────────────────────────────────────────────────────────┤
│  Layer 1: Identity Verification (Clerk)                │
│  • Multi-factor authentication                          │
│  • Device fingerprinting                                │
│  • Behavioral analysis                                  │
├─────────────────────────────────────────────────────────┤
│  Layer 2: Request Authorization                         │
│  • JWT token validation                                 │
│  • Role-based access control (RBAC)                     │
│  • Resource-level permissions                           │
├─────────────────────────────────────────────────────────┤
│  Layer 3: Network Security                              │
│  • TLS 1.3 encryption                                   │
│  • DDoS protection                                      │
│  • Web Application Firewall (WAF)                       │
├─────────────────────────────────────────────────────────┤
│  Layer 4: Data Protection                               │
│  • Encryption at rest (AES-256)                         │
│  • Encryption in transit (TLS 1.3)                      │
│  • Key rotation policies                                │
└─────────────────────────────────────────────────────────┘
```

## Authentication & Authorization

### JWT Token Management

#### Token Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_123",
    "email": "user@example.com",
    "role": "customer",
    "iat": 1699564800,
    "exp": 1699565700,
    "jti": "token_unique_id"
  }
}
```

#### Token Lifecycle

1. **Issue**: On successful authentication
2. **Validate**: On every API request
3. **Refresh**: Before expiration (sliding window)
4. **Revoke**: On logout or security event

#### Secure Token Storage

**Client-Side:**
```javascript
// DO NOT store in localStorage (XSS vulnerable)
// ❌ localStorage.setItem('token', token);

// Store in httpOnly cookie (recommended)
// Set via server-side Set-Cookie header
Set-Cookie: auth_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=900
```

**Server-Side:**
```javascript
// Validate token on every request
import { getAuth } from '@clerk/nextjs/server';

export async function authenticateRequest(request) {
  const { userId } = getAuth(request);
  
  if (!userId) {
    throw new UnauthorizedError('Invalid or missing token');
  }
  
  return userId;
}
```

### Role-Based Access Control (RBAC)

#### Role Hierarchy

```
super_admin (Full platform access)
    ↓
admin (Platform management)
    ↓
seller (Vendor operations)
    ↓
delivery (Logistics operations)
    ↓
customer (Shopping & orders)
```

#### Permission Matrix

| Resource | Customer | Seller | Delivery | Admin |
|----------|----------|--------|----------|-------|
| View Products | ✓ | ✓ | ✓ | ✓ |
| Create Product | ✗ | ✓ | ✗ | ✓ |
| Edit Own Product | ✗ | ✓ | ✗ | ✓ |
| Edit Any Product | ✗ | ✗ | ✗ | ✓ |
| Place Order | ✓ | ✓ | ✗ | ✓ |
| View Own Orders | ✓ | ✗ | ✗ | ✓ |
| View All Orders | ✗ | View Own | Assigned | ✓ |
| Manage Deliveries | ✗ | ✗ | ✓ | ✓ |
| View Analytics | ✗ | Own Data | Own Data | ✓ |
| Manage Users | ✗ | ✗ | ✗ | ✓ |

#### Implementation

```typescript
// lib/rbac.ts
export const permissions = {
  'product:create': ['seller', 'admin'],
  'product:update': ['seller', 'admin'],
  'product:delete': ['seller', 'admin'],
  'order:view_all': ['admin'],
  'user:manage': ['admin', 'super_admin']
};

export function hasPermission(
  userRole: string,
  permission: string
): boolean {
  return permissions[permission]?.includes(userRole) ?? false;
}

// Middleware usage
export async function requirePermission(
  request: Request,
  permission: string
) {
  const { userId } = getAuth(request);
  const user = await getUserById(userId);
  
  if (!hasPermission(user.role, permission)) {
    throw new ForbiddenError('Insufficient permissions');
  }
}
```

## Input Validation & Sanitization

### Server-Side Validation

```typescript
// lib/validation.ts
import { z } from 'zod';

// Product creation schema
export const createProductSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(200, 'Name cannot exceed 200 characters')
    .trim(),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
  
  price: z.number()
    .positive('Price must be positive')
    .max(1000000, 'Price cannot exceed 1,000,000'),
  
  offerPrice: z.number()
    .positive('Offer price must be positive')
    .optional(),
  
  category: z.enum([
    'Electronics',
    'Fashion',
    'Home',
    'Books',
    'Sports'
  ]),
  
  images: z.array(z.string().url())
    .min(1, 'At least one image required')
    .max(10, 'Maximum 10 images allowed')
});

// Validate in API route
export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const validated = createProductSchema.parse(body);
    // Proceed with validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input parameters',
          details: error.errors
        }
      }, { status: 400 });
    }
  }
}
```

### XSS Protection

```typescript
// Sanitize HTML content
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'li'],
    ALLOWED_ATTR: []
  });
}

// Usage
const cleanDescription = sanitizeHtml(userInput);
```

### SQL/NoSQL Injection Prevention

```typescript
// ✓ SAFE: Using parameterized queries
await Product.find({
  userId: sellerId,
  status: 'active'
});

// ✓ SAFE: Using Mongoose schema validation
const product = new Product({
  name: sanitizedName,
  price: validatedPrice
});

// ❌ UNSAFE: String concatenation
// await db.collection.find(`{ userId: "${userId}" }`);
```

## OWASP Top 10 Protection

### 1. Broken Access Control

**Protection:**
- Every API route validates authentication
- Role-based permission checks
- Resource ownership verification

```typescript
// Verify user owns resource
export async function updateProduct(productId: string, userId: string) {
  const product = await Product.findById(productId);
  
  if (product.userId !== userId) {
    throw new ForbiddenError('Cannot modify another seller\'s product');
  }
  
  // Proceed with update
}
```

### 2. Cryptographic Failures

**Protection:**
- TLS 1.3 for all connections
- AES-256 encryption at rest
- No sensitive data in logs
- Secure password hashing (Clerk managed)

```typescript
// Sensitive data masking in logs
function logUserAction(user: User) {
  logger.info({
    userId: user._id,
    email: maskEmail(user.email),  // user@example.com → u***@example.com
    action: 'profile_updated'
  });
}
```

### 3. Injection

**Protection:**
- Parameterized queries only
- Input validation with Zod
- Content Security Policy headers
- NoSQL injection prevention

```typescript
// Content Security Policy
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.clerk.dev"
  ].join('; ')
};
```

### 4. Insecure Design

**Protection:**
- Threat modeling for all features
- Security requirements in design phase
- Secure defaults (opt-in, not opt-out)
- Rate limiting on all endpoints

```typescript
// Rate limiting implementation
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true
});

export async function rateLimit(identifier: string) {
  const { success, limit, remaining } = await ratelimit.limit(identifier);
  
  if (!success) {
    throw new RateLimitError('Too many requests');
  }
  
  return { limit, remaining };
}
```

### 5. Security Misconfiguration

**Protection:**
- Secure headers on all responses
- No default credentials
- Minimal error information exposure
- Regular dependency updates

```typescript
// middleware.ts - Security headers
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  return response;
}
```

### 6. Vulnerable Components

**Protection:**
- Automated dependency scanning (Dependabot)
- Regular security updates
- No deprecated packages
- Minimal dependency footprint

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### 7. Identification and Authentication Failures

**Protection:**
- Strong password requirements (Clerk managed)
- Multi-factor authentication support
- Session timeout after 15 minutes
- Account lockout after failed attempts

### 8. Software and Data Integrity Failures

**Protection:**
- Integrity checks on packages (package-lock.json)
- Signed commits (git commit -S)
- CI/CD pipeline validation
- Immutable audit logs

### 9. Security Logging and Monitoring Failures

**Protection:**
- Comprehensive logging of security events
- Real-time alerts for suspicious activity
- Centralized log aggregation
- Regular log review

```typescript
// Security event logging
export function logSecurityEvent(event: SecurityEvent) {
  logger.security({
    eventType: event.type,
    severity: event.severity,
    userId: event.userId,
    ipAddress: event.ipAddress,
    userAgent: event.userAgent,
    timestamp: new Date().toISOString(),
    details: event.details
  });
  
  // Alert on critical events
  if (event.severity === 'critical') {
    alertSecurityTeam(event);
  }
}

// Usage
logSecurityEvent({
  type: 'UNAUTHORIZED_ACCESS_ATTEMPT',
  severity: 'high',
  userId: 'user_123',
  ipAddress: '203.0.113.42',
  details: {
    resource: '/api/admin/users',
    method: 'GET'
  }
});
```

### 10. Server-Side Request Forgery (SSRF)

**Protection:**
- Whitelist allowed domains
- Validate and sanitize URLs
- No user-controlled redirects
- Network segmentation

```typescript
// URL validation
const ALLOWED_DOMAINS = [
  'res.cloudinary.com',
  'api.smartbazar.com'
];

export function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some(domain => 
      parsed.hostname === domain || 
      parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}
```

## Data Protection & Privacy

### Encryption Standards

#### At Rest
- **Algorithm**: AES-256-GCM
- **Key Management**: MongoDB encryption keys
- **Scope**: All sensitive user data

#### In Transit
- **Protocol**: TLS 1.3
- **Cipher Suites**: Strong ciphers only (AES-GCM)
- **Certificate**: Let's Encrypt (auto-renewed)

### Personal Data Handling

```typescript
// Data classification
export enum DataClassification {
  PUBLIC = 'public',           // Product listings, reviews
  INTERNAL = 'internal',       // Analytics, logs
  CONFIDENTIAL = 'confidential', // User profiles
  RESTRICTED = 'restricted'    // Payment info, passwords
}

// Sensitive fields
const SENSITIVE_FIELDS = [
  'password',
  'bankAccount',
  'panNumber',
  'gstNumber',
  'cardNumber',
  'cvv'
];

// Redact sensitive data in logs
export function redactSensitiveData(data: any) {
  const redacted = { ...data };
  
  SENSITIVE_FIELDS.forEach(field => {
    if (redacted[field]) {
      redacted[field] = '[REDACTED]';
    }
  });
  
  return redacted;
}
```

### GDPR Compliance

#### User Rights Implementation

1. **Right to Access**
```typescript
// GET /api/v1/users/me/data-export
export async function exportUserData(userId: string) {
  const user = await User.findById(userId);
  const orders = await Order.find({ userId });
  const reviews = await Review.find({ userId });
  
  return {
    personalInfo: user,
    orderHistory: orders,
    reviews: reviews
  };
}
```

2. **Right to Erasure**
```typescript
// DELETE /api/v1/users/me
export async function deleteUserData(userId: string) {
  // Anonymize instead of hard delete (for order history)
  await User.findByIdAndUpdate(userId, {
    email: `deleted_${userId}@example.com`,
    name: 'Deleted User',
    status: 'deleted',
    deletedAt: new Date()
  });
  
  // Remove from Clerk
  await clerkClient.users.deleteUser(userId);
}
```

3. **Right to Portability**
```typescript
// Export in machine-readable format (JSON)
export async function exportPortableData(userId: string) {
  const data = await exportUserData(userId);
  return JSON.stringify(data, null, 2);
}
```

### PCI DSS Compliance

#### Payment Data Handling

```typescript
// ✓ COMPLIANT: Never store card details
// Payment processing delegated to PCI-compliant providers

// Store only payment reference
export interface PaymentRecord {
  transactionId: string;        // ✓ OK to store
  provider: string;              // ✓ OK to store
  last4: string;                 // ✓ OK to store (last 4 digits)
  cardBrand: string;             // ✓ OK to store
  // ❌ NEVER store: full card number, CVV, expiry date
}

// Tokenization approach
export async function processPayment(paymentDetails: any) {
  // Send to payment gateway (Razorpay/Stripe)
  const token = await paymentGateway.tokenize(paymentDetails);
  
  // Use token for transaction
  const result = await paymentGateway.charge({
    token: token,
    amount: orderTotal
  });
  
  // Store only transaction reference
  return {
    transactionId: result.id,
    status: result.status
  };
}
```

## Security Monitoring & Incident Response

### Security Monitoring

```typescript
// Real-time security monitoring
export const securityMetrics = {
  // Failed login attempts
  failedLogins: new Counter({
    name: 'failed_login_attempts',
    help: 'Number of failed login attempts',
    labelNames: ['userId', 'ipAddress']
  }),
  
  // Unauthorized access attempts
  unauthorizedAccess: new Counter({
    name: 'unauthorized_access_attempts',
    help: 'Number of unauthorized access attempts',
    labelNames: ['endpoint', 'userId']
  }),
  
  // API rate limit hits
  rateLimitHits: new Counter({
    name: 'rate_limit_hits',
    help: 'Number of rate limit violations',
    labelNames: ['endpoint', 'ipAddress']
  })
};
```

### Incident Response Plan

#### Phase 1: Detection & Analysis
1. Monitor alerts from security systems
2. Verify incident severity
3. Assemble incident response team

#### Phase 2: Containment
1. Isolate affected systems
2. Revoke compromised credentials
3. Block malicious IP addresses

#### Phase 3: Eradication
1. Remove malware/backdoors
2. Patch vulnerabilities
3. Update security rules

#### Phase 4: Recovery
1. Restore from clean backups
2. Verify system integrity
3. Monitor for re-infection

#### Phase 5: Post-Incident
1. Document lessons learned
2. Update security procedures
3. Implement preventive measures

### Security Contacts

```
Security Team: security@smartbazar.com
Vulnerability Reports: security-reports@smartbazar.com
Emergency Hotline: +91-XXXX-XXXX-XX
```

## Compliance Certifications

### Target Certifications

- [ ] SOC 2 Type II (Security & Availability)
- [ ] ISO 27001 (Information Security)
- [ ] PCI DSS Level 1 (Payment Card Industry)
- [ ] GDPR Compliant (Data Protection)
- [ ] CCPA Compliant (California Privacy)

### Compliance Checklist

#### SOC 2 Requirements
- [x] Access controls implemented
- [x] Encryption at rest and in transit
- [x] Audit logging enabled
- [ ] Third-party audit completed
- [ ] Penetration testing performed

#### PCI DSS Requirements
- [x] No storage of sensitive card data
- [x] Use of PCI-compliant payment processors
- [x] Network segmentation
- [ ] Quarterly vulnerability scans
- [ ] Annual penetration testing

## Security Best Practices for Developers

### Code Review Checklist

- [ ] Input validation on all user inputs
- [ ] Output encoding to prevent XSS
- [ ] Parameterized queries only
- [ ] Authentication checks on protected routes
- [ ] Authorization checks for resource access
- [ ] Sensitive data not in logs
- [ ] Error messages don't leak information
- [ ] Rate limiting on endpoints
- [ ] HTTPS only (no HTTP)
- [ ] Secure headers configured

### Secure Coding Guidelines

```typescript
// ✓ GOOD: Validate input
const validated = schema.parse(userInput);

// ✓ GOOD: Sanitize output
const clean = DOMPurify.sanitize(userContent);

// ✓ GOOD: Use parameterized queries
const user = await User.findById(userId);

// ✓ GOOD: Hash sensitive data
const hashed = await bcrypt.hash(password, 12);

// ✓ GOOD: Use secure random
const token = crypto.randomBytes(32).toString('hex');

// ❌ BAD: String concatenation in queries
// const query = `SELECT * FROM users WHERE id = ${userId}`;

// ❌ BAD: Storing passwords in plain text
// user.password = password;
```

---

*Document Version: 1.0.0*  
*Last Updated: 2025-11-10*  
*Owner: Security & Compliance Team*  
*Classification: Internal*
