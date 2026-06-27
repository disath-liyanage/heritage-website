'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useRef, useEffect } from 'react'

export default function AdminNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      style={{ fontFamily: "'Google Sans', var(--font-body), sans-serif" }}
      className="sticky inset-x-0 top-0 z-50 bg-[#f5f0e8]/95 backdrop-blur-[20px] backdrop-saturate-[140%] border-b border-[#d8ccb8]/30 shadow-sm"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-[#1f2a20]">Heritage Admin</span>
          <div className="flex items-center gap-2">
            <NavLink href="/admin/menu" active={pathname.startsWith('/admin/menu')}>
              Menu
            </NavLink>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f2a20] text-[#1f2a20] transition-all hover:bg-[#1f2a20] hover:text-[#f5f0e8]"
            aria-label="User menu"
            aria-expanded={isDropdownOpen}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              className="h-5 w-5" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {isDropdownOpen ? (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-[#d8ccb8]/30 bg-[#f5f0e8] shadow-lg py-1">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm font-semibold text-[#1f2a20] transition-colors hover:bg-[#1f2a20]/10"
              >
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </nav>
    </header>
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
      className={`px-3 py-2 rounded-md text-sm transition-all ${
        active
          ? 'bg-[#1f2a20] text-[#f5f0e8] font-bold'
          : 'text-[#1f2a20] font-semibold hover:bg-[#1f2a20]/10 hover:font-bold'
      }`}
    >
      {children}
    </Link>
  )
}