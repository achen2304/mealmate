/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'production'
            ? '/api/:path*' // In production, route to Vercel serverless functions
            : 'http://localhost:8080/api/:path*', // In development, route to local backend
      },
    ];
  },
};

module.exports = nextConfig;
