import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET(req,  context) {
    try {
        const { id } = await context.params;
        
        const product = await prisma.product.findUnique({
            where: { id },
        });
        
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
