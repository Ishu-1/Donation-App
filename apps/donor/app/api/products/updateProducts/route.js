import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const donorId = session.user.id;
    const body = await req.json();

    const { productId, name, image, condition, category, quantity } = body;

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    // Ensure that all fields are optional and only valid fields go to the update
    const updateData = {};

    if (name) updateData.name = name;
    if (image) updateData.image = image;
    if (condition) updateData.condition = condition;
    if (category) updateData.category = category;
    if (quantity !== undefined && !isNaN(Number(quantity))) {
      updateData.quantity = Number(quantity);
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        donorId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found or unauthorized" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json({ updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
