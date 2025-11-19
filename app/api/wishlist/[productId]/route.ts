import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/db";
import { Session } from "next-auth"; // Import Session type

// Define an interface for the context object to explicitly type route parameters
interface RouteContext {
  params: {
    productId: string;
  };
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext // Use the explicit interface here
) {
  try {
    const session: Session | null = await getServerSession(authOptions); // Explicitly type session

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { productId } = context.params; // Access params from context

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (!existingWishlistItem) {
      return new NextResponse("Product not found in wishlist", { status: 404 });
    }

    await prisma.wishlist.delete({
      where: { id: existingWishlistItem.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

