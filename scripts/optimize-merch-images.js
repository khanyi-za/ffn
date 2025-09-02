#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath, maxWidth = 800) {
  try {
    const stats = fs.statSync(inputPath);
    console.log(`🔄 Optimizing: ${path.basename(inputPath)} (${(stats.size / 1024 / 1024).toFixed(1)}MB)`);
    
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
  console.log('🖼️  Optimizing Merch Component Images');
  console.log('=====================================');
  
  // Create backup directory
  const backupDir = 'public/merch_backup';
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Optimize merch image
  const merchImage = 'public/merch/merch_coming.jpg';
  if (fs.existsSync(merchImage)) {
    // Create backup
    fs.copyFileSync(merchImage, `${backupDir}/merch_coming_original.jpg`);
    await optimizeImage(merchImage, `${backupDir}/merch_coming_optimized.jpg`, 800);
    // Replace original with optimized
    fs.copyFileSync(`${backupDir}/merch_coming_optimized.jpg`, merchImage);
  }
  
  // Optimize preview gallery images
  const previewDir = 'public/preview_gallery';
  if (fs.existsSync(previewDir)) {
    const images = fs.readdirSync(previewDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    
    for (const image of images) {
      const inputPath = path.join(previewDir, image);
      const backupPath = path.join(backupDir, `preview_${image}`);
      const tempPath = path.join(backupDir, `preview_optimized_${image}`);
      
      // Create backup
      fs.copyFileSync(inputPath, backupPath);
      await optimizeImage(inputPath, tempPath, 400); // Smaller for gallery previews
      // Replace original
      fs.copyFileSync(tempPath, inputPath);
    }
  }
  
  console.log('🎉 Optimization complete! Backups saved to public/merch_backup/');
}

main().catch(console.error);