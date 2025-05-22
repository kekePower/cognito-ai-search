// This file contains type declarations for Next.js page props
// It helps TypeScript understand the page props structure in the App Router

import 'next'

// This tells TypeScript that our page props are compatible with Next.js
declare module 'next' {
  export interface PageProps {
    params?: { [key: string]: string | string[] }
    searchParams?: { [key: string]: string | string[] | undefined }
  }
}

// This tells TypeScript that our page component props are compatible with Next.js
declare global {
  namespace React {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // Add any custom HTML attributes here if needed
    }
  }
}
