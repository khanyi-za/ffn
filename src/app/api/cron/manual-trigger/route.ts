import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Manual trigger endpoint for testing cron jobs
export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with proper authentication
    if (process.env.NODE_ENV !== 'development') {
      const authHeader = request.headers.get('authorization');
      if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { searchParams } = new URL(request.url);
    const job = searchParams.get('job');

    if (!job) {
      return NextResponse.json({ 
        error: 'Job parameter required. Use ?job=refresh-gallery-data or ?job=optimize-images' 
      }, { status: 400 });
    }

    let result;
    
    switch (job) {
      case 'refresh-gallery-data':
        console.log('Manually triggering gallery data refresh...');
        const refreshResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/cron/refresh-gallery-data`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`
          }
        });
        result = await refreshResponse.json();
        break;
        
      case 'optimize-images':
        console.log('Manually triggering image optimization...');
        const optimizeResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/cron/optimize-images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`
          }
        });
        result = await optimizeResponse.json();
        break;
        
      default:
        return NextResponse.json({ 
          error: 'Invalid job. Use refresh-gallery-data or optimize-images' 
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      job,
      result,
      triggeredAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error triggering cron job:', error);
    return NextResponse.json(
      { error: 'Failed to trigger cron job', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint for checking cron job status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (status === 'true') {
      return NextResponse.json({
        cronJobsActive: true,
        availableJobs: [
          {
            name: 'refresh-gallery-data',
            schedule: '0 */6 * * *',
            description: 'Refreshes gallery data from S3 every 6 hours'
          },
          {
            name: 'optimize-images',
            schedule: '0 2 * * *',
            description: 'Optimizes image metadata daily at 2 AM'
          }
        ],
        manualTrigger: {
          endpoint: '/api/cron/manual-trigger',
          method: 'POST',
          examples: [
            'POST /api/cron/manual-trigger?job=refresh-gallery-data',
            'POST /api/cron/manual-trigger?job=optimize-images'
          ]
        },
        environment: {
          hasS3Credentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
          hasCloudFront: !!process.env.CLOUDFRONT_DOMAIN,
          hasCronSecret: !!process.env.CRON_SECRET,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }

    return NextResponse.json({
      message: 'Cron job manual trigger endpoint',
      usage: 'POST /api/cron/manual-trigger?job=<job-name>',
      availableJobs: ['refresh-gallery-data', 'optimize-images'],
      status: 'GET /api/cron/manual-trigger?status=true'
    });

  } catch (error) {
    console.error('Error checking cron job status:', error);
    return NextResponse.json(
      { error: 'Failed to check status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 