/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Make environment variables available on the client side
  env: {
    NEXT_PUBLIC_OLLAMA_API_URL: process.env.OLLAMA_API_URL,
    NEXT_PUBLIC_SEARXNG_API_URL: process.env.SEARXNG_API_URL,
    NEXT_PUBLIC_DEFAULT_OLLAMA_MODEL: process.env.DEFAULT_OLLAMA_MODEL,
  },
  // Optionally expose all environment variables with NEXT_PUBLIC_ prefix
  // This is useful for development but should be used with caution in production
  env: Object.fromEntries(
    Object.entries(process.env)
      .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
      .map(([key, value]) => [key, String(value)])
  ),
}

export default nextConfig
