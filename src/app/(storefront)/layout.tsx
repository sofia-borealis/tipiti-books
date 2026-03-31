import { StorefrontHeader } from '@/components/storefront/header'
import { StorefrontFooter } from '@/components/storefront/footer'
import { AnnouncementBanner } from '@/components/storefront/announcement-banner'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBanner />
      <StorefrontHeader />
      <main id="main-content" className="flex-1">{children}</main>
      <StorefrontFooter />
    </div>
  )
}
