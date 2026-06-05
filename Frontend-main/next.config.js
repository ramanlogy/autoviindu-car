/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration
  output: 'standalone',
  
  // Image optimization
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'devapi.autoviindu.com',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
    ],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },

  // Security and performance headers
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Prevent hydration cache issues in development
          {
            key: 'Cache-Control',
            value: isDev ? 'no-cache, no-store, must-revalidate' : 'public, max-age=0, must-revalidate',
          },
        ],
      },
      // Static assets caching
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Public assets
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=172800',
          },
        ],
      },
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=5184000',
          },
        ],
      },
      // Brave-specific cache headers for chunks
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate', // More aggressive for Brave
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=0',
          },
        ],
        // Apply only to Brave browser
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value: '.*Brave.*',
          },
        ],
      },
    ];
  },

  // Proxy API and storage requests to Laravel backend in development
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiBase}/api/v1/:path*`,
      },
      {
        source: '/storage/:path*',
        destination: `${apiBase}/storage/:path*`,
      },
    ];
  },

  // Proxy API requests to Laravel backend in development
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiBase}/api/v1/:path*`,
      },
    ];
  },


  // Redirects
  async redirects() {
    return [
      {
        source: '/((?!api).*)/',
        destination: '/$1',
        permanent: true,
      },
    ];
  },

  // Development cache-busting with safer approach
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Only modify client-side builds in development
      // Use a safer approach that doesn't break chunk loading
      config.output.filename = config.output.filename || '[name].js';
      config.output.chunkFilename = config.output.chunkFilename || '[name].js';
      
      // Add cache busting through query parameters instead
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        // Add timestamp to prevent aggressive caching in development
        if (entries['main.js']) {
          entries['main.js'] = [
            ...entries['main.js'],
          ];
        }
        return entries;
      };
    }
    
    // Remove console.log in production
    if (!dev) {
      const TerserPlugin = require('terser-webpack-plugin');
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        })
      );
    }
    
    return config;
  },
};

module.exports = nextConfig;