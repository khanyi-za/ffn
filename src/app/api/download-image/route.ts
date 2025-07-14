import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');
    const fileName = url.searchParams.get('filename');
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    // Fetch the image from the source (S3, CloudFront, or local)
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    
    // Determine content type from the original response or default to jpeg
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Create response with proper headers for download
    const downloadResponse = new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName || 'image.jpg'}"`,
        'Content-Length': imageBuffer.byteLength.toString(),
      },
    });
    
    return downloadResponse;
    
  } catch (error) {
    console.error('Error downloading image:', error);
    return NextResponse.json(
      { error: 'Failed to download image' },
      { status: 500 }
    );
  }
} 