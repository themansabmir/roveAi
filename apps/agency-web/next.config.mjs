/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@rove/ui", "@rove/cms"],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
