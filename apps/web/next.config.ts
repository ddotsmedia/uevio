import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'media.uevio.com',
      },
    ],
  },
  i18n: undefined, // Using App Router i18n routing
};

export default nextConfig;
