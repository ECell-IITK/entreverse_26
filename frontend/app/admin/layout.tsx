'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Calendar, 
  LogOut,
  Menu,
  X,
  Loader2,
  ChevronRight
} from 'lucide-react'
import { getToken, clearSession } from '@/lib/admin-api'

const NAV_ITEMS = [
  { href: '/admin',              label: 'Overview',      icon: LayoutDashboard },
  { href: '/admin/teams',        label: 'Teams',         icon: Users },
  { href: '/admin/competitions', label: 'Competitions',  icon: Trophy },
  { href: '/admin/events',       label: 'Events',        icon: Calendar },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Login page is exempt
    if (pathname === '/admin/login') {
      setChecked(true)
      return
    }
    if (!getToken()) {
      router.replace('/admin/login')
    } else {
      setChecked(true)
    }
  }, [pathname, router])

  function handleLogout() {
    clearSession()
    router.push('/admin/login')
  }

  // Don't render layout chrome on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const username = typeof window !== 'undefined'
    ? sessionStorage.getItem('admin_username') ?? 'admin'
    : 'admin'

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-64 flex-col
          border-r border-white/[0.07] bg-background/95 backdrop-blur-xl
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:flex
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.07]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <img src="/logo_ecell.png" alt="E-Cell" className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-sm font-bold text-foreground leading-none">EntreVerse</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">Admin Panel</p>
          </div>
          <button
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                  ${active
                    ? 'bg-primary/15 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-white/[0.05] hover:text-foreground'
                  }
                `}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-white/[0.07] px-3 py-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">
              {username[0]}
            </div>
            <span className="text-sm text-muted-foreground truncate flex-1">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content area ───────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar (mobile) */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/[0.07] bg-background/80 backdrop-blur-xl px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-heading text-sm font-bold text-foreground">
            {NAV_ITEMS.find(n => n.href === pathname || pathname.startsWith(n.href + '/'))?.label ?? 'Admin'}
          </span>
          <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">
            {username[0]}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
