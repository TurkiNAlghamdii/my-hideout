import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',  // This is important
  assetPrefix: process.env.NODE_ENV === 'production' ? '/my-hideout' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/my-hideout' : '',
  images: {
    unoptimized: true,
  },
  // Add redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
}

export default nextConfig
