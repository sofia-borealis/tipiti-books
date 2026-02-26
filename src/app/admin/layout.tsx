import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Don't apply sidebar layout to login page
  // The middleware handles auth redirects, but the layout
  // wraps all /admin/* routes including /admin/login
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If no user, render children directly (login page)
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-cream flex">
      <AdminSidebar userName={user.user_metadata?.name || 'Admin'} />
      <main className="flex-1 ml-0 md:ml-[280px]">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
