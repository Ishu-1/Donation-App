import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const donorId = session.user.id;
        const { donationId, deliveryType } = await req.json();

        if (!donationId || !deliveryType) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const donation = await prisma.donation.findUnique({
            where: { id: donationId },
            include: { details: true },
        });

        if (!donation) {
            return NextResponse.json({ message: "Donation not found" }, { status: 404 });
        }

        if (donation.donorId !== donorId) {
            return NextResponse.json({ message: "Unauthorized: You are not the donor of this donation" }, { status: 403 });
        }

        // Check product availability
        for (const { productId, quantity } of donation.details) {
            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (!product || product.quantity < quantity) {
                return NextResponse.json({ message: `Out of stock for product ID: ${productId}` }, { status: 400 });
            }
        }

        // Update the donation status and delivery type
        const updatedDonation = await prisma.donation.update({
            where: { id: donationId },
            data: { status: "COMPLETED", deliveryType },
        });

        return NextResponse.json({ donation: updatedDonation }, { status: 200 });
    } catch (error) {
        console.error("Error updating donation status:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
