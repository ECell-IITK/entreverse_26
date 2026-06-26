
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SpaceBackground } from '@/components/background/space-background'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EntreVerse 2026 — Where Ideas Become Impact',
  description:
    "EntreVerse 2026 is IIT Kanpur's flagship entrepreneurship festival. Three days of competitions, workshops, founder talks, and startup experiences. 15–17 August 2026.",
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050816',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <SpaceBackground />
      <body className="bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
