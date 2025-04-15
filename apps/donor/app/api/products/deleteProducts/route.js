import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const donorId = session.user.id;
        // const donorId = "554c0a8c-3325-45fd-aa3c-87d9630cbf31"
        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        // Check if the product exists and belongs to the logged-in donor
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product || product.donorId !== donorId) {
            return NextResponse.json({ message: "Product not found or unauthorized" }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id: productId },
        });

        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
// {
//     "name": "Winter boot",
//     "image": [
//       "https://example.com/image1.jpg"
//     ],
//     "condition": "Very Good",
//     "category": "Shoe",
//     "quantity": 3
//   }