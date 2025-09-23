# French For New - Project Handover Documentation

## Table of Contents
1. [Functional Synopsis](#functional-synopsis)
2. [Project Overview](#project-overview)
3. [Deployment Setup (Vercel & GitHub)](#deployment-setup-vercel--github)
4. [Image Optimization & Gallery Thumbnails](#image-optimization--gallery-thumbnails)
5. [AWS S3 & CloudFront Setup](#aws-s3--cloudfront-setup)
6. [Project Scripts & Tools](#project-scripts--tools)
7. [Resend Email Integration](#resend-email-integration)
8. [Gallery S3 Folder Structure](#gallery-s3-folder-structure)
9. [Architecture & Components](#architecture--components)
10. [Environment Setup for New Developer](#environment-setup-for-new-developer)

---

## Functional Synopsis

This section walks you through exactly how each major component works in the French For New website. If you're seeing this project for the first time, this will help you understand what each part does and how they connect together.

### How the Upcoming Events Component Works

**Step 1: Understanding What It Does**
When you visit the homepage, you'll see a section that shows promotional banners for upcoming events. These banners automatically change every few seconds, cycling through different event announcements.

**Step 2: Where to Find the Code**
- **File Location**: `src/components/upcoming-events.tsx`
- **Used On**: Homepage (`src/app/page.tsx` imports and displays this component)

**Step 3: How the Data Works**
1. **No Database Required**: Event information is stored directly in the component as JavaScript objects
2. **Event Data Structure**: Each event has:
   - Event name (e.g., "SoundSet Sunday")
   - Date information
   - Poster image path (stored in `/public/upcoming_events_poster/`)
   - Ticket purchase link (external URL)

**Step 4: The Automatic Image Cycling**
1. **React State**: The component uses `useState` to track which event poster is currently showing
2. **Timer Setup**: `useEffect` creates a timer that runs every 5 seconds
3. **Image Switching**: When the timer triggers, it updates the state to show the next event poster
4. **Smooth Transitions**: CSS transitions make the image changes look smooth

**Step 5: User Interaction**
1. **Hover Effects**: When users hover over an event banner, it shows additional details
2. **Click Action**: "Get Tickets" buttons link directly to external ticketing websites
3. **Responsive Design**: Layout automatically adjusts for mobile phones vs desktop screens

**Step 6: Why It's Built This Way**
- **Simple to Update**: To add a new event, you just edit the component file - no database changes needed
- **Fast Loading**: All images are stored locally, so they load instantly
- **Low Maintenance**: No complex backend systems to manage

### How the Shop System Works

The shop system has two main parts: a product listing page and individual product detail pages. Let's walk through how each works.

#### Part 1: Shop Listing Page (`src/app/shop/page.tsx`)

**Step 1: Understanding What Users See**
When someone clicks "SHOP" in the navigation, they land on a page that shows:
- A hero section with cycling background images
- An animated "SHOP..." title that types and erases itself
- A grid showing all available products (currently 2 items)

**Step 2: How the Product Data Works**
1. **No Database**: Products are defined directly in the component as TypeScript objects
2. **Current Products**: 
   - Football Jersey (R700.00)
   - Bowling Shirt (R800.00)
3. **Product Information Includes**:
   - Unique ID and name
   - Price in South African Rand (ZAR)
   - Array of image file paths
   - Description text
   - URL-friendly "slug" for the product page

**Step 3: How the Visual Effects Work**
1. **Hero Background Cycling**: 
   - Two promotional images stored in `/public/images/`
   - `useEffect` timer switches between them every 5 seconds
   - CSS transitions create smooth fade effects
2. **Typewriter Title Effect**:
   - Custom component that types "SHOP..." letter by letter
   - After completing, it erases and starts over
   - Creates an engaging, dynamic feel

**Step 4: How Product Images Work**
- Product photos are stored in `/public/merch/[product-name]/` folders
- Each product has multiple photos (4-5 images each)
- The listing page shows the first image from each product's array
- Hover effects reveal "View Details" overlay

#### Part 2: Individual Product Pages (`src/app/shop/[slug]/page.tsx`)

**Step 1: Understanding the URL Structure**
- URLs look like: `/shop/football-jersey` or `/shop/bowling-shirt`
- Next.js automatically routes these to the `[slug]` page
- The slug matches the product's slug property from the data

**Step 2: How the Page Finds the Right Product**
1. **URL Parameter**: Next.js passes the slug (e.g., "football-jersey") to the component
2. **Product Lookup**: Component searches the product array for matching slug
3. **Error Handling**: If no product is found, shows "Product not found" message

**Step 3: Product Image Gallery System**
1. **Main Display**: Shows large version of currently selected image
2. **Thumbnail Row**: Small versions of all product images below
3. **Click to Switch**: Clicking a thumbnail changes the main image
4. **State Management**: `useState` tracks which image is currently active

**Step 4: Size Selection Process**
1. **Dropdown Menu**: Shows options from S to XXXL
2. **Required Selection**: User must choose a size before proceeding
3. **State Tracking**: Selected size is stored in React state
4. **Form Integration**: Size gets included in the order information

**Step 5: Customer Information Collection**
The form collects:
- Full name (required)
- Email address (required)
- Phone number (required)
- Delivery address (required)

**Step 6: The Purchase Process Flow**
1. **Form Submission**: Customer fills out all required fields
2. **Validation**: JavaScript checks all fields are complete
3. **Email Notification**: System sends order details to admin via Resend API
4. **Payment Link Selection**: System randomly chooses from multiple Yoco payment URLs
5. **Redirect**: Customer is sent to the payment processor

**Step 7: Why Multiple Payment Links**
- **Load Distribution**: Prevents any single payment link from being overwhelmed
- **Redundancy**: If one link fails, others are available
- **Better Performance**: Spreads traffic across multiple Yoco accounts
- **Random Selection**: Ensures even distribution of payments

### How the Gallery Page Works

The gallery is the most complex part of the website. It shows thousands of event photos organized by event, date, and photographer. Here's how it all works together:

**Step 1: Understanding What Users See**
- A filtering system at the top (dropdowns for Event, Date, Photographer)
- A grid of photos that loads more as you scroll down
- Click any photo to see it full-screen with download options

**Step 2: The File Locations**
- **Main Page**: `src/app/gallery/page.tsx`
- **API Endpoint**: `src/app/api/s3-images/route.ts`
- **Download API**: `src/app/api/download-image/route.ts`

**Step 3: How the Two-Part Image System Works**
This is the key to understanding the gallery - it uses TWO different sources for images:

1. **For Browsing (Fast Loading)**:
   - Small thumbnail versions stored locally in `/public/thumbnails/`
   - These load instantly because they're on the same server
   - Created by running scripts that download and optimize S3 images

2. **For Downloading (High Quality)**:
   - Original full-resolution images stored on AWS S3
   - Delivered through CloudFront CDN for global speed
   - Only loaded when user specifically wants to download

**Step 4: The Three-Level Filter System**
1. **Event Level** (e.g., "SoundSet Sunday", "Electic Sessions")
   - When page loads, API calls S3 to get list of all event folders
   - Populates the Event dropdown

2. **Date Level** (e.g., "09 February 2025", "13 April 2025")
   - When user selects an event, API gets all date folders within that event
   - Populates the Date dropdown

3. **Photographer Level** (e.g., "Hooduniversal", "patra_shot.it")
   - When user selects a date, API gets all photographer folders within that date
   - Shows as filter buttons or dropdown

**Step 5: How the API Calls Work**
1. **Initial Load**: Browser calls `/api/s3-images` with no parameters
2. **Filter Changes**: Each filter selection makes a new API call with updated parameters
3. **API Response**: Returns array of image data including:
   - Thumbnail URL (local file)
   - Original URL (S3/CloudFront)
   - Image name and metadata
   - Whether local thumbnail exists

**Step 6: The Infinite Scroll Loading**
1. **Batch Loading**: Loads 24 images at a time
2. **Scroll Detection**: JavaScript watches when user scrolls near bottom
3. **Next Batch**: Automatically loads next 24 images
4. **Performance**: Prevents loading thousands of images at once

**Step 7: The Waterfall Grid Layout**
1. **Aspect Ratio Detection**: System determines if each image is tall, wide, or square
2. **Dynamic Sizing**: Grid automatically adjusts to fit different image shapes
3. **Responsive Design**: Grid columns change based on screen size (mobile vs desktop)

**Step 8: The Lightbox Modal System**
1. **Click to Open**: Clicking any thumbnail opens full-screen view
2. **Navigation**: Left/right arrows to browse through images
3. **Download Button**: Streams original high-quality file from S3
4. **Progress Tracking**: Shows download progress for large files

**Step 9: How Downloads Work**
1. **Stream Processing**: `/api/download-image` endpoint streams files directly from S3
2. **No Local Storage**: Large original files aren't stored on the server
3. **Direct Transfer**: Files go straight from S3 to user's browser
4. **Proper Headers**: Sets correct filename and content type for download

**Step 10: Why This Complex System Exists**
- **Speed**: Local thumbnails load instantly for browsing
- **Quality**: Original S3 files available for downloads
- **Cost**: Reduces S3 bandwidth by serving thumbnails locally
- **Scalability**: Can handle thousands of images without performance issues
- **User Experience**: Fast browsing + high-quality downloads when needed

### How the Scripts Work and Why We Have Them

The scripts in `/scripts/` directory are tools that run on your computer (not on the website) to prepare and optimize images. Think of them as maintenance tools that keep the website running smoothly.

#### Why Scripts Instead of Real-Time Processing?

**Step 1: Understanding the Problem**
- Images from photographers are often 5-10MB each (very large)
- Loading these directly would make the website extremely slow
- Processing images in real-time would crash the server
- We need smaller, optimized versions for web display

**Step 2: The Solution - Offline Processing**
- Scripts run on your local computer or server
- They download, resize, and optimize images when you have time
- Processed images are then uploaded to the website
- Website serves fast, pre-optimized images to users

#### The Main Script: Thumbnail Generation (`generate-thumbnails.js`)

**Step 1: What This Script Does**
This is the most important script - it creates the thumbnails for the gallery system.

**Step 2: How It Works**
1. **Connects to S3**: Uses AWS credentials to access the image storage
2. **Scans Folders**: Looks through all event/date/photographer folders
3. **Downloads Originals**: Gets the full-size images from S3 
4. **Creates Thumbnails**: Uses Sharp.js to resize and compress images
5. **Saves Locally**: Puts optimized versions in `/public/thumbnails/`

**Step 3: The Optimization Settings**
- **Target Size**: About 350KB per thumbnail (vs 5-10MB originals)
- **Max Width**: 1000 pixels wide (perfect for web display)
- **Quality**: 75% JPEG quality (good balance of size vs quality)
- **Format**: Keeps original format (JPG stays JPG, PNG stays PNG)

**Step 4: How to Run It**
```bash
# Generate all thumbnails
npm run generate-thumbnails

# Generate for specific event folder
npm run generate-thumbnails -- --folder "SoundSet Sunday/27 April 2025"

# Test without actually creating files
npm run generate-thumbnails:dry-run
```

**Step 5: Batch Processing Strategy**
- Processes 5 images at a time (prevents overwhelming S3)
- Adds small delays between downloads
- Shows progress as it works through hundreds of images
- Can resume if interrupted

#### Other Image Optimization Scripts

**Step 1: Understanding Why Multiple Scripts**
Different parts of the website need different types of image optimization:

**Step 2: The Five Optimization Scripts**
1. **`optimize-hero-images.js`** - Homepage background images
   - Larger sizes needed for full-screen display
   - Higher quality to look professional

2. **`optimize-row-images.js`** - Brand logo carousel images
   - Small sizes since they're just logos
   - High compression to load quickly

3. **`optimize-shop-images.js`** - Product promotional photos
   - Medium quality for product appeal
   - Multiple formats (WebP for modern browsers, JPG for compatibility)

4. **`optimize-team-images.js`** - About page team photos
   - Consistent sizing for uniform layout
   - Portrait optimization

5. **`optimize-merch-folder-images.js`** - Individual product photos
   - High quality for detailed product views
   - Multiple resolutions for different use cases

**Step 3: Common Features All Scripts Share**
1. **Backup System**: Always saves original files before modifying
2. **Dry-Run Mode**: Test the script without making changes
3. **Multiple Formats**: Creates WebP (modern) and JPG (compatible) versions
4. **Sharp.js Processing**: Uses professional image processing library
5. **Progress Reporting**: Shows what it's doing as it works

**Step 4: When to Run These Scripts**
- **Thumbnail Generation**: After new event photos are uploaded to S3
- **Other Scripts**: When you add new images to the respective folders
- **Before Deployment**: Ensure all images are optimized before going live

### How Deployment Works

Understanding how your code changes become the live website is crucial for any developer working on this project.

**Step 1: The Current Setup Overview**
- **Code Storage**: All code lives in a GitHub repository
- **Hosting**: Website runs on Vercel (a hosting platform)
- **Connection**: GitHub repository is connected to Vercel account
- **Automation**: Changes automatically become live when you push to the main branch

**Step 2: The Automatic Deployment Process**
1. **Local Development**: You make changes on your computer
2. **Git Commit**: You save changes using `git commit`
3. **Push to Main**: You upload changes with `git push origin main`
4. **Vercel Detection**: Vercel automatically sees the new code
5. **Build Process**: Vercel downloads code and builds the website (2-3 minutes)
6. **Go Live**: New version automatically replaces the old website
7. **Notification**: You get email confirmation when deployment is complete

**Step 3: What "Main Branch" Means**
- **Main Branch**: The primary version of your code (called `main` in Git)
- **Other Branches**: You can create other versions for testing (like `feature-xyz`)
- **Deployment Rule**: ONLY changes pushed to `main` branch go live
- **Safety**: This prevents experimental code from accidentally going live

**Step 4: Why We Don't Use Vercel Cron Jobs**
Vercel offers "cron jobs" (automated tasks that run on schedule), but we deliberately don't use them:

1. **Cost Reasons**: Cron jobs consume server resources and cost money
2. **Control**: Running scripts manually gives us better control over when they happen
3. **Resource Intensity**: Image processing scripts use a lot of memory and CPU
4. **Reliability**: Manual execution is more predictable than automated scheduling

**Step 5: What Runs Automatically vs Manually**
- **Automatic**: Code deployment when you push to main
- **Manual**: All image processing scripts (thumbnails, optimization)
- **Manual**: Uploading new images to S3
- **Manual**: Environment variable changes

**Step 6: Deployment Best Practices**
1. **Test Locally First**: Always run `npm run dev` and test changes before pushing
2. **Check for Errors**: Run `npm run build` to catch build errors locally
3. **Small Changes**: Push small, focused changes rather than huge updates
4. **Monitor Deployment**: Watch Vercel dashboard to ensure deployment succeeds

### How the Email System Works

The website sends emails in two situations: when someone contacts the company, and when someone wants to buy merchandise. Here's how both work:

#### Part 1: Contact Page Emails (`src/app/contact/page.tsx`)

**Step 1: What Users See**
- A contact form with fields for name, email, and message
- Submit button that sends their message to the company

**Step 2: The Form Submission Process**
1. **Client Validation**: JavaScript checks that all fields are filled out
2. **Form Submission**: Data gets sent to `/api/contact` endpoint
3. **Server Validation**: API double-checks that data is valid
4. **Email Creation**: System builds a professional HTML email
5. **Email Sending**: Email goes to admin via Resend service
6. **User Feedback**: User sees success or error message

**Step 3: What the Admin Receives**
- **Subject**: "New Contact Form Submission"
- **Content**: Nicely formatted email with:
  - Person's name and email
  - Their message
  - Timestamp of when submitted
  - Professional styling matching the brand

#### Part 2: Purchase Notification Emails (`/api/purchase-notification`)

**Step 1: When These Emails Are Triggered**
- Customer fills out product information form in the shop
- BEFORE they go to payment (so admin knows about purchase intent)
- Helps admin prepare for potential orders

**Step 2: The Purchase Email Process**
1. **Form Completion**: Customer fills out name, email, phone, address, size
2. **Data Validation**: System checks all required fields are complete
3. **Email Generation**: Creates detailed order information email
4. **Admin Notification**: Email sent to admin immediately
5. **Payment Redirect**: Customer then goes to payment processor

**Step 3: What the Admin Receives**
- **Subject**: "New Purchase Intent - [Product Name]"
- **Content**: Complete order details including:
  - Product name and price
  - Selected size
  - Customer's full contact information
  - Delivery address
  - Timestamp

#### Part 3: The Email Service (Resend)

**Step 1: Why We Use Resend Instead of Other Services**
- **Reliability**: Very high email delivery rates (emails don't go to spam)
- **Professional Templates**: Supports HTML emails with styling
- **Simple Integration**: Easy to use with Next.js
- **Domain Verification**: Can send emails from your own domain (like @frenchfornew.com)

**Step 2: How Resend Works**
1. **API Key**: Stored securely in environment variables
2. **API Call**: Website makes HTTP request to Resend when email is needed
3. **Email Processing**: Resend handles the actual sending
4. **Delivery**: Email appears in recipient's inbox

**Step 3: The Email Template System**
- **HTML Templates**: Professional-looking emails with proper styling
- **Brand Consistency**: Uses company colors and fonts
- **Responsive Design**: Looks good on mobile phones and computers
- **Plain Text Backup**: If HTML doesn't work, there's a text-only version

**Step 4: Configuration Details**
- **Sender Email**: What appears in the "From" field (stored in environment variables)
- **Recipient Email**: Where all emails go (admin's email address)
- **API Credentials**: Secure keys that let the website use Resend service

**Step 5: How to Update Email Settings**
1. **Change Recipients**: Update `RESEND_TO_EMAIL` in environment variables
2. **Change Sender**: Update `RESEND_FROM_EMAIL` (must be verified domain)
3. **Modify Templates**: Edit the HTML in the API route files
4. **Test Changes**: Use the contact form to test email functionality

This email system ensures that the business never misses a customer inquiry or potential sale, while providing professional communication that matches the brand's image.

---

## Project Overview

French For New is a Next.js 15 application for an event management and merchandise company. The site features:
- Event gallery with S3-hosted images
- E-commerce shop with Yoco payment integration
- Contact forms and email notifications
- Dynamic image optimization and thumbnail generation
- CloudFront CDN for global image delivery

**Tech Stack:**
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- AWS S3 + CloudFront
- Resend for email
- Yoco for payments
- Vercel for deployment

---

## Deployment Setup (Vercel & GitHub)

### Current Setup
- **GitHub Repository**: Connected to Vercel for automatic deployments
- **Deployment Trigger**: Push to `main` branch triggers automatic deployment
- **Environment**: Production deployment on Vercel

### Setting Up Your Own Deployment

#### 1. GitHub Repository Setup
1. Fork or clone the repository to your own GitHub account
2. Ensure you have access to push to the `main` branch

#### 2. Vercel Account Setup
1. Sign up for a Vercel account at [vercel.com](https://vercel.com)
2. Connect your GitHub account to Vercel
3. Import the repository from GitHub (no CLI installation needed)

#### 3. Environment Variables
Add these environment variables in your Vercel project dashboard:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET_NAME=your_bucket_name
CLOUDFRONT_DOMAIN=your_cloudfront_domain

# Email Configuration
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_sender_email
RESEND_TO_EMAIL=admin_recipient_email
```

#### 4. Vercel Configuration
The `vercel.json` file (already in the project) defines function timeouts:
```json
{
  "functions": {
    "src/app/api/**": { "maxDuration": 45 },
    "src/app/api/download-image/**": { "maxDuration": 120 },
    "src/app/api/s3-images/**": { "maxDuration": 60 }
  }
}
```

#### 5. Automatic Deployment Process
1. **GitHub Integration**: Vercel automatically connects to your GitHub repository
2. **Push to Main**: Every push to the `main` branch triggers automatic deployment
3. **Build & Deploy**: Vercel handles the build process and deployment (no manual commands needed)
4. **Live Site**: Your changes go live automatically within 2-3 minutes

**No CLI Required**: Everything is handled through the web interface and GitHub integration. You never need to run `vercel deploy` commands manually.

---

## Image Optimization & Gallery Thumbnails

### How It Works
The gallery system uses a two-tier approach:
1. **Original images** stored in S3
2. **Thumbnails** generated locally and served from `/public/thumbnails`

### Thumbnail Generation Script
**Location**: `scripts/generate-thumbnails.js`

**Purpose**: Downloads S3 images and creates medium-resolution thumbnails (~350KB, max 1000px width)

**Usage**:
```bash
# Generate all thumbnails
npm run generate-thumbnails

# Generate for specific folder
npm run generate-thumbnails -- --folder "SoundSet Sunday/27 April 2025"

# Dry run (preview without creating files)
npm run generate-thumbnails:dry-run
```

**Process**:
1. Scans S3 bucket for images
2. Downloads original images
3. Creates optimized thumbnails using Sharp
4. Saves to `public/thumbnails` with same folder structure
5. Gallery page serves thumbnails from local files for faster loading

### Gallery Thumbnail Integration
- **Gallery page** (`src/app/gallery/page.tsx`) fetches image metadata from S3 API
- **Thumbnails served** from `/public/thumbnails/` directory
- **Full resolution** downloaded via `/api/download-image` streaming endpoint
- **Aspect ratio detection** for proper grid layout (tall/wide/square)

---

## AWS S3 & CloudFront Setup

### Current AWS Architecture
```
S3 Bucket (frenchfornew-images)
├── SoundSet Sunday/
│   ├── 09 February 2025/
│   │   └── photographer_name/
│   │       └── image_files.jpg
├── Electic Sessions/
│   └── 24 July 2025/
└── A Rare Experience/
    └── 27 July 2024/
```

### Setting Up Your Own AWS

#### 1. S3 Bucket Creation
```bash
# Create bucket (replace with your region)
aws s3 mb s3://your-bucket-name --region af-south-1

# Set bucket policy for CloudFront access
aws s3api put-bucket-policy --bucket your-bucket-name --policy file://bucket-policy.json
```

#### 2. CloudFront Distribution
1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Enable compression
4. Set appropriate cache behaviors
5. Note the CloudFront domain (e.g., `d1234567890.cloudfront.net`)

#### 3. IAM User Permissions
Create IAM user with these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

#### 4. Environment Configuration
Update `.env.local`:
```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_region
AWS_S3_BUCKET_NAME=your_bucket_name
CLOUDFRONT_DOMAIN=your_cloudfront_domain
```

### S3 Integration Points
- **`/api/s3-images`**: Lists images and folder structure
- **`/api/download-image`**: Streams full-resolution images for download
- **Thumbnail scripts**: Download images for local optimization
- **Gallery page**: Fetches metadata and serves optimized thumbnails

---

## Project Scripts & Tools

### Available Scripts
```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "generate-thumbnails": "node scripts/generate-thumbnails.js",
  "optimize-row-images": "node scripts/optimize-row-images.js --backup",
  "optimize-hero-images": "node scripts/optimize-hero-images.js --backup",
  "optimize-team-images": "node scripts/optimize-team-images.js --backup",
  "optimize-shop-images": "node scripts/optimize-shop-images.js --backup",
  "optimize-merch-images": "node scripts/optimize-merch-folder-images.js --backup"
}
```

### Script Details

#### 1. Thumbnail Generation (`generate-thumbnails.js`)
- **Purpose**: Create medium-resolution thumbnails from S3 images
- **Output**: `public/thumbnails/` directory
- **Settings**: 1000px max width, ~350KB target size, 75% quality
- **Batch processing**: 5 images at a time with delays

#### 2. Image Optimization Scripts
Each script optimizes images in specific directories:
- **`optimize-hero-images.js`**: Hero section backgrounds
- **`optimize-row-images.js`**: Brand logo rows
- **`optimize-shop-images.js`**: Shop/merch promotional images
- **`optimize-team-images.js`**: About us team photos
- **`optimize-merch-folder-images.js`**: Product images

**Common features**:
- Backup original files
- Multiple quality levels (webp, compressed jpg)
- Dry run mode available
- Sharp.js for processing

#### 3. Development Commands
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Generate thumbnails for all events
npm run generate-thumbnails

# Optimize specific image categories
npm run optimize-hero-images
npm run optimize-shop-images
```

---

## Resend Email Integration

### Email Service Setup
**Service**: Resend (resend.com)
**Purpose**: Contact forms and purchase notifications

### Configuration
```env
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=your_verified_sender@domain.com
RESEND_TO_EMAIL=admin@frenchfornew.com
```

### Email Integration Points

#### 1. Contact Form (`/api/contact`)
**File**: `src/app/api/contact/route.ts`
**Triggers**: Contact page form submissions
**Email content**:
- Contact details (name, email)
- Message content
- Timestamp
- Professional HTML template

#### 2. Purchase Notifications (`/api/purchase-notification`)
**File**: `src/app/api/purchase-notification/route.ts`
**Triggers**: Shop checkout form completion
**Email content**:
- Product details (name, price, size)
- Customer information
- Shipping address
- Purchase intent notification

### Setting Up Your Own Resend

#### 1. Account Creation
1. Sign up at resend.com
2. Verify your domain (recommended) or use resend's domain
3. Get API key from dashboard

#### 2. Domain Setup (Optional but recommended)
1. Add your domain to Resend
2. Add DNS records for domain verification
3. Update `RESEND_FROM_EMAIL` to use your domain

#### 3. Email Templates
Both email endpoints use HTML templates with:
- Responsive design
- Professional styling
- Brand colors and layout
- Plain text fallback

### Usage in Components
```typescript
// Contact form submission
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message })
});

// Purchase notification
const response = await fetch('/api/purchase-notification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ product, customerInfo })
});
```

---

## Gallery S3 Folder Structure

### Folder Hierarchy
```
S3 Bucket Root/
├── Event Name/
│   ├── Date/
│   │   ├── Photographer Name/
│   │   │   ├── IMG_001.jpg
│   │   │   ├── IMG_002.jpg
│   │   │   └── ...
│   │   └── Another Photographer/
│   │       └── images...
│   └── Another Date/
└── Another Event/
```

### Example Structure
```
frenchfornew-images/
├── SoundSet Sunday/
│   ├── 09 February 2025/
│   │   └── Hooduniversal/
│   │       ├── HOOD5741.jpg
│   │       ├── HOOD5742.jpg
│   │       └── ...
│   └── 13 April 2025/
│       └── Hooduniversal/
├── Electic Sessions/
│   └── 24 July 2025/
│       └── patra_shot.it/
│           ├── PAT08636.jpg
│           └── ...
└── A Rare Experience/
    └── 27 July 2024/
        └── nizi.jpg/
            ├── 6W9A0787.jpg
            └── ...
```

### Folder Structure Rules

#### 1. Event Level (Top Level)
- **Format**: Event name exactly as displayed
- **Examples**: "SoundSet Sunday", "Electic Sessions", "A Rare Experience"
- **Display**: Used in gallery event dropdown

#### 2. Date Level (Second Level)
- **Format**: "DD Month YYYY" (e.g., "09 February 2025")
- **Sorting**: Gallery sorts dates in descending order (newest first)
- **Display**: Used in gallery date dropdown

#### 3. Photographer Level (Third Level)
- **Format**: Photographer name or handle
- **Examples**: "Hooduniversal", "patra_shot.it", "nizi.jpg"
- **Display**: Used in photographer filter buttons

#### 4. Image Files (Fourth Level)
- **Supported formats**: JPG, JPEG, PNG, WebP
- **Naming**: Any naming convention
- **Aspect ratio detection**: Automatic classification as tall/wide/square

### Adding New Events

#### 1. S3 Upload Structure
```bash
# Example: New event "Music Festival" on "15 March 2025" by "john_doe"
aws s3 cp local_images/ s3://your-bucket/Music Festival/15 March 2025/john_doe/ --recursive
```

#### 2. Thumbnail Generation
```bash
# Generate thumbnails for new event
npm run generate-thumbnails -- --folder "Music Festival/15 March 2025"
```

#### 3. Gallery Auto-Detection
The gallery automatically detects new folders and updates dropdowns - no code changes needed.

### S3 API Integration
**Endpoint**: `/api/s3-images`
**Parameters**:
- `event`: Filter by event name
- `date`: Filter by event date
- `photographer`: Filter by photographer
- `page` & `limit`: Pagination

**Response Format**:
```json
{
  "images": [
    {
      "id": "unique_id",
      "src": "cloudfront_url",
      "originalSrc": "s3_url",
      "name": "filename",
      "aspectRatio": "tall|wide|square",
      "lastModified": "date",
      "isOptimized": boolean
    }
  ],
  "folders": ["folder1", "folder2"],
  "prefix": "current_path"
}
```

---

## Architecture & Components

### File System Structure
```
src/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── about-us/
│   │   └── page.tsx            # About page
│   ├── api/                     # API routes
│   │   ├── contact/
│   │   │   └── route.ts        # Contact form API
│   │   ├── purchase-notification/
│   │   │   └── route.ts        # Shop notification API
│   │   ├── s3-images/
│   │   │   └── route.ts        # Gallery S3 API
│   │   └── download-image/
│   │       └── route.ts        # Image download streaming
│   ├── contact/
│   │   └── page.tsx            # Contact page
│   ├── events/
│   │   └── page.tsx            # Events page
│   ├── gallery/
│   │   └── page.tsx            # Gallery page
│   ├── services/
│   │   └── page.tsx            # Services page
│   ├── services-detail/
│   │   └── page.tsx            # Services detail
│   └── shop/                    # E-commerce
│       ├── layout.tsx          # Shop layout
│       ├── page.tsx            # Shop listing
│       ├── [slug]/
│       │   └── page.tsx        # Product detail
│       └── checkout/
│           └── page.tsx        # Checkout page
├── components/                  # Reusable components
│   ├── navigation.tsx          # Main navigation
│   ├── footer.tsx              # Site footer
│   ├── hero.tsx                # Home hero section
│   ├── page-loader.tsx         # Loading screen
│   └── [other-components].tsx
└── lib/                        # Utilities
    └── gallery-cache.ts        # Gallery caching utilities
```

### Page-by-Page Architecture

#### 1. Home Page (`src/app/page.tsx`)
**Components Used**:
- `Hero`: Main hero section with background cycling
- `UpcomingEvents`: Event announcements
- `StatsSection`: Company statistics with animated counters
- `MerchComingSoon`: Merchandise teaser
- `LogoCarousel`: Brand partner logos
- `HomePageEvents`: Recent event highlights
- `Footer`: Site footer

**Features**:
- Page loader with completion callback
- Client-side rendering
- Component composition pattern

#### 2. Gallery Page (`src/app/gallery/page.tsx`)
**Key Features**:
- **Dynamic S3 integration**: Auto-detects events, dates, photographers
- **Infinite scroll pagination**: Loads 24 images per batch
- **Image optimization**: Serves thumbnails locally, full images via streaming
- **Lightbox modal**: Full-screen image viewing
- **Download functionality**: Streams original files
- **Responsive grid**: Waterfall layout with aspect ratio detection
- **Connection speed detection**: Adjusts quality based on network

**State Management**:
```typescript
// Filter states
const [activeEvent, setActiveEvent] = useState('SoundSet Sunday');
const [activeDate, setActiveDate] = useState('09 February 2025');
const [activePhotographer, setActivePhotographer] = useState('');

// Data states
const [images, setImages] = useState<ImageData[]>([]);
const [loading, setLoading] = useState(true);

// UI states
const [lightboxOpen, setLightboxOpen] = useState(false);
const [downloadingImages, setDownloadingImages] = useState<Record<string, boolean>>({});
```

#### 3. Shop Pages (`src/app/shop/`)

##### Shop Listing (`page.tsx`)
**Features**:
- Product grid display
- Typewriter effect for title
- Hero image cycling
- Product data management

**Product Data Structure**:
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  description: string;
  slug: string;
  details?: string[];
}
```

##### Product Detail (`[slug]/page.tsx`)
**Features**:
- Image gallery with thumbnails
- Size selection (S, M, L, XL, XXL, XXXL)
- Customer information form
- Yoco payment integration with multiple links
- Purchase notification emails

**Payment Integration**:
```typescript
// Multiple payment links per size for load distribution
const paymentLinks = {
  'football-jersey': {
    'Small': ['link1', 'link2', 'link3'],
    'Medium': ['link1', 'link2', 'link3'],
    // ... other sizes
  }
};

// Random link selection with no consecutive repeats
const getRandomPaymentLink = (productId: string, size: string): string => {
  // Logic to select random link avoiding last used
};
```

#### 4. Contact Page (`src/app/contact/page.tsx`)
**Features**:
- Contact form with validation
- Email integration via Resend
- Success/error handling
- Form state management

#### 5. API Routes (`src/app/api/`)

##### S3 Images API (`s3-images/route.ts`)
**Purpose**: Provides gallery data from S3
**Parameters**:
- `event`: Event name filter
- `date`: Date filter  
- `photographer`: Photographer filter
- `page` & `limit`: Pagination

**Response**: Image metadata with thumbnail URLs

##### Download API (`download-image/route.ts`)
**Purpose**: Streams full-resolution images for download
**Features**:
- S3 streaming with proper headers
- Content-disposition for downloads
- Error handling and timeouts

##### Contact API (`contact/route.ts`)
**Purpose**: Handles contact form submissions
**Features**:
- Input validation
- Resend email integration
- HTML email templates

##### Purchase Notification API (`purchase-notification/route.ts`)
**Purpose**: Sends admin notifications for purchase intents
**Features**:
- Customer data validation
- Purchase details formatting
- Email notifications to admin

### Component Architecture

#### Reusable Components

##### Navigation (`components/navigation.tsx`)
**Features**:
- Responsive mobile menu
- Active page indication
- Logo integration
- Smooth transitions

##### Footer (`components/footer.tsx`)
**Features**:
- Contact information
- Social media links
- Newsletter signup
- Brand information

##### Page Loader (`components/page-loader.tsx`)
**Features**:
- Loading animation
- Completion callback
- Consistent UX across pages

### State Management Strategy
- **Local state**: React useState for component-specific data
- **API data**: Direct fetch calls with error handling
- **Caching**: Browser cache for images, no global state management needed
- **Form state**: Controlled components with validation

### Performance Optimizations
1. **Image optimization**: Next.js Image component with optimization
2. **Lazy loading**: Progressive image loading in gallery
3. **Pagination**: Infinite scroll with batched loading
4. **CDN**: CloudFront for global image delivery
5. **Streaming**: Large file downloads via streaming API
6. **Prefetching**: Background loading of next gallery pages

---

## Environment Setup for New Developer

### Prerequisites
```bash
# Node.js 18+ and npm
node --version  # Should be 18+
npm --version

# AWS CLI (optional, for S3 management)
aws --version
```

### Initial Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd ffn
npm install
```

#### 2. Environment Variables
Create `.env.local`:
```env
# AWS Configuration (use your own credentials)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET_NAME=your_bucket_name
CLOUDFRONT_DOMAIN=your_cloudfront_domain

# Email Configuration (use your own Resend account)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_sender@domain.com
RESEND_TO_EMAIL=admin_recipient@domain.com
```

#### 3. Development Server
```bash
npm run dev
```
Visit: http://localhost:3000

#### 4. Build & Test
```bash
# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Required External Accounts

#### 1. AWS Account
- Create S3 bucket
- Set up CloudFront distribution
- Create IAM user with S3 permissions
- Get access keys

#### 2. Resend Account
- Sign up at resend.com
- Verify domain (optional)
- Get API key
- Configure sender email

#### 3. Vercel Account (for deployment)
- Sign up at vercel.com
- Connect GitHub repository
- Add environment variables
- Deploy application

### Development Workflow
1. **Local development**: Use `npm run dev`
2. **Image management**: Upload to S3, run thumbnail generation
3. **Testing**: Build locally before pushing
4. **Deployment**: Push to main branch for auto-deployment

### Troubleshooting Common Issues

#### 1. Image Loading Issues
- Check S3 bucket permissions
- Verify CloudFront distribution
- Ensure thumbnail generation completed

#### 2. Email Not Sending
- Verify Resend API key
- Check sender email verification
- Review API route logs

#### 3. Build Failures
- Check TypeScript errors
- Verify all environment variables
- Review ESLint warnings

#### 4. Gallery Not Loading
- Check S3 folder structure
- Verify API route functionality
- Review network requests in browser

### Next Steps for New Developer
1. Set up all external accounts (AWS, Resend, Vercel)
2. Configure environment variables
3. Test local development environment
4. Upload test images to S3 and generate thumbnails
5. Test email functionality
6. Deploy to your own Vercel account
7. Update DNS settings if using custom domain

This handover document should provide everything needed to maintain and extend the French For New website. For questions or clarifications, refer to the code comments and Next.js documentation.