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
        donor: true,
      },
    });

    const receiverEmail = donation.receiver.email;

    const emailHtml = `
      <h2>Hi ${donation.receiver.name},</h2>
      <p>Your donation request <strong>#${donation.id.slice(0, 6)}</strong> has been accepted by the donor <strong>${donation.donor.name}</strong>.</p>
      <p><strong>Delivery Method:</strong> ${deliveryType.replace('_', ' ')}</p>
      <p>Thank you for using <strong>DonateConnect</strong>!</p>
    `;

    await sendEmail({
      to: receiverEmail,
      subject: 'Your donation request has been accepted!',
      html: emailHtml,
    });

    return NextResponse.json({ message: 'Donation accepted and email sent.' }, { status: 200 });
  } catch (err) {
    console.error('Error updating donation status:', err);
    return NextResponse.json({ message: 'Failed to accept donation' }, { status: 500 });
  }
}
