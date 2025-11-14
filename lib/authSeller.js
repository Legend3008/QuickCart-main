import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const authSeller = async (userId) => {
    try {
        console.log('=== Auth Seller Check ===');
        console.log('Checking userId:', userId);

        if (!userId) {
            console.log('No userId provided');
            return false;
        }

        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        
        console.log('User public metadata:', user.publicMetadata);
        console.log('User role:', user.publicMetadata.role);

        if (user.publicMetadata.role === 'seller') {
            console.log('✓ User is a seller');
            return true;
        } else {
            console.log('✗ User is not a seller. Current role:', user.publicMetadata.role);
            return false;
        }
    } catch (error) {
        console.error('Auth seller error:', error);
        return false;
    }
}

export default authSeller;
