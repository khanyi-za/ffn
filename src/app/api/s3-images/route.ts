import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

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
  source: 'local' | 's3';
  page?: number;
  limit?: number;
  total?: number;
  error?: string;
}

// Define image data type
interface ImageData {
  id: string;
  src: string;
  name: string;
  aspectRatio: string;
  lastModified?: Date;
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

// Add API response caching - Extended to 24 hours for better performance
const CACHE_DURATION = 86400; // 24 hours in seconds (increased from 1 hour)
const apiCache: Record<string, CachedData> = {};

// Helper function to create proper CloudFront URL
function createCloudFrontUrl(key: string): string {
  // Remove any leading slash from the key
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  
  // Encode the key properly for URLs (handle spaces and special characters)
  // We need to split by '/' and encode each part separately to preserve the path structure
  const encodedKey = cleanKey.split('/').map(part => encodeURIComponent(part)).join('/');
  
  // Check if CLOUDFRONT_DOMAIN already includes the protocol
  if (CLOUDFRONT_DOMAIN.startsWith('http://') || CLOUDFRONT_DOMAIN.startsWith('https://')) {
    return `${CLOUDFRONT_DOMAIN}/${encodedKey}`;
  } else {
    return `https://${CLOUDFRONT_DOMAIN}/${encodedKey}`;
  }
}

// Helper function to filter out specific dates for certain events
function filterDatesByEvent(folders: string[], event?: string): string[] {
  if (event === 'SoundSet Sunday') {
    // Filter out "6 January 2025" for SoundSet Sunday
    return folders.filter(folder => folder !== '6 January 2025');
  }
  return folders;
}

// Function to generate mock data from local files (fallback for development)
async function getMockGalleryData(
  event?: string, 
  date?: string, 
  photographer?: string,
  page: number = 1,
  limit: number = 100
): Promise<{ images: ImageData[], folders: string[], total?: number }> {
  const baseDir = path.join(process.cwd(), 'public/images');
  
  // Determine which directory to scan based on params
  let scanDir = baseDir;
  let prefix = '';
  
  try {
    // List all events (if no event specified)
    if (!event) {
      // Get direct subdirectories of images folder as events
      const events = fs.readdirSync(baseDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      return { images: [], folders: events };
    }
    
    // List all dates for an event
    scanDir = path.join(baseDir, event);
    prefix = event + '/';
    
    if (!date) {
      if (!fs.existsSync(scanDir)) {
        // Mock dates if event folder doesn't exist
        let mockDates = ['09 February 2025', '10 March 2025', '15 April 2025'];
        // Apply filtering based on event
        mockDates = filterDatesByEvent(mockDates, event);
        return { 
          images: [], 
          folders: mockDates 
        };
      }
      
      const dates = fs.readdirSync(scanDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      // Apply filtering based on event
      const filteredDates = filterDatesByEvent(dates, event);
      
      return { images: [], folders: filteredDates };
    }
    
    // List all photographers for a date
    scanDir = path.join(baseDir, event, date);
    prefix = event + '/' + date + '/';
    
    if (!photographer) {
      if (!fs.existsSync(scanDir)) {
        // Mock photographers if date folder doesn't exist
        return { 
          images: [], 
          folders: ['Photographer One', 'Photographer Two', 'Photographer Three'] 
        };
      }
      
      const photographers = fs.readdirSync(scanDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      return { images: [], folders: photographers };
    }
    
    // Get images for a specific photographer
    scanDir = path.join(baseDir, event, date, photographer);
    prefix = event + '/' + date + '/' + photographer + '/';
    
    if (!fs.existsSync(scanDir)) {
      // Generate 100 placeholder images for testing pagination
      const sampleImages = Array.from({ length: 100 }, (_, i) => ({
        id: `${i+1}`,
        src: `/images/${i % 6 === 0 ? 'ep_1.png' : 
               i % 6 === 1 ? 'hp_1.png' : 
               i % 6 === 2 ? 'hp_2.png' :
               i % 6 === 3 ? 'hp_3.png' :
               i % 6 === 4 ? 'ep_2.png' :
               'video_variable.png'}`,
        name: `Sample ${i+1}`,
        aspectRatio: i % 3 === 0 ? 'wide' : i % 3 === 1 ? 'tall' : 'square'
      }));
      
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
      
      return {
        id: `${prefix}${file}`,
        src: `/images/${event}/${date}/${photographer}/${file}`,
        name: file,
        aspectRatio
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
  try {
    // Get query parameters
    const url = new URL(request.url);
    const event = url.searchParams.get('event');
    const date = url.searchParams.get('date');
    const photographer = url.searchParams.get('photographer');
    
    // Get pagination parameters
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);
    
    // Create a cache key based on the request URL
    const cacheKey = request.url;
    
    // Check if we have a valid cached response
    const now = Date.now();
    if (apiCache[cacheKey] && now - apiCache[cacheKey].timestamp < CACHE_DURATION * 1000) {
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
    
    // Check if we should use S3 or fallback to local files
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
        folders: mockData.folders, // filtering already applied in getMockGalleryData
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
    
    // If using S3, continue with the original implementation
    // Build the prefix for S3 listing
    let prefix = '';
    if (event) prefix += `${event}/`;
    if (date) prefix += `${date}/`;
    if (photographer) prefix += `${photographer}/`;
    
    // List objects from S3 bucket
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME || '',
      Prefix: prefix,
      Delimiter: '/',
      MaxKeys: 1000, // Get more keys to support pagination
    });
    
    try {
      // Execute with a 10-second timeout
      const response = await executeWithTimeout(s3Client.send(command), 10000);
      
      // Process all images first (to support pagination)
      const allImages = response.Contents?.filter(item => {
        // Filter for image files
        const key = item.Key || '';
        return /\.(jpe?g|png|gif|webp)$/i.test(key);
      }) || [];
      
      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedImages = allImages.slice(startIndex, endIndex).map(item => {
        const key = item.Key || '';
        const filename = key.split('/').pop() || '';
        
        // Generate a simpler aspect ratio based on file name or extension
        let aspectRatio = 'square';
        if (filename.toLowerCase().includes('wide') || filename.match(/landscape|wide|16x9|16-9/i)) {
          aspectRatio = 'wide';
        } else if (filename.toLowerCase().includes('tall') || filename.match(/portrait|tall|9x16|9-16|3x4|3-4/i)) {
          aspectRatio = 'tall';
        }
        
        return {
          id: key,
          src: createCloudFrontUrl(key),
          name: filename,
          aspectRatio,
          lastModified: item.LastModified,
        };
      });
      
      // If no images found, list available prefixes
      let folders: string[] = [];
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
        total: allImages.length
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
    } catch (error) {
      console.error('Error fetching S3 images:', error);
      return NextResponse.json(
        { error: 'Failed to fetch images from S3', images: [], folders: [], prefix: '', source: 's3' } as S3ApiResponse,
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching S3 images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images from S3', images: [], folders: [], prefix: '', source: 's3' } as S3ApiResponse,
      { status: 500 }
    );
  }
} 