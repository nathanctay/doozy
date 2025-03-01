/** @type {import('next').NextConfig} */
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const nextConfig = {
  /* config options here */
  images: {
    domains: ['...'],
  },
  // ... other config options
}
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}
module.exports = nextConfig
