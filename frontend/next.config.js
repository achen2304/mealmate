/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Make sure the output is exported as a standalone app
  output: 'standalone',
  // Explicitly set trailingSlash to false
  trailingSlash: false,
  // Configure webpack to handle assets correctly
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
