import connectDB from '@/config/db'
import authSeller from '@/lib/authSeller'
import Product from '@/models/Product'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        console.log('=== Seller Product List API Called ===');
        
        const { userId } = getAuth(request);
        console.log('User ID:', userId);

        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Not authenticated' 
            }, { status: 401 });
        }

        const isSeller = await authSeller(userId);
        console.log('Is seller:', isSeller);

        if (!isSeller) {
            return NextResponse.json({ 
                success: false, 
                message: 'Not authorized. Only sellers can view this.' 
            }, { status: 403 });
        }

        await connectDB();

        // Get products for this specific seller
        const products = await Product.find({ userId });
        console.log(`Found ${products.length} products for seller ${userId}`);
        
        return NextResponse.json({ success: true, products });

    } catch (error) {
        console.error('Seller product list error:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
    
}