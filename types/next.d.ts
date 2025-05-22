import 'next'

declare module 'next' {
  export interface PageProps {
    params?: { [key: string]: string | string[] }
    searchParams?: { [key: string]: string | string[] | undefined }
  }
}

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
