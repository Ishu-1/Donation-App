import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

// const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("getAllDonors hit!");
    const donors = await prisma.donor.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        products: true,
        donations: {
          select: {
            details: true, // Get details array from each donation
          },
        },
      },
    });
    const donorsWithProductCount = donors.map((donor) => {
      const totalProductsDonated = donor.donations.reduce((acc, donation) => {
        const quantitySum = donation.details.reduce((sum, item) => {
          return parseInt(sum) + parseInt(item.quantity || 0); // Sum up quantities safely
        }, 0);
        return parseInt(acc) + parseInt(quantitySum);
      }, 0);
      console.log(totalProductsDonated);
      return {
        ...donor,
        totalProductsDonated,
      };
    });

    // console.log(donors.length);
    return NextResponse.json(donorsWithProductCount, { status: 200 });
  } catch (error) {
    console.error("Error fetching donors:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
