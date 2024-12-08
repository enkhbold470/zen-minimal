/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "placekeanu.com",
      },
    ],
  },
}

module.exports = nextConfig
