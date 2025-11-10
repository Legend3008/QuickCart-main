import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },  // Clerk user ID
    
    // Basic Information
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        index: true
    },
    imageUrl: { type: String, required: true },
    
    phone: {
        number: String,
        verified: Boolean,
        verifiedAt: Date
    },
    
    // User Role
    role: {
        type: String,
        enum: ['customer', 'seller', 'delivery', 'admin', 'super_admin'],
        default: 'customer',
        index: true
    },
    
    // Shopping Cart (backward compatibility)
    cartItems: { 
        type: Object, 
        default: {} 
    },
    
    // Enhanced Cart Structure
    cart: {
        items: [{
            productId: { type: String, ref: 'product' },
            quantity: { type: Number, default: 1, min: 1 },
            addedAt: { type: Date, default: Date.now },
            priceAtAdd: Number
        }],
        updatedAt: Date
    },
    
    // Wishlist
    wishlist: [{
        productId: { type: String, ref: 'product' },
        addedAt: { type: Date, default: Date.now }
    }],
    
    // Addresses
    addresses: [{
        _id: { type: String },
        type: {
            type: String,
            enum: ['home', 'office', 'other'],
            default: 'home'
        },
        isDefault: { type: Boolean, default: false },
        name: String,
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
        storeSlug: { type: String, unique: true, sparse: true, index: true },
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
            coordinates: [Number]
        },
        isOnline: { type: Boolean, default: false },
        metrics: {
            totalDeliveries: { type: Number, default: 0 },
            onTimeDeliveries: { type: Number, default: 0 },
            rating: { type: Number, default: 0 },
            earnings: { type: Number, default: 0 }
        }
    },
    
    // User Preferences
    preferences: {
        language: { type: String, default: 'en' },
        currency: { type: String, default: 'INR' },
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true }
        },
        theme: { 
            type: String, 
            enum: ['light', 'dark', 'auto'], 
            default: 'auto' 
        }
    },
    
    // Account Status
    status: {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        default: 'active',
        index: true
    },
    
    // Metadata
    lastLoginAt: Date,
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now }
}, { 
    minimize: false,
    timestamps: true
});

// Indexes for optimal query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ 'sellerProfile.storeSlug': 1 }, { unique: true, sparse: true });
userSchema.index({ 'deliveryProfile.currentLocation': '2dsphere' });

// Pre-save middleware
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    
    // Sync cart structures
    if (this.cartItems && Object.keys(this.cartItems).length > 0 && (!this.cart || !this.cart.items || this.cart.items.length === 0)) {
        if (!this.cart) this.cart = { items: [] };
        this.cart.items = Object.entries(this.cartItems).map(([productId, quantity]) => ({
            productId,
            quantity,
            addedAt: new Date()
        }));
        this.cart.updatedAt = new Date();
    }
    
    next();
});

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;