import connectDB from "@/config/db";
import Feedback from "@/models/Feedback";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, email, category, message, userId } = body;

        // Validation
        if (!name || !email || !category || !message) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Message length validation
        if (message.length < 10) {
            return NextResponse.json(
                { success: false, message: 'Message must be at least 10 characters' },
                { status: 400 }
            );
        }

        // Determine priority based on category
        let priority = 'medium';
        if (category === 'Technical Support' || category === 'Account Issue') {
            priority = 'high';
        } else if (category === 'General Inquiry') {
            priority = 'low';
        }

        const feedback = await Feedback.create({
            name,
            email,
            category,
            message,
            userId: userId || null,
            priority,
            status: 'pending'
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Your feedback has been submitted successfully. We\'ll respond within 24 hours.',
                feedback: {
                    id: feedback._id,
                    status: feedback.status
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Feedback submission error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to submit feedback. Please try again.' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const status = searchParams.get('status');

        let query = {};

        if (userId) {
            query.userId = userId;
        }

        if (status) {
            query.status = status;
        }

        const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, feedbacks });

    } catch (error) {
        console.error('Feedback fetch error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
