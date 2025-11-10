import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    // Seller Reference
    userId: { 
        type: String, 
        required: true, 
        ref: "user",
        index: true
    },
    
    // Basic Information
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    slug: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    description: { 
        type: String, 
        required: true,
        minlength: 10,
        maxlength: 5000
    },
    shortDescription: {
        type: String,
        maxlength: 500
    },
    
    // Legacy pricing fields (backward compatibility)
    price: { type: Number, required: true, min: 0 },
    offerPrice: { type: Number, required: true, min: 0 },
    
    // Enhanced pricing structure
    pricing: {
        original: { type: Number, min: 0 },
        current: { type: Number, min: 0, index: true },
        currency: { type: String, default: 'INR' },
        discount: {
            percentage: Number,
            amount: Number,
            validFrom: Date,
            validTo: Date
        }
    },
    
    // Legacy image field (backward compatibility)
    image: { type: Array },
    
    // Enhanced images structure
    images: [{
        url: { type: String },
        alt: String,
        isPrimary: { type: Boolean, default: false },
        order: Number
    }],
    
    // Legacy category field (backward compatibility)
    category: { type: String, required: true, index: true },
    
    // Enhanced categorization
    categoryDetails: {
        primary: { type: String, index: true },
        secondary: String,
        tags: [String]
    },
    
    // Inventory Management
    inventory: {
        sku: { type: String, unique: true, sparse: true },
        quantity: { type: Number, default: 0, min: 0, index: true },
        lowStockThreshold: { type: Number, default: 10 },
        restockDate: Date,
        trackInventory: { type: Boolean, default: true }
    },
    
    // Product Specifications
    specifications: {
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        },
        brand: String,
        manufacturer: String,
        countryOfOrigin: String,
        warranty: String
    },
    
    // SEO Optimization
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String],
        canonicalUrl: String
    },
    
    // Analytics & Performance Metrics
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
    
    // Product Status
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
    deletedAt: Date
}, {
    timestamps: true
});

// Indexes for optimal query performance
productSchema.index({ userId: 1, status: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: -1, createdAt: -1 });
productSchema.index({ 'inventory.quantity': 1, status: 1 });
productSchema.index({ 'metrics.averageRating': -1, 'metrics.reviewCount': -1 });

// Text search index
productSchema.index({ 
    name: 'text', 
    description: 'text',
    'categoryDetails.tags': 'text'
});

// Virtual for computed fields
productSchema.virtual('inStock').get(function() {
    return this.inventory?.quantity > 0 || this.price > 0;
});

// Pre-save middleware for data synchronization
productSchema.pre('save', function(next) {
    // Sync legacy fields with new structure
    if (this.price && !this.pricing?.original) {
        if (!this.pricing) this.pricing = {};
        this.pricing.original = this.price;
    }
    if (this.offerPrice && !this.pricing?.current) {
        if (!this.pricing) this.pricing = {};
        this.pricing.current = this.offerPrice;
    }
    if (this.category && !this.categoryDetails?.primary) {
        if (!this.categoryDetails) this.categoryDetails = {};
        this.categoryDetails.primary = this.category;
    }
    if (this.image && this.image.length > 0 && (!this.images || this.images.length === 0)) {
        this.images = this.image.map((url, index) => ({
            url,
            isPrimary: index === 0,
            order: index
        }));
    }
    
    // Generate slug if not exists
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    // Update timestamp
    this.updatedAt = new Date();
    
    next();
});

// Validation
productSchema.path('offerPrice').validate(function(value) {
    return value <= this.price;
}, 'Offer price cannot exceed original price');

const Product = mongoose.models.product || mongoose.model('product', productSchema);

export default Product;