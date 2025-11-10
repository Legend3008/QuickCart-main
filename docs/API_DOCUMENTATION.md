# SmartBazar: API Documentation

## API Overview

SmartBazar provides a comprehensive RESTful API for all platform operations. All APIs follow consistent conventions, use JSON for request/response bodies, and implement industry-standard authentication and rate limiting.

## Base URLs

```
Production:  https://smartbazar.com/api/v1
Staging:     https://staging.smartbazar.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication

### Bearer Token Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### Obtaining Tokens

Tokens are issued by Clerk authentication service:
- Access Token: 15-minute expiration
- Refresh Token: 7-day expiration

## Rate Limiting

| Tier | Requests/minute | Requests/hour |
|------|----------------|---------------|
| Anonymous | 60 | 1,000 |
| Authenticated | 300 | 10,000 |
| Seller | 600 | 20,000 |
| Admin | Unlimited | Unlimited |

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 285
X-RateLimit-Reset: 1699564800
```

## Standard Response Format

### Success Response

```json
{
  "success": true,
  "data": { },
  "meta": {
    "timestamp": "2025-11-10T17:14:24.806Z",
    "version": "1.0.0",
    "requestId": "req_abc123xyz"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "price",
      "reason": "Price must be a positive number"
    },
    "timestamp": "2025-11-10T17:14:24.806Z",
    "requestId": "req_abc123xyz"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (duplicate) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Temporary service outage |

## Pagination

List endpoints support cursor-based pagination:

### Request Parameters
```
?page=1&limit=20&sort=-createdAt
```

### Response Format
```json
{
  "success": true,
  "data": [ ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## API Endpoints

### Products API

#### List Products

```http
GET /api/v1/products
```

**Query Parameters:**
- `category` (string): Filter by category
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `search` (string): Search in name/description
- `sort` (string): Sort field (createdAt, price, rating)
- `order` (string): Sort order (asc, desc)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "prod_123",
        "name": "Wireless Headphones",
        "description": "Premium noise-canceling headphones",
        "price": {
          "original": 2999,
          "current": 2499,
          "currency": "INR"
        },
        "category": {
          "primary": "Electronics",
          "tags": ["audio", "wireless"]
        },
        "images": [
          {
            "url": "https://...",
            "isPrimary": true
          }
        ],
        "inventory": {
          "quantity": 50,
          "inStock": true
        },
        "metrics": {
          "averageRating": 4.5,
          "reviewCount": 128
        },
        "createdAt": "2025-11-10T10:00:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}
```

#### Get Product Details

```http
GET /api/v1/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "prod_123",
      "name": "Wireless Headphones",
      "description": "Detailed product description...",
      "price": {
        "original": 2999,
        "current": 2499
      },
      "category": {
        "primary": "Electronics"
      },
      "images": [ ],
      "specifications": {
        "brand": "AudioTech",
        "warranty": "1 year"
      },
      "seller": {
        "id": "seller_456",
        "name": "TechStore",
        "rating": 4.8
      }
    }
  }
}
```

#### Create Product (Seller Only)

```http
POST /api/v1/products
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
name: "New Product"
description: "Product description"
category: "Electronics"
price: 2999
offerPrice: 2499
images: <file1>, <file2>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "prod_new",
      "name": "New Product",
      "status": "draft"
    }
  },
  "message": "Product created successfully"
}
```

#### Update Product (Seller Only)

```http
PUT /api/v1/products/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 2799,
  "inventory": {
    "quantity": 100
  }
}
```

#### Delete Product (Seller Only)

```http
DELETE /api/v1/products/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### User API

#### Get Current User

```http
GET /api/v1/users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "cartItems": {
        "prod_123": 2
      },
      "addresses": [ ]
    }
  }
}
```

#### Update User Profile

```http
PUT /api/v1/users/me
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": {
    "number": "+911234567890"
  },
  "preferences": {
    "language": "en",
    "notifications": {
      "email": true,
      "push": true
    }
  }
}
```

#### Add Address

```http
POST /api/v1/users/me/addresses
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "home",
  "isDefault": true,
  "name": "John Doe",
  "phone": "+911234567890",
  "addressLine1": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "IN"
}
```

#### Update Address

```http
PUT /api/v1/users/me/addresses/:addressId
Authorization: Bearer <token>
```

#### Delete Address

```http
DELETE /api/v1/users/me/addresses/:addressId
Authorization: Bearer <token>
```

### Cart API

#### Get Cart

```http
GET /api/v1/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [
        {
          "productId": "prod_123",
          "product": {
            "name": "Wireless Headphones",
            "price": 2499,
            "image": "https://..."
          },
          "quantity": 2,
          "subtotal": 4998
        }
      ],
      "summary": {
        "subtotal": 4998,
        "tax": 899.64,
        "shippingFee": 0,
        "total": 5897.64
      }
    }
  }
}
```

#### Add to Cart

```http
POST /api/v1/cart/items
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "prod_123",
  "quantity": 1
}
```

#### Update Cart Item

```http
PUT /api/v1/cart/items/:productId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

#### Remove from Cart

```http
DELETE /api/v1/cart/items/:productId
Authorization: Bearer <token>
```

#### Clear Cart

```http
DELETE /api/v1/cart
Authorization: Bearer <token>
```

### Orders API

#### Create Order

```http
POST /api/v1/orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2
    }
  ],
  "shippingAddressId": "addr_456",
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "order_789",
      "orderNumber": "ORD-2025-001234",
      "status": "pending_payment",
      "pricing": {
        "total": 5897.64
      },
      "payment": {
        "method": "card",
        "status": "pending"
      }
    }
  }
}
```

#### Get Order Details

```http
GET /api/v1/orders/:orderId
Authorization: Bearer <token>
```

#### List User Orders

```http
GET /api/v1/orders
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string): Filter by order status
- `page` (number): Page number
- `limit` (number): Items per page

#### Cancel Order

```http
POST /api/v1/orders/:orderId/cancel
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Changed my mind",
  "comments": "Optional comments"
}
```

#### Track Order

```http
GET /api/v1/orders/:orderId/tracking
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tracking": {
      "orderNumber": "ORD-2025-001234",
      "status": "out_for_delivery",
      "estimatedDelivery": "2025-11-12T18:00:00Z",
      "currentLocation": {
        "city": "Mumbai",
        "coordinates": {
          "lat": 19.0760,
          "lng": 72.8777
        }
      },
      "history": [
        {
          "status": "confirmed",
          "timestamp": "2025-11-10T10:00:00Z",
          "location": "Mumbai Warehouse"
        },
        {
          "status": "shipped",
          "timestamp": "2025-11-11T08:00:00Z",
          "location": "Mumbai Sorting Center"
        },
        {
          "status": "out_for_delivery",
          "timestamp": "2025-11-12T09:00:00Z",
          "location": "Local Delivery Hub"
        }
      ],
      "deliveryAgent": {
        "name": "Raj Kumar",
        "phone": "+919876543210"
      }
    }
  }
}
```

### Reviews API

#### List Product Reviews

```http
GET /api/v1/products/:productId/reviews
```

**Query Parameters:**
- `rating` (number): Filter by rating (1-5)
- `verified` (boolean): Verified purchases only
- `sort` (string): Sort by (recent, helpful, rating)

#### Create Review

```http
POST /api/v1/products/:productId/reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Really satisfied with the quality and delivery.",
  "orderId": "order_789"
}
```

#### Mark Review Helpful

```http
POST /api/v1/reviews/:reviewId/helpful
Authorization: Bearer <token>
```

### Search API

#### Search Products

```http
GET /api/v1/search
```

**Query Parameters:**
- `q` (string): Search query
- `category` (string): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `rating` (number): Minimum rating

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [ ],
    "suggestions": [
      "wireless headphones",
      "bluetooth headphones"
    ],
    "filters": {
      "categories": [
        { "name": "Electronics", "count": 45 }
      ],
      "priceRanges": [
        { "min": 0, "max": 1000, "count": 12 }
      ]
    }
  }
}
```

### Seller API

#### Get Seller Dashboard

```http
GET /api/v1/seller/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalProducts": 45,
      "totalOrders": 230,
      "totalRevenue": 456789.50,
      "pendingOrders": 12,
      "averageRating": 4.7
    },
    "recentOrders": [ ],
    "lowStockProducts": [ ]
  }
}
```

#### List Seller Products

```http
GET /api/v1/seller/products
Authorization: Bearer <token>
```

#### Get Sales Analytics

```http
GET /api/v1/seller/analytics
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (date): Start date for analytics
- `endDate` (date): End date for analytics
- `granularity` (string): day, week, month

### Admin API

#### Get Platform Statistics

```http
GET /api/v1/admin/statistics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 15000,
      "active": 8500,
      "new": 250
    },
    "orders": {
      "total": 12000,
      "completed": 10500,
      "pending": 1200,
      "cancelled": 300
    },
    "revenue": {
      "total": 5678900,
      "thisMonth": 456789,
      "growth": 12.5
    }
  }
}
```

## Webhooks

SmartBazar supports webhooks for real-time event notifications:

### Supported Events

- `order.created`
- `order.confirmed`
- `order.shipped`
- `order.delivered`
- `payment.completed`
- `payment.failed`
- `product.low_stock`

### Webhook Payload

```json
{
  "event": "order.confirmed",
  "timestamp": "2025-11-10T17:14:24.806Z",
  "data": {
    "orderId": "order_789",
    "orderNumber": "ORD-2025-001234"
  },
  "signature": "sha256=..."
}
```

## SDK & Client Libraries

### JavaScript/TypeScript

```bash
npm install @smartbazar/api-client
```

```typescript
import { SmartBazarClient } from '@smartbazar/api-client';

const client = new SmartBazarClient({
  apiKey: process.env.SMARTBAZAR_API_KEY,
  environment: 'production'
});

// Get products
const products = await client.products.list({
  category: 'Electronics',
  limit: 20
});

// Create order
const order = await client.orders.create({
  items: [{ productId: 'prod_123', quantity: 2 }],
  shippingAddressId: 'addr_456'
});
```

## Best Practices

### 1. Error Handling

Always check the `success` field in responses:

```typescript
const response = await fetch('/api/v1/products');
const data = await response.json();

if (!data.success) {
  console.error(data.error.message);
  // Handle error based on error.code
}
```

### 2. Rate Limiting

Implement exponential backoff for rate limit errors:

```typescript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const delay = Math.pow(2, i) * 1000;
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
}
```

### 3. Pagination

Always handle pagination for list endpoints:

```typescript
async function getAllProducts() {
  const allProducts = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await client.products.list({ page, limit: 100 });
    allProducts.push(...response.data.products);
    hasMore = response.meta.pagination.hasNext;
    page++;
  }
  
  return allProducts;
}
```

### 4. Caching

Implement client-side caching for frequently accessed data:

```typescript
const cache = new Map();

async function getCachedProduct(id) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  
  const product = await client.products.get(id);
  cache.set(id, product);
  
  // Expire after 5 minutes
  setTimeout(() => cache.delete(id), 5 * 60 * 1000);
  
  return product;
}
```

---

*Document Version: 1.0.0*  
*Last Updated: 2025-11-10*  
*Owner: API Engineering Team*
