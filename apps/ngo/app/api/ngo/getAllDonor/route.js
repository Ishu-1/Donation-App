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

        const donations = await prisma.donation.findMany({
            where: { receiverId, status: "COMPLETED" },
            select: {
                id: true,
                donorId: true,
                receiverId: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                deliveryType: true,
                details: true,
                donor: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName:true,       // Or firstName & lastName if stored separately
                    },
                },
            },
        });
        const allProductIds = [
            ...new Set(
              donations.flatMap((donation) =>
                donation.details.map((item) => item.productId)
              )
            ),
          ];
      
          // Fetch all relevant products in one go
          const allProducts = await prisma.product.findMany({
            where: { id: { in: allProductIds } },
          });
      
          const productMap = new Map(
            allProducts.map((product) => [product.id, product])
          );
      
          // Attach full product info to donation.details
          const enrichedDonations = donations.map((donation) => {
            const enrichedDetails = donation.details.map((item) => ({
              quantity: item.quantity,
              product: productMap.get(item.productId) || null,
            }));
      
            return {
              ...donation,
              details: enrichedDetails,
            };
          });
      
          return NextResponse.json({ donations: enrichedDonations }, { status: 200 });
    } catch (error) {
        console.error("Error fetching completed donations for receiver:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
