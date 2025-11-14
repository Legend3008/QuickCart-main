import connectDB from "@/config/db";
import HelpTopic from "@/models/HelpTopic";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();

        const topics = await HelpTopic.find({ isActive: true }).sort({ order: 1 });

        return NextResponse.json({ success: true, topics });

    } catch (error) {
        console.error('Help topics fetch error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Seed initial topics
export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const { action } = body;

        if (action === 'seed') {
            const seedTopics = [
                {
                    title: "Orders & Returns",
                    description: "Track orders, manage returns, and view order history",
                    icon: "📦",
                    slug: "orders-returns",
                    order: 1,
                    articleCount: 12
                },
                {
                    title: "Payments & Refunds",
                    description: "Payment methods, refund policies, and billing questions",
                    icon: "💳",
                    slug: "payments-refunds",
                    order: 2,
                    articleCount: 8
                },
                {
                    title: "Shipping Information",
                    description: "Delivery times, shipping costs, and tracking details",
                    icon: "🚚",
                    slug: "shipping-info",
                    order: 3,
                    articleCount: 10
                },
                {
                    title: "Account Settings",
                    description: "Manage your profile, password, and preferences",
                    icon: "⚙️",
                    slug: "account-settings",
                    order: 4,
                    articleCount: 6
                },
                {
                    title: "Technical Support",
                    description: "Troubleshoot issues and get technical assistance",
                    icon: "🔧",
                    slug: "technical-support",
                    order: 5,
                    articleCount: 9
                },
                {
                    title: "Product Information",
                    description: "Product details, specifications, and availability",
                    icon: "📱",
                    slug: "product-info",
                    order: 6,
                    articleCount: 15
                }
            ];

            await HelpTopic.insertMany(seedTopics);

            return NextResponse.json({ success: true, message: 'Topics seeded successfully' });
        }

        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Help topics creation error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
