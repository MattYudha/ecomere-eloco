import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/utils/authOptions';
import prisma from '@/utils/db';
import { Session } from 'next-auth';

// PENTING: Memastikan route ini selalu dijalankan di server (tidak di-cache static)
export const dynamic = 'force-dynamic';

interface AddToWishlistRequestBody {
  productId: string;
}

// GET /api/wishlist — Fetch user's wishlist
export async function GET(request: Request) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    const products = wishlistItems.map((item) => {
      const p = item.product;
      // Pastikan data ini cocok dengan yang diharapkan di Frontend
      return {
        id: p.id,
        slug: p.slug || '',
        title: p.title || '',
        mainImage: p.mainImage && p.mainImage.trim() !== ''
          ? p.mainImage
          : '/product_placeholder.jpg',
        price: Number(p.price ?? 0),
        stockAvailabillity: Number(p.inStock ?? 0), // Menambahkan info stock
      };
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('[WISHLIST_GET_ERROR]', error);
    return new NextResponse(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request: Request) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body: AddToWishlistRequestBody = await request.json();
    const { productId } = body;

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 });
    }

    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existingWishlistItem) {
      return new NextResponse('Product already in wishlist', { status: 409 });
    }

    const newWishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: { product: true },
    });

    const p = newWishlistItem.product;

    return NextResponse.json(
      {
        id: p.id,
        slug: p.slug || '',
        title: p.title || '',
        mainImage: p.mainImage && p.mainImage.trim() !== ''
          ? p.mainImage
          : '/product_placeholder.jpg',
        price: Number(p.price ?? 0),
        stockAvailabillity: Number(p.inStock ?? 0),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[WISHLIST_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}