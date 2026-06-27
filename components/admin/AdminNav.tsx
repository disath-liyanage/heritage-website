'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminNav() {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b border-[#D8CCB8] bg-[#FFF9F0] px-6 py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-display text-xl text-[#1F2D21]">Heritage Admin</span>
          <div className="flex items-center gap-1">
            <NavLink href="/admin/menu" active={pathname.startsWith('/admin/menu')}>
              Menu
            </NavLink>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-[#6A5A43] hover:text-[#1F2D21] transition"
        >
          Log out
        </button>
      </div>
    </nav>
  )
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-sm transition ${
        active
          ? 'bg-[#2A3A2D] text-white'
          : 'text-[#6A5A43] hover:bg-[#EDE6D8] hover:text-[#1F2D21]'
      }`}
    >
      {children}
    </Link>
  )
}