import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { Readable } from 'stream';

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// In-memory deduplication system for concurrent request protection
const activeOptimizations = new Map<string, { startTime: number; promise: Promise<unknown> }>();
const OPTIMIZATION_TIMEOUT = 600000; // 10 minutes timeout for stuck processes

// Image size configurations - only thumbnail needed
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150, quality: 80, suffix: '_thumb' },
} as const;

// Cleanup stale optimization locks
function cleanupStaleOptimizations() {
  const now = Date.now();
  for (const [folderPath, { startTime }] of activeOptimizations) {
    if (now - startTime > OPTIMIZATION_TIMEOUT) {
      console.log(`🧹 Cleaning up stale optimization for: ${folderPath}`);
      activeOptimizations.delete(folderPath);
    }
  }
}

// Check if folder is currently being optimized
function isOptimizationInProgress(folderPath: string): boolean {
  cleanupStaleOptimizations();
  return activeOptimizations.has(folderPath);
}

// Mark folder as being optimized
function markOptimizationStart(folderPath: string, promise: Promise<unknown>) {
  activeOptimizations.set(folderPath, {
    startTime: Date.now(),
    promise
  });
}

// Mark folder optimization as complete
function markOptimizationComplete(folderPath: string) {
  activeOptimizations.delete(folderPath);
}

// Stream to Buffer conversion
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

// Check if optimized versions exist for an image
async function checkOptimizedVersions(originalKey: string) {
  const basePath = originalKey.replace(/\.[^/.]+$/, '');
  const extension = originalKey.split('.').pop()?.toLowerCase() || 'jpg';
  
  const thumbnailKey = `${basePath}${IMAGE_SIZES.thumbnail.suffix}.${extension}`;
  
  const results = {
    hasThumbnail: false,
    thumbnailKey
  };
  
  try {
    await s3Client.send(new GetObjectCommand({ Bucket: BUCKET_NAME, Key: thumbnailKey }));
    results.hasThumbnail = true;
  } catch {
    // Thumbnail doesn't exist
  }
  
  return results;
}

// Process single image to create thumbnail only
async function processImage(originalKey: string): Promise<{
  success: boolean;
  thumbnailKey?: string;
  error?: string;
}> {
  try {
    console.log(`🔄 Processing image: ${originalKey}`);
    
    // Download original from S3
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: originalKey,
    });
    
    const response = await s3Client.send(getCommand);
    if (!response.Body) {
      throw new Error('Failed to download original image');
    }
    
    const originalBuffer = await streamToBuffer(response.Body as Readable);
    console.log(`📊 Original: ${(originalBuffer.length / 1024 / 1024).toFixed(2)}MB`);
    
    const basePath = originalKey.replace(/\.[^/.]+$/, '');
    const extension = originalKey.split('.').pop()?.toLowerCase() || 'jpg';
    
    const results = {
      success: true,
      thumbnailKey: ''
    };
    
    // Process only thumbnail
    const config = IMAGE_SIZES.thumbnail;
    const outputKey = `${basePath}${config.suffix}.${extension}`;
    
    // Create square thumbnail with crop
    const sharpInstance = sharp(originalBuffer).resize(config.width, config.height, {
      fit: 'cover',
      position: 'center'
    });
    
    const processedBuffer = await sharpInstance
      .jpeg({ quality: config.quality, progressive: true })
      .toBuffer();
    
    const sizeReduction = ((1 - processedBuffer.length / originalBuffer.length) * 100).toFixed(1);
    console.log(`✨ Thumbnail: ${(processedBuffer.length / 1024).toFixed(2)}KB (${sizeReduction}% reduction)`);
    
    // Upload to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: outputKey,
      Body: processedBuffer,
      ContentType: `image/${extension === 'jpg' ? 'jpeg' : extension}`,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    }));
    
    results.thumbnailKey = outputKey;
    
    console.log(`✅ Optimization complete: ${originalKey}`);
    return results;
    
  } catch (error) {
    console.error(`❌ Optimization failed for ${originalKey}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get all images in a folder that need optimization
async function getUnoptimizedImages(folderPath: string): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: folderPath,
      MaxKeys: 1000,
    });

    const response = await s3Client.send(command);
    const objects = response.Contents || [];
    
    // Filter for original image files (not already optimized versions)
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const originalImages = objects
      .filter(obj => {
        if (!obj.Key) return false;
        const extension = obj.Key.split('.').pop()?.toLowerCase();
        const isImage = extension && imageExtensions.includes(extension);
        const isOptimizedVersion = obj.Key.includes('_thumb') || obj.Key.includes('_medium');
        return isImage && !isOptimizedVersion;
      })
      .map(obj => obj.Key!)
      .sort(); // Sort for consistent processing order
    
    // Check which ones need optimization - batch check for better performance
    const unoptimizedImages: string[] = [];
    
    // Process in chunks to avoid overwhelming S3
    const BATCH_SIZE = 10;
    for (let i = 0; i < originalImages.length; i += BATCH_SIZE) {
      const batch = originalImages.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (imageKey) => {
          const optimized = await checkOptimizedVersions(imageKey);
          return { imageKey, needsOptimization: !optimized.hasThumbnail };
        })
      );
      
      batchResults.forEach(({ imageKey, needsOptimization }) => {
        if (needsOptimization) {
          unoptimizedImages.push(imageKey);
        }
      });
    }
    
    return unoptimizedImages;
    
  } catch (error) {
    console.error('Error finding unoptimized images:', error);
    return [];
  }
}

// Main optimization function with better error handling and progress tracking
async function optimizeFolderImages(folderPath: string, maxImages: number = 10) {
  console.log(`🚀 Starting optimization for: ${folderPath}`);
  
  // Get unoptimized images in this folder
  const unoptimizedImages = await getUnoptimizedImages(folderPath);
  
  if (unoptimizedImages.length === 0) {
    console.log(`✅ All images already optimized in: ${folderPath}`);
    return {
      message: 'All images are already optimized',
      folderPath,
      optimized: 0,
      total: 0,
      hasMore: false
    };
  }
  
  console.log(`📋 Found ${unoptimizedImages.length} images to optimize`);
  
  // Process up to maxImages to avoid timeouts
  const imagesToProcess = unoptimizedImages.slice(0, maxImages);
  
  let successCount = 0;
  let errorCount = 0;
  const results = [];
  const errors = [];
  
  // Process images sequentially to manage memory and avoid overwhelming S3
  for (const imageKey of imagesToProcess) {
    try {
      const result = await processImage(imageKey);
      results.push({
        image: imageKey,
        success: result.success,
        error: result.error
      });
      
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
        if (result.error) {
          errors.push(`${imageKey}: ${result.error}`);
        }
      }
      
      // Small delay to prevent overwhelming S3 and respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      errorCount++;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${imageKey}: ${errorMsg}`);
      console.error(`❌ Failed to process ${imageKey}:`, error);
    }
  }
  
  const hasMore = unoptimizedImages.length > maxImages;
  
  console.log(`✅ Optimization batch complete: ${successCount} success, ${errorCount} errors`);
  
  return {
    message: `Optimization batch completed for ${folderPath}`,
    folderPath,
    optimized: successCount,
    errors: errorCount,
    total: unoptimizedImages.length,
    processed: imagesToProcess.length,
    hasMore,
    remainingImages: unoptimizedImages.length - maxImages,
    errorDetails: errors.slice(0, 3), // First 3 errors for debugging
    results: results.slice(0, 3) // First 3 results for debugging
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { folderPath, maxImages = 10 } = body;
    
    if (!folderPath) {
      return NextResponse.json({ error: 'folderPath is required' }, { status: 400 });
    }
    
    // Check if this folder is already being optimized
    if (isOptimizationInProgress(folderPath)) {
      console.log(`⏳ Optimization already in progress for: ${folderPath}`);
      return NextResponse.json({
        message: 'Optimization already in progress for this folder',
        folderPath,
        inProgress: true
      }, { status: 202 }); // 202 Accepted - processing
    }
    
    // Create optimization promise and track it
    const optimizationPromise = optimizeFolderImages(folderPath, maxImages)
      .finally(() => {
        markOptimizationComplete(folderPath);
      });
    
    markOptimizationStart(folderPath, optimizationPromise);
    
    // Wait for optimization to complete
    const result = await optimizationPromise;
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Auto-optimization error:', error);
    return NextResponse.json(
      { 
        error: 'Auto-optimization failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderPath = searchParams.get('folderPath');
    
    if (!folderPath) {
      return NextResponse.json({ error: 'folderPath parameter required' }, { status: 400 });
    }
    
    // Check if optimization is currently in progress
    const inProgress = isOptimizationInProgress(folderPath);
    
    // Get optimization status for a folder
    const unoptimizedImages = await getUnoptimizedImages(folderPath);
    
    return NextResponse.json({
      folderPath,
      needsOptimization: unoptimizedImages.length,
      isFullyOptimized: unoptimizedImages.length === 0,
      inProgress,
      unoptimizedCount: unoptimizedImages.length
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check optimization status' },
      { status: 500 }
    );
  }
} 