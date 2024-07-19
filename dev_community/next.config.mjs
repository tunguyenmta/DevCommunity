/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
};
module.exports = {
    output: 'export',
    distDir: 'out',
    basePath: process.env.NODE_ENV === 'production' ? '/DevCommunity' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/DevCommunity/' : '',
  }
export default nextConfig;
