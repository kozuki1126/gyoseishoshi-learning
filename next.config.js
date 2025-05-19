/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false, // Using pages directory
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
