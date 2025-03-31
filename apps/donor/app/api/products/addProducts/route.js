import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    try {
        // const donorId = "554c0a8c-3325-45fd-aa3c-87d9630cbf31"
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const donorId = session.user.id;
        const { name, image, condition, category, quantity } = await req.json();

        if (!name || !image || !Array.isArray(image) || image.length === 0 || !condition || !category || quantity == null) {
            return NextResponse.json({ message: "Missing or invalid required fields" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                image,
                condition,
                category,
                quantity: Number(quantity),
                donorId,
            },
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error("Error adding product:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
