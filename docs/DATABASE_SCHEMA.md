# SmartBazar: Database Architecture & Schema Design

## Database Strategy

SmartBazar uses MongoDB as its primary datastore, leveraging document-oriented design for flexibility while maintaining ACID guarantees through MongoDB's transaction support.

## Schema Design Principles

1. **Embed vs. Reference**: Embed for one-to-few, reference for one-to-many
2. **Denormalization**: Strategic duplication for read performance
3. **Index Optimization**: Compound indexes for frequent query patterns
4. **Schema Validation**: Enforce data integrity at database level
5. **Audit Trail**: Track all modifications with timestamps and user IDs

## Collection Schemas

### 1. Users Collection

```javascript
// Collection: users
{
  _id: String,                    // Clerk user ID (primary key)
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: String,
  phone: {
    number: String,
    verified: Boolean,
    verifiedAt: Date
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'delivery', 'admin', 'super_admin'],
    default: 'customer',
    index: true
  },
  
  // Shopping cart (embedded for fast access)
  cartItems: {
    type: Map,
    of: {
      quantity: Number,
      addedAt: Date,
      priceAtAdd: Number        // Store price when added
    },
    default: {}
  },
  
  // Wishlist
  wishlist: [{
    productId: { type: String, ref: 'products' },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Addresses (embedded, typically < 5 addresses)
  addresses: [{
    _id: String,                 // Auto-generated address ID
    type: {
      type: String,
      enum: ['home', 'office', 'other'],
      default: 'home'
    },
    isDefault: Boolean,
    name: String,                // Recipient name
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'IN' },
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],
  
  // Seller-specific fields
  sellerProfile: {
    storeName: String,
    storeSlug: { type: String, unique: true, sparse: true },
    storeDescription: String,
    storeLogo: String,
    businessDetails: {
      businessName: String,
      gstNumber: String,
      panNumber: String,
      bankAccount: {
        accountNumber: String,
        ifscCode: String,
        accountHolderName: String
      }
    },
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    metrics: {
      totalProducts: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 }
    }
  },
  
  // Delivery agent fields
  deliveryProfile: {
    vehicleType: {
      type: String,
      enum: ['bike', 'car', 'van']
    },
    vehicleNumber: String,
    licenseNumber: String,
    currentLocation: {
      type: { type: String, default: 'Point' },
      coordinates: [Number]      // [longitude, latitude]
    },
    isOnline: { type: Boolean, default: false },
    metrics: {
      totalDeliveries: { type: Number, default: 0 },
      onTimeDeliveries: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      earnings: { type: Number, default: 0 }
    }
  },
  
  // User preferences
  preferences: {
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' }
  },
  
  // Metadata
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active',
    index: true
  },
  lastLoginAt: Date,
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
}

// Indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1, status: 1 })
db.users.createIndex({ 'sellerProfile.storeSlug': 1 }, { unique: true, sparse: true })
db.users.createIndex({ 'deliveryProfile.currentLocation': '2dsphere' })
db.users.createIndex({ createdAt: -1 })
```

### 2. Products Collection

```javascript
// Collection: products
{
  _id: ObjectId,                 // Auto-generated
  
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
    index: 'text'                // Full-text search
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    index: 'text'
  },
  shortDescription: String,      // For listing pages
  
  // Seller Reference
  userId: {                      // Seller ID
    type: String,
    required: true,
    ref: 'users',
    index: true
  },
  sellerName: String,            // Denormalized for performance
  storeName: String,             // Denormalized for performance
  
  // Pricing
  price: {
    original: { type: Number, required: true },
    current: { type: Number, required: true, index: true },
    currency: { type: String, default: 'INR' },
    discount: {
      percentage: Number,
      amount: Number,
      validFrom: Date,
      validTo: Date
    }
  },
  
  // Legacy fields (for backward compatibility)
  offerPrice: Number,
  
  // Categorization
  category: {
    primary: { type: String, required: true, index: true },
    secondary: String,
    tags: [String]
  },
  
  // Images
  images: [{
    url: { type: String, required: true },
    alt: String,
    isPrimary: { type: Boolean, default: false },
    order: Number
  }],
  image: [String],               // Legacy field
  
  // Inventory
  inventory: {
    sku: { type: String, unique: true, sparse: true },
    quantity: { type: Number, default: 0, min: 0, index: true },
    lowStockThreshold: { type: Number, default: 10 },
    restockDate: Date,
    trackInventory: { type: Boolean, default: true }
  },
  
  // Variants (for products with options)
  variants: [{
    _id: String,
    name: String,                // e.g., "Size: M, Color: Red"
    sku: String,
    price: Number,
    quantity: Number,
    attributes: {
      size: String,
      color: String,
      material: String
    }
  }],
  
  // Specifications
  specifications: {
    weight: Number,              // in grams
    dimensions: {
      length: Number,            // in cm
      width: Number,
      height: Number
    },
    brand: String,
    manufacturer: String,
    countryOfOrigin: String,
    warranty: String
  },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    canonicalUrl: String
  },
  
  // Analytics & Performance
  metrics: {
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    addToCartCount: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'out_of_stock', 'discontinued', 'deleted'],
    default: 'draft',
    index: true
  },
  isPublished: { type: Boolean, default: false, index: true },
  publishedAt: Date,
  isFeatured: { type: Boolean, default: false, index: true },
  
  // Timestamps
  date: { type: Number, required: true },  // Legacy field
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: Date                // Soft delete
}

// Indexes
db.products.createIndex({ userId: 1, status: 1 })
db.products.createIndex({ 'category.primary': 1, 'price.current': 1 })
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ 'inventory.quantity': 1, status: 1 })
db.products.createIndex({ isFeatured: -1, createdAt: -1 })
db.products.createIndex({ 'metrics.averageRating': -1, 'metrics.reviewCount': -1 })
db.products.createIndex({ name: 'text', description: 'text', 'category.tags': 'text' })
```

### 3. Orders Collection

```javascript
// Collection: orders
{
  _id: ObjectId,
  orderNumber: {                 // Human-readable order number
    type: String,
    unique: true,
    index: true
  },
  
  // Customer Information
  userId: {
    type: String,
    required: true,
    ref: 'users',
    index: true
  },
  customerName: String,          // Denormalized
  customerEmail: String,         // Denormalized
  
  // Order Items
  items: [{
    productId: { type: String, ref: 'products', required: true },
    productName: String,         // Snapshot at time of order
    productImage: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    discount: Number,
    tax: Number,
    subtotal: Number,
    
    // Seller information for multi-vendor orders
    sellerId: { type: String, ref: 'users' },
    sellerName: String,
    
    // Item-level status (for partial fulfillment)
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    }
  }],
  
  // Pricing Summary
  pricing: {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
  },
  
  // Shipping Address (snapshot at time of order)
  shippingAddress: {
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Billing Address
  billingAddress: {
    name: String,
    phone: String,
    addressLine1: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  
  // Order Status
  status: {
    type: String,
    enum: [
      'pending_payment',
      'payment_failed',
      'confirmed',
      'processing',
      'ready_to_ship',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'refunded',
      'returned'
    ],
    default: 'pending_payment',
    index: true
  },
  
  // Status History
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: String            // User ID who made the change
  }],
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'],
      required: true
    },
    transactionId: String,
    provider: String,            // Razorpay, Stripe, etc.
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  
  // Delivery Information
  delivery: {
    method: {
      type: String,
      enum: ['standard', 'express', 'same_day'],
      default: 'standard'
    },
    agentId: { type: String, ref: 'users' },
    agentName: String,
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    trackingNumber: String,
    trackingUrl: String,
    
    // Proof of delivery
    proofOfDelivery: {
      signature: String,
      photo: String,
      notes: String,
      deliveredAt: Date
    }
  },
  
  // Notes & Communication
  customerNotes: String,
  internalNotes: String,
  
  // Metadata
  source: {                      // Order source
    type: String,
    enum: ['web', 'mobile_app', 'api'],
    default: 'web'
  },
  deviceInfo: {
    userAgent: String,
    ipAddress: String
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
  cancelledAt: Date,
  deliveredAt: Date
}

// Indexes
db.orders.createIndex({ orderNumber: 1 }, { unique: true })
db.orders.createIndex({ userId: 1, createdAt: -1 })
db.orders.createIndex({ status: 1, createdAt: -1 })
db.orders.createIndex({ 'items.sellerId': 1, status: 1 })
db.orders.createIndex({ 'delivery.agentId': 1, status: 1 })
db.orders.createIndex({ 'payment.status': 1 })
```

### 4. Reviews Collection

```javascript
// Collection: reviews
{
  _id: ObjectId,
  
  // References
  productId: {
    type: String,
    required: true,
    ref: 'products',
    index: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'users',
    index: true
  },
  orderId: {                     // Link to purchase verification
    type: String,
    ref: 'orders'
  },
  
  // Review Content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: String,
  comment: {
    type: String,
    required: true
  },
  
  // Media
  images: [{
    url: String,
    caption: String
  }],
  videos: [{
    url: String,
    thumbnail: String
  }],
  
  // Verification
  isVerifiedPurchase: { type: Boolean, default: false },
  
  // Helpfulness
  helpfulCount: { type: Number, default: 0 },
  notHelpfulCount: { type: Number, default: 0 },
  helpfulVotes: [String],        // Array of user IDs who voted helpful
  
  // Seller Response
  sellerResponse: {
    comment: String,
    respondedAt: Date,
    respondedBy: String
  },
  
  // Moderation
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending',
    index: true
  },
  moderationNotes: String,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
}

// Indexes
db.reviews.createIndex({ productId: 1, status: 1, createdAt: -1 })
db.reviews.createIndex({ userId: 1, createdAt: -1 })
db.reviews.createIndex({ productId: 1, rating: -1 })
db.reviews.createIndex({ isVerifiedPurchase: -1, helpfulCount: -1 })

// Compound index for unique review per user per product
db.reviews.createIndex({ productId: 1, userId: 1 }, { unique: true })
```

### 5. Analytics Events Collection

```javascript
// Collection: analytics_events
{
  _id: ObjectId,
  
  // Event Type
  eventType: {
    type: String,
    required: true,
    index: true,
    enum: [
      'page_view',
      'product_view',
      'add_to_cart',
      'remove_from_cart',
      'checkout_started',
      'purchase_completed',
      'search',
      'filter_applied'
    ]
  },
  
  // User Context
  userId: String,                // null for anonymous users
  sessionId: { type: String, required: true, index: true },
  
  // Event Data
  properties: {
    type: Map,
    of: Schema.Types.Mixed       // Flexible event properties
  },
  
  // Page Context
  page: {
    url: String,
    referrer: String,
    title: String
  },
  
  // Device & Browser
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop']
  },
  userAgent: String,
  
  // Location
  location: {
    country: String,
    region: String,
    city: String
  },
  
  // Timestamp
  timestamp: { type: Date, default: Date.now, index: true }
}

// Indexes
db.analytics_events.createIndex({ eventType: 1, timestamp: -1 })
db.analytics_events.createIndex({ userId: 1, timestamp: -1 })
db.analytics_events.createIndex({ sessionId: 1, timestamp: -1 })
db.analytics_events.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 }) // 90 days TTL
```

## Database Optimization Strategies

### 1. Indexing Strategy

```javascript
// Performance-critical indexes
// Ensure these are created in production

// Users - Fast authentication lookups
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1, status: 1 })

// Products - Fast catalog queries
db.products.createIndex({ userId: 1, status: 1 })
db.products.createIndex({ 'category.primary': 1, 'price.current': 1 })
db.products.createIndex({ isFeatured: -1, createdAt: -1 })

// Orders - User order history
db.orders.createIndex({ userId: 1, createdAt: -1 })
db.orders.createIndex({ status: 1, createdAt: -1 })

// Reviews - Product reviews page
db.reviews.createIndex({ productId: 1, status: 1, createdAt: -1 })
```

### 2. Query Optimization

```javascript
// BAD: Returns all fields
db.products.find({ category: 'electronics' })

// GOOD: Project only needed fields
db.products.find(
  { category: 'electronics' },
  { name: 1, price: 1, images: 1, _id: 1 }
)

// GOOD: Use lean() for read-only operations
Product.find({ category: 'electronics' })
  .select('name price images')
  .lean()
  .exec()
```

### 3. Aggregation Pipeline Optimization

```javascript
// Product statistics with efficient aggregation
db.products.aggregate([
  { $match: { userId: sellerId, status: 'active' } },
  { $group: {
      _id: '$category.primary',
      totalProducts: { $sum: 1 },
      avgPrice: { $avg: '$price.current' },
      totalRevenue: { $sum: '$metrics.revenue' }
    }
  },
  { $sort: { totalRevenue: -1 } }
])
```

### 4. Connection Pooling

```javascript
// config/db.js optimization
const mongoose = require('mongoose');

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  
  const opts = {
    bufferCommands: false,
    maxPoolSize: 100,          // Maximum connections
    minPoolSize: 10,           // Minimum connections
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4                  // Use IPv4
  };
  
  cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
  cached.conn = await cached.promise;
  return cached.conn;
};
```

### 5. Read Replicas (Production)

```javascript
// Use read replicas for read-heavy operations
const readPreference = 'secondaryPreferred';

// Read from replica
db.products.find({ status: 'active' })
  .read(readPreference)
  .exec();

// Write to primary (default)
db.products.create({ ... });
```

## Data Migration Strategy

### Initial Setup Script

```javascript
// scripts/db-setup.js
async function setupDatabase() {
  // 1. Create collections with validation
  await createCollections();
  
  // 2. Create indexes
  await createIndexes();
  
  // 3. Seed initial data
  await seedData();
  
  console.log('Database setup complete');
}

async function createIndexes() {
  // Users
  await db.users.createIndex({ email: 1 }, { unique: true });
  await db.users.createIndex({ role: 1, status: 1 });
  
  // Products
  await db.products.createIndex({ userId: 1, status: 1 });
  await db.products.createIndex({ slug: 1 }, { unique: true });
  
  // Orders
  await db.orders.createIndex({ userId: 1, createdAt: -1 });
  await db.orders.createIndex({ orderNumber: 1 }, { unique: true });
  
  // Reviews
  await db.reviews.createIndex({ productId: 1, userId: 1 }, { unique: true });
}
```

## Backup and Disaster Recovery

### Backup Strategy

1. **Automated Backups**
   - MongoDB Atlas continuous backup
   - Point-in-time recovery (up to 48 hours)
   - Snapshots every 6 hours

2. **Backup Retention**
   - Daily backups: 30 days
   - Weekly backups: 90 days
   - Monthly backups: 1 year

3. **Backup Testing**
   - Monthly restore tests
   - Documented restore procedures
   - RTO: 15 minutes
   - RPO: 5 minutes

### Disaster Recovery Plan

```bash
# 1. Identify issue
# 2. Stop write operations
# 3. Restore from backup
mongorestore --uri="mongodb+srv://..." --archive=backup.archive

# 4. Verify data integrity
# 5. Resume operations
# 6. Document incident
```

## Performance Monitoring

### Key Metrics to Monitor

1. **Query Performance**
   - Slow queries (> 100ms)
   - Index usage
   - Collection scans

2. **Connection Pool**
   - Active connections
   - Available connections
   - Wait queue

3. **Storage**
   - Database size
   - Index size
   - Storage I/O

4. **Replication Lag**
   - Primary-secondary lag
   - Oplog size

### Monitoring Tools

- MongoDB Atlas built-in monitoring
- Performance Advisor
- Real-time performance panel
- Custom alerts for critical metrics

## Schema Validation

### Mongoose Schema Validation

```javascript
// Enhanced Product schema with validation
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: Number.isFinite,
      message: 'Price must be a valid number'
    }
  }
});

// Pre-save middleware for validation
productSchema.pre('save', function(next) {
  if (this.price < this.offerPrice) {
    next(new Error('Offer price cannot exceed original price'));
  }
  next();
});
```

---

*Document Version: 1.0.0*  
*Last Updated: 2025-11-10*  
*Owner: Database Engineering Team*
