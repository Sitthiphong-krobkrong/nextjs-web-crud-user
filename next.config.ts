import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://3.106.213.14:5000/api/:path*`, // Proxy to Backend''
      }
    ];
  }
};

export default nextConfig;
