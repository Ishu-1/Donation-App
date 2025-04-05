// /api/ngo/fetchparticularNGO/route.ts

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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Receiver ID is required" }, { status: 400 });
    }

    const receiver = await prisma.receiver.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        type: true,
        createdAt: true,
      },
    });

    if (!receiver) {
      return NextResponse.json({ message: "Receiver not found" }, { status: 404 });
    }

    return NextResponse.json({ receiver }, { status: 200 });
  } catch (error) {
    console.error("Error fetching receiver details:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
