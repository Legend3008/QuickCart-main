import { clerkClient } from '@clerk/nextjs/server';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Development endpoint to set user role to seller
 * In production, this should be done through admin dashboard
 */
export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Not authenticated' 
            }, { status: 401 });
        }

        const client = await clerkClient();
        
        // Update user's public metadata to set role as seller
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'seller'
            }
        });

        console.log(`✓ User ${userId} role updated to seller`);

        return NextResponse.json({ 
            success: true, 
            message: 'Seller role assigned successfully',
            userId 
        });

    } catch (error) {
        console.error('Set seller role error:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}

/**
 * Get current user role
 */
export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Not authenticated' 
            }, { status: 401 });
        }

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        return NextResponse.json({ 
            success: true, 
            userId,
            role: user.publicMetadata.role || 'user',
            publicMetadata: user.publicMetadata
        });

    } catch (error) {
        console.error('Get user role error:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}
