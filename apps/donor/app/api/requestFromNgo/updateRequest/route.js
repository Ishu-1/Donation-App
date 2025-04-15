import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { sendEmail } from "../../../utils/sendEmail"; // 👈 import your NodeMailer util

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { donationId, deliveryType } = await req.json();

    if (!donationId || !deliveryType) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        receiver: true,
        details: true,
        donor: true
      },
    });

    if (!donation) {
      return NextResponse.json({ message: "Donation not found" }, { status: 404 });
    }

    // Assign donorId to products
    for (const detail of donation.details) {
      await prisma.product.update({
        where: { id: detail.productId },
        data: { donorId: userId },
      });
    }

    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: "COMPLETED",
        deliveryType,
        donorId: userId,
      },
      include: {
        receiver: true,
        donor: true,
      }
    });

    for (const detail of donation.details) {
      await prisma.product.update({
        where: { id: detail.productId },
        data: { quantity: 0 },
      });
    }

    // 📨 Email logic
    const deliveryNote =
      deliveryType === "DELIVERY"
        ? "Your items will be delivered within 7 days."
        : "Please coordinate pickup with the donor.";

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #4CAF50; color: white; padding: 20px 30px;">
            <h2 style="margin: 0;">🎉 Donation Accepted</h2>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px;">Hi <strong>${updatedDonation.receiver.name}</strong>,</p>
            <p style="font-size: 16px;">
              Your donation request <strong>#${updatedDonation.id.slice(0, 6)}</strong> has been <strong>accepted</strong>.
            </p>

            <h3 style="margin-top: 30px; color: #333;">📦 Delivery Details</h3>
            <p style="font-size: 15px;"><strong>Method:</strong> ${deliveryType}</p>
            <p style="font-size: 15px;">${deliveryNote}</p>

            <h3 style="margin-top: 30px; color: #333;">🙋‍♂️ Donor Information</h3>
            <table style="width: 100%; font-size: 15px; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px;"><strong>Name:</strong></td>
                <td style="padding: 8px;">${session.user.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Email:</strong></td>
                <td style="padding: 8px;">${session.user.email}</td>
              </tr>
            </table>

            <p style="margin-top: 40px; font-size: 15px;">Thank you for using <strong>DonateConnect</strong>! ❤️</p>
          </div>
          <div style="background-color: #f0f0f0; padding: 15px 30px; text-align: center; font-size: 13px; color: #888;">
            © ${new Date().getFullYear()} DonateConnect. All rights reserved.
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: updatedDonation.receiver.email,
      subject: "Your Donation Request Has Been Accepted!",
      html: emailHtml,
    });

    return NextResponse.json({ donation: updatedDonation }, { status: 200 });
  } catch (error) {
    console.error("Error updating donation:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
