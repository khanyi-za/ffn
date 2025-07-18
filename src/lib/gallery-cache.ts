// Gallery cache utility functions
interface ImageData {
  id: string;
  src: string;
  name: string;
  aspectRatio: string;
  lastModified?: Date;
}

interface GalleryData {
  events: string[];
  dates: Record<string, string[]>;
  photographers: Record<string, string[]>;
  images: Record<string, ImageData[]>;
  lastUpdated: string;
}

interface CachedGalleryData {
  data: GalleryData;
  timestamp: number;
}

// In-memory cache as backup (this will be replaced with Vercel KV in production)
let memoryCache: CachedGalleryData | null = null;

// Function to store data in cache (this will be replaced with Vercel KV)
export async function storeInCache(data: GalleryData): Promise<void> {
  // For now, store in memory cache
  memoryCache = {
    data,
    timestamp: Date.now()
  };
  
  // TODO: Replace with Vercel KV storage
  // await kv.set('gallery-data', JSON.stringify(data));
  console.log('Gallery data cached successfully');
}

// Function to get cached data
export async function getCachedGalleryData(): Promise<GalleryData | null> {
  // TODO: Replace with Vercel KV retrieval
  // const cached = await kv.get('gallery-data');
  // if (cached) return JSON.parse(cached);
  
  if (memoryCache && Date.now() - memoryCache.timestamp < 24 * 60 * 60 * 1000) {
    return memoryCache.data;
  }
  
  return null;
}

// Export types for use in other files
export type { ImageData, GalleryData, CachedGalleryData }; 