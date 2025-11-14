import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        console.log('=== Order Placement API Called ===');
        
        // Connect to database
        await connectDB();

        // Authenticate user
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized. Please sign in to place an order.' },
                { status: 401 }
            );
        }

        const userId = user.id;

        // Parse request body
        const body = await request.json();
        const { items, shippingAddress, paymentMethod, subtotal, shippingFee, tax, discount, orderTotal } = body;

        // Validate required fields
        if (!items || items.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Cart is empty. Add items to place an order.' },
                { status: 400 }
            );
        }

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.city) {
            return NextResponse.json(
                { success: false, message: 'Shipping address is incomplete.' },
                { status: 400 }
            );
        }

        if (!paymentMethod) {
            return NextResponse.json(
                { success: false, message: 'Payment method is required.' },
                { status: 400 }
            );
        }

        if (!orderTotal || orderTotal <= 0) {
            return NextResponse.json(
                { success: false, message: 'Invalid order total.' },
                { status: 400 }
            );
        }

        // Verify products exist and validate prices
        const productIds = items.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== items.length) {
            return NextResponse.json(
                { success: false, message: 'Some products in your cart are no longer available.' },
                { status: 400 }
            );
        }

        // Validate prices and prepare order items
        const orderItems = [];
        let calculatedSubtotal = 0;

        for (const item of items) {
            const product = products.find(p => p._id.toString() === item.productId);
            
            if (!product) {
                return NextResponse.json(
                    { success: false, message: `Product ${item.name} not found.` },
                    { status: 400 }
                );
            }

            // Use the actual product price from database
            const itemSubtotal = product.offerPrice * item.quantity;
            calculatedSubtotal += itemSubtotal;

            orderItems.push({
                productId: product._id,
                name: product.name,
                image: product.image[0] || '',
                price: product.offerPrice,
                quantity: item.quantity,
                subtotal: itemSubtotal
            });
        }

        // Validate total (with some tolerance for rounding)
        const calculatedTax = Math.floor(calculatedSubtotal * 0.02);
        const calculatedTotal = calculatedSubtotal + (shippingFee || 0) + calculatedTax - (discount || 0);

        if (Math.abs(calculatedTotal - orderTotal) > 1) {
            return NextResponse.json(
                { success: false, message: 'Order total mismatch. Please refresh and try again.' },
                { status: 400 }
            );
        }

        // Calculate estimated delivery (7 days from now)
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

        // Generate unique order number
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const orderNumber = `SBZ${year}${month}${random}`;

        // Create order
        const order = await Order.create({
            userId,
            orderNumber,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal: calculatedSubtotal,
            shippingFee: shippingFee || 0,
            tax: calculatedTax,
            discount: discount || 0,
            orderTotal: calculatedTotal,
            status: 'Processing',
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
            estimatedDelivery,
            orderDate: new Date()
        });

        // Update or create user record
        await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    name: user.fullName || shippingAddress.fullName,
                    email: user.emailAddresses[0]?.emailAddress || '',
                    imageUrl: user.imageUrl || ''
                }
            },
            { upsert: true }
        );

        // Clear user's cart in database (if you're storing it)
        await User.findOneAndUpdate(
            { _id: userId },
            { $set: { cartItems: {} } }
        );

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Order placed successfully!',
            order: {
                orderId: order._id,
                orderNumber: order.orderNumber,
                orderTotal: order.orderTotal,
                estimatedDelivery: order.estimatedDelivery,
                status: order.status,
                items: order.items.length
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Order placement error:', error);

        // Handle specific errors
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: 'Duplicate order detected. Please try again.' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, message: 'Failed to place order. Please try again.' },
            { status: 500 }
        );
    }
}

// Get user orders
export async function GET(request) {
    try {
        await connectDB();

        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit')) || 50;

        let query = { userId: user.id };
        if (status && status !== 'all') {
            query.status = status;
        }

        const orders = await Order.find(query)
            .sort({ orderDate: -1 })
            .limit(limit);

        return NextResponse.json({
            success: true,
            orders
        });

    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
