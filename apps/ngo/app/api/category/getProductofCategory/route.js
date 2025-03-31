import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        if (!category) {
            return NextResponse.json({ message: "Category is required" }, { status: 400 });
        }

        const products = await prisma.product.findMany({
            where: {
                category: category,
            },
            select: {
                id: true,
                name: true,
                image: true,
                condition: true,
                quantity: true,
                donor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        address: true,
                    },
                },
            },
        });

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
