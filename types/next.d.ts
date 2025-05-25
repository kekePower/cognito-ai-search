// Next.js App Router type definitions
import 'next'

declare module 'next' {
  export interface PageProps {
    params?: { [key: string]: string | string[] }
    searchParams?: { [key: string]: string | string[] | undefined }
  }
}
