/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next.js 15 image optimization features
    unoptimized: false,
    // Add domains for remote images if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Improved performance with React strict mode
  reactStrictMode: true,
  // Make environment variables available on the client side
  env: {
    // Explicitly defined environment variables
    NEXT_PUBLIC_OLLAMA_API_URL: process.env.OLLAMA_API_URL,
    NEXT_PUBLIC_SEARXNG_API_URL: process.env.SEARXNG_API_URL,
    NEXT_PUBLIC_DEFAULT_OLLAMA_MODEL: process.env.DEFAULT_OLLAMA_MODEL,
    // Include all other NEXT_PUBLIC_ environment variables
    ...Object.fromEntries(
      Object.entries(process.env)
        .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
        .map(([key, value]) => [key, String(value)])
    ),
  },
  // Enable experimental features for Next.js 15
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    // Enable optimized bundle splitting
    optimizeCss: true,
  },
}

export default nextConfig
