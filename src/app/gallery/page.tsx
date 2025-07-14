"use client"

import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import debounce from "lodash/debounce"

interface ImageData {
  id: string;
  src: string;
  name: string;
  aspectRatio: string;
  lastModified?: Date;
}

interface S3ApiResponse {
  images: ImageData[];
  folders: string[];
  prefix: string;
  page?: number;
  limit?: number;
  total?: number;
}

async function fetchWithRetry(url: string, maxRetries = 3, retryDelay = 500): Promise<Response> {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.error(`Fetch attempt ${attempt + 1} failed:`, error);
      lastError = error;
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      // Increase delay for next retry
      retryDelay *= 1.5; 
    }
  }
  
  throw lastError || new Error(`Failed to fetch ${url} after ${maxRetries} attempts`);
}

export default function GalleryPage() {
  // For event and date dropdown filters
  const [activeEvent, setActiveEvent] = useState('SoundSet Sunday');
  const [activeDate, setActiveDate] = useState('09 February 2025');
  const [activePhotographer, setActivePhotographer] = useState('');
  
  // For S3 data
  const [eventOptions, setEventOptions] = useState<string[]>([]);
  const [dateOptions, setDateOptions] = useState<string[]>([]);
  const [photographerOptions, setPhotographerOptions] = useState<string[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const imagesPerPage = 12;

  // State for individual image loading
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
  // State for downloads
  const [downloadingImages, setDownloadingImages] = useState<Record<string, boolean>>({});

  // Track when an image finishes loading
  const handleImageLoaded = useCallback((id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  }, []);

  // Reset pagination when gallery parameters change
  useEffect(() => {
    // Reset page when selection changes, but don't trigger new API calls immediately
    setPage(1);
    setHasMore(true);
    setLoadedImages({});
    setDownloadingImages({});
    
    // Wait a bit before triggering load - this prevents cascading API calls
    const timer = setTimeout(() => {
      setImages([]);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeEvent, activeDate, activePhotographer]);

  // Fetch images when photographer or page changes
  useEffect(() => {
    if (!activeEvent || !activeDate || (!activePhotographer && photographerOptions.length > 0)) return;
    
    const fetchImages = async () => {
      try {
        setLoading(true);
        let url = `/api/s3-images?event=${encodeURIComponent(activeEvent)}&date=${encodeURIComponent(activeDate)}`;
        
        if (activePhotographer) {
          url += `&photographer=${encodeURIComponent(activePhotographer)}`;
        }
        
        // Add pagination parameters
        url += `&page=${page}&limit=${imagesPerPage}`;
        
        const response = await fetchWithRetry(url);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        
        const data: S3ApiResponse = await response.json();
        
        if (page === 1) {
          setImages(data.images.slice(0, imagesPerPage)); // Limit initial load
        } else {
          setImages(prev => [...prev, ...data.images.slice(0, imagesPerPage)]);
        }
        
        // Check if we have more images to load
        setHasMore(data.images.length === imagesPerPage);
        
      } catch (err) {
        setError('Failed to load images. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce the API call to avoid hammering the server
    const timer = setTimeout(() => {
      fetchImages();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [activeEvent, activeDate, activePhotographer, photographerOptions.length, page]);

  // Load more images when user scrolls to bottom
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [loading, hasMore]);

  // Download individual image
  const downloadImage = useCallback(async (imageUrl: string, imageName: string, imageId: string) => {
    try {
      setDownloadingImages(prev => ({ ...prev, [imageId]: true }));
      
      // Use our download API to avoid CORS issues
      const downloadUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(imageName || 'image.jpg')}`;
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${imageName || 'image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloadingImages(prev => ({ ...prev, [imageId]: false }));
    }
  }, []);

  // Add scroll event listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loading) return; // Don't trigger more loads while loading
      
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 800 && hasMore
      ) {
        // Debounce the load more action
        const timer = setTimeout(() => {
          loadMore();
        }, 300);
        
        return () => clearTimeout(timer);
      }
    };
    
    const debouncedHandleScroll = debounce(handleScroll, 200);
    window.addEventListener('scroll', debouncedHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [loadMore, loading, hasMore]);

  // Custom dropdown component with white border
  const CustomDropdown = ({ 
    value, 
    options, 
    onChange, 
    className = "",
    isLarge = false
  }: { 
    value: string, 
    options: string[], 
    onChange: (value: string) => void,
    className?: string,
    isLarge?: boolean
  }) => (
    <div className={`relative inline-block ${className}`}>
      <div className="relative">
        <div className={`flex items-center justify-between text-white border-2 border-white rounded-lg px-4 py-2 cursor-pointer ${isLarge ? 'text-5xl md:text-6xl font-serif' : 'text-lg md:text-xl'}`}>
          <div>{value}</div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  // Fetch available events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetchWithRetry('/api/s3-images');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data: S3ApiResponse = await response.json();
        
        if (data.folders.length > 0) {
          // Make SoundSet Sunday the first event option if it exists
          const folders = [...data.folders];
          const soundSetIndex = folders.findIndex(folder => folder === 'SoundSet Sunday');
          
          if (soundSetIndex !== -1) {
            // Remove SoundSet Sunday from its current position
            const soundSet = folders.splice(soundSetIndex, 1)[0];
            // Add it to the beginning of the array
            folders.unshift(soundSet);
          }
          
          setEventOptions(folders);
          setActiveEvent(folders[0]);
        }
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Fetch dates when event changes
  useEffect(() => {
    if (!activeEvent) return;
    
    const fetchDates = async () => {
      try {
        setLoading(true);
        const response = await fetchWithRetry(`/api/s3-images?event=${encodeURIComponent(activeEvent)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dates');
        }
        
        const data: S3ApiResponse = await response.json();
        
        if (data.folders.length > 0) {
          // Sort dates in descending order (most recent first)
          const sortedDates = [...data.folders].sort((a, b) => {
            // Parse dates and compare them (assuming format like "09 February 2025")
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateB.getTime() - dateA.getTime();
          });
          
          setDateOptions(sortedDates);
          setActiveDate(sortedDates[0]);
        }
      } catch (err) {
        setError('Failed to load dates. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDates();
  }, [activeEvent]);

  // Fetch photographers when date changes
  useEffect(() => {
    if (!activeEvent || !activeDate) return;
    
    const fetchPhotographers = async () => {
      try {
        setLoading(true);
        const response = await fetchWithRetry(
          `/api/s3-images?event=${encodeURIComponent(activeEvent)}&date=${encodeURIComponent(activeDate)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch photographers');
        }
        
        const data: S3ApiResponse = await response.json();
        
        if (data.folders.length > 0) {
          setPhotographerOptions(data.folders);
          setActivePhotographer(data.folders[0]);
        } else {
          // If no photographers, maybe we already have images
          setImages(data.images);
          setPhotographerOptions([]);
          setActivePhotographer('');
        }
      } catch (err) {
        setError('Failed to load photographers. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhotographers();
  }, [activeEvent, activeDate]);

  return (
    <main className="min-h-screen with-hero-nav">
      {/* Gallery Hero Section */}
      <div className="relative h-[75vh] w-full overflow-hidden bg-black">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery_page_hero.png"
            alt="Gallery hero image showing people at an event"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        {/* Navigation */}
        <Navigation activePage="GALLERY" />
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-between h-full px-6 md:px-12 pb-12">
          <div className="mt-auto">
            {/* Event filter dropdown (replacing <h1>) */}
            <CustomDropdown 
              value={activeEvent} 
              options={eventOptions} 
              onChange={setActiveEvent}
              isLarge={true}
            />
            
            {/* Date filter dropdown (replacing <p>) */}
            <div className="mt-2">
              <CustomDropdown 
                value={activeDate} 
                options={dateOptions} 
                onChange={setActiveDate}
              />
            </div>
          </div>

          <div className="flex justify-between items-end w-full">
            {/* FFN Logo */}
            <div className="w-16 md:w-20">
              <Image
                src="/images/ffn_white_logo.svg"
                alt="ffn logo"
                width={80}
                height={60}
                className="object-contain"
              />
            </div>

            {/* Gallery Button */}
            <Link
              href="/gallery"
              className="border-2 border-white text-white px-8 py-3 text-lg md:text-xl font-medium tracking-wider hover:bg-white hover:text-black transition-colors inline-block rounded-lg"
            >
              GALLERY
            </Link>
          </div>
        </div>
      </div>

      {/* Photographer Filter Section */}
      <div className="backdrop-blur-md bg-white/30 py-4 px-6 md:px-12 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-12 overflow-x-auto pb-2 hide-scrollbar">
            <h2 className="font-mono text-black font-semibold whitespace-nowrap">
              Photographers
            </h2>

            {/* Generate photographer buttons dynamically based on active date */}
            {photographerOptions.length > 0 ? (
              photographerOptions.map(photographer => (
                <button 
                  key={photographer}
                  className={`font-mono whitespace-nowrap pb-1 transition-colors ${
                    activePhotographer === photographer 
                      ? "text-black border-2 border-black px-4 py-1 rounded-lg" 
                      : "text-black/60 hover:text-black hover:border-b hover:border-black"
                  }`}
                  onClick={() => setActivePhotographer(photographer)}
                >
                  {photographer}
                </button>
              ))
            ) : (
              <div className="text-black/60">No photographers available</div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-black/60 hover:text-black transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-heart"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
            <button className="text-black/60 hover:text-black transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-more-vertical"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Waterfall Grid */}
      <div className="bg-white py-8">
        <div className="px-2 md:px-4">
          {page === 1 && loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-2xl text-gray-400">Loading images...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-red-500">{error}</div>
            </div>
          ) : images.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-gray-400">No images found</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-2 auto-rows-[10px]">
                {images.map(image => {
                  // Calculate row span based on aspect ratio
                  const rowSpan = image.aspectRatio === "tall" ? 40 : 
                                image.aspectRatio === "wide" ? 20 : 30;
                  
                  return (
                    <div 
                      key={image.id} 
                      className="relative"
                      style={{
                        gridRow: `span ${rowSpan}`,
                      }}
                    >
                      <div className={`w-full h-full ${
                        image.aspectRatio === "square" ? "aspect-square" :
                        image.aspectRatio === "tall" ? "aspect-[3/4]" :
                        "aspect-[16/9]"
                      } bg-gray-100 overflow-hidden rounded-lg relative group cursor-pointer`}>
                        {/* Show loading skeleton until image loads */}
                        {!loadedImages[image.id] && (
                          <div className="absolute inset-0 bg-gray-200 rounded-lg overflow-hidden">
                            <div 
                              className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200"
                              style={{
                                backgroundSize: '200% 100%',
                                animation: 'shimmerEffect 2s infinite linear'
                              }}
                            />
                            <style jsx>{`
                              @keyframes shimmerEffect {
                                0% { background-position: -200% 0; }
                                100% { background-position: 200% 0; }
                              }
                            `}</style>
                          </div>
                        )}
                        
                        {/* Replace img with Next.js Image component */}
                        <Image
                          src={image.src}
                          alt={image.name}
                          fill
                          className={`object-cover rounded-lg transition-all duration-300 ${
                            loadedImages[image.id] 
                              ? 'opacity-100 group-hover:scale-105' 
                              : 'opacity-0'
                          }`}
                          onLoadingComplete={() => handleImageLoaded(image.id)}
                          onError={() => {
                            // Mark as loaded even if there's an error to prevent infinite retries
                            handleImageLoaded(image.id);
                          }}
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          loading="lazy"
                          unoptimized={true} // Skip Next.js image optimization for large images
                        />
                        
                        {/* Download overlay - shows on hover */}
                        {loadedImages[image.id] && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                downloadImage(image.src, image.name, image.id);
                              }}
                              disabled={downloadingImages[image.id]}
                              className={`p-3 rounded-full transition-all duration-200 ${
                                downloadingImages[image.id]
                                  ? 'bg-gray-600 cursor-not-allowed'
                                  : 'bg-white hover:bg-gray-100 hover:scale-110'
                              }`}
                              title={`Download ${image.name}`}
                            >
                              {downloadingImages[image.id] ? (
                                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-black"
                                >
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" x2="12" y1="15" y2="3" />
                                </svg>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Loading indicator at bottom for pagination */}
              {hasMore && (
                <div className="flex justify-center my-8">
                  <button 
                    onClick={loadMore}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Loading more...' : 'Load more images'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

