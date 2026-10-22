/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile the shared UI package (ships raw TS/TSX source).
  transpilePackages: ["@rove/ui", "@rove/cms"],
  eslint: {
    // Linting is run as a separate monorepo task (turbo run lint), not during build.
    // eslint-config-next does not yet support ESLint 10.x used across the workspace.
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
