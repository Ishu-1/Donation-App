import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const donorId = session.user.id;

        // Fetch all donations for the donor
        const donations = await prisma.donation.findMany({
            where: { donorId },
            orderBy: { createdAt: "desc" },
            include: { details: true },
        });

        // Check if pending donations have enough stock
        const updatedDonations = await Promise.all(
            donations.map(async (donation) => {
                if (donation.status === "COMPLETED") {
                    return { ...donation, stockStatus: "OK" };
                }

                // Fetch available product quantities
                const stockCheckPromises = donation.details.map(async (item) => {
                    const product = await prisma.product.findUnique({
                        where: { id: item.productId },
                        select: { quantity: true },
                    });
                    return product && product.quantity >= item.quantity;
                });

                const stockResults = await Promise.all(stockCheckPromises);
                const isOutOfStock = stockResults.includes(false);

                return { ...donation, stockStatus: isOutOfStock ? "OUT_OF_STOCK" : "OK" };
            })
        );

        return NextResponse.json({ donations: updatedDonations }, { status: 200 });
    } catch (error) {
        console.error("Error fetching donations:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
