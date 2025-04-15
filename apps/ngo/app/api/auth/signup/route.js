import { NextResponse } from "next/server";
import db from "@repo/db/client";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password, name, type = "INDIVIDUAL", address, description, motti } = await req.json();

    if (!email || !password || !name || !type) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const existingUser = await db.receiver.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.receiver.create({
      data: {
        email,
        password: hashedPassword,
        name,
        type,
        address,
        description,
        motti,
      },
      select: {
        id: true,
        email: true,
        name: true,
        type: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
