import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutList, Users, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/batches', label: 'Lotes', icon: LayoutList },
  { to: '/partners', label: 'Parceiros', icon: Users },
]

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )
          }
        >
          <Icon className="w-4 h-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 hidden md:flex flex-col py-6">
        <div className="px-6 mb-8">
          <h1 className="text-lg font-bold text-gray-900">FileBatcher</h1>
        </div>
        {navLinks}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <h1 className="text-base font-bold text-gray-900">FileBatcher</h1>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </header>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 py-4">
            {navLinks}
          </div>
        )}

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
