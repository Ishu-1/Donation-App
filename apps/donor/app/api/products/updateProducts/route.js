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
        const { productId, ...updateData } = await req.json();

        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id: productId, donorId },
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
