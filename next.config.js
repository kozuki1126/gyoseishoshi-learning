/**
 * Next.js Configuration with Environment Validation
 * 
 * This configuration integrates environment variable validation
 * at application startup to ensure security requirements are met.
 */

const { validateEnvironmentMiddleware } = require('./src/middleware/validateEnv');

// Validate environment variables at startup
// This will throw an error and prevent startup if validation fails
try {
  console.log('🔍 Validating environment configuration...');
  validateEnvironmentMiddleware();
  console.log('✅ Environment validation completed successfully\n');
} catch (error) {
  console.error('❌ Environment validation failed:', error.message);
  // Exit in production to prevent insecure startup
  if (process.env.NODE_ENV === 'production') {
    console.error('💥 Production startup blocked due to security requirements');
    process.exit(1);
  }
  // In development, log error but allow startup for debugging
  console.warn('⚠️  Development mode: continuing with warnings...\n');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce strict mode for React
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-src 'self'; object-src 'none';"
          }
        ]
      }
    ];
  },

  // Environment variables validation and exposure
  env: {
    // Validate JWT_SECRET exists and meets requirements
    JWT_SECRET_VALIDATED: (() => {
      const jwtSecret = process.env.JWT_SECRET;
      
      if (!jwtSecret) {
        throw new Error(
          '🚨 CRITICAL: JWT_SECRET is not set!\n' +
          '🔧 Fix: Run "node scripts/generate-jwt-secret.js --save" to generate a secure secret\n' +
          '📋 Then restart the application'
        );
      }

      if (jwtSecret.length < 32) {
        throw new Error(
          '🚨 CRITICAL: JWT_SECRET is too short (minimum 32 characters required)!\n' +
          '🔧 Fix: Run "node scripts/generate-jwt-secret.js --save" to generate a secure secret\n' +
          '📋 Then restart the application'
        );
      }

      // Check for common weak patterns
      const weakPatterns = [
        /your.{0,10}secret/i,
        /change.{0,10}this/i,
        /example/i,
        /test.{0,10}key/i,
        /default/i
      ];

      const hasWeakPattern = weakPatterns.some(pattern => pattern.test(jwtSecret));
      if (hasWeakPattern) {
        throw new Error(
          '🚨 CRITICAL: JWT_SECRET appears to be a default or example value!\n' +
          '🔧 Fix: Run "node scripts/generate-jwt-secret.js --save" to generate a secure secret\n' +
          '📋 Never use example values in production!'
        );
      }

      return 'validated';
    })()
  },

  // Webpack configuration for security
  webpack: (config, { dev, isServer }) => {
    // Add security-related webpack optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }

    return config;
  },

  // Image optimization settings
  images: {
    domains: [], // Add allowed image domains here
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Experimental features for better performance
  experimental: {
    // Enable modern JavaScript features
    esmExternals: true,
    // Optimize package imports
    optimizePackageImports: ['react-icons'],
  },

  // Production optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Output configuration
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  // Transpile packages if needed
  transpilePackages: [],

  // Redirect configuration
  async redirects() {
    return [
      // Add any URL redirects here
    ];
  },

  // Rewrites configuration
  async rewrites() {
    return [
      // Add any URL rewrites here
    ];
  }
};

module.exports = nextConfig;
