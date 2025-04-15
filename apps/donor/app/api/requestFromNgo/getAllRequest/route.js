import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      where: {
        donorId: "all-donor",
      },
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
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
