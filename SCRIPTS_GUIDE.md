# French For New - Image Processing Scripts Guide

This guide explains all the image optimization scripts in the project, what they do, how to use them, and when you need them.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Script Details](#script-details)
   - [Generate Thumbnails](#1-generate-thumbnails)
   - [Optimize Hero Images](#2-optimize-hero-images)
   - [Optimize Shop Images](#3-optimize-shop-images)
   - [Optimize Row Images](#4-optimize-row-images)
   - [Optimize Team Images](#5-optimize-team-images)
   - [Optimize Merch Images](#6-optimize-merch-images)
   - [Optimize Merch Folder Images](#7-optimize-merch-folder-images)
4. [Common Options](#common-options)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)

---

## Overview

The project includes **7 specialized image optimization scripts** that help prepare images for web display. Each script targets different types of images and applies appropriate optimization settings.

### Why Do We Need These Scripts?

- **Performance**: Original images are often 5-10MB each, which would slow down the website dramatically
- **User Experience**: Optimized images load faster, improving the browsing experience
- **Bandwidth**: Smaller images reduce hosting costs and data usage
- **SEO**: Faster load times improve search engine rankings

### Script Categories

```
Gallery Images (S3):
└── generate-thumbnails.js        # Creates medium-res thumbnails from S3

Website Images (Local):
├── optimize-hero-images.js       # Homepage/page hero backgrounds
├── optimize-shop-images.js       # Product showcase images
├── optimize-row-images.js        # Logo carousel images
├── optimize-team-images.js       # About page team photos
├── optimize-merch-images.js      # Product detail images
└── optimize-merch-folder-images.js # Batch merch optimization
```

---

## Prerequisites

Before running any scripts, ensure you have:

### 1. Required Dependencies
```bash
npm install
```

### 2. Environment Variables (for gallery thumbnails only)
Create a `.env.local` file with your AWS credentials:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET_NAME=your_bucket_name
```

### 3. Sharp Library
All scripts use [Sharp](https://sharp.pixelplumbing.com/) for high-performance image processing. It's included in `package.json` and installs automatically with `npm install`.

---

## Script Details

## 1. Generate Thumbnails

**File**: `scripts/generate-thumbnails.js`

### What It Does
Downloads original images from AWS S3 and creates medium-resolution thumbnails (~350KB each) for the gallery page. These thumbnails are served from the local `/public/thumbnails/` folder for instant loading.

### When to Use
- After uploading new event photos to S3
- When adding a new event, date, or photographer folder
- If thumbnails are missing or outdated

### Target Specifications
- **Max Width**: 1000px
- **Max Height**: 1500px
- **Quality**: 75% (adjusts down to 40% if needed)
- **Target Size**: ~350KB per image
- **Format**: Maintains original format (JPG stays JPG, PNG stays PNG)

### Usage

#### Generate all thumbnails
```bash
npm run generate-thumbnails
```

#### Generate for specific event/date
```bash
npm run generate-thumbnails -- --folder "SoundSet Sunday/27 April 2025"
```

#### Preview what will happen (dry run)
```bash
npm run generate-thumbnails:dry-run
```

### How It Works

1. **Connects to S3**: Uses AWS credentials to access your bucket
2. **Scans folders**: Lists all images in the specified folder (or all folders)
3. **Filters images**: Skips already optimized versions (`_thumb`, `_medium` files)
4. **Batch processing**: Downloads and processes 5 images at a time
5. **Creates thumbnails**: Resizes and compresses each image
6. **Saves locally**: Stores in `/public/thumbnails/` with same folder structure
7. **Smart sizing**: Adjusts quality until target file size is reached

### Example Output
```
🚀 Medium Resolution Thumbnail Generation Script
===============================================
📁 Bucket: frenchfornew-images
📂 Target: /Users/you/project/public/thumbnails
🎯 Quality: 1000x1500px, ~350KB
🔍 Filter: SoundSet Sunday/27 April 2025

🔍 Scanning S3 bucket for images...
📂 Found 250 images in this batch (total: 250)
🖼️  Total images found: 250

🔄 Processing IMG_5741.jpg
📊 Original: 8.2MB
🔄 Creating medium resolution thumbnail...
✨ Medium thumbnail: 342KB at 75% quality (95.8% reduction)
📐 Dimensions: 1000x1500px
💾 Saved: thumbnails/SoundSet Sunday/27 April 2025/Hooduniversal/IMG_5741_medium.jpg
✅ Complete: SoundSet Sunday/27 April 2025/Hooduniversal/IMG_5741.jpg

📊 Final Statistics
===================
🔍 Total images found: 250
⏭️  Already existed: 45
✅ Successfully processed: 205
❌ Errors: 0
📉 Total size reduction: 1682MB → 71MB (95.8%)

🎉 Medium resolution thumbnail generation complete!
```

### S3 Folder Structure Required
```
s3://your-bucket/
├── Event Name/
│   ├── Date/
│   │   └── Photographer Name/
│   │       └── image_files.jpg
```

### Local Output Structure
```
public/thumbnails/
├── Event Name/
│   ├── Date/
│   │   └── Photographer Name/
│   │       └── image_name_medium.jpg
```

---

## 2. Optimize Hero Images

**File**: `scripts/optimize-hero-images.js`

### What It Does
Optimizes large hero/background images used on page headers. These images are displayed full-screen, so they need higher resolution than regular images but still need optimization.

### When to Use
- When adding new page hero backgrounds
- After updating homepage hero images
- When hero images are loading slowly

### Target Specifications
- **Max Width**: 1920px (Full HD)
- **Max Height**: 1080px (Full HD)
- **Quality**: 90% (higher for crisp display)
- **Target Size**: ~800KB per image
- **Format**: JPEG (progressive) or PNG (compressed)

### Target Images
The script automatically finds images with these names or patterns:
- `HERO_v2.jpg`
- `hero_home.png`
- `gallery_page_hero.png`
- `landing_events_page.png`
- `event_production.png`
- `event_planning.png`
- `marketing.png`
- `talent_managment.png`
- `about_us_hero.png`
- Any file containing "hero" or "landing" in the name

### Usage

#### Optimize with backup
```bash
npm run optimize-hero-images
```

#### Preview changes
```bash
npm run optimize-hero-images:dry-run
```

### How It Works

1. **Scans directory**: Looks in `public/images/` for hero images
2. **Creates backups**: Saves originals to `public/images_hero_backup/`
3. **Detects format**: Maintains PNG for images with transparency, converts others to JPEG
4. **Progressive optimization**: Adjusts quality to reach target file size
5. **Replaces originals**: Updates files in place (backup is safe)

### Example Output
```
🎭 Hero Images Optimization Script
===================================
💾 Backup mode enabled - Original files will be saved

🔍 Found 3 hero images to optimize:
   • gallery_page_hero.png (15.2MB)
   • HERO_v2.jpg (12.8MB)
   • landing_events_page.png (10.5MB)

🔄 Processing: gallery_page_hero.png
   📊 Original: 15.2MB
   📐 Original dimensions: 3840x2160px
   💾 Backup created: gallery_page_hero.png
   📐 New dimensions: 1920x1080px
   ✨ Optimized size: 756KB at 90% quality (PNG)
   📉 Size reduction: 95.0%
   ✅ Optimization complete!

📊 HERO OPTIMIZATION SUMMARY
=============================
✅ Successfully processed: 3
❌ Errors: 0
📁 Total size before: 38.5MB
📁 Total size after: 2.1MB
🎉 Total savings: 36.4MB (94.5% reduction)
💾 Original files backed up to: public/images_hero_backup

🎭 Hero image optimization complete!
```

---

## 3. Optimize Shop Images

**File**: `scripts/optimize-shop-images.js`

### What It Does
Optimizes product showcase images displayed on the shop listing page (`/shop`). These are the main product photos shown in the grid.

### When to Use
- When adding new product categories
- After updating shop promotional images
- Before launching new product collections

### Target Specifications
- **Max Width**: 800px
- **Quality**: 85% (JPEG progressive)
- **Format**: JPEG
- **Location**: `public/shop_images/`

### Usage

#### Optimize with backup
```bash
npm run optimize-shop-images
```

#### Preview changes
```bash
npm run optimize-shop-images:dry-run
```

### Example Output
```
🛍️  Optimizing Shop Images
==========================

📸 Found 4 images to optimize

🔄 Optimizing: product_hero_1.jpg (5.2MB)
💾 Backed up: product_hero_1.jpg
✅ Optimized: 245KB (reduced by 95.3%)

🎉 Shop image optimization complete!
💾 Original images backed up to: public/shop_images_backup
```

---

## 4. Optimize Row Images

**File**: `scripts/optimize-row-images.js`

### What It Does
Optimizes logo images used in the brand partner carousel on the homepage. These need to be small and crisp.

### When to Use
- When adding new partner/sponsor logos
- After updating brand collaborator images

### Target Specifications
- **Max Width**: 400px (logos are small)
- **Quality**: 85%
- **Format**: Maintains original (PNG for transparency, JPEG otherwise)
- **Location**: `public/row_images/`

### Usage

#### Optimize with backup
```bash
npm run optimize-row-images
```

#### Preview changes
```bash
npm run optimize-row-images:dry-run
```

---

## 5. Optimize Team Images

**File**: `scripts/optimize-team-images.js`

### What It Does
Optimizes team member photos displayed on the About Us page. Ensures consistent sizing and quality.

### When to Use
- When adding new team members
- After updating team photos
- Before launching About page

### Target Specifications
- **Max Width**: 600px
- **Quality**: 85%
- **Format**: JPEG (progressive)
- **Location**: `public/team_images/` or `public/images/team/`

### Usage

#### Optimize with backup
```bash
npm run optimize-team-images
```

#### Preview changes
```bash
npm run optimize-team-images:dry-run
```

---

## 6. Optimize Merch Images

**File**: `scripts/optimize-merch-images.js`

### What It Does
Optimizes individual product photos in the shop. These are the detail images shown when viewing a specific product.

### When to Use
- When adding new product photos
- After photoshoots of merchandise
- Before adding new products to the shop

### Target Specifications
- **Max Width**: 1200px (higher quality for product details)
- **Quality**: 90%
- **Format**: JPEG (progressive)
- **Location**: `public/merch/`

### Usage

#### Optimize with backup
```bash
npm run optimize-merch-images
```

#### Preview changes
```bash
npm run optimize-merch-images:dry-run
```

---

## 7. Optimize Merch Folder Images

**File**: `scripts/optimize-merch-folder-images.js`

### What It Does
Batch processes all product images in the merch folder structure. Useful when adding multiple new products.

### When to Use
- When setting up new product categories
- After bulk uploading product photos
- For initial setup of the shop

### Target Specifications
- **Max Width**: 1200px
- **Quality**: 90%
- **Format**: JPEG (progressive)
- **Location**: `public/merch/[product-folders]/`

### Usage

#### Optimize with backup
```bash
npm run optimize-merch-images
```

#### Preview changes
```bash
npm run optimize-merch-images:dry-run
```

---

## Common Options

All scripts support these command-line flags:

### `--dry-run`
Preview what the script will do without making any changes. Useful for testing.

```bash
npm run generate-thumbnails:dry-run
npm run optimize-hero-images:dry-run
npm run optimize-shop-images:dry-run
```

### `--backup`
Create backups of original files before optimization. Highly recommended!

```bash
npm run optimize-hero-images -- --backup
npm run optimize-shop-images -- --backup
```

**Note**: The `generate-thumbnails` script doesn't need backup because it creates new files (doesn't modify originals in S3).

### `--folder "Path/To/Folder"`
For `generate-thumbnails` only - process a specific S3 folder.

```bash
npm run generate-thumbnails -- --folder "SoundSet Sunday/27 April 2025"
```

---

## Troubleshooting

### Problem: "Missing AWS configuration"
**Solution**: Ensure `.env.local` has your AWS credentials:
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=af-south-1
AWS_S3_BUCKET_NAME=your_bucket_name
```

### Problem: "Permission denied" errors
**Solution**: Check file permissions:
```bash
chmod +x scripts/*.js
```

### Problem: Scripts run too slowly
**Solution**:
- For thumbnails: Use `--folder` to process specific folders
- Batch processing already limits to 5 images at a time
- Consider running overnight for large batches

### Problem: "Directory not found"
**Solution**: Create the required directories:
```bash
mkdir -p public/images
mkdir -p public/thumbnails
mkdir -p public/merch
mkdir -p public/shop_images
```

### Problem: Out of memory errors
**Solution**:
- Process images in smaller batches
- Close other applications
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run generate-thumbnails`

### Problem: Images still look blurry
**Solution**:
- Increase the `MAX_WIDTH` in the script configuration
- Increase `QUALITY` setting (at the cost of larger file sizes)
- Ensure original images are high resolution

---

## Best Practices

### 1. Always Use Dry Run First
Before running any script, preview the changes:
```bash
npm run script-name:dry-run
```

### 2. Always Create Backups
For scripts that modify originals (all except thumbnails):
```bash
npm run script-name -- --backup
```

### 3. Process in Stages
For large batches, process by folder:
```bash
npm run generate-thumbnails -- --folder "Event/Date"
```

### 4. Monitor File Sizes
Check that optimized images meet targets:
```bash
ls -lh public/thumbnails/Event/Date/Photographer/
```

### 5. Test on Staging First
- Run scripts in development environment
- Check image quality in browser
- Ensure loading times are improved
- Then deploy to production

### 6. Regular Maintenance Schedule

**After each event:**
```bash
# 1. Upload photos to S3
# 2. Generate thumbnails
npm run generate-thumbnails -- --folder "New Event/Date"
# 3. Deploy to production
git add public/thumbnails
git commit -m "Add thumbnails for New Event"
git push
```

**When adding products:**
```bash
# 1. Add product photos to public/merch/
# 2. Optimize
npm run optimize-merch-images -- --backup
# 3. Test locally
npm run dev
# 4. Deploy
```

**Before major launches:**
```bash
# Optimize all images
npm run optimize-hero-images -- --backup
npm run optimize-shop-images -- --backup
npm run optimize-team-images -- --backup
```

### 7. Cleanup Old Backups
Backup folders can grow large. Periodically remove old backups:
```bash
# After verifying optimizations worked
rm -rf public/images_hero_backup
rm -rf public/shop_images_backup
# etc.
```

---

## Performance Impact

### Before Optimization
```
Gallery image: 8.2MB → 20+ seconds to load
Hero image: 15.2MB → 10+ seconds
Shop image: 5.2MB → 5+ seconds
```

### After Optimization
```
Gallery thumbnail: 342KB → <1 second
Hero image: 756KB → <1 second
Shop image: 245KB → <1 second
```

### Total Savings Example
For a typical event with 250 photos:
- **Before**: 250 × 8MB = 2,000MB (2GB)
- **After**: 250 × 350KB = 87.5MB
- **Savings**: 95.6% reduction

---

## Script Comparison Table

| Script | Target | Max Width | Quality | Target Size | Backup | Format |
|--------|--------|-----------|---------|-------------|--------|--------|
| **generate-thumbnails** | Gallery images | 1000px | 75% | 350KB | N/A (new files) | Original |
| **optimize-hero-images** | Page heroes | 1920px | 90% | 800KB | Yes | JPEG/PNG |
| **optimize-shop-images** | Shop showcase | 800px | 85% | 250KB | Yes | JPEG |
| **optimize-row-images** | Logo carousel | 400px | 85% | 50KB | Yes | Original |
| **optimize-team-images** | Team photos | 600px | 85% | 200KB | Yes | JPEG |
| **optimize-merch-images** | Product details | 1200px | 90% | 400KB | Yes | JPEG |
| **optimize-merch-folder** | Bulk merch | 1200px | 90% | 400KB | Yes | JPEG |

---

## Quick Reference

### Generate Gallery Thumbnails
```bash
# All events
npm run generate-thumbnails

# Specific event
npm run generate-thumbnails -- --folder "Event/Date"

# Preview only
npm run generate-thumbnails:dry-run
```

### Optimize Website Images
```bash
# Hero images
npm run optimize-hero-images

# Shop images
npm run optimize-shop-images

# Team images
npm run optimize-team-images

# Product images
npm run optimize-merch-images

# Logo carousel
npm run optimize-row-images
```

### All With Backup
```bash
npm run optimize-hero-images -- --backup
npm run optimize-shop-images -- --backup
npm run optimize-team-images -- --backup
npm run optimize-merch-images -- --backup
npm run optimize-row-images -- --backup
```

---

## Need Help?

If you encounter issues not covered here:

1. Check script output for error messages
2. Review the script file directly (`scripts/script-name.js`)
3. Ensure all dependencies are installed (`npm install`)
4. Verify environment variables (`.env.local`)
5. Check Node.js version (should be 18+)

---

**Last Updated**: October 2025
**Maintained By**: French For New Development Team
