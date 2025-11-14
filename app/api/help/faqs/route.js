import connectDB from "@/config/db";
import FAQ from "@/models/FAQ";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        let query = { isActive: true };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { question: { $regex: search, $options: 'i' } },
                { answer: { $regex: search, $options: 'i' } }
            ];
        }

        const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });

        return NextResponse.json({ success: true, faqs });

    } catch (error) {
        console.error('FAQ fetch error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Seed initial FAQ data if needed
export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const { action, data } = body;

        if (action === 'seed') {
            // Initial FAQ data
            const seedFAQs = [
                {
                    question: "How do I track my order?",
                    answer: "You can track your order by visiting the 'My Orders' page from your account dashboard. Each order will have a tracking number that updates in real-time. You'll also receive email notifications with tracking links.",
                    category: "Orders & Returns",
                    order: 1
                },
                {
                    question: "What is your return policy?",
                    answer: "We offer a 30-day return policy for most items. Products must be unused, in original packaging, and with all tags attached. Electronics have a 14-day return window. Refunds are processed within 5-7 business days after we receive your return.",
                    category: "Orders & Returns",
                    order: 2
                },
                {
                    question: "How long does shipping take?",
                    answer: "Standard shipping takes 3-5 business days. Express shipping delivers within 1-2 business days. Free shipping is available on orders over $50. You'll receive tracking information once your order ships.",
                    category: "Shipping Information",
                    order: 1
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, Apple Pay, Google Pay, and UPI. All transactions are secured with 256-bit SSL encryption.",
                    category: "Payments & Refunds",
                    order: 1
                },
                {
                    question: "How do I reset my password?",
                    answer: "Click on 'Sign In' and then 'Forgot Password'. Enter your registered email address, and we'll send you a password reset link. The link expires in 24 hours for security reasons.",
                    category: "Account Settings",
                    order: 1
                },
                {
                    question: "Can I change my order after placing it?",
                    answer: "You can modify your order within 1 hour of placing it. Go to 'My Orders', find your order, and click 'Modify Order'. After processing begins, changes cannot be made, but you can still cancel if needed.",
                    category: "Orders & Returns",
                    order: 3
                },
                {
                    question: "Do you offer international shipping?",
                    answer: "Yes, we ship to over 50 countries worldwide. International shipping takes 7-14 business days. Customs duties and taxes may apply depending on your location and are the responsibility of the customer.",
                    category: "Shipping Information",
                    order: 2
                },
                {
                    question: "How do I apply a discount code?",
                    answer: "Enter your discount code at checkout in the 'Promo Code' field before completing payment. The discount will be applied automatically. Note that some codes cannot be combined with other offers.",
                    category: "Payments & Refunds",
                    order: 2
                },
                {
                    question: "Is my payment information secure?",
                    answer: "Absolutely. We use industry-standard SSL encryption and never store your complete credit card information. All payments are processed through PCI-DSS compliant payment gateways.",
                    category: "Payments & Refunds",
                    order: 3
                },
                {
                    question: "How do I delete my account?",
                    answer: "To delete your account, go to Account Settings > Privacy > Delete Account. Please note this action is permanent and cannot be undone. All your order history and saved data will be removed.",
                    category: "Account Settings",
                    order: 2
                },
                {
                    question: "Why is my page loading slowly?",
                    answer: "Slow loading can be caused by internet connection, browser cache, or high traffic. Try clearing your browser cache, checking your internet connection, or using a different browser. If the issue persists, contact our support team.",
                    category: "Technical Support",
                    order: 1
                },
                {
                    question: "What should I do if I receive a damaged product?",
                    answer: "If you receive a damaged item, please contact us within 48 hours with photos of the damage. We'll arrange a free return pickup and send you a replacement or issue a full refund immediately.",
                    category: "Orders & Returns",
                    order: 4
                }
            ];

            await FAQ.insertMany(seedFAQs);

            return NextResponse.json({ success: true, message: 'FAQs seeded successfully' });
        }

        // Create new FAQ
        const faq = await FAQ.create(data);
        return NextResponse.json({ success: true, faq }, { status: 201 });

    } catch (error) {
        console.error('FAQ creation error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Update FAQ helpful count
export async function PATCH(request) {
    try {
        await connectDB();

        const body = await request.json();
        const { faqId, action } = body;

        if (action === 'helpful') {
            await FAQ.findByIdAndUpdate(faqId, { $inc: { helpful: 1 } });
        } else if (action === 'view') {
            await FAQ.findByIdAndUpdate(faqId, { $inc: { views: 1 } });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('FAQ update error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
