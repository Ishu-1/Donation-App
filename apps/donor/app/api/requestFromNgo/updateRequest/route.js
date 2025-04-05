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

        const userId = session.user.id;
        // const userId = "f7d54b27-45f4-47aa-ae38-85d0706f0a4c"
        const { donationId, deliveryType } = await req.json();

        if (!donationId || !deliveryType) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const donation = await prisma.donation.findUnique({
            where: { id: donationId },
        });

        if (!donation) {
            return NextResponse.json({ message: "Donation not found" }, { status: 404 });
        }

        // Update the products to set the donorId for the donations as it was originally created by the NGO
        for (const detail of donation.details) {
            await prisma.product.update({
                where: { id: detail.productId },
                data: { donorId: userId },
            });
        }

        // Update the donation details
        const updatedDonation = await prisma.donation.update({
            where: { id: donationId },
            data: { 
                status: "COMPLETED", 
                deliveryType, 
                donorId: userId 
            },
        });

        return NextResponse.json({ donation: updatedDonation }, { status: 200 });
    } catch (error) {
        console.error("Error updating donation:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
