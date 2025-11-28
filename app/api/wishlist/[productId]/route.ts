import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/utils/authOptions';
import prisma from '@/utils/db';
import { Session } from 'next-auth';

// Explicit typing for dynamic route context
interface RouteContext {
  params: {
    productId: string;
  };
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    // Get session (NextAuth)
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const productId = params.productId;

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 });
    }

    // Check if item exists in wishlist
    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (!wishlistItem) {
      return new NextResponse('Product not found in wishlist', { status: 404 });
    }

    // Remove wishlist item
    await prisma.wishlist.delete({
      where: { id: wishlistItem.id },
    });

    // No response body for successful delete
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[WISHLIST_DELETE_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
