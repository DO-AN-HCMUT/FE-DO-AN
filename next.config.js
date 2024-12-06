/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
      },
    ],
  },
  distDir: 'build',
  output: 'export',
  images: {
    unoptimized: true,
  },
};
