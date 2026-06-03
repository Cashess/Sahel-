import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, quantity, grade } = body;

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // change after verifying your domain
      to: ['aminugotie42@gmail.com'],
      subject: `Custom Order Inquiry: ${subject}`,
      html: `
        <h2>New Custom Order Inquiry</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd">${phone || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><strong>Quantity</strong></td><td style="padding:8px;border:1px solid #ddd">${quantity} kg</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><strong>Grade</strong></td><td style="padding:8px;border:1px solid #ddd">${grade || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><strong>Subject</strong></td><td style="padding:8px;border:1px solid #ddd">${subject}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd">${message}</td></tr>
        </table>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}