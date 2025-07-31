/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // all requests to /api/*
        destination: "http://localhost:4000/api/:path*", // redirect to backend
      },
    ];
  },
};

module.exports = nextConfig;
