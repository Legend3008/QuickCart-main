import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "user", index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true, index: true },
    date: { type: Number, required: true }
}, {
    timestamps: true
})

// Index for efficient seller product queries
productSchema.index({ userId: 1, date: -1 });

const Product = mongoose.models.product || mongoose.model('product', productSchema)

export default Product