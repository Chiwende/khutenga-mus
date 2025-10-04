import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['aurrhddzisfdteihbzfz.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'w7.pngwing.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
