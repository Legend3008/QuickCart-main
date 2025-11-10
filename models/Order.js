import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    
    // Customer Information
    userId: {
        type: String,
        required: true,
        ref: 'user',
        index: true
    },
    customerName: String,
    customerEmail: String,
    
    // Order Items
    items: [{
        productId: { 
            type: String, 
            ref: 'product', 
            required: true 
        },
        productName: String,
        productImage: String,
        quantity: { 
            type: Number, 
            required: true, 
            min: 1 
        },
        price: { 
            type: Number, 
            required: true 
        },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        subtotal: Number,
        
        // Seller information
        sellerId: { type: String, ref: 'user' },
        sellerName: String,
        
        // Item status
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
    
    // Shipping Address
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
        updatedBy: String
    }],
    
    // Payment Information
    payment: {
        method: {
            type: String,
            enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'],
            required: true
        },
        transactionId: String,
        provider: String,
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
        agentId: { type: String, ref: 'user' },
        agentName: String,
        estimatedDeliveryDate: Date,
        actualDeliveryDate: Date,
        trackingNumber: String,
        trackingUrl: String,
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
    source: {
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
}, {
    timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'items.sellerId': 1, status: 1 });
orderSchema.index({ 'delivery.agentId': 1, status: 1 });
orderSchema.index({ 'payment.status': 1 });

// Pre-save middleware
orderSchema.pre('save', function(next) {
    // Generate order number if not exists
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        this.orderNumber = `ORD-${year}-${random}`;
    }
    
    // Add to status history if status changed
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date()
        });
    }
    
    this.updatedAt = new Date();
    next();
});

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;
