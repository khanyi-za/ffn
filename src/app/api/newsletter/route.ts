import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      replyTo: email, // User can be contacted back
      subject: 'French for New - Merchandise Notification Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; font-size: 24px; margin: 0;">French for New</h1>
            <p style="color: #666; margin: 5px 0;">Merchandise Notification Request</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0; font-size: 18px;">New Merchandise Notification Request</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Hi, my email <strong>${email}</strong>, please notify me when the merch drops.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0; color: #333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Requested:</td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #888; font-size: 14px; margin: 0;">
              This email was automatically generated from the French for New shop page newsletter signup.
            </p>
            <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">
              Visit us at frenchfornew.com/shop
            </p>
          </div>
        </div>
      `,
      text: `
French for New - Merchandise Notification Request

Hi, my email ${email}, please notify me when the merch drops.

Email: ${email}
Requested: ${new Date().toLocaleString()}

---
This email was sent from the French for New shop page newsletter signup.
      `.trim(),
    });

    console.log('✅ Newsletter signup email sent successfully:', emailResult);

    return NextResponse.json(
      { success: true, message: 'Newsletter signup successful' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error sending newsletter signup email:', error);
    
    return NextResponse.json(
      { error: 'Failed to process newsletter signup. Please try again later.' },
      { status: 500 }
    );
  }
}