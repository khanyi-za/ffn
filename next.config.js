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
    timeout: 120000, // Increased to 120 seconds for large downloads
  },
  // Optimize API configuration for large file streaming
  experimental: {
    largePageDataBytes: 128 * 1000, // 128KB
  },
  // Headers for better caching and streaming
  async headers() {
    return [
      {
        source: '/api/download-image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // Cache downloads for 1 day
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 