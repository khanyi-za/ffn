#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const createBackup = args.includes('--backup');

async function optimizeImage(inputPath, outputPath, maxWidth = 800) {
  try {
    const stats = fs.statSync(inputPath);
    console.log(`🔄 Optimizing: ${path.basename(inputPath)} (${(stats.size / 1024 / 1024).toFixed(1)}MB)`);
    
    if (dryRun) {
      console.log(`📋 DRY RUN: Would optimize ${path.basename(inputPath)} to ${maxWidth}px width`);
      return;
    }
    
    await sharp(inputPath)
      .resize(maxWidth, null, { withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const reduction = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);
    console.log(`✅ Optimized: ${(newStats.size / 1024).toFixed(0)}KB (reduced by ${reduction}%)`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('🛍️  Optimizing Shop Images');
  console.log('==========================');
  
  if (dryRun) {
    console.log('🚨 DRY RUN MODE - No files will be modified');
    console.log('');
  }
  
  // Shop images directory
  const shopDir = 'public/shop_images';
  
  if (!fs.existsSync(shopDir)) {
    console.log(`❌ Directory ${shopDir} does not exist`);
    return;
  }
  
  // Create backup directory if requested
  let backupDir;
  if (createBackup && !dryRun) {
    backupDir = 'public/shop_images_backup';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`📁 Created backup directory: ${backupDir}`);
    }
  }
  
  // Get all image files
  const images = fs.readdirSync(shopDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
  
  if (images.length === 0) {
    console.log('❌ No image files found in shop_images directory');
    return;
  }
  
  console.log(`📸 Found ${images.length} images to optimize`);
  console.log('');
  
  for (const image of images) {
    const inputPath = path.join(shopDir, image);
    
    if (createBackup && !dryRun) {
      // Create backup
      const backupPath = path.join(backupDir, `original_${image}`);
      fs.copyFileSync(inputPath, backupPath);
      console.log(`💾 Backed up: ${image}`);
    }
    
    // Optimize image (800px width for shop showcase)
    const tempPath = dryRun ? null : path.join(shopDir, `optimized_temp_${image}`);
    
    if (!dryRun) {
      await optimizeImage(inputPath, tempPath, 800);
      
      // Replace original with optimized
      if (fs.existsSync(tempPath)) {
        fs.copyFileSync(tempPath, inputPath);
        fs.unlinkSync(tempPath); // Clean up temp file
      }
    } else {
      await optimizeImage(inputPath, null, 800);
    }
    
    console.log('');
  }
  
  if (!dryRun) {
    console.log('🎉 Shop image optimization complete!');
    if (createBackup) {
      console.log(`💾 Original images backed up to: ${backupDir}`);
    }
  } else {
    console.log('📋 Dry run complete! Use --backup flag to create backups when running for real.');
  }
}

main().catch(console.error);