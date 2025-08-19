/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'your-image-domain.com'],
  },
}

module.exports = nextConfig
