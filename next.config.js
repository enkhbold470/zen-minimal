/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/:path*`, // Proxy to Backend
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placekeanu.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
}

module.exports = nextConfig
