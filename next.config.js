/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "placekeanu.com",
      },
    ],
  },
}

module.exports = nextConfig
