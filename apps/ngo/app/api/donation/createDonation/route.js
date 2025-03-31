import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";

export async function POST(req) {
    try {
        const session = await getServerSession();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { productId, quantity } = await req.json();
        if (!productId || !quantity) {
            return NextResponse.json({ message: "Product ID and quantity are required" }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { donor: true },
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        if (product.quantity < quantity) {
            return NextResponse.json({ message: "Insufficient product quantity" }, { status: 400 });
        }

        const donation = await prisma.donation.create({
            data: {
                donorId: product.donor.id,
                receiverId: session.user.id,
                status: "PENDING",
                deliveryType: null,
                details: [{ productId, quantity }],
            },
        });

        return NextResponse.json({ donation }, { status: 201 });
    } catch (error) {
        console.error("Error creating donation:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
