/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Security Headers Configuration
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Enable XSS protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Enforce HTTPS (only in production)
          ...(process.env.NODE_ENV === 'production' ? [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains; preload',
            },
          ] : []),
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Note: 'unsafe-inline' should be removed in production with proper nonce implementation
              "style-src 'self' 'unsafe-inline'", // Note: 'unsafe-inline' should be removed in production with proper nonce implementation
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Permissions Policy (Feature Policy)
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
              'payment=()',
              'usb=()',
            ].join(', '),
          },
        ],
      },
      {
        // Additional headers for API routes
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        // Cache headers for static assets
        source: '/(_next/static|audio|pdf|images)/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Image optimization configuration
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Webpack configuration for better security
  webpack: (config, { dev, isServer }) => {
    // Enable source maps in development for better debugging
    if (dev) {
      config.devtool = 'eval-source-map';
    }

    // Additional security-focused webpack configurations
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  // Experimental features for performance and security
  experimental: {
    // Enable SWC minification for better performance
    swcMinify: true,
    // Enable concurrent features for better performance
    concurrentFeatures: true,
  },

  // Compiler configuration
  compiler: {
    // Remove console statements in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Environment variables exposed to the browser
  env: {
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // Production-specific optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Enable compression in production
    compress: true,
    // Generate sitemap and robots.txt
    generateEtags: true,
    // Optimize power preference
    poweredByHeader: false,
  }),

  // Development-specific configurations
  ...(process.env.NODE_ENV === 'development' && {
    // Enable hot reloading indicators
    devIndicators: {
      buildActivity: true,
      buildActivityPosition: 'bottom-right',
    },
  }),
};

module.exports = nextConfig;
