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

async function processDirectory(dirPath, backupDir) {
  const items = fs.readdirSync(dirPath);
  let totalImages = 0;
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      console.log(`📁 Processing subdirectory: ${item}/`);
      const subBackupDir = backupDir ? path.join(backupDir, item) : null;
      
      if (subBackupDir && createBackup && !dryRun) {
        if (!fs.existsSync(subBackupDir)) {
          fs.mkdirSync(subBackupDir, { recursive: true });
          console.log(`📁 Created backup subdirectory: ${subBackupDir}`);
        }
      }
      
      const subTotal = await processDirectory(itemPath, subBackupDir);
      totalImages += subTotal;
    } else if (item.match(/\.(jpg|jpeg|png)$/i)) {
      // Process image file
      totalImages++;
      const relativePath = path.relative('public', itemPath);
      console.log(`📸 Processing: ${relativePath}`);
      
      if (createBackup && !dryRun && backupDir) {
        // Create backup
        const backupPath = path.join(backupDir, `original_${item}`);
        fs.copyFileSync(itemPath, backupPath);
        console.log(`💾 Backed up: ${item}`);
      }
      
      // Optimize image (800px width for merch showcase)
      const tempPath = dryRun ? null : path.join(path.dirname(itemPath), `optimized_temp_${item}`);
      
      if (!dryRun) {
        await optimizeImage(itemPath, tempPath, 800);
        
        // Replace original with optimized
        if (fs.existsSync(tempPath)) {
          fs.copyFileSync(tempPath, itemPath);
          fs.unlinkSync(tempPath); // Clean up temp file
        }
      } else {
        await optimizeImage(itemPath, null, 800);
      }
      
      console.log('');
    }
  }
  
  return totalImages;
}

async function main() {
  console.log('🛍️  Optimizing Merch Folder Images');
  console.log('===================================');
  
  if (dryRun) {
    console.log('🚨 DRY RUN MODE - No files will be modified');
    console.log('');
  }
  
  // Merch images directory
  const merchDir = 'public/merch';
  
  if (!fs.existsSync(merchDir)) {
    console.log(`❌ Directory ${merchDir} does not exist`);
    return;
  }
  
  // Create backup directory if requested
  let backupDir;
  if (createBackup && !dryRun) {
    backupDir = 'public/merch_backup';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`📁 Created backup directory: ${backupDir}`);
    }
  }
  
  console.log(`📂 Scanning directory: ${merchDir}`);
  console.log('');
  
  const totalImages = await processDirectory(merchDir, backupDir);
  
  if (totalImages === 0) {
    console.log('❌ No image files found in merch directory');
    return;
  }
  
  console.log(`📊 Total images processed: ${totalImages}`);
  console.log('');
  
  if (!dryRun) {
    console.log('🎉 Merch folder image optimization complete!');
    if (createBackup) {
      console.log(`💾 Original images backed up to: ${backupDir}`);
    }
  } else {
    console.log('📋 Dry run complete! Use --backup flag to create backups when running for real.');
  }
}

main().catch(console.error);