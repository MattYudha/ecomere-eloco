import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Failed to fetch categories", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category with this name already exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: name,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: `Category with name '${name}' already exists` },
        { status: 409 } // 409 Conflict
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        id: name.toLowerCase().replace(/\s+/g, '-'), // Assuming ID is slug-like
        name: name,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Failed to create category", error: errorMessage },
      { status: 500 }
    );
  }
}
