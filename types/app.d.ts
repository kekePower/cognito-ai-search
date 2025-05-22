// This file contains type declarations for the Next.js App Router
// It extends the default Next.js types to provide better TypeScript support

import 'next'

declare module 'next' {
  // This tells TypeScript that our page props are compatible with Next.js
  export interface PageProps {
    params?: { [key: string]: string | string[] }
    searchParams?: { [key: string]: string | string[] | undefined }
  }
}

// This helps TypeScript understand the App Router's page props
declare module 'next/app' {
  export { PageProps } from 'next'
}

// This helps TypeScript understand the Link component's props
declare module 'next/link' {
  import type { LinkProps as NextLinkProps } from 'next/link'
  import { AnchorHTMLAttributes } from 'react'
  
  export type LinkProps = Omit<NextLinkProps, 'as'> &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
      as?: string
    }
  
  declare const Link: React.ForwardRefExoticComponent<LinkProps>
  export default Link
}
