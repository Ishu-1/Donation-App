import { NextResponse } from 'next/server';
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { productId } = await params;
    if (!productId) {
        return new Response(JSON.stringify({ error: 'Product ID is required' }), { status: 400 });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { 
                name: true,
                image: true,
                condition: true
            },
        });

        if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ name: product.name, image: product.image, condition:product.condition });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
