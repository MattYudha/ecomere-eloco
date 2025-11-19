import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET() {
  try {
    const merchants = await prisma.merchant.findMany({
      include: {
        product: true, // Include the related products
      },
    });
    return NextResponse.json(merchants);
  } catch (error) {
    console.error("Error fetching merchants:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Failed to fetch merchants", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, description, status } = body;

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    const newMerchant = await prisma.merchant.create({
      data: {
        name,
        email,
        phone,
        address,
        description,
        status,
      },
    });

    return NextResponse.json(newMerchant, { status: 201 });
  } catch (error) {
    console.error("Error creating merchant:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Failed to create merchant", error: errorMessage },
      { status: 500 }
    );
  }
}

