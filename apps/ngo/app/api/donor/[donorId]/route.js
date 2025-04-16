import { NextResponse } from 'next/server';
import prisma from '@repo/db/client';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req,{params}) {
  const session = await getServerSession(authOptions);
          if (!session) {
              return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
          }
          const { donorId } = await params;

  if (!donorId) {
    return NextResponse.json({ error: 'Missing donor ID' }, { status: 400 });
  }

  try {
    const donor = await prisma.donor.findUnique({
      where: { id: donorId },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    if (!donor) {
      return NextResponse.json({ error: 'Donor not found' }, { status: 404 });
    }

    return NextResponse.json({ donor });
  } catch (error) {
    console.error('Error fetching donor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
