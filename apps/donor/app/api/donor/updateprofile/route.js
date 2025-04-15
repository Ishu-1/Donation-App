import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }
        const donorId = session.user.id;
        // const donorId = "554c0a8c-3325-45fd-aa3c-87d9630cbf31"
        const { firstName, lastName, email, address, password } = await req.json();
        
        const updatedDonor = await prisma.donor.update({
            where: { id: donorId },
            data: {
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                email: email || undefined,
                address: address || undefined,
                password: password || undefined,
            },
        });
        
        return NextResponse.json(
            { message: "Donor profile updated", success: true, updatedDonor },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating donor profile:", error);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}
