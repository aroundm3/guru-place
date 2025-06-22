// const checkEnvVariables = require("./check-env-variables")

// checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    loader: "default",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "14.225.0.172",
        port: "1337",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "admin.myphamdivi.com",
        port: "",
        pathname: "**",
      },
    ],
  },
}

module.exports = nextConfig
