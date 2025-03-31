import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";

export async function DELETE(req) {
    try {
        const session = await getServerSession();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { donorId, productId } = await req.json();
        if (!donorId || !productId) {
            return NextResponse.json({ message: "Donor ID and Product ID are required" }, { status: 400 });
        }

        const donation = await prisma.donation.findFirst({
            where: {
                donorId,
                receiverId: session.user.id,
                status: "PENDING",
                details: {
                    path: "$[*].productId",
                    equals: productId,
                },
            },
        });

        if (!donation) {
            return NextResponse.json({ message: "Donation not found or cannot be deleted" }, { status: 404 });
        }

        await prisma.donation.delete({
            where: { id: donation.id },
        });

        return NextResponse.json({ message: "Donation deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting donation:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
