import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tipitibooks.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Fetch published books
  const { data: books } = await supabase
    .from('books')
    .select('slug, created_at')
    .eq('is_published', true)

  const bookUrls = (books || []).map((book) => ({
    url: `${siteUrl}/libro/${book.slug}`,
    lastModified: new Date(book.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...bookUrls,
  ]
}
