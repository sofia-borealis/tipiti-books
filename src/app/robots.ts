import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tipitibooks.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/wizard/', '/checkout', '/preview'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
