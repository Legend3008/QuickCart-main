import connectDB from "@/config/db";
import Product from "@/models/Product";
import { 
    successResponse, 
    errorResponse, 
    paginatedResponse,
    asyncHandler 
} from "@/lib/api/response";
import { 
    validatePaginationParams, 
    validateSortParams,
    validatePriceRange,
    validateSearchQuery 
} from "@/lib/api/validation";

/**
 * GET /api/product/list
 * Fetch products with filtering, sorting, and pagination
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - category: Filter by category
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - search: Search in name/description
 * - sort: Sort field (createdAt, price, name)
 * - status: Filter by status (default: active)
 * - featured: Filter featured products (true/false)
 */
export const GET = asyncHandler(async (request) => {
    // Connect to database
    await connectDB();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const { page, limit } = validatePaginationParams({
        page: searchParams.get('page'),
        limit: searchParams.get('limit')
    });
    
    // Build filter query
    const filter = {};
    
    // Status filter (default to active products)
    const status = searchParams.get('status') || 'active';
    if (status !== 'all') {
        filter.status = status;
    }
    
    // Category filter
    const category = searchParams.get('category');
    if (category) {
        filter.category = category;
    }
    
    // Price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
        const { minPrice: min, maxPrice: max } = validatePriceRange(minPrice, maxPrice);
        filter.offerPrice = { $gte: min, $lte: max };
    }
    
    // Featured filter
    const featured = searchParams.get('featured');
    if (featured === 'true') {
        filter.isFeatured = true;
    }
    
    // Seller filter
    const sellerId = searchParams.get('sellerId');
    if (sellerId) {
        filter.userId = sellerId;
    }
    
    // Search query
    const searchQuery = validateSearchQuery(searchParams.get('search'));
    if (searchQuery) {
        filter.$or = [
            { name: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } }
        ];
    }
    
    // Sorting
    const sortField = searchParams.get('sort') || '-createdAt';
    const allowedSortFields = ['createdAt', 'price', 'offerPrice', 'name', 'metrics.averageRating'];
    const sort = validateSortParams(
        { sort: sortField }, 
        allowedSortFields
    );
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
        Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('name description price offerPrice image category createdAt status isFeatured metrics inventory')
            .lean(),
        Product.countDocuments(filter)
    ]);
    
    // Return paginated response
    return paginatedResponse(
        { products },
        page,
        limit,
        total
    );
});

