#!/usr/bin/env node

/**
 * Optimize Hero Images Script
 * 
 * This script optimizes the large hero images in public/images/ for web usage.
 * Hero images are typically used full-screen, so they need higher resolution
 * than regular images but still need optimization for web performance.
 * 
 * Usage:
 *   node scripts/optimize-hero-images.js
 *   node scripts/optimize-hero-images.js --backup  (creates backups first)
 *   node scripts/optimize-hero-images.js --dry-run (preview only)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Source and destination paths
  INPUT_DIR: path.join(process.cwd(), 'public', 'images'),
  BACKUP_DIR: path.join(process.cwd(), 'public', 'images_hero_backup'),
  
  // Hero image optimization settings (larger than regular images)
  MAX_WIDTH: 1920,     // Full HD width for hero displays
  MAX_HEIGHT: 1080,    // Full HD height
  QUALITY: 90,         // Higher quality for hero images (90% for crisp display)
  TARGET_SIZE_KB: 800, // Target file size in KB (larger than regular images)
  
  // File extensions to process
  EXTENSIONS: ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG'],
  
  // Specific hero images to target
  HERO_IMAGES: [
    'HERO_v2.jpg',
    'hero_home.png',
    'gallery_page_hero.png',
    'landing_events_page.png',
    'event_production.png',
    'event_planning.png',
    'marketing.png',
    'talent_managment.png',
    'about_us_hero.png' // In case it exists
  ]
};

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const createBackup = args.includes('--backup');

console.log('🎭 Hero Images Optimization Script');
console.log('===================================');

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

// Get all hero image files
const allFiles = fs.readdirSync(CONFIG.INPUT_DIR)
  .filter(file => {
    const ext = path.extname(file);
    return CONFIG.EXTENSIONS.includes(ext);
  });

// Filter for known hero images or all images if specific list is empty
const heroFiles = allFiles.filter(file => 
  CONFIG.HERO_IMAGES.some(heroImage => 
    file.toLowerCase() === heroImage.toLowerCase() || 
    file.toLowerCase().includes('hero') ||
    file.toLowerCase().includes('landing')
  )
);

// If no specific hero images found, show all available images for user to decide
if (heroFiles.length === 0) {
  console.log('⚠️  No specific hero images found. Available image files:');
  allFiles.forEach(file => {
    const filePath = path.join(CONFIG.INPUT_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
    console.log(`   • ${file} (${sizeMB}MB)`);
  });
  console.log('');
  console.log('💡 Tip: The script targets known hero images. If you want to optimize specific images,');
  console.log('   update the HERO_IMAGES array in the script or rename your files to include "hero".');
  process.exit(0);
}

console.log(`🔍 Found ${heroFiles.length} hero images to optimize:`);
heroFiles.forEach(file => {
  const filePath = path.join(CONFIG.INPUT_DIR, file);
  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
  console.log(`   • ${file} (${sizeMB}MB)`);
});

console.log('');

// Process each hero image
async function optimizeHeroImage(filename) {
  const inputPath = path.join(CONFIG.INPUT_DIR, filename);
  const backupPath = path.join(CONFIG.BACKUP_DIR, filename);
  
  try {
    console.log(`🔄 Processing: ${filename}`);
    
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSizeMB = (originalStats.size / 1024 / 1024).toFixed(1);
    console.log(`   📊 Original: ${originalSizeMB}MB`);
    
    // Get original metadata
    const originalMetadata = await sharp(inputPath).metadata();
    console.log(`   📐 Original dimensions: ${originalMetadata.width}x${originalMetadata.height}px`);
    
    if (isDryRun) {
      // Calculate estimated optimized dimensions
      const aspectRatio = originalMetadata.width / originalMetadata.height;
      let newWidth = Math.min(originalMetadata.width, CONFIG.MAX_WIDTH);
      let newHeight = Math.min(originalMetadata.height, CONFIG.MAX_HEIGHT);
      
      // Maintain aspect ratio
      if (newWidth / aspectRatio > CONFIG.MAX_HEIGHT) {
        newWidth = CONFIG.MAX_HEIGHT * aspectRatio;
      } else {
        newHeight = newWidth / aspectRatio;
      }
      
      console.log(`   🎯 Will resize to: ${Math.round(newWidth)}x${Math.round(newHeight)}px at ${CONFIG.QUALITY}% quality`);
      console.log(`   ✨ Estimated size reduction: ~70-85%`);
      console.log('');
      return { success: true };
    }
    
    // Create backup if requested
    if (createBackup) {
      fs.copyFileSync(inputPath, backupPath);
      console.log(`   💾 Backup created: ${path.basename(backupPath)}`);
    }
    
    // Determine output format based on input
    const inputFormat = originalMetadata.format;
    const isPNG = inputFormat === 'png';
    
    // Optimize the image with progressive quality adjustment
    let quality = CONFIG.QUALITY;
    let optimizedBuffer;
    let attempts = 0;
    const maxAttempts = 4;
    
    do {
      let sharpInstance = sharp(inputPath)
        .resize(CONFIG.MAX_WIDTH, CONFIG.MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true
        });
      
      if (isPNG) {
        // For PNG images, use PNG optimization
        optimizedBuffer = await sharpInstance
          .png({ 
            quality: Math.round(quality),
            compressionLevel: 8,
            progressive: true
          })
          .toBuffer();
      } else {
        // For JPEG images
        optimizedBuffer = await sharpInstance
          .jpeg({ 
            quality, 
            progressive: true,
            mozjpeg: true
          })
          .toBuffer();
      }
      
      const fileSizeKB = optimizedBuffer.length / 1024;
      
      if (fileSizeKB <= CONFIG.TARGET_SIZE_KB || quality <= 70) {
        break; // Acceptable size or minimum quality reached
      }
      
      // Reduce quality if file is still too large
      quality = Math.max(quality - 5, 70); // Smaller reduction steps for hero images
      attempts++;
      
    } while (attempts < maxAttempts);
    
    // Get final metadata
    const metadata = await sharp(optimizedBuffer).metadata();
    const optimizedSizeKB = (optimizedBuffer.length / 1024).toFixed(0);
    const sizeReduction = ((1 - optimizedBuffer.length / originalStats.size) * 100).toFixed(1);
    
    // Write optimized image
    fs.writeFileSync(inputPath, optimizedBuffer);
    
    console.log(`   📐 New dimensions: ${metadata.width}x${metadata.height}px`);
    console.log(`   ✨ Optimized size: ${optimizedSizeKB}KB at ${quality}% quality (${isPNG ? 'PNG' : 'JPEG'})`);
    console.log(`   📉 Size reduction: ${sizeReduction}%`);
    console.log(`   ✅ Optimization complete!`);
    console.log('');
    
    return {
      success: true,
      originalSize: originalStats.size,
      optimizedSize: optimizedBuffer.length,
      reduction: parseFloat(sizeReduction),
      format: isPNG ? 'PNG' : 'JPEG'
    };
    
  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
    console.log('');
    return { success: false, error: error.message };
  }
}

// Main optimization function
async function optimizeAllHeroImages() {
  const results = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (const filename of heroFiles) {
    const result = await optimizeHeroImage(filename);
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
  console.log('📊 HERO OPTIMIZATION SUMMARY');
  console.log('=============================');
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
    console.log('🚀 To actually optimize the hero images, run:');
    console.log('   node scripts/optimize-hero-images.js --backup');
  }
  
  console.log('');
  console.log('🎭 Hero image optimization complete!');
  console.log('💡 These images are optimized for full-screen display while maintaining web performance.');
}

// Run the optimization
optimizeAllHeroImages().catch(error => {
  console.error('❌ Hero optimization failed:', error);
  process.exit(1);
});