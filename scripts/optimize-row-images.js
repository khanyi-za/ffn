#!/usr/bin/env node

/**
 * Optimize Row Images Script
 * 
 * This script optimizes the large images in public/row_images/ for web usage.
 * Original images are 2-27MB each, this will reduce them to ~100-500KB each.
 * 
 * Usage:
 *   node scripts/optimize-row-images.js
 *   node scripts/optimize-row-images.js --backup  (creates backups first)
 *   node scripts/optimize-row-images.js --dry-run (preview only)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Source and destination paths
  INPUT_DIR: path.join(process.cwd(), 'public', 'row_images'),
  BACKUP_DIR: path.join(process.cwd(), 'public', 'row_images_original'),
  
  // Optimization settings
  MAX_WIDTH: 1200,     // Max width for high-DPI displays
  MAX_HEIGHT: 900,     // Max height (4:3 aspect ratio)
  QUALITY: 85,         // JPEG quality (85% for good balance)
  TARGET_SIZE_KB: 400, // Target file size in KB
  
  // File extensions to process
  EXTENSIONS: ['.jpg', '.jpeg', '.JPG', '.JPEG'],
};

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const createBackup = args.includes('--backup');

console.log('🖼️  Row Images Optimization Script');
console.log('=====================================');

if (isDryRun) {
  console.log('🧪 DRY RUN MODE - No files will be modified');
}

if (createBackup) {
  console.log('💾 Backup mode enabled - Original files will be saved');
}

console.log('');

// Check if input directory exists
if (!fs.existsSync(CONFIG.INPUT_DIR)) {
  console.error(`❌ Input directory not found: ${CONFIG.INPUT_DIR}`);
  process.exit(1);
}

// Create backup directory if needed
if (createBackup && !isDryRun) {
  if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
    fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
    console.log(`📁 Created backup directory: ${CONFIG.BACKUP_DIR}`);
  }
}

// Get all image files
const imageFiles = fs.readdirSync(CONFIG.INPUT_DIR)
  .filter(file => {
    const ext = path.extname(file);
    return CONFIG.EXTENSIONS.includes(ext);
  })
  .sort();

if (imageFiles.length === 0) {
  console.log('ℹ️  No image files found to optimize');
  process.exit(0);
}

console.log(`🔍 Found ${imageFiles.length} images to optimize:`);
imageFiles.forEach(file => {
  const filePath = path.join(CONFIG.INPUT_DIR, file);
  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
  console.log(`   • ${file} (${sizeMB}MB)`);
});

console.log('');

// Process each image
async function optimizeImage(filename) {
  const inputPath = path.join(CONFIG.INPUT_DIR, filename);
  const backupPath = path.join(CONFIG.BACKUP_DIR, filename);
  
  try {
    console.log(`🔄 Processing: ${filename}`);
    
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSizeMB = (originalStats.size / 1024 / 1024).toFixed(1);
    console.log(`   📊 Original: ${originalSizeMB}MB`);
    
    if (isDryRun) {
      // Just analyze the image without processing
      const metadata = await sharp(inputPath).metadata();
      console.log(`   📐 Dimensions: ${metadata.width}x${metadata.height}px`);
      console.log(`   🎯 Will resize to: max ${CONFIG.MAX_WIDTH}x${CONFIG.MAX_HEIGHT}px at ${CONFIG.QUALITY}% quality`);
      console.log(`   ✨ Estimated size reduction: ~80-90%`);
      console.log('');
      return { success: true };
    }
    
    // Create backup if requested
    if (createBackup) {
      fs.copyFileSync(inputPath, backupPath);
      console.log(`   💾 Backup created: ${path.basename(backupPath)}`);
    }
    
    // Optimize the image with progressive quality adjustment
    let quality = CONFIG.QUALITY;
    let optimizedBuffer;
    let attempts = 0;
    const maxAttempts = 3;
    
    do {
      optimizedBuffer = await sharp(inputPath)
        .resize(CONFIG.MAX_WIDTH, CONFIG.MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ 
          quality, 
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();
      
      const fileSizeKB = optimizedBuffer.length / 1024;
      
      if (fileSizeKB <= CONFIG.TARGET_SIZE_KB || quality <= 60) {
        break; // Acceptable size or minimum quality reached
      }
      
      // Reduce quality if file is still too large
      quality = Math.max(quality - 10, 60);
      attempts++;
      
    } while (attempts < maxAttempts);
    
    // Get final metadata
    const metadata = await sharp(optimizedBuffer).metadata();
    const optimizedSizeKB = (optimizedBuffer.length / 1024).toFixed(0);
    const sizeReduction = ((1 - optimizedBuffer.length / originalStats.size) * 100).toFixed(1);
    
    // Write optimized image
    fs.writeFileSync(inputPath, optimizedBuffer);
    
    console.log(`   📐 New dimensions: ${metadata.width}x${metadata.height}px`);
    console.log(`   ✨ Optimized size: ${optimizedSizeKB}KB at ${quality}% quality`);
    console.log(`   📉 Size reduction: ${sizeReduction}%`);
    console.log(`   ✅ Optimization complete!`);
    console.log('');
    
    return {
      success: true,
      originalSize: originalStats.size,
      optimizedSize: optimizedBuffer.length,
      reduction: parseFloat(sizeReduction)
    };
    
  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
    console.log('');
    return { success: false, error: error.message };
  }
}

// Main optimization function
async function optimizeAllImages() {
  const results = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (const filename of imageFiles) {
    const result = await optimizeImage(filename);
    results.push({ filename, ...result });
    
    if (result.success) {
      successCount++;
      if (!isDryRun) {
        totalOriginalSize += result.originalSize;
        totalOptimizedSize += result.optimizedSize;
      }
    } else {
      errorCount++;
    }
    
    // Small delay to prevent overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Print summary
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('========================');
  console.log(`✅ Successfully processed: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  
  if (!isDryRun && totalOriginalSize > 0) {
    const totalReductionMB = ((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(1);
    const totalReductionPercent = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
    
    console.log(`📁 Total size before: ${(totalOriginalSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`📁 Total size after: ${(totalOptimizedSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`🎉 Total savings: ${totalReductionMB}MB (${totalReductionPercent}% reduction)`);
    
    if (createBackup) {
      console.log(`💾 Original files backed up to: ${CONFIG.BACKUP_DIR}`);
    }
  }
  
  if (isDryRun) {
    console.log('');
    console.log('🚀 To actually optimize the images, run:');
    console.log('   node scripts/optimize-row-images.js --backup');
  }
}

// Run the optimization
optimizeAllImages().catch(error => {
  console.error('❌ Optimization failed:', error);
  process.exit(1);
}); 