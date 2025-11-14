import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";


//configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export async function POST(request) {
    try {
        console.log('=== Product Add API Called ===');

        const { userId } = getAuth(request)
        console.log('User ID from Clerk:', userId);

        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Not authenticated. Please sign in.' 
            }, { status: 401 });
        }

        const isSeller = await authSeller(userId)
        console.log('Is seller check result:', isSeller);

        if (!isSeller) {
            return NextResponse.json({ 
                success: false, 
                message: 'Not authorized. Only sellers can add products.' 
            }, { status: 403 });
        }

        const formData = await request.formData()

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');

        // Validate required fields
        if (!name || !description || !category || !price || !offerPrice) {
            return NextResponse.json({ 
                success: false, 
                message: 'All fields are required' 
            }, { status: 400 });
        }

        // Validate prices
        if (Number(price) <= 0 || Number(offerPrice) <= 0) {
            return NextResponse.json({ 
                success: false, 
                message: 'Prices must be greater than 0' 
            }, { status: 400 });
        }

        if (Number(offerPrice) > Number(price)) {
            return NextResponse.json({ 
                success: false, 
                message: 'Offer price cannot be greater than regular price' 
            }, { status: 400 });
        }

        const files = formData.getAll('images');

        if (!files || files.length === 0) {
            return NextResponse.json({ 
                success: false, 
                message: 'Please upload at least one product image' 
            }, { status: 400 });
        }

        console.log(`Uploading ${files.length} images to Cloudinary...`);

        const result = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    )
                    stream.end(buffer)
                })
            })
        )

        const image = result.map(result => result.secure_url)
        console.log('Images uploaded successfully:', image.length);

        await connectDB()
        
        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            image,
            date: Date.now()
        })

        console.log('✓ Product created successfully:', newProduct._id);

        return NextResponse.json({ 
            success: true, 
            message: 'Product added successfully', 
            product: newProduct 
        }, { status: 201 });

    } catch (error) {
        console.error('Product add error:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'Failed to add product' 
        }, { status: 500 });
    }
}