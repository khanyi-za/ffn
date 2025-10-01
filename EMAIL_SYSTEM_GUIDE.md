# French For New - Email System Documentation

This guide provides a comprehensive overview of the email functionality in the French For New website, powered by the **Resend** framework.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Resend Framework](#resend-framework)
3. [Environment Configuration](#environment-configuration)
4. [Email System Architecture](#email-system-architecture)
5. [Email Types](#email-types)
   - [Contact Form Emails](#1-contact-form-emails)
   - [Purchase Notification Emails](#2-purchase-notification-emails)
   - [Newsletter Signup Emails](#3-newsletter-signup-emails)
   - [Artist Collaboration Emails](#4-artist-collaboration-emails)
6. [Algorithm & Flow Diagrams](#algorithm--flow-diagrams)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The French For New website uses **Resend** as its email service provider to handle all email communications. The system manages four distinct types of emails:

1. **Contact Form Submissions** - General inquiries from website visitors
2. **Purchase Notifications** - Alerts when customers intend to purchase merchandise
3. **Newsletter Signups** - Merchandise drop notification requests
4. **Artist Collaborations** - DJ/Artist collaboration requests

### Why Resend?

- **Reliable Delivery**: High deliverability rates, emails don't go to spam
- **Developer-Friendly**: Simple API with TypeScript support
- **Professional Templates**: Full HTML email support with styling
- **Domain Verification**: Can send from your own domain (e.g., @frenchfornew.com)
- **No Complex Setup**: No SMTP configuration required

---

## Resend Framework

### What is Resend?

Resend is a modern email API service designed for developers. It provides a simple way to send transactional emails from applications.

### Installation

```bash
npm install resend
```

### Basic Usage Pattern

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'sender@domain.com',
  to: 'recipient@domain.com',
  subject: 'Email Subject',
  html: '<p>HTML content</p>',
  text: 'Plain text fallback'
});
```

---

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file with the following variables:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=your_verified_sender@domain.com
RESEND_TO_EMAIL=admin@frenchfornew.com
```

### Variable Descriptions

| Variable | Purpose | Example |
|----------|---------|---------|
| `RESEND_API_KEY` | API key from Resend dashboard | `re_R4zdG1X4_...` |
| `RESEND_FROM_EMAIL` | Verified sender email address | `khanyi@yiiva.co.za` |
| `RESEND_TO_EMAIL` | Admin email (receives all notifications) | `info@frenchfornew.com` |

### Getting Your API Key

1. Sign up at [resend.com](https://resend.com)
2. Navigate to **API Keys** in dashboard
3. Create a new API key
4. Copy and add to `.env.local`

### Domain Verification (Optional but Recommended)

1. Add your domain in Resend dashboard
2. Add DNS records to your domain registrar
3. Wait for verification (usually 24-48 hours)
4. Update `RESEND_FROM_EMAIL` to use your verified domain

---

## Email System Architecture

### Project Structure

```
src/
├── app/
│   ├── api/                           # Email API endpoints
│   │   ├── contact/
│   │   │   └── route.ts              # Contact form handler
│   │   ├── purchase-notification/
│   │   │   └── route.ts              # Purchase notification handler
│   │   ├── newsletter/
│   │   │   └── route.ts              # Newsletter signup handler
│   │   └── collaboration/
│   │       └── route.ts              # Artist collaboration handler
│   ├── contact/
│   │   └── page.tsx                  # Contact page (uses ContactForm)
│   └── shop/
│       └── [slug]/
│           └── page.tsx              # Product page (purchase flow)
└── components/
    ├── contact-form.tsx              # Contact form component
    └── collaboration-modal.tsx       # Collaboration modal component
```

### Data Flow

```
User Interface (Form)
        ↓
   Form Submission (POST)
        ↓
   API Route (/api/*)
        ↓
   Validation & Processing
        ↓
   Resend API Call
        ↓
   Email Delivery
        ↓
   Response to User
```

---

## Email Types

## 1. Contact Form Emails

### Purpose
Handles general inquiries, booking requests, and questions from website visitors via the contact page.

### Files Involved

**API Route**: `src/app/api/contact/route.ts` (106 lines)
**Frontend Component**: `src/components/contact-form.tsx` (189 lines)
**Page**: `src/app/contact/page.tsx` (41 lines)

---

### Algorithm Flow

```
┌─────────────────────────────────────────────┐
│ 1. User fills out contact form             │
│    - Name                                   │
│    - Email                                  │
│    - Message                                │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 2. Frontend Validation                      │
│    - Check all fields filled                │
│    - Basic HTML5 email validation           │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 3. POST to /api/contact                     │
│    Body: { name, email, message }           │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 4. Backend Validation                       │
│    ✓ All fields present?                    │
│    ✓ Email format valid? (regex)            │
│    └─ Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 5. Prepare Email Data                       │
│    - Create HTML template                   │
│    - Create plain text fallback             │
│    - Add timestamp                          │
│    - Set replyTo = user's email             │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 6. Send via Resend API                      │
│    resend.emails.send({                     │
│      from: RESEND_FROM_EMAIL,               │
│      to: RESEND_TO_EMAIL,                   │
│      replyTo: user_email,                   │
│      subject: "Contact Form: [Name]",       │
│      html: template,                        │
│      text: plaintext                        │
│    })                                       │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 7. Handle Response                          │
│    Success: Return { success: true }        │
│    Failure: Return { error: message }       │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 8. User Feedback                            │
│    - Show success/error message             │
│    - Clear form on success                  │
│    - Enable retry on error                  │
└─────────────────────────────────────────────┘
```

---

### Code Implementation

#### API Route (`src/app/api/contact/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse request body
    const body = await request.json();
    const { name, email, message } = body;

    // Step 2: Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Step 3: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Step 4: Send email using Resend
    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      replyTo: email, // Admin can reply directly
      subject: `French for New - Contact Form: ${name}`,
      html: `[HTML template]`,
      text: `[Plain text version]`
    });

    // Step 5: Return success response
    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    // Step 6: Handle errors
    console.error('❌ Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
```

#### Frontend Component (`src/components/contact-form.tsx`)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    // Make API call
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const result = await response.json()

    if (response.ok) {
      // Success - show message and clear form
      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully.'
      })
      setFormData({ name: "", email: "", message: "" })
    } else {
      // Error from API
      setSubmitStatus({
        type: 'error',
        message: result.error || 'Something went wrong.'
      })
    }
  } catch (error) {
    // Network error
    setSubmitStatus({
      type: 'error',
      message: 'Failed to send message. Please check your connection.'
    })
  } finally {
    setIsSubmitting(false)
  }
}
```

---

### Email Template

**HTML Version** (Rendered in email clients):
- Professional header with company branding
- Contact details in a styled table
- Message in a formatted box
- Footer with website link

**Plain Text Version** (Fallback):
```
New Contact Form Submission

Name: John Doe
Email: john@example.com
Submitted: 2025-10-01 14:30:00

Message:
Hello, I'm interested in booking...

---
This email was sent from the French for New contact form.
```

---

## 2. Purchase Notification Emails

### Purpose
Notifies admin when a customer completes the purchase form and is about to make payment. Helps admin prepare orders before payment is confirmed.

### Files Involved

**API Route**: `src/app/api/purchase-notification/route.ts` (152 lines)
**Frontend Page**: `src/app/shop/[slug]/page.tsx` (477 lines)

---

### Algorithm Flow

```
┌─────────────────────────────────────────────┐
│ 1. User views product page                  │
│    URL: /shop/football-jersey               │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 2. User fills out purchase form             │
│    - Email address                          │
│    - First & Last name                      │
│    - Street address                         │
│    - City, Province, Postal code            │
│    - Size selection (S-XXXL)                │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 3. Frontend Validation (isFormValid)        │
│    - Check all 8 fields filled              │
│    - Ensure size is selected                │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 4. User clicks "Purchase" button            │
│    - Button shows loading spinner           │
│    - Form disabled during submission        │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 5. Send notification to admin               │
│    POST /api/purchase-notification          │
│    Body: {                                  │
│      product: { id, name, price },          │
│      customerInfo: { all 8 fields }         │
│    }                                        │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 6. Backend Validation                       │
│    ✓ Product data present?                  │
│    ✓ All customer fields present?           │
│    ✓ Each field has value?                  │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 7. Format email with purchase details       │
│    - Product name, price, size              │
│    - Customer full details                  │
│    - Formatted address                      │
│    - Timestamp                              │
│    - Next steps section                     │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 8. Send via Resend API                      │
│    To: info@frenchfornew.com                │
│    Subject: "Purchase Intent: [Product]"    │
│    ReplyTo: customer email                  │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 9. Select random Yoco payment link          │
│    - Get links for product & size           │
│    - Filter out last used link              │
│    - Random selection from remaining        │
│    - Store selected link                    │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 10. Store order data locally                │
│     localStorage.setItem('lastOrderInfo')   │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 11. Redirect to Yoco payment                │
│     window.open(paymentLink, '_blank')      │
│     - Opens in new tab                      │
│     - User completes payment on Yoco        │
└─────────────────────────────────────────────┘
```

---

### Payment Link Selection Algorithm

```typescript
// Multiple payment links per product/size for load distribution
const paymentLinks = {
  'football-jersey': {
    'Small': [
      'https://pay.yoco.com/r/4gbaxz',
      'https://pay.yoco.com/r/m65oQn',
      'https://pay.yoco.com/r/4x5zk1'
    ],
    'Medium': [ /* 3 links */ ],
    // ... other sizes
  },
  'bowling-shirt': { /* similar structure */ }
};

// Random selection with no consecutive repeats
const getRandomPaymentLink = (productId: string, size: string): string => {
  // 1. Get links for product & size
  const links = paymentLinks[productId][size];

  // 2. Filter out last used link (avoid repeats)
  const availableLinks = lastUsedLink
    ? links.filter(link => link !== lastUsedLink)
    : links;

  // 3. Fallback if all links were same
  const linksToChooseFrom = availableLinks.length > 0
    ? availableLinks
    : links;

  // 4. Random selection
  const randomIndex = Math.floor(Math.random() * linksToChooseFrom.length);
  const selectedLink = linksToChooseFrom[randomIndex];

  // 5. Remember for next time
  setLastUsedLink(selectedLink);

  return selectedLink;
};
```

**Why Multiple Links?**
- **Load Distribution**: Prevents overwhelming a single payment link
- **Redundancy**: If one link fails, others available
- **Better Performance**: Spreads payment traffic
- **No Consecutive Repeats**: Ensures fair distribution

---

### Code Implementation

#### API Route (`src/app/api/purchase-notification/route.ts`)

```typescript
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

    const { email, firstName, lastName, streetAddress,
            city, province, postalCode, size } = customerInfo;

    // Validate all customer fields present
    if (!email || !firstName || !lastName || !streetAddress ||
        !city || !province || !postalCode || !size) {
      return NextResponse.json(
        { error: 'All customer fields are required' },
        { status: 400 }
      );
    }

    // Send purchase notification email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: 'info@frenchfornew.com',
      replyTo: email,
      subject: `French for New - Purchase Intent: ${product.name}`,
      html: `[Purchase details template]`,
      text: `[Plain text version]`
    });

    return NextResponse.json(
      { success: true, message: 'Purchase notification sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error sending purchase notification:', error);
    return NextResponse.json(
      { error: 'Failed to send purchase notification.' },
      { status: 500 }
    );
  }
}
```

---

### Email Template Highlights

**Warning Box** (Yellow):
```html
🛒 CUSTOMER READY TO PURCHASE
A customer has filled out all purchase details and is about to make payment.
```

**Product Details Section**:
- Product name
- Price (R700.00 / R800.00)
- Selected size
- Timestamp

**Customer Information Section**:
- Full name
- Email (clickable mailto link)
- Complete address (formatted)

**Next Steps Section** (Blue box):
```
💡 Next Steps
• Monitor Yoco payments for this customer
• Prepare [Product] (Size: [Size]) for shipping
• Contact customer at [email] if needed
```

---

## 3. Newsletter Signup Emails

### Purpose
Collects email addresses from users who want to be notified when new merchandise drops.

### Files Involved

**API Route**: `src/app/api/newsletter/route.ts` (96 lines)

---

### Algorithm Flow

```
┌─────────────────────────────────────────────┐
│ 1. User enters email in newsletter form     │
│    (Location: Footer or Shop page)          │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 2. Frontend Validation                      │
│    - Email field not empty                  │
│    - Basic HTML5 validation                 │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 3. POST to /api/newsletter                  │
│    Body: { email }                          │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 4. Backend Validation                       │
│    ✓ Email field present?                   │
│    ✓ Email format valid? (regex)            │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 5. Create notification email                │
│    Subject: "Merchandise Notification..."   │
│    Content: "Hi, my email [email], please   │
│             notify me when merch drops"     │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 6. Send via Resend to admin                 │
│    To: RESEND_TO_EMAIL                      │
│    ReplyTo: user's email                    │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 7. Return success response                  │
│    { success: true }                        │
└─────────────────────────────────────────────┘
```

---

### Code Implementation

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email present
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

    // Send notification to admin
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      replyTo: email,
      subject: 'French for New - Merchandise Notification Request',
      html: `[Newsletter signup template]`,
      text: `
        Hi, my email ${email}, please notify me when the merch drops.

        Email: ${email}
        Requested: ${new Date().toLocaleString()}
      `
    });

    return NextResponse.json(
      { success: true, message: 'Newsletter signup successful' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error sending newsletter signup:', error);
    return NextResponse.json(
      { error: 'Failed to process newsletter signup.' },
      { status: 500 }
    );
  }
}
```

---

## 4. Artist Collaboration Emails

### Purpose
Handles submission of artist/DJ collaboration requests from the contact page modal.

### Files Involved

**API Route**: `src/app/api/collaboration/route.ts` (152 lines)
**Frontend Component**: `src/components/collaboration-modal.tsx` (297 lines)
**Trigger**: Contact page "COLLABORATE WITH US" button

---

### Algorithm Flow

```
┌─────────────────────────────────────────────┐
│ 1. User clicks "COLLABORATE WITH US"        │
│    (On contact page)                        │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 2. Modal opens with collaboration form      │
│    Fields:                                  │
│    - Name (text)                            │
│    - Genre (text)                           │
│    - Email (email)                          │
│    - Gender (dropdown)                      │
│    - Location (text)                        │
│    - Mix Link (URL)                         │
│    - Instagram Handle (text)                │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 3. User fills out all 7 fields              │
│    - Required field validation              │
│    - Real-time status message clearing      │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 4. User submits form                        │
│    - Button shows loading spinner           │
│    - Form disabled during submission        │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 5. POST to /api/collaboration               │
│    Body: {                                  │
│      name, genre, email, gender,            │
│      location, mixLink, instagramHandle     │
│    }                                        │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 6. Backend Validation (4 layers)            │
│    ✓ All 7 fields present?                  │
│    ✓ Email format valid? (regex)            │
│    ✓ Mix link is valid URL? (starts http)   │
│    ✓ Clean Instagram handle (remove @)      │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 7. Format collaboration email               │
│    - Artist information table               │
│    - Clickable email & Instagram links      │
│    - Clickable mix link                     │
│    - Next steps section                     │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 8. Send via Resend API                      │
│    To: info@frenchfornew.com                │
│    Subject: "Collaboration Request: [Name]" │
│    ReplyTo: artist's email                  │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 9. Show success message                     │
│    "Thank you! We'll review your            │
│     submission and get back to you soon."   │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 10. Auto-close modal after 3 seconds        │
│     setTimeout(() => onClose(), 3000)       │
└─────────────────────────────────────────────┘
```

---

### Special Validation

#### Instagram Handle Cleaning
```typescript
// Remove @ symbol if user includes it
const cleanInstagramHandle = instagramHandle.replace('@', '');

// Result used in email template:
<a href="https://instagram.com/${cleanInstagramHandle}">
  @${cleanInstagramHandle}
</a>
```

#### URL Validation
```typescript
// Ensure mix link is a valid URL
const urlRegex = /^https?:\/\/.+/;
if (!urlRegex.test(mixLink)) {
  return NextResponse.json(
    { error: 'Mix link must be a valid URL starting with http:// or https://' },
    { status: 400 }
  );
}
```

---

### Code Implementation

#### API Route (`src/app/api/collaboration/route.ts`)

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, genre, email, gender, location, mixLink, instagramHandle } = body;

    // Validate all required fields
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

    // Validate URL format
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(mixLink)) {
      return NextResponse.json(
        { error: 'Mix link must be a valid URL' },
        { status: 400 }
      );
    }

    // Clean Instagram handle
    const cleanInstagramHandle = instagramHandle.replace('@', '');

    // Send collaboration email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      replyTo: email,
      subject: `French for New - Collaboration Request: ${name}`,
      html: `[Collaboration template with artist details]`,
      text: `[Plain text version]`
    });

    return NextResponse.json(
      { success: true, message: 'Collaboration request sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error sending collaboration email:', error);
    return NextResponse.json(
      { error: 'Failed to send collaboration request.' },
      { status: 500 }
    );
  }
}
```

---

### Email Template

**Artist Information Table**:
- Name
- Genre (e.g., Afrohouse, Amapiano)
- Email (clickable mailto)
- Gender
- Location (City, Country)
- Instagram (clickable link with @handle)
- Mix Link (clickable, word-wrapped)
- Submission timestamp

**Next Steps Section** (Yellow box):
```
📝 Next Steps
• Review the artist's mix and social media presence
• Assess fit with French for New's brand and events
• Reply directly to this email to contact the artist
• Schedule a call or meeting if interested
```

---

## Algorithm & Flow Diagrams

### Overall Email System Flow

```
                    ┌──────────────────────┐
                    │   User Interaction   │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    ┌─────▼─────┐        ┌────▼────┐        ┌─────▼─────┐
    │  Contact  │        │  Shop   │        │Collab Modal│
    │   Form    │        │  Page   │        │   Form     │
    └─────┬─────┘        └────┬────┘        └─────┬──────┘
          │                   │                    │
          │ POST              │ POST               │ POST
          │ /api/contact      │ /api/purchase-     │ /api/collaboration
          │                   │ notification       │
          │                   │                    │
    ┌─────▼─────────────────────▼────────────────────▼──────┐
    │                    API Layer                           │
    │  • Validate request data                               │
    │  • Check email format                                  │
    │  • Sanitize inputs                                     │
    └─────┬──────────────────────────────────────────────────┘
          │
          │ All routes use Resend
          │
    ┌─────▼──────────────────────────────────────────────────┐
    │                  Resend Service                         │
    │  const resend = new Resend(RESEND_API_KEY)             │
    │  await resend.emails.send({...})                       │
    └─────┬──────────────────────────────────────────────────┘
          │
          │ Email delivery
          │
    ┌─────▼──────────────────────────────────────────────────┐
    │               Admin Email Inbox                         │
    │         (info@frenchfornew.com)                        │
    │  • Contact inquiries                                    │
    │  • Purchase notifications                               │
    │  • Newsletter signups                                   │
    │  • Collaboration requests                               │
    └─────────────────────────────────────────────────────────┘
```

---

### Error Handling Flow

```
┌─────────────────────────────────────────────┐
│        User submits form                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Try sending email    │
        └──────────┬───────────┘
                   │
        ┌──────────▼───────────┐
        │   Email sent?        │
        └──┬───────────────┬───┘
           │ Yes           │ No
           │               │
    ┌──────▼─────┐  ┌──────▼──────────┐
    │  Success   │  │  Catch error    │
    │            │  │                 │
    │ 200 status │  │ • Log error     │
    │ { success: │  │ • Return 500    │
    │   true }   │  │ { error: msg }  │
    └──────┬─────┘  └──────┬──────────┘
           │                │
    ┌──────▼────────────────▼──────────┐
    │     Return to frontend           │
    └──────┬───────────────────────────┘
           │
    ┌──────▼───────────────┐
    │ Display result       │
    │ • Success: Green box │
    │ • Error: Red box     │
    └──────────────────────┘
```

---

## Error Handling

### Backend Error Handling

All API routes follow this pattern:

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate input
    // 2. Process data
    // 3. Send email
    // 4. Return success

    return NextResponse.json(
      { success: true, message: 'Success message' },
      { status: 200 }
    );

  } catch (error) {
    // Log error for debugging
    console.error('❌ Error description:', error);

    // Return user-friendly error
    return NextResponse.json(
      { error: 'User-friendly error message' },
      { status: 500 }
    );
  }
}
```

### Frontend Error Handling

```typescript
try {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (response.ok) {
    // Success case
    setSubmitStatus({
      type: 'success',
      message: 'Success message for user'
    });
  } else {
    // API returned error
    setSubmitStatus({
      type: 'error',
      message: result.error || 'Generic error message'
    });
  }

} catch (error) {
  // Network or parsing error
  setSubmitStatus({
    type: 'error',
    message: 'Connection error. Please try again.'
  });
} finally {
  setIsSubmitting(false);
}
```

### Common Error Types

| Error Type | Status | Cause | Resolution |
|------------|--------|-------|------------|
| **Missing fields** | 400 | Required data not provided | Fill all required fields |
| **Invalid email** | 400 | Email format incorrect | Use valid email format |
| **Invalid URL** | 400 | Mix link not a valid URL | Use full URL with http:// |
| **Resend API error** | 500 | API key invalid or rate limit | Check API key, wait if rate limited |
| **Network error** | N/A | Connection failed | Check internet connection |
| **Parsing error** | 500 | Malformed request | Check request format |

---

## Testing

### Local Testing Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env.local
# Add your Resend API key
```

3. **Start dev server**:
```bash
npm run dev
```

### Testing Each Email Type

#### 1. Contact Form
```bash
# Navigate to
http://localhost:3000/contact

# Fill form:
- Name: Test User
- Email: test@example.com
- Message: This is a test message

# Submit and check:
✓ Success message shown?
✓ Form cleared?
✓ Email received at admin address?
```

#### 2. Purchase Notification
```bash
# Navigate to
http://localhost:3000/shop/football-jersey

# Fill form:
- All address fields
- Select size
- Email: test@example.com

# Click "Purchase" and check:
✓ Loading spinner shown?
✓ Yoco payment link opened in new tab?
✓ Purchase notification email received?
```

#### 3. Newsletter Signup
```bash
# Navigate to footer on any page
# Or shop page

# Enter email: test@example.com
# Submit and check:
✓ Success message shown?
✓ Newsletter signup email received?
```

#### 4. Artist Collaboration
```bash
# Navigate to
http://localhost:3000/contact

# Click "COLLABORATE WITH US"

# Fill modal form:
- Name: Test Artist
- Genre: Afrohouse
- Email: artist@example.com
- Gender: Select option
- Location: Cape Town, South Africa
- Mix Link: https://soundcloud.com/test
- Instagram: @testartist

# Submit and check:
✓ Success message shown?
✓ Modal auto-closes after 3s?
✓ Collaboration email received?
```

### Testing Email Delivery

#### Using Resend Dashboard
1. Log into [resend.com](https://resend.com)
2. Navigate to "Logs"
3. View sent emails
4. Check delivery status
5. View email content

#### Manual API Testing
```bash
# Test contact endpoint
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'

# Expected response:
{"success":true,"message":"Email sent successfully"}
```

---

## Troubleshooting

### Problem: Emails not being sent

**Possible causes**:
1. Invalid API key
2. Rate limiting
3. Unverified sender domain
4. Network connectivity issues

**Solutions**:
```bash
# 1. Check API key
echo $RESEND_API_KEY
# Should start with "re_"

# 2. Check Resend dashboard for errors
# Visit: https://resend.com/logs

# 3. Verify environment variables loaded
# In your API route, add:
console.log('API Key exists:', !!process.env.RESEND_API_KEY);
console.log('From email:', process.env.RESEND_FROM_EMAIL);
```

### Problem: Emails going to spam

**Solutions**:
1. **Verify domain with Resend**
   - Add DNS records (SPF, DKIM, DMARC)
   - Wait for verification

2. **Use verified sender email**
   - Don't use free email providers (Gmail, Yahoo) as sender
   - Use your own domain

3. **Improve email content**
   - Include plain text version
   - Avoid spam trigger words
   - Include unsubscribe link (for newsletters)

### Problem: Invalid email format errors

**Check regex pattern**:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valid:
test@example.com ✓
user.name@domain.co.za ✓

// Invalid:
test@example (no TLD) ✗
@example.com (no user) ✗
test example@domain.com (space) ✗
```

### Problem: Purchase notifications not triggering payment

**Check flow**:
```typescript
// 1. Verify payment links array exists
console.log('Payment links:', paymentLinks[productId][size]);

// 2. Check random selection logic
const selectedLink = getRandomPaymentLink(productId, size);
console.log('Selected link:', selectedLink);

// 3. Verify window.open executed
window.open(selectedLink, '_blank'); // Should open new tab
```

### Problem: Form not clearing after submission

**Ensure state reset**:
```typescript
if (response.ok) {
  // Reset form state
  setFormData({
    name: "",
    email: "",
    message: "",
    // ... all fields
  });

  // Show success
  setSubmitStatus({
    type: 'success',
    message: 'Success!'
  });
}
```

### Problem: Resend rate limiting

**Solutions**:
1. Check Resend plan limits
2. Implement client-side rate limiting
3. Add delays between automated tests
4. Upgrade Resend plan if needed

**Rate limits by plan**:
- Free: 100 emails/day
- Pro: 50,000 emails/month
- Business: Custom limits

---

## Best Practices

### 1. Always Include Plain Text Version
```typescript
await resend.emails.send({
  html: '<p>HTML content</p>',
  text: 'Plain text fallback' // Important!
});
```

### 2. Use ReplyTo for User Emails
```typescript
await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL,
  to: 'admin@frenchfornew.com',
  replyTo: userEmail, // Admin can reply directly to user
  subject: 'Subject',
  html: 'Content'
});
```

### 3. Validate on Both Client and Server
```typescript
// Client-side (quick feedback)
if (!email || !name) {
  alert('Please fill all fields');
  return;
}

// Server-side (security)
if (!email || !name) {
  return NextResponse.json(
    { error: 'All fields required' },
    { status: 400 }
  );
}
```

### 4. Log Errors for Debugging
```typescript
catch (error) {
  console.error('❌ Error sending email:', error);
  // Log to external service in production
}
```

### 5. Provide User-Friendly Error Messages
```typescript
// ✗ Bad
{ error: 'ERR_RESEND_API_KEY_INVALID' }

// ✓ Good
{ error: 'Failed to send email. Please try again later.' }
```

---

## Summary

### Email System Overview

| Email Type | Trigger | Purpose | API Route | Frontend |
|------------|---------|---------|-----------|----------|
| **Contact** | Contact form | General inquiries | `/api/contact` | `contact-form.tsx` |
| **Purchase** | Shop checkout | Order notifications | `/api/purchase-notification` | `shop/[slug]/page.tsx` |
| **Newsletter** | Footer signup | Merch drop alerts | `/api/newsletter` | Footer component |
| **Collaboration** | Collab modal | Artist requests | `/api/collaboration` | `collaboration-modal.tsx` |

### Key Features

✓ **Resend Integration** - Modern, reliable email delivery
✓ **Professional Templates** - HTML + plain text versions
✓ **Comprehensive Validation** - Client and server-side
✓ **Error Handling** - Graceful failures with user feedback
✓ **Reply-To Support** - Admin can reply directly to users
✓ **Multiple Use Cases** - 4 distinct email types
✓ **TypeScript** - Type-safe implementation

---

**Last Updated**: October 2025
**Framework**: Resend v4.7.0
**Maintained By**: French For New Development Team

