import { ChevronRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface CardProps {
  title: string
  icon: LucideIcon
  to: string
  children: ReactNode
}

export function Card({ title, icon: Icon, to, children }: CardProps) {
  return (
    <div className="rounded-2xl border border-app-border bg-app-surface p-4">
      <Link to={to} className="group mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 font-display text-sm font-semibold text-gray-100">
          <Icon size={18} className="text-blue-400" />
          {title}
        </span>
        <ChevronRight
          size={18}
          className="text-gray-600 transition group-hover:translate-x-0.5 group-hover:text-gray-400"
        />
      </Link>
      {children}
    </div>
  )
}
