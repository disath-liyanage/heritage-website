'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminNav() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b border-stone-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-bold text-amber-500">Heritage Admin</span>
        <Link href="/admin/menu" className="text-stone-300 hover:text-white text-sm">
          Menu
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-stone-400 hover:text-red-400 transition"
      >
        Logout
      </button>
    </nav>
  )
}