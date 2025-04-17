import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        console.log('User id    :', session.user.id);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const receiverId = session.user.id;
        // const receiverId = "84e4fa1f-c6d0-4d5d-b21f-63eb44866d69"
        const { productId, quantity } = await req.json();
        if (!productId || !quantity) {
            return NextResponse.json({ message: "Product ID and quantity are required" }, { status: 400 });
        }
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        if (product.quantity < quantity) {
            return NextResponse.json({ message: "Insufficient product quantity" }, { status: 400 });
        }
        const donation = await prisma.donation.create({
            data: {
                donor: { connect: { id: product.donorId } }, // Fix here
                receiver: { connect: { id: receiverId } }, // Fix here
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
