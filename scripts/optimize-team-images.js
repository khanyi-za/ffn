#!/usr/bin/env node

/**
 * Optimize Team Images Script
 * 
 * This script optimizes team member portrait images in public/images/ for web usage.
 * Team images are displayed in a 3:4 aspect ratio and need to be optimized for
 * portrait photography while maintaining good quality for professional presentation.
 * 
 * Usage:
 *   node scripts/optimize-team-images.js
 *   node scripts/optimize-team-images.js --backup  (creates backups first)
 *   node scripts/optimize-team-images.js --dry-run (preview only)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Source and destination paths
  INPUT_DIR: path.join(process.cwd(), 'public', 'images'),
  BACKUP_DIR: path.join(process.cwd(), 'public', 'images_team_backup'),
  
  // Team image optimization settings (portrait-optimized)
  MAX_WIDTH: 600,      // Optimal for 3:4 portrait display
  MAX_HEIGHT: 800,     // 3:4 aspect ratio
  QUALITY: 88,         // Higher quality for professional portraits
  TARGET_SIZE_KB: 250, // Target file size in KB (smaller than heroes)
  
  // File extensions to process
  EXTENSIONS: ['.jpg', '.jpeg', '.JPG', '.JPEG'],
  
  // Specific team member images to target
  TEAM_IMAGES: [
    'duo_founders.jpg',
    'Thube.jpg',
    'Neo.jpg', 
    'Sango.jpg',
    'Itu.jpg',
    'Emihle.jpg'
  ]
};

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const createBackup = args.includes('--backup');

console.log('👥 Team Images Optimization Script');
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

// Get all team image files
const allFiles = fs.readdirSync(CONFIG.INPUT_DIR)
  .filter(file => {
    const ext = path.extname(file);
    return CONFIG.EXTENSIONS.includes(ext);
  });

// Filter for known team images
const teamFiles = allFiles.filter(file => 
  CONFIG.TEAM_IMAGES.some(teamImage => 
    file.toLowerCase() === teamImage.toLowerCase()
  )
);

// If no team images found, show what's available
if (teamFiles.length === 0) {
  console.log('⚠️  No team images found. Available image files:');
  allFiles.forEach(file => {
    const filePath = path.join(CONFIG.INPUT_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
    console.log(`   • ${file} (${sizeMB}MB)`);
  });
  console.log('');
  console.log('💡 Tip: Update the TEAM_IMAGES array in the script to include your team images.');
  process.exit(0);
}

console.log(`🔍 Found ${teamFiles.length} team images to optimize:`);
teamFiles.forEach(file => {
  const filePath = path.join(CONFIG.INPUT_DIR, file);
  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
  console.log(`   • ${file} (${sizeMB}MB)`);
});

console.log('');

// Process each team image
async function optimizeTeamImage(filename) {
  const inputPath = path.join(CONFIG.INPUT_DIR, filename);
  const backupPath = path.join(CONFIG.BACKUP_DIR, filename);
  
  try {
    console.log(`🔄 Processing: ${filename}`);
    
    // Get original file size and metadata
    const originalStats = fs.statSync(inputPath);
    const originalSizeMB = (originalStats.size / 1024 / 1024).toFixed(1);
    const originalMetadata = await sharp(inputPath).metadata();
    
    console.log(`   📊 Original: ${originalSizeMB}MB`);
    console.log(`   📐 Original dimensions: ${originalMetadata.width}x${originalMetadata.height}px`);
    
    if (isDryRun) {
      // Calculate estimated optimized dimensions
      const aspectRatio = originalMetadata.width / originalMetadata.height;
      let newWidth = Math.min(originalMetadata.width, CONFIG.MAX_WIDTH);
      let newHeight = Math.min(originalMetadata.height, CONFIG.MAX_HEIGHT);
      
      // Maintain aspect ratio and optimize for portrait
      if (newWidth / aspectRatio > CONFIG.MAX_HEIGHT) {
        newWidth = CONFIG.MAX_HEIGHT * aspectRatio;
      } else {
        newHeight = newWidth / aspectRatio;
      }
      
      console.log(`   🎯 Will resize to: ${Math.round(newWidth)}x${Math.round(newHeight)}px at ${CONFIG.QUALITY}% quality`);
      console.log(`   📸 Optimized for portrait display (3:4 aspect ratio)`);
      console.log(`   ✨ Estimated size reduction: ~75-85%`);
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
    const maxAttempts = 5;
    
    do {
      optimizedBuffer = await sharp(inputPath)
        .resize(CONFIG.MAX_WIDTH, CONFIG.MAX_HEIGHT, {
          fit: 'inside', // Maintain aspect ratio, fit within bounds
          withoutEnlargement: true, // Don't upscale smaller images
          position: 'top' // For portraits, keep the top (face) in frame
        })
        .jpeg({ 
          quality, 
          progressive: true,
          mozjpeg: true, // Better compression for portraits
          trellisQuantisation: true, // Better quality for faces
          overshootDeringing: true, // Reduce artifacts around faces
          optimizeScans: true // Optimize for progressive loading
        })
        .toBuffer();
      
      const fileSizeKB = optimizedBuffer.length / 1024;
      
      if (fileSizeKB <= CONFIG.TARGET_SIZE_KB || quality <= 75) {
        break; // Acceptable size or minimum quality reached
      }
      
      // Reduce quality if file is still too large
      quality = Math.max(quality - 3, 75); // Smaller reduction steps for portraits
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
    console.log(`   👤 Portrait-optimized for professional display`);
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
async function optimizeAllTeamImages() {
  const results = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (const filename of teamFiles) {
    const result = await optimizeTeamImage(filename);
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
  console.log('📊 TEAM OPTIMIZATION SUMMARY');
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
    console.log('🚀 To actually optimize the team images, run:');
    console.log('   node scripts/optimize-team-images.js --backup');
  }
  
  console.log('');
  console.log('👥 Team image optimization complete!');
  console.log('💡 These images are optimized for portrait display with professional quality.');
}

// Run the optimization
optimizeAllTeamImages().catch(error => {
  console.error('❌ Team optimization failed:', error);
  process.exit(1);
});