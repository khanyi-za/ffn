import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product, customerInfo } = body;

    // Validate required fields
    if (!product || !customerInfo) {
      return NextResponse.json(
        { error: 'Product and customer information are required' },
        { status: 400 }
      );
    }

    const { email, firstName, lastName, streetAddress, city, province, postalCode, size } = customerInfo;

    // Validate all required customer fields
    if (!email || !firstName || !lastName || !streetAddress || !city || !province || !postalCode || !size) {
      return NextResponse.json(
        { error: 'All customer fields are required' },
        { status: 400 }
      );
    }

    // Send purchase notification email using Resend
    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: 'info@frenchfornew.com',
      replyTo: email, // Admin can reply directly to customer
      subject: `French for New - Purchase Intent: ${product.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; font-size: 24px; margin: 0;">French for New</h1>
            <p style="color: #666; margin: 5px 0;">Purchase Intent Notification</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h2 style="color: #856404; margin-top: 0; font-size: 18px;">🛒 Customer Ready to Purchase</h2>
            <p style="color: #856404; margin: 5px 0;">A customer has filled out all purchase details and is about to make a payment.</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Product Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Product:</td>
                <td style="padding: 8px 0; color: #333;">${product.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Price:</td>
                <td style="padding: 8px 0; color: #333;">R${product.price.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Size:</td>
                <td style="padding: 8px 0; color: #333;">${size}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Customer Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0; color: #333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold; vertical-align: top;">Address:</td>
                <td style="padding: 8px 0; color: #333;">
                  ${streetAddress}<br>
                  ${city}, ${province}<br>
                  ${postalCode}
                </td>
              </tr>
            </table>
          </div>

          <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
            <h3 style="color: #0c5460; margin-top: 0; font-size: 16px;">💡 Next Steps</h3>
            <p style="color: #0c5460; margin: 5px 0;">
              • Monitor Yoco payments for this customer<br>
              • Prepare ${product.name} (Size: ${size}) for shipping<br>
              • Contact customer at ${email} if needed
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #888; font-size: 14px; margin: 0;">
              This email was automatically generated from the French for New shop.
            </p>
            <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">
              Visit us at frenchfornew.com
            </p>
          </div>
        </div>
      `,
      text: `
French for New - Purchase Intent Notification

🛒 CUSTOMER READY TO PURCHASE
A customer has filled out all purchase details and is about to make a payment.

PRODUCT DETAILS:
Product: ${product.name}
Price: R${product.price.toFixed(2)}
Size: ${size}
Date: ${new Date().toLocaleString()}

CUSTOMER INFORMATION:
Name: ${firstName} ${lastName}
Email: ${email}
Address: ${streetAddress}, ${city}, ${province} ${postalCode}

NEXT STEPS:
• Monitor Yoco payments for this customer
• Prepare ${product.name} (Size: ${size}) for shipping  
• Contact customer at ${email} if needed

---
This email was automatically generated from the French for New shop.
      `.trim(),
    });

    console.log('✅ Purchase notification email sent successfully:', emailResult);

    return NextResponse.json(
      { success: true, message: 'Purchase notification sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error sending purchase notification email:', error);
    
    return NextResponse.json(
      { error: 'Failed to send purchase notification. Please try again later.' },
      { status: 500 }
    );
  }
}