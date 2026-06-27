import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1F2A20]">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-6 py-10">
        {children}
      </main>
    </div>
  )
}