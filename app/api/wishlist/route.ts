import { getServerSession } from "next-auth/next"; // Corrected import
import { NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/db";
import { Session } from "next-auth"; // Import Session type

// Interface for the POST request body
interface AddToWishlistRequestBody {
  productId: string;
}

// GET /api/wishlist - Fetch user's wishlist
export async function GET(request: Request) {
  try {
    const session: Session | null = await getServerSession(authOptions); // Explicitly type session

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true, // Include full product details
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // We just want to return the products, not the wishlist wrapper object
    const products = wishlistItems.map((item) => item.product);

    return NextResponse.json(products);
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/wishlist - Add product to wishlist
export async function POST(request: Request) {
  try {
    const session: Session | null = await getServerSession(authOptions); // Explicitly type session

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body: AddToWishlistRequestBody = await request.json(); // Explicitly type body
    const { productId } = body;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Check if the product already exists in the wishlist
    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    if (existingWishlistItem) {
      return new NextResponse("Product already in wishlist", { status: 409 });
    }

    const newWishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId: productId,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(newWishlistItem.product, { status: 201 });
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
