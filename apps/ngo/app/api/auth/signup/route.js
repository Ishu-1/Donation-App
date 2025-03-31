import { NextResponse } from "next/server";
import db from "@repo/db/client";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.donor.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new donor
    const newUser = await db.donor.create({
      data: { email, password: hashedPassword, firstName, lastName },
      select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
    });

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
