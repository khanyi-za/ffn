import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');
    const fileName = url.searchParams.get('filename');
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    console.log(`🔄 Starting streaming download for: ${fileName}`);
    
    // Fetch the image with increased timeout and streaming
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-ImageDownloader/1.0)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    if (!response.body) {
      throw new Error('No response body received');
    }

    // Get content type and length
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const contentLength = response.headers.get('content-length');
    
    console.log(`📦 Streaming ${fileName}: ${contentType}, ${contentLength ? `${Math.round(parseInt(contentLength) / 1024 / 1024)}MB` : 'unknown size'}`);

    // Create streaming response
    const downloadResponse = new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName || 'image.jpg'}"`,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        ...(contentLength && { 'Content-Length': contentLength }),
      },
    });
    
    console.log(`✅ Download stream started for: ${fileName}`);
    return downloadResponse;
    
  } catch (error) {
    console.error('Streaming download error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Download timeout - file too large or connection too slow' },
        { status: 408 } // Request Timeout
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to download image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 