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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://entreverse.ecelliitk.org'

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'EntreVerse 2026 — Where Ideas Become Impact',
    template: '%s | EntreVerse 2026',
  },
  description:
    "EntreVerse 2026 is IIT Kanpur's flagship entrepreneurship festival. Two days of competitions, workshops, founder talks, and startup experiences. 29–30 August 2026 at IIT Kanpur.",
  keywords: ['EntreVerse', 'E-Cell IITK', 'IIT Kanpur', 'entrepreneurship', 'startup', 'hackathon', 'business competition', 'India'],
  authors: [{ name: 'E-Cell IIT Kanpur', url: 'https://ecelliitk.org' }],
  creator: 'E-Cell IIT Kanpur',
  publisher: 'E-Cell IIT Kanpur',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: baseUrl,
    siteName: 'EntreVerse 2026',
    title: 'EntreVerse 2026 — Where Ideas Become Impact',
    description: "IIT Kanpur's flagship entrepreneurship festival. 29–30 August 2026. Competitions, workshops, and startup experiences.",
    images: [{ url: '/logo_ecell.png', width: 800, height: 600, alt: 'EntreVerse 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EntreVerse 2026 — Where Ideas Become Impact',
    description: "IIT Kanpur's flagship entrepreneurship festival. 29–30 August 2026.",
    images: ['/logo_ecell.png'],
    creator: '@ecelliitk',
  },
  icons: {
    icon: '/logo_ecell.png',
    shortcut: '/logo_ecell.png',
    apple: '/logo_ecell.png',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: baseUrl },
}

export const viewport = {
  colorScheme: 'dark',
  themeColor: '#030014',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        <SpaceBackground />
        {children}
      </body>
    </html>
  )
}
