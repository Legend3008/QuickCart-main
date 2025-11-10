import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/config/db";
import { 
    successResponse, 
    forbiddenError,
    validationError,
    asyncHandler,
    ValidationError
} from "@/lib/api/response";
import { validateProductData } from "@/lib/api/validation";

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * POST /api/product/add
 * Create a new product (Seller only)
 * 
 * Request Body (multipart/form-data):
 * - name: Product name (required, 3-200 chars)
 * - description: Product description (required, 10-5000 chars)
 * - category: Product category (required)
 * - price: Original price (required, positive number)
 * - offerPrice: Offer price (required, positive number)
 * - images: Product images (required, 1-10 images)
 * 
 * Additional optional fields:
 * - shortDescription: Brief description
 * - brand: Product brand
 * - sku: Stock keeping unit
 * - quantity: Inventory quantity
 */
export const POST = asyncHandler(async (request) => {
    // Authenticate user
    const { userId } = getAuth(request);
    
    if (!userId) {
        return forbiddenError('Authentication required');
    }

    // Verify seller role
    const isSeller = await authSeller(userId);

    if (!isSeller) {
        return forbiddenError('Only sellers can add products');
    }

    // Parse form data
    const formData = await request.formData();

    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const price = formData.get('price');
    const offerPrice = formData.get('offerPrice');
    
    // Optional fields
    const shortDescription = formData.get('shortDescription');
    const brand = formData.get('brand');
    const sku = formData.get('sku');
    const quantity = formData.get('quantity') || 0;

    // Validate product data
    const validation = validateProductData({
        name,
        description,
        category,
        price: parseFloat(price),
        offerPrice: parseFloat(offerPrice)
    });

    if (!validation.isValid) {
        return validationError('Invalid product data', validation.errors);
    }

    // Handle image uploads
    const files = formData.getAll('images');

    if (!files || files.length === 0) {
        return validationError('At least one product image is required');
    }

    if (files.length > 10) {
        return validationError('Maximum 10 images allowed');
    }

    // Upload images to Cloudinary
    const uploadPromises = files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { 
                    resource_type: 'auto',
                    folder: 'smartbazar/products',
                    transformation: [
                        { width: 1000, height: 1000, crop: 'limit' },
                        { quality: 'auto:good' },
                        { fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(buffer);
        });
    });

    let uploadResults;
    try {
        uploadResults = await Promise.all(uploadPromises);
    } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        throw new ValidationError('Failed to upload images. Please try again.');
    }

    // Extract image URLs
    const imageUrls = uploadResults.map(result => result.secure_url);
    
    // Prepare images array with metadata
    const images = imageUrls.map((url, index) => ({
        url,
        isPrimary: index === 0,
        order: index
    }));

    // Connect to database
    await connectDB();

    // Create product
    const productData = {
        userId,
        name: name.trim(),
        description: description.trim(),
        category,
        price: parseFloat(price),
        offerPrice: parseFloat(offerPrice),
        image: imageUrls,  // Legacy field for backward compatibility
        images,           // New structured images
        date: Date.now(),
        status: 'active',
        isPublished: true,
        publishedAt: new Date()
    };
    
    // Add optional fields
    if (shortDescription) {
        productData.shortDescription = shortDescription.trim();
    }
    
    if (brand) {
        productData.specifications = { brand };
    }
    
    if (sku) {
        productData.inventory = { sku, quantity: parseInt(quantity) };
    } else if (quantity) {
        productData.inventory = { quantity: parseInt(quantity) };
    }

    const newProduct = await Product.create(productData);

    return successResponse(
        {
            product: {
                _id: newProduct._id,
                name: newProduct.name,
                slug: newProduct.slug,
                price: newProduct.price,
                offerPrice: newProduct.offerPrice,
                category: newProduct.category,
                status: newProduct.status,
                images: newProduct.images
            }
        },
        201,
        { 
            message: 'Product added successfully'
        }
    );
});
