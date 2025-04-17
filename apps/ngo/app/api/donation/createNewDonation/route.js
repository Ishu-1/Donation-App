import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const receiverId = session.user.id;
        console.log(receiverId);
        // const receiverId = "cc5409de-0893-4b40-acb7-d013bb5bf6e1"

        const { name, image, condition, category, quantity } = await req.json();

        if (!name || !condition || !category || !quantity) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }
        // image=[""]
        // Create a new product with donorId set to null
        const newProduct = await prisma.product.create({
            data: {
                name,
                image,
                condition,
                category,
                quantity,
                donorId: null,
            },
        });

        // Create a new donation request with donorId set to "all" and receiverId as the current session user
        const newDonation = await prisma.donation.create({
            data: {
                donorId: "all-donor",
                receiverId,
                status: "PENDING",
                deliveryType: null,
                details: [{ productId: newProduct.id, quantity }],
            },
        });

        return NextResponse.json({ donation: newDonation, product: newProduct }, { status: 201 });
    } catch (error) {
        console.error("Error creating new donation request:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
