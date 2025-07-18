import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { storeInCache, getCachedGalleryData, type ImageData, type GalleryData } from '@/lib/gallery-cache';

// Initialize S3 client
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

// Cache functions are now imported from @/lib/gallery-cache

// Helper function to create proper CloudFront URL
function createCloudFrontUrl(key: string): string {
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  const encodedKey = cleanKey.split('/').map(part => encodeURIComponent(part)).join('/');
  
  if (CLOUDFRONT_DOMAIN.startsWith('http://') || CLOUDFRONT_DOMAIN.startsWith('https://')) {
    return `${CLOUDFRONT_DOMAIN}/${encodedKey}`;
  } else {
    return `https://${CLOUDFRONT_DOMAIN}/${encodedKey}`;
  }
}

// Helper function to filter out specific dates for certain events
function filterDatesByEvent(folders: string[], event?: string): string[] {
  if (event === 'SoundSet Sunday') {
    return folders.filter(folder => folder !== '6 January 2025');
  }
  return folders;
}

// Helper function to determine aspect ratio from filename
function determineAspectRatio(filename: string): string {
  const lowerName = filename.toLowerCase();
  if (lowerName.includes('wide') || lowerName.match(/landscape|wide|16x9|16-9/i)) {
    return 'wide';
  } else if (lowerName.includes('tall') || lowerName.match(/portrait|tall|9x16|9-16|3x4|3-4/i)) {
    return 'tall';
  }
  return 'square';
}

// Function to get all events from S3
async function getAllEvents(): Promise<string[]> {
  if (!s3Client || !process.env.AWS_S3_BUCKET_NAME) {
    return ['SoundSet Sunday', 'Electic Sessions', 'Rare Experience'];
  }

  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Delimiter: '/',
    MaxKeys: 1000,
  });

  try {
    const response = await s3Client.send(command);
    const events = response.CommonPrefixes?.map(prefix => 
      prefix.Prefix?.split('/').filter(Boolean).pop() || ''
    ).filter(Boolean) || [];
    
    return events.length > 0 ? events : ['SoundSet Sunday', 'Electic Sessions', 'Rare Experience'];
  } catch (error) {
    console.error('Error fetching events:', error);
    return ['SoundSet Sunday', 'Electic Sessions', 'Rare Experience'];
  }
}

// Function to get all dates for a specific event
async function getDatesForEvent(event: string): Promise<string[]> {
  if (!s3Client || !process.env.AWS_S3_BUCKET_NAME) {
    const mockDates = ['09 February 2025', '10 March 2025', '15 April 2025'];
    return filterDatesByEvent(mockDates, event);
  }

  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: `${event}/`,
    Delimiter: '/',
    MaxKeys: 1000,
  });

  try {
    const response = await s3Client.send(command);
    const dates = response.CommonPrefixes?.map(prefix => 
      prefix.Prefix?.split('/').filter(Boolean).pop() || ''
    ).filter(Boolean) || [];
    
    return filterDatesByEvent(dates, event);
  } catch (error) {
    console.error(`Error fetching dates for ${event}:`, error);
    return filterDatesByEvent(['09 February 2025', '10 March 2025'], event);
  }
}

// Function to get all photographers for a specific event/date
async function getPhotographersForEventDate(event: string, date: string): Promise<string[]> {
  if (!s3Client || !process.env.AWS_S3_BUCKET_NAME) {
    return ['Photographer1', 'Photographer2', 'Photographer3'];
  }

  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: `${event}/${date}/`,
    Delimiter: '/',
    MaxKeys: 1000,
  });

  try {
    const response = await s3Client.send(command);
    const photographers = response.CommonPrefixes?.map(prefix => 
      prefix.Prefix?.split('/').filter(Boolean).pop() || ''
    ).filter(Boolean) || [];
    
    return photographers.length > 0 ? photographers : ['Photographer1', 'Photographer2'];
  } catch (error) {
    console.error(`Error fetching photographers for ${event}/${date}:`, error);
    return ['Photographer1', 'Photographer2'];
  }
}

// Function to get all images for a specific photographer
async function getImagesForPhotographer(event: string, date: string, photographer: string): Promise<ImageData[]> {
  if (!s3Client || !process.env.AWS_S3_BUCKET_NAME) {
    // Return mock images for testing
    return Array.from({ length: 50 }, (_, i) => ({
      id: `${event}/${date}/${photographer}/${i+1}`,
      src: `/images/${i % 6 === 0 ? 'ep_1.png' : 
             i % 6 === 1 ? 'hp_1.png' : 
             i % 6 === 2 ? 'hp_2.png' :
             i % 6 === 3 ? 'hp_3.png' :
             i % 6 === 4 ? 'ep_2.png' :
             'video_variable.png'}`,
      name: `Image ${i+1}`,
      aspectRatio: i % 3 === 0 ? 'wide' : i % 3 === 1 ? 'tall' : 'square'
    }));
  }

  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: `${event}/${date}/${photographer}/`,
    MaxKeys: 1000,
  });

  try {
    const response = await s3Client.send(command);
    const images = response.Contents?.filter(item => {
      const key = item.Key || '';
      return /\.(jpe?g|png|gif|webp)$/i.test(key);
    }).map(item => {
      const key = item.Key || '';
      const filename = key.split('/').pop() || '';
      
      return {
        id: key,
        src: createCloudFrontUrl(key),
        name: filename,
        aspectRatio: determineAspectRatio(filename),
        lastModified: item.LastModified,
      };
    }) || [];
    
    return images;
  } catch (error) {
    console.error(`Error fetching images for ${event}/${date}/${photographer}:`, error);
    return [];
  }
}

// Cache functions are now imported from @/lib/gallery-cache

// Main cron job function
export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron job request
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting gallery data refresh cron job...');
    const startTime = Date.now();
    
    // Initialize our data structure
    const galleryData: GalleryData = {
      events: [],
      dates: {},
      photographers: {},
      images: {},
      lastUpdated: new Date().toISOString()
    };

    // Step 1: Get all events
    console.log('Fetching events...');
    const events = await getAllEvents();
    galleryData.events = events;
    console.log(`Found ${events.length} events:`, events);

    // Step 2: For each event, get all dates
    console.log('Fetching dates for each event...');
    for (const event of events) {
      const dates = await getDatesForEvent(event);
      galleryData.dates[event] = dates;
      console.log(`Found ${dates.length} dates for ${event}`);

      // Step 3: For each date, get all photographers
      for (const date of dates) {
        const eventDateKey = `${event}/${date}`;
        const photographers = await getPhotographersForEventDate(event, date);
        galleryData.photographers[eventDateKey] = photographers;
        console.log(`Found ${photographers.length} photographers for ${event}/${date}`);

        // Step 4: For each photographer, get all images
        for (const photographer of photographers) {
          const fullKey = `${event}/${date}/${photographer}`;
          const images = await getImagesForPhotographer(event, date, photographer);
          galleryData.images[fullKey] = images;
          console.log(`Found ${images.length} images for ${fullKey}`);
        }
      }
    }

    // Step 5: Store the data in cache
    await storeInCache(galleryData);

    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`Gallery data refresh completed in ${duration}ms`);
    
    // Return summary
    const totalImages = Object.values(galleryData.images).reduce((sum, images) => sum + images.length, 0);
    const totalPhotographers = Object.values(galleryData.photographers).reduce((sum, photographers) => sum + photographers.length, 0);
    const totalDates = Object.values(galleryData.dates).reduce((sum, dates) => sum + dates.length, 0);

    return NextResponse.json({
      success: true,
      summary: {
        events: galleryData.events.length,
        dates: totalDates,
        photographers: totalPhotographers,
        images: totalImages,
        duration: `${duration}ms`,
        lastUpdated: galleryData.lastUpdated
      }
    });

  } catch (error) {
    console.error('Error in gallery data refresh cron job:', error);
    return NextResponse.json(
      { error: 'Failed to refresh gallery data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 