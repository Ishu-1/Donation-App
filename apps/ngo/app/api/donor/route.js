import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const receiverId = session.user.id;
        // const receiverId = "cc5409de-0893-4b40-acb7-d013bb5bf6e1"
        const { searchParams } = new URL(req.url);
        const donorId = searchParams.get("donorId");

        if (!donorId) {
            return NextResponse.json({ message: "Donor ID is required" }, { status: 400 });
        }

        const donations = await prisma.donation.findMany({
            where: { donorId, receiverId },
            orderBy: [
                { status: "asc" }, // Pending donations first
                { createdAt: "desc" } // Sort by most recent donations
            ],
            select: {
                id: true,
                donorId: true,
                receiverId: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                deliveryType: true,
                details: true,
            },
        });

        return NextResponse.json({ donations }, { status: 200 });
    } catch (error) {
        console.error("Error fetching donations:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
