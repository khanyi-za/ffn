import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, genre, email, gender, location, mixLink, instagramHandle } = body;

    // Validate required fields
    if (!name || !genre || !email || !gender || !location || !mixLink || !instagramHandle) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Validate URL format for mix link
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(mixLink)) {
      return NextResponse.json(
        { error: 'Mix link must be a valid URL starting with http:// or https://' },
        { status: 400 }
      );
    }

    // Clean Instagram handle (remove @ if present)
    const cleanInstagramHandle = instagramHandle.replace('@', '');

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      replyTo: email, // User can reply directly to the artist
      subject: `French for New - Collaboration Request: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; font-size: 26px; margin: 0;">French for New</h1>
            <p style="color: #666; margin: 5px 0;">Artist Collaboration Request</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0; font-size: 20px;">Artist Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold; width: 150px;">Name:</td>
                <td style="padding: 10px 0; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Genre:</td>
                <td style="padding: 10px 0; color: #333;">${genre}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; color: #333;"><a href="mailto:${email}" style="color: #0066cc;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Gender:</td>
                <td style="padding: 10px 0; color: #333;">${gender}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Location:</td>
                <td style="padding: 10px 0; color: #333;">${location}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Instagram:</td>
                <td style="padding: 10px 0; color: #333;"><a href="https://instagram.com/${cleanInstagramHandle}" target="_blank" style="color: #0066cc;">@${cleanInstagramHandle}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Mix Link:</td>
                <td style="padding: 10px 0; color: #333;"><a href="${mixLink}" target="_blank" style="color: #0066cc; word-break: break-all;">${mixLink}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Submitted:</td>
                <td style="padding: 10px 0; color: #333;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0; font-size: 16px;">📝 Next Steps</h3>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>Review the artist's mix and social media presence</li>
              <li>Assess fit with French for New's brand and events</li>
              <li>Reply directly to this email to contact the artist</li>
              <li>Schedule a call or meeting if interested</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #888; font-size: 14px; margin: 0;">
              This collaboration request was submitted through the French for New website.
            </p>
            <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">
              Visit us at frenchfornew.com
            </p>
          </div>
        </div>
      `,
      text: `
French for New - Artist Collaboration Request

Artist Information:
==================
Name: ${name}
Genre: ${genre}
Email: ${email}
Gender: ${gender}
Location: ${location}
Instagram: @${cleanInstagramHandle}
Mix Link: ${mixLink}
Submitted: ${new Date().toLocaleString()}

Next Steps:
- Review the artist's mix and social media presence
- Assess fit with French for New's brand and events
- Reply directly to this email to contact the artist
- Schedule a call or meeting if interested

---
This collaboration request was submitted through the French for New website.
Visit us at frenchfornew.com
      `.trim(),
    });

    console.log('✅ Collaboration email sent successfully:', emailResult);

    return NextResponse.json(
      { success: true, message: 'Collaboration request sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error sending collaboration email:', error);
    
    return NextResponse.json(
      { error: 'Failed to send collaboration request. Please try again later.' },
      { status: 500 }
    );
  }
}