import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Define types for cached data
interface CachedData {
  data: S3ApiResponse;
  timestamp: number;
}

// Define API response type
interface S3ApiResponse {
  images: ImageData[];
  folders: string[];
  prefix: string;
  source: 'local' | 's3' | 'cached';
  page?: number;
  limit?: number;
  total?: number;
  error?: string;
}

// Define image data type - updated to support multi-resolution
interface ImageData {
  id: string;
  src: string; // Thumbnail URL for grid view (now local)
  mediumSrc?: string; // Medium resolution for lightbox
  originalSrc?: string; // Original URL for download (S3/CloudFront)
  name: string;
  aspectRatio: string;
  lastModified?: Date;
  isOptimized?: boolean; // Whether optimized versions exist locally
}

// Initialize S3 client if credentials are available
const s3Client = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? 
  new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  }) : null;

// CloudFront domain
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN || '';
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// Local paths configuration
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const THUMBNAILS_DIR = path.join(PUBLIC_DIR, 'thumbnails');

// Add API response caching - Extended to 24 hours for better performance
const CACHE_DURATION = 86400; // 24 hours in seconds (increased from 1 hour)
const apiCache: Record<string, CachedData> = {};

// Helper function to create proper CloudFront URL
function createCloudFrontUrl(key: string): string {
  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${key}`;
  }
  // Fallback to direct S3 URL
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
}

// Get local thumbnail path for an S3 key
function getLocalThumbnailPath(s3Key: string): string {
  const basePath = s3Key.replace(/\.[^/.]+$/, '');
  const extension = s3Key.split('.').pop()?.toLowerCase() || 'jpg';
  const thumbnailName = `${path.basename(basePath)}_medium.${extension}`;
  const folderPath = path.dirname(s3Key);
  
  return path.join(THUMBNAILS_DIR, folderPath, thumbnailName);
}

// Check if local thumbnail exists
function hasLocalThumbnail(s3Key: string): boolean {
  try {
    const localPath = getLocalThumbnailPath(s3Key);
    return fs.existsSync(localPath);
  } catch {
    return false;
  }
}

// Get local thumbnail URL for serving
function getLocalThumbnailUrl(s3Key: string): string {
  const basePath = s3Key.replace(/\.[^/.]+$/, '');
  const extension = s3Key.split('.').pop()?.toLowerCase() || 'jpg';
  const thumbnailName = `${path.basename(basePath)}_medium.${extension}`;
  const folderPath = path.dirname(s3Key);
  
  // Return URL relative to public folder
  return `/thumbnails/${folderPath}/${thumbnailName}`;
}

// Removed unused checkOptimizedVersions function

// Removed unused triggerAutoOptimization function

// Removed unused cache management functions

// Get images with local thumbnails (NEW HYBRID APPROACH)
async function getImagesWithLocalThumbnails(folderPath: string, page: number = 1, limit: number = 24): Promise<{ 
  images: ImageData[], 
  hasMore: boolean,
  autoOptimizationTriggered: boolean 
}> {
  if (!s3Client || !BUCKET_NAME) {
    console.warn('S3 client not initialized, cannot fetch images.');
    return { images: [], hasMore: false, autoOptimizationTriggered: false };
  }

  try {
    console.log(`📸 Fetching images from: ${folderPath} (using local thumbnails)`);
    
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: folderPath,
      MaxKeys: 1000,
    });

    const response = await s3Client.send(command);
    const objects = response.Contents || [];
    
    // Filter for original image files (not optimized versions)
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const originalImages = objects
      .filter(obj => {
        if (!obj.Key) return false;
        const extension = obj.Key.split('.').pop()?.toLowerCase();
        const isImage = extension && imageExtensions.includes(extension);
        const isOptimizedVersion = obj.Key.includes('_thumb') || obj.Key.includes('_medium');
        return isImage && !isOptimizedVersion;
      })
      .sort((a, b) => {
        const dateA = a.LastModified?.getTime() || 0;
        const dateB = b.LastModified?.getTime() || 0;
        return dateB - dateA;
      });
    
    console.log(`🖼️  Found ${originalImages.length} original images in ${folderPath}`);
    
    // Check local thumbnail coverage - only on first page
    const autoOptimizationTriggered = false;
    let missingThumbnails = 0;
    
    if (page === 1) {
      // Sample a few images to see if local thumbnails are needed
      const sampleSize = Math.min(5, originalImages.length);
      
      for (let i = 0; i < sampleSize; i++) {
        const imageKey = originalImages[i].Key!;
        if (!hasLocalThumbnail(imageKey)) {
          missingThumbnails++;
        }
      }
      
      // If we're missing thumbnails, we could trigger script or show message
      if (missingThumbnails > 0) {
        console.log(`⚠️  ${missingThumbnails}/${sampleSize} thumbnails missing locally. Run 'npm run generate-thumbnails' to create them.`);
        // Optionally trigger background optimization to S3 as fallback
        // const triggered = await triggerAutoOptimization(folderPath);
        // if (triggered) {
        //   autoOptimizationTriggered = true;
        //   markOptimizationTriggered(folderPath);
        // }
      }
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedImages = originalImages.slice(startIndex, endIndex);
    const hasMore = endIndex < originalImages.length;
    
    // Process each image to create URLs with local thumbnails
    const BATCH_SIZE = 10;
    const images: ImageData[] = [];
    
    for (let i = 0; i < paginatedImages.length; i += BATCH_SIZE) {
      const batch = paginatedImages.slice(i, i + BATCH_SIZE);
      
      // Create image data for batch
      const batchResults = batch.map((obj, batchIndex) => {
        const key = obj.Key!;
        const hasLocalThumb = hasLocalThumbnail(key);
        
        // Use local thumbnail if available, fallback to original
        const thumbnailUrl = hasLocalThumb 
          ? getLocalThumbnailUrl(key)  // Local thumbnail URL
          : createCloudFrontUrl(key);   // Fallback to original from S3/CloudFront
        
        const originalUrl = createCloudFrontUrl(key);
        
        return {
          id: `${folderPath}-${startIndex + i + batchIndex}`,
          src: thumbnailUrl, // Local thumbnail or S3 original
          originalSrc: originalUrl, // Always S3/CloudFront for download
          name: key.split('/').pop()?.split('.')[0] || `image-${startIndex + i + batchIndex}`,
          aspectRatio: determineAspectRatio(key),
          lastModified: obj.LastModified,
          isOptimized: hasLocalThumb // True if we have local thumbnail
        };
      });
      
      images.push(...batchResults);
    }
    
    const optimizedCount = images.filter(img => img.isOptimized).length;
    console.log(`✨ Processed ${images.length} images, ${optimizedCount} have local thumbnails`);
    
    return { images, hasMore, autoOptimizationTriggered };
    
  } catch (error) {
    console.error('Error fetching images with local thumbnails:', error);
    throw new Error('Failed to fetch images from S3');
  }
}

// Removed unused getImagesWithAutoOptimization function

// Helper function to determine aspect ratio
function determineAspectRatio(key: string): string {
  const filename = key.split('/').pop() || '';
  if (filename.toLowerCase().includes('wide') || filename.match(/landscape|wide|16x9|16-9/i)) {
    return 'wide';
  } else if (filename.toLowerCase().includes('tall') || filename.match(/portrait|tall|9x16|9-16|3x4|3-4/i)) {
    return 'tall';
  }
  return 'square';
}

// Filter function for date-based filtering
function filterDatesByEvent(dates: string[], event?: string): string[] {
  if (!event) return dates;
  
  // Special filtering logic for different events
  if (event === 'SoundSet Sunday') {
    // For SoundSet Sunday, we might want to show only certain dates
    return dates;
  }
  
  return dates;
}

// Mock gallery data for local development
async function getMockGalleryData(
  event?: string, 
  date?: string, 
  photographer?: string,
  page: number = 1,
  limit: number = 24
): Promise<{ images: ImageData[], folders: string[], total?: number }> {
  try {
    const prefix = event && date && photographer ? `${event}/${date}/${photographer}/` : '';
    const scanDir = path.join(process.cwd(), 'public', 'images', prefix);
    
    // If directory doesn't exist, generate placeholder images
    if (!fs.existsSync(scanDir)) {
      // Generate 100 placeholder images for testing pagination
      const sampleImages = Array.from({ length: 100 }, (_, i) => {
        const imageSrc = `/images/${i % 6 === 0 ? 'ep_1.png' : 
               i % 6 === 1 ? 'hp_1.png' : 
               i % 6 === 2 ? 'hp_2.png' :
               i % 6 === 3 ? 'hp_3.png' :
               i % 6 === 4 ? 'ep_2.png' :
               'video_variable.png'}`;
        return {
          id: `${i+1}`,
          src: imageSrc,
          originalSrc: imageSrc,
          name: `Sample ${i+1}`,
          aspectRatio: i % 3 === 0 ? 'wide' : i % 3 === 1 ? 'tall' : 'square',
          isOptimized: false
        };
      });
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedImages = sampleImages.slice(startIndex, endIndex);
      
      return { 
        images: paginatedImages, 
        folders: [],
        total: sampleImages.length
      };
    }
    
    // Read actual image files from the directory
    const imageFiles = fs.readdirSync(scanDir)
      .filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file));
    
    // Generate images with pagination
    const allImages = imageFiles.map((file, index) => {
      // Determine aspect ratio from filename or apply defaults in a pattern
      let aspectRatio = 'square';
      if (file.includes('wide') || index % 3 === 0) {
        aspectRatio = 'wide';
      } else if (file.includes('tall') || index % 3 === 1) {
        aspectRatio = 'tall';
      }
      
      const imageSrc = `/images/${event}/${date}/${photographer}/${file}`;
      return {
        id: `${prefix}${file}`,
        src: imageSrc, // Using local file as thumbnail
        originalSrc: imageSrc, // Same for original
        name: file,
        aspectRatio,
        isOptimized: false // Local files are not optimized
      };
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedImages = allImages.slice(startIndex, endIndex);
    
    return { 
      images: paginatedImages, 
      folders: [],
      total: allImages.length
    };
  } catch (error) {
    console.error('Error in mock gallery data:', error);
    return { images: [], folders: [] };
  }
}

// Add a timeout wrapper for the S3 command
async function executeWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Operation timed out after ${timeout}ms`));
    }, timeout);
  });

  return Promise.race([promise, timeoutPromise]);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const event = searchParams.get('event');
  const date = searchParams.get('date');
  const photographer = searchParams.get('photographer');

  // Get pagination parameters
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '24', 10);
  
  // Create a cache key based on the request URL
  const cacheKey = `${event || 'all'}-${date || 'all'}-${photographer || 'all'}-${page}-${limit}`;

  try {
    console.log('API called with params:', { event, date, photographer, page, limit });
    
    // Note: Cron job caching removed - using automatic optimization instead
    
    // PRIORITY 2: Check if we have a valid cached response (old API cache)
    const now = Date.now();
    if (apiCache[cacheKey] && now - apiCache[cacheKey].timestamp < CACHE_DURATION * 1000) {
      console.log('Using old API cache');
      return NextResponse.json(apiCache[cacheKey].data, {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}, stale-while-revalidate=86400`,
          'X-Cache': 'HIT',
          'ETag': `"${cacheKey}-${apiCache[cacheKey].timestamp}"`,
          'Last-Modified': new Date(apiCache[cacheKey].timestamp).toUTCString(),
          'Vary': 'Accept-Encoding'
        }
      });
    }
    
    // PRIORITY 3: Real-time S3 data with automatic optimization
    console.log('No cached data available, fetching from S3 with auto-optimization');
    
    if (!s3Client || !process.env.AWS_S3_BUCKET_NAME) {
      console.log('S3 credentials not found, using local file fallback');
      const mockData = await getMockGalleryData(
        event || undefined, 
        date || undefined, 
        photographer || undefined,
        page,
        limit
      );
      
      const response: S3ApiResponse = {
        images: mockData.images,
        folders: mockData.folders,
        prefix: '',
        source: 'local',
        page,
        limit,
        total: mockData.total || mockData.images.length
      };
      
      // Cache the response
      apiCache[cacheKey] = { data: response, timestamp: now };
      
      return NextResponse.json(response, {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}, stale-while-revalidate=86400`,
          'X-Cache': 'MISS',
          'ETag': `"${cacheKey}-${now}"`,
          'Last-Modified': new Date(now).toUTCString(),
          'Vary': 'Accept-Encoding'
        }
      });
    }

    // Real S3 implementation with automatic optimization
    const bucketName = process.env.AWS_S3_BUCKET_NAME!;
    let prefix = '';

    if (event && date && photographer) {
      // Get images for specific photographer with auto-optimization
      prefix = `${event}/${date}/${photographer}/`;
      
             const { images, autoOptimizationTriggered } = await getImagesWithLocalThumbnails(prefix, page, limit);
      
      const responseData: S3ApiResponse = {
        images,
        folders: [],
        prefix,
        source: 's3',
        page,
        limit,
        total: images.length
      };
      
      // Cache the response
      apiCache[cacheKey] = { data: responseData, timestamp: now };
      
      const headers: Record<string, string> = {
        'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}, stale-while-revalidate=86400`,
        'X-Cache': 'MISS',
        'ETag': `"${cacheKey}-${now}"`,
        'Last-Modified': new Date(now).toUTCString(),
        'Vary': 'Accept-Encoding'
      };
      
      if (autoOptimizationTriggered) {
        headers['X-Auto-Optimization'] = 'triggered';
      }
      
      return NextResponse.json(responseData, { headers });
      
    } else {
      // Handle folder listing (events, dates, photographers)
      if (event && date) {
        prefix = `${event}/${date}/`;
      } else if (event) {
        prefix = `${event}/`;
      }

      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
        Delimiter: '/',
        MaxKeys: 1000,
      });

      const response = await executeWithTimeout(s3Client.send(command), 15000);
      
      let folders: string[] = [];
      const paginatedImages: ImageData[] = [];
      
      if (response.CommonPrefixes && response.CommonPrefixes.length > 0) {
        folders = response.CommonPrefixes.map(prefix => {
          const folderName = prefix.Prefix?.split('/').filter(Boolean).pop() || '';
          return folderName;
        });
      }
      
      // Apply filtering based on event
      const filteredFolders = filterDatesByEvent(folders, event || undefined);

      const responseData: S3ApiResponse = {
        images: paginatedImages,
        folders: filteredFolders,
        prefix,
        source: 's3',
        page,
        limit,
        total: paginatedImages.length
      };
      
      // Cache the response
      apiCache[cacheKey] = { data: responseData, timestamp: now };
      
      return NextResponse.json(responseData, {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}, stale-while-revalidate=86400`,
          'X-Cache': 'MISS',
          'ETag': `"${cacheKey}-${now}"`,
          'Last-Modified': new Date(now).toUTCString(),
          'Vary': 'Accept-Encoding'
        }
      });
    }
    
  } catch (error) {
    console.error('S3 API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from S3', images: [], folders: [], prefix: '', source: 's3' } as S3ApiResponse,
      { status: 500 }
    );
  }
} 