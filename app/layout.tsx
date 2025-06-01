import type React from "react"
import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'
import { Footer } from '@/components/footer'
import "./globals.css"
import "./styles/browser-compatibility.css"
import "./styles/firefox-fixes.css"
import "./styles/chrome-fixes.css"
import { cn } from "@/lib/utils"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export const metadata: Metadata = {
  title: {
    default: "Cognito AI Search",
    template: "%s | Cognito AI Search",
  },
  description: "AI-powered search that understands natural language and finds what you're looking for.",
  keywords: [
    "AI search",
    "semantic search",
    "natural language search",
    "Ollama",
    "SearXNG",
    "AI-powered search",
    "intelligent search",
  ],
  authors: [
    {
      name: "Stig",
      url: "https://github.com/stigok",
    },
  ],
  creator: "Stig",
  openGraph: {
    title: "Cognito AI Search",
    description: "AI-powered search that understands natural language and finds what you're looking for.",
    url: "https://cognito-search.vercel.app",
    siteName: "Cognito AI Search",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cognito AI Search",
    description: "AI-powered search that understands natural language and finds what you're looking for.",
    creator: "@stigok",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://cognito-search.vercel.app"),
  alternates: {
    canonical: "/",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* Geist fonts are loaded via the geist package */}</head>
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-background text-foreground",
          "selection:bg-primary-20 selection:text-foreground",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: "group bg-background text-foreground border-border shadow-lg",
                title: "font-medium",
                description: "text-muted-foreground",
                actionButton: "bg-primary text-primary-foreground hover:bg-primary/90",
                cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}