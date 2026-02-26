const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tipitibooks.com'

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tipiti Books',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      'Libros infantiles personalizados con ilustraciones acuarela pintadas a mano. Hecho en Chile con amor.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hola@tipitibooks.com',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
    sameAs: [],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ProductSchema({
  name,
  description,
  price,
  slug,
  imageUrl,
}: {
  name: string
  description: string
  price: number
  slug: string
  imageUrl?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url: `${siteUrl}/libro/${slug}`,
    image: imageUrl || `${siteUrl}/og-image.jpg`,
    brand: {
      '@type': 'Brand',
      name: 'Tipiti Books',
    },
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'CLP',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Tipiti Books',
      },
    },
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 0,
      suggestedMaxAge: 6,
    },
    category: 'Libros infantiles personalizados',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tipiti Books',
    url: siteUrl,
    description:
      'Libros infantiles personalizados con ilustraciones acuarela. Hecho en Chile.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/catalogo?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
