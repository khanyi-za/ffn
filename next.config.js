/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Temporarily disable optimization for CloudFront images
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd20zb6kzfg6m1s.cloudfront.net',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    // Add domains for fallback compatibility
    domains: ['d20zb6kzfg6m1s.cloudfront.net'],
  },
  // Add timeout configuration for server-side rendering
  serverRuntimeConfig: {
    timeout: 30000, // 30 seconds timeout
  },
  // Add request timeout for API routes
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig; 