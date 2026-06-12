'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

const navLinks = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="5" height="5" rx="1" />
        <rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" />
        <rect x="9" y="9" width="5" height="5" rx="1" />
      </svg>
    ),
  },
  {
    href: '/tasks',
    label: 'My tasks',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M3 5h10M3 8h7M3 11h5" />
      </svg>
    ),
  },
  {
    href: '/calendar',
    label: 'Calendar',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="3" width="12" height="11" rx="1.5" />
        <path d="M5 1v4M11 1v4M2 7h12" />
      </svg>
    ),
  },
  {
    href: '/progress',
    label: 'Progress',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2,12 6,7 9,10 12,5 14,7" />
      </svg>
    ),
  },
]

const categories = [
  { label: 'Work',     color: '#7F77DD' },
  { label: 'Health',   color: '#1D9E75' },
  { label: 'Personal', color: '#EF9F27' },
  { label: 'Learning', color: '#D85A30' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const userName = user?.fullName ?? user?.firstName ?? 'Guest'
  const userInitials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()


  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-[220px] min-h-screen bg-sidebar flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-7">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M7 2v10M2 7h10" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">Taskly</span>
        </div>

        {/* Nav */}
        <div className="px-0 mb-2">
          <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase px-5 mb-2">Menu</p>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-5 py-[10px] text-sm transition-colors
                ${pathname === link.href
                  ? 'text-white bg-primary/20 border-r-2 border-primary'
                  : 'text-white/50 hover:text-white/80'
                }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Categories */}
        <div className="px-0 mt-4">
          <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase px-5 mb-2">Categories</p>
          {categories.map(cat => (
            <div key={cat.label} className="flex items-center gap-3 px-5 py-[9px] text-sm text-white/50 hover:text-white/80 cursor-pointer transition-colors">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
              {cat.label}
            </div>
          ))}
        </div>

        {/* User */}
        <div className="mt-auto px-5 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[11px] font-semibold text-white">
              {userInitials}
            </div>
            <span className="text-xs text-white/60">{userName}</span>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/8 flex justify-around py-2">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 text-[10px] px-3 py-1
              ${pathname === link.href ? 'text-primary' : 'text-gray-400'}`}
          >
            {link.icon}
            {link.label.split(' ')[0]}
          </Link>
        ))}
      </nav>
    </>
  )
}