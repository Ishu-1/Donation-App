import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET() {
    try {
        console.log("GET /api/category/getAllCategory hit!");
        const categories = await prisma.product.findMany({
            select: {
                category: true,
                image: true,
            },
            distinct: ["category"],
            
        });

        // Extract one image per category
        const categoryImages = {};
        categories.forEach(({ category, image }) => {
            if (!categoryImages[category] && image.length > 0) {
                categoryImages[category] = image[0]; // Select the first image
            }
        });

        const response = categories.map(({ category }) => ({
            category,
            image: categoryImages[category] || null,
        }));

        return NextResponse.json({ categories: response }, { status: 200 });
    } catch (error) {
        console.error("Error fetching categories with images:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
