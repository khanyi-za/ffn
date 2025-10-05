#!/usr/bin/env node

/**
 * Generate Medium Resolution Thumbnails Script
 * 
 * This script downloads original images from S3, creates medium resolution thumbnails
 * (~800-1200px wide, 200-500KB), and saves them to the public folder with the same 
 * folder structure as S3
 * 
 * Usage:
 *   node scripts/generate-thumbnails.js
 *   node scripts/generate-thumbnails.js --folder "SoundSet Sunday/27 April 2025"
 *   node scripts/generate-thumbnails.js --dry-run
 */

// Load environment variables from .env.local
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  // dotenv is optional, continue without it
  console.log('⚠️  dotenv not available, using system environment variables');
}

const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

// Configuration
const CONFIG = {
  // S3 Configuration
  AWS_REGION: process.env.AWS_REGION || 'af-south-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  
  // Thumbnail settings - Updated for medium resolution
  THUMBNAIL_SIZE: { 
    maxWidth: 1000, 
    maxHeight: 1500, 
    quality: 75,
    targetFileSize: 350 // Target ~350KB (middle of 200-500KB range)
  },
  
  // Local paths
  PUBLIC_DIR: path.join(process.cwd(), 'public'),
  THUMBNAILS_DIR: path.join(process.cwd(), 'public', 'thumbnails'),
  
  // Processing settings
  BATCH_SIZE: 5, // Process 5 images at a time
  DELAY_BETWEEN_BATCHES: 1000, // 1 second delay between batches
  
  // File extensions to process
  IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp'],
};

// Initialize S3 client
const s3Client = new S3Client({
  region: CONFIG.AWS_REGION,
  credentials: {
    accessKeyId: CONFIG.AWS_ACCESS_KEY_ID,
    secretAccessKey: CONFIG.AWS_SECRET_ACCESS_KEY,
  },
});

// Command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const folderArgIndex = args.indexOf('--folder');
const folderFilter = folderArgIndex !== -1 && folderArgIndex + 1 < args.length 
  ? args[folderArgIndex + 1] 
  : args.find(arg => arg.startsWith('--folder='))?.split('=')[1];

console.log('🚀 Medium Resolution Thumbnail Generation Script');
console.log('===============================================');
console.log(`📁 Bucket: ${CONFIG.AWS_S3_BUCKET_NAME}`);
console.log(`📂 Target: ${CONFIG.THUMBNAILS_DIR}`);
console.log(`🎯 Quality: ${CONFIG.THUMBNAIL_SIZE.maxWidth}x${CONFIG.THUMBNAIL_SIZE.maxHeight}px, ~${CONFIG.THUMBNAIL_SIZE.targetFileSize}KB`);
console.log(`🔍 Filter: ${folderFilter || 'All folders'}`);
console.log(`🧪 Dry Run: ${isDryRun ? 'YES' : 'NO'}`);
console.log('');

// Statistics
const stats = {
  totalFound: 0,
  alreadyExists: 0,
  processed: 0,
  errors: 0,
  sizeReduction: { before: 0, after: 0 }
};

// Utility function to convert stream to buffer
async function streamToBuffer(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

// Create directory recursively
function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

// Get local thumbnail path for an S3 key
function getLocalThumbnailPath(s3Key) {
  const basePath = s3Key.replace(/\.[^/.]+$/, '');
  const extension = s3Key.split('.').pop()?.toLowerCase() || 'jpg';
  const thumbnailName = `${path.basename(basePath)}_medium.${extension}`;
  const folderPath = path.dirname(s3Key);
  
  return path.join(CONFIG.THUMBNAILS_DIR, folderPath, thumbnailName);
}

// Check if thumbnail already exists locally
function thumbnailExists(s3Key) {
  const localPath = getLocalThumbnailPath(s3Key);
  return fs.existsSync(localPath);
}

// Process a single image
async function processImage(s3Key) {
  try {
    console.log(`🔄 Processing: ${s3Key}`);
    
    // Download original from S3
    const getCommand = new GetObjectCommand({
      Bucket: CONFIG.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    });
    
    const response = await s3Client.send(getCommand);
    if (!response.Body) {
      throw new Error('Failed to download image from S3');
    }
    
    const originalBuffer = await streamToBuffer(response.Body);
    stats.sizeReduction.before += originalBuffer.length;
    
    console.log(`📊 Original: ${(originalBuffer.length / 1024 / 1024).toFixed(2)}MB`);
    
    // Create medium resolution thumbnail
    console.log(`🔄 Creating medium resolution thumbnail...`);
    
    // Start with high quality and adjust down if needed to hit file size target
    let quality = CONFIG.THUMBNAIL_SIZE.quality;
    let thumbnailBuffer;
    let attempts = 0;
    const maxAttempts = 5;
    
    do {
      thumbnailBuffer = await sharp(originalBuffer)
        .resize(CONFIG.THUMBNAIL_SIZE.maxWidth, CONFIG.THUMBNAIL_SIZE.maxHeight, {
          fit: 'inside', // Maintain aspect ratio, fit within bounds
          withoutEnlargement: true // Don't upscale smaller images
        })
        .jpeg({ quality, progressive: true })
        .toBuffer();
      
      const fileSizeKB = thumbnailBuffer.length / 1024;
      
      if (fileSizeKB <= CONFIG.THUMBNAIL_SIZE.targetFileSize) {
        break; // File size is acceptable
      }
      
      // Reduce quality if file is too large
      quality = Math.max(quality - 10, 40); // Don't go below 40% quality
      attempts++;
      
      if (attempts >= maxAttempts) {
        console.log(`⚠️  Could not reach target file size, using quality ${quality}%`);
        break;
      }
      
    } while (attempts < maxAttempts);
    
    stats.sizeReduction.after += thumbnailBuffer.length;
    
    const fileSizeKB = (thumbnailBuffer.length / 1024).toFixed(0);
    const sizeReduction = ((1 - thumbnailBuffer.length / originalBuffer.length) * 100).toFixed(1);
    console.log(`✨ Medium thumbnail: ${fileSizeKB}KB at ${quality}% quality (${sizeReduction}% reduction)`);
    
    // Get image dimensions for logging
    const metadata = await sharp(thumbnailBuffer).metadata();
    console.log(`📐 Dimensions: ${metadata.width}x${metadata.height}px`);
    
    // Save thumbnail locally
    if (!isDryRun) {
      const localPath = getLocalThumbnailPath(s3Key);
      ensureDirectoryExists(localPath);
      fs.writeFileSync(localPath, thumbnailBuffer);
      console.log(`💾 Saved: ${path.relative(CONFIG.PUBLIC_DIR, localPath)}`);
    }
    
    stats.processed++;
    console.log(`✅ Complete: ${s3Key}`);
    console.log('');
    
    return { success: true };
    
  } catch (error) {
    console.error(`❌ Error processing ${s3Key}:`, error.message);
    stats.errors++;
    return { success: false, error: error.message };
  }
}

// Get all images from S3 bucket
async function getAllImages() {
  console.log('🔍 Scanning S3 bucket for images...');
  
  const images = [];
  let continuationToken;
  
  do {
    const command = new ListObjectsV2Command({
      Bucket: CONFIG.AWS_S3_BUCKET_NAME,
      MaxKeys: 1000,
      ContinuationToken: continuationToken,
      Prefix: folderFilter || undefined,
    });
    
    const response = await s3Client.send(command);
    const objects = response.Contents || [];
    
    // Filter for image files
    const imageFiles = objects.filter(obj => {
      if (!obj.Key) return false;
      
      const extension = obj.Key.split('.').pop()?.toLowerCase();
      const isImage = extension && CONFIG.IMAGE_EXTENSIONS.includes(extension);
      const isOptimizedVersion = obj.Key.includes('_thumb') || obj.Key.includes('_medium');
      
      return isImage && !isOptimizedVersion;
    });
    
    images.push(...imageFiles);
    continuationToken = response.NextContinuationToken;
    
    console.log(`📂 Found ${imageFiles.length} images in this batch (total: ${images.length})`);
    
  } while (continuationToken);
  
  console.log(`🖼️  Total images found: ${images.length}`);
  console.log('');
  
  return images;
}

// Process images in batches
async function processImagesInBatches(images) {
  console.log(`🔄 Processing ${images.length} images in batches of ${CONFIG.BATCH_SIZE}...`);
  console.log('');
  
  for (let i = 0; i < images.length; i += CONFIG.BATCH_SIZE) {
    const batch = images.slice(i, i + CONFIG.BATCH_SIZE);
    const batchNumber = Math.floor(i / CONFIG.BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(images.length / CONFIG.BATCH_SIZE);
    
    console.log(`📦 Batch ${batchNumber}/${totalBatches} (${batch.length} images)`);
    console.log('─'.repeat(50));
    
    // Process batch sequentially to avoid overwhelming S3
    for (const image of batch) {
      const s3Key = image.Key;
      
      // Check if thumbnail already exists
      if (thumbnailExists(s3Key)) {
        console.log(`⏭️  Skipping ${s3Key} (thumbnail already exists)`);
        stats.alreadyExists++;
        continue;
      }
      
      await processImage(s3Key);
      
      // Small delay between images to be respectful to S3
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Delay between batches
    if (i + CONFIG.BATCH_SIZE < images.length) {
      console.log(`⏸️  Waiting ${CONFIG.DELAY_BETWEEN_BATCHES}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_BATCHES));
    }
    
    console.log('');
  }
}

// Print final statistics
function printStatistics() {
  console.log('📊 Final Statistics');
  console.log('===================');
  console.log(`🔍 Total images found: ${stats.totalFound}`);
  console.log(`⏭️  Already existed: ${stats.alreadyExists}`);
  console.log(`✅ Successfully processed: ${stats.processed}`);
  console.log(`❌ Errors: ${stats.errors}`);
  
  if (stats.sizeReduction.before > 0) {
    const totalReduction = ((1 - stats.sizeReduction.after / stats.sizeReduction.before) * 100).toFixed(1);
    console.log(`📉 Total size reduction: ${(stats.sizeReduction.before / 1024 / 1024).toFixed(2)}MB → ${(stats.sizeReduction.after / 1024 / 1024).toFixed(2)}MB (${totalReduction}%)`);
  }
  
  console.log('');
  
  if (!isDryRun && stats.processed > 0) {
    console.log('🎉 Medium resolution thumbnail generation complete!');
    console.log(`📁 Thumbnails saved to: ${CONFIG.THUMBNAILS_DIR}`);
    console.log('📝 Next step: Update your API to serve medium resolution thumbnails from public folder');
  } else if (isDryRun) {
    console.log('🧪 Dry run complete! Run without --dry-run to generate medium resolution thumbnails.');
  }
}

// Main function
async function main() {
  try {
    // Validate configuration
    if (!CONFIG.AWS_ACCESS_KEY_ID || !CONFIG.AWS_SECRET_ACCESS_KEY || !CONFIG.AWS_S3_BUCKET_NAME) {
      throw new Error('Missing AWS configuration. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME environment variables.');
    }
    
    // Create thumbnails directory
    if (!isDryRun && !fs.existsSync(CONFIG.THUMBNAILS_DIR)) {
      fs.mkdirSync(CONFIG.THUMBNAILS_DIR, { recursive: true });
      console.log(`📁 Created thumbnails directory: ${CONFIG.THUMBNAILS_DIR}`);
      console.log('');
    }
    
    // Get all images from S3
    const images = await getAllImages();
    stats.totalFound = images.length;
    
    if (images.length === 0) {
      console.log('ℹ️  No images found to process.');
      return;
    }
    
    // Process images
    await processImagesInBatches(images);
    
    // Print final statistics
    printStatistics();
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { main, processImage, getAllImages }; 