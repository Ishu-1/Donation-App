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
        // const donorId = "554c0a8c-3325-45fd-aa3c-87d9630cbf31"

        const products = await prisma.product.findMany({
            where: { donorId },
            orderBy: { createdAt: "desc" }, // Latest products first
        });

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error("Error fetching donor's products:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
