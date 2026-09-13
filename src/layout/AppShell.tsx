import { LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Logo } from '../components/Logo'
import { NavBar } from './NavBar'

export function AppShell({ children }: { children: ReactNode }) {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-app-bg text-gray-100 sm:flex-row">
      <NavBar />

      <div className="flex flex-1 flex-col">
        <header className="safe-top sticky top-0 z-10 flex items-center justify-between border-b border-app-border bg-app-bg/90 px-4 py-3 backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-display text-lg font-bold tracking-tight text-gray-100">LIFE</span>
          </div>
          <button
            onClick={() => void logout()}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-gray-400 hover:bg-app-surface-2 hover:text-gray-200"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:pb-4">{children}</main>
      </div>
    </div>
  )
}
