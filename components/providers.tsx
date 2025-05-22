'use client'

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemeProviderProps } from "next-themes"
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

type ProvidersProps = Omit<NextThemeProviderProps, 'children'> & {
  children: React.ReactNode
}

export function Providers({ children, ...props }: ProvidersProps) {
  return (
    <NextThemesProvider {...props}>
      <div className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        {children}
      </div>
    </NextThemesProvider>
  )
}
