/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@rove/ui", "@rove/cms"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      { source: "/:locale/work", destination: "/:locale/case-studies", permanent: true },
      {
        source: "/:locale/work/:slug",
        destination: "/:locale/case-studies/:slug",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
