import type { Metadata } from 'next'
import Script from 'next/script'
import { fraunces, dmSans, caveat } from '@/lib/fonts'
import { OrganizationSchema, WebsiteSchema } from '@/components/seo/structured-data'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tipitibooks.com'

export const metadata: Metadata = {
  title: {
    default: 'Tipiti Books — Libros infantiles personalizados',
    template: '%s | Tipiti Books',
  },
  description:
    'Libros infantiles personalizados con ilustraciones acuarela pintadas a mano. Tu hijo/a es el protagonista. Hecho en Chile con amor.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: 'Tipiti Books',
    title: 'Tipiti Books — Libros infantiles personalizados',
    description:
      'Crea un libro único donde tu hijo/a es el protagonista. Ilustraciones acuarela, impreso y enviado a tu puerta.',
    url: siteUrl,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tipiti Books — Libros infantiles personalizados',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tipiti Books — Libros infantiles personalizados',
    description:
      'Crea un libro único donde tu hijo/a es el protagonista. Ilustraciones acuarela.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable} ${caveat.variable}`}>
      <head>
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body>
        {children}
        {/* Google Analytics — set NEXT_PUBLIC_GA_ID in env */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
