import type { LucideIcon } from 'lucide-react'

export function PageHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <h1 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold text-gray-100">
      <Icon size={22} className="text-blue-400" />
      {title}
    </h1>
  )
}
