import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    // References
    productId: {
        type: String,
        required: true,
        ref: 'product',
        index: true
    },
    userId: {
        type: String,
        required: true,
        ref: 'user',
        index: true
    },
    orderId: {
        type: String,
        ref: 'order'
    },
    
    // Review Content
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        maxlength: 200
    },
    comment: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 2000
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
    isVerifiedPurchase: { 
        type: Boolean, 
        default: false 
    },
    
    // Helpfulness
    helpfulCount: { 
        type: Number, 
        default: 0 
    },
    notHelpfulCount: { 
        type: Number, 
        default: 0 
    },
    helpfulVotes: [String],  // Array of user IDs
    
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
    createdAt: { 
        type: Date, 
        default: Date.now, 
        index: true 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

// Indexes
reviewSchema.index({ productId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ productId: 1, rating: -1 });
reviewSchema.index({ isVerifiedPurchase: -1, helpfulCount: -1 });
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Pre-save middleware
reviewSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(productId) {
    const result = await this.aggregate([
        { 
            $match: { 
                productId: productId, 
                status: 'approved' 
            } 
        },
        {
            $group: {
                _id: '$productId',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);
    
    return result.length > 0 ? result[0] : { averageRating: 0, reviewCount: 0 };
};

const Review = mongoose.models.review || mongoose.model('review', reviewSchema);

export default Review;
