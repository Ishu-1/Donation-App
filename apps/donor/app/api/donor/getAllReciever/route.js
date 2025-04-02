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

        const donorId = session.user.id;

        const receivers = await prisma.receiver.findMany({
            where: {
                donations: {
                    some: {
                        donorId: donorId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                type: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ receivers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching receivers helped by donor:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
