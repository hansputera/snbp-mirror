import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/static/:key(.+)',
        destination: '/api/snbp/:key',
      }, {
        source: '/config.json',
        destination: '/api/config',
      }, {
        source: '/:path*',
        destination: 'https://pengumuman-snbp.snpmb.id/:path*',
      }
    ]
  },
};

export default nextConfig;
