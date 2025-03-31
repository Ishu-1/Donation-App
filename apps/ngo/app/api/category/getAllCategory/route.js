import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET() {
    try {
        const categories = await prisma.product.findMany({
            select: {
                category: true,
            },
            distinct: ["category"],
        });

        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
