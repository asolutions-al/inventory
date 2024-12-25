const createNextIntlPlugin = require("next-intl/plugin")

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "xczxozyteslsqdxtljzq.supabase.co",
      },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
}

module.exports = withNextIntl(nextConfig)
