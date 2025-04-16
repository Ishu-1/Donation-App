/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'example.com',  // Add other hostnames you want to allow
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'm.media-amazon.com',  // Another allowed hostname
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'img.freepik.com',  // Another allowed hostname
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'veirdo.in',  // Another allowed hostname
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
// 'example.com',''