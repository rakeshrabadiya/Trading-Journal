/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Trading-Journal',
  assetPrefix: '/Trading-Journal/',
}

module.exports = nextConfig
