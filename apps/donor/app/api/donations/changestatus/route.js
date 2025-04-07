import { NextResponse } from 'next/server';
import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { sendEmail } from '../../../utils/sendEmail';

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const donorId = session.user.id;
    const { donationId, deliveryType } = await req.json();

    const donation = await prisma.donation.update({
      where: { id: donationId, donorId },
      data: {
        status: 'COMPLETED',
        deliveryType,
      },
      include: {
        receiver: true,
        donor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            address: true,
          }
        }
      }
    });

    // Decrease product quantity
    await Promise.all(
      donation.details.map(async (item) => {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      })
    );

    // Send email to receiver
    const deliveryNote =
      deliveryType === 'DELIVERY'
        ? 'Your items will be delivered within 7 days.'
        : 'Please coordinate pickup with the donor.';

        const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="background-color: #4CAF50; color: white; padding: 20px 30px;">
              <h2 style="margin: 0;">🎉 Donation Accepted</h2>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px;">Hi <strong>${donation.receiver.name}</strong>,</p>
              <p style="font-size: 16px;">
                Great news! Your donation request <strong>#${donation.id.slice(0, 6)}</strong> has been <strong>accepted</strong>.
              </p>
      
              <h3 style="margin-top: 30px; color: #333;">📦 Delivery Details</h3>
              <p style="font-size: 15px;"><strong>Method:</strong> ${deliveryType}</p>
              <p style="font-size: 15px;">${deliveryNote}</p>
      
              <h3 style="margin-top: 30px; color: #333;">🙋‍♂️ Donor Information</h3>
              <table style="width: 100%; font-size: 15px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px;"><strong>Name:</strong></td>
                  <td style="padding: 8px;">${donation.donor.firstName} ${donation.donor.lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px;"><strong>Email:</strong></td>
                  <td style="padding: 8px;">${donation.donor.email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px;"><strong>Address:</strong></td>
                  <td style="padding: 8px;">${donation.donor.address || 'Not Provided'}</td>
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
      to: donation.receiver.email,
      subject: 'Your Donation Request Has Been Accepted!',
      html: emailHtml,
    });
    

    return NextResponse.json(
      { message: 'Donation accepted, quantity updated and email sent.' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating donation status:', err);
    return NextResponse.json({ message: 'Failed to accept donation' }, { status: 500 });
  }
}