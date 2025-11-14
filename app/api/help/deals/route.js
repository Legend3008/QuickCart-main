import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 8;

        // Find products with the best discounts (highest difference between price and offerPrice)
        const products = await Product.find({})
            .sort({ date: -1 })
            .limit(limit * 2); // Get more to filter

        // Calculate discount percentage and filter
        const dealsWithDiscount = products
            .map(product => {
                const discountPercentage = Math.round(
                    ((product.price - product.offerPrice) / product.price) * 100
                );
                return {
                    ...product.toObject(),
                    discountPercentage
                };
            })
            .filter(product => product.discountPercentage >= 10) // At least 10% off
            .sort((a, b) => b.discountPercentage - a.discountPercentage)
            .slice(0, limit);

        return NextResponse.json({ success: true, products: dealsWithDiscount });

    } catch (error) {
        console.error('Deals fetch error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
