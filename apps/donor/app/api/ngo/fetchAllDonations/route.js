import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const donorId = session.user.id;
        const { receiverId } = params;

        if (!receiverId) {
            return NextResponse.json({ message: "Receiver ID is required" }, { status: 400 });
        }

        const donations = await prisma.donation.findMany({
            where: {
                donorId: donorId,
                receiverId: receiverId,
            },
            select: {
                id: true,
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
