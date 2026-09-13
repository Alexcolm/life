import { Check } from 'lucide-react'

const ROWS = [
  { width: '85%' },
  { width: '65%' },
  { width: '75%' },
  { width: '55%' },
]

export function PhonePreview() {
  return (
    <div className="hidden fade-in-up sm:block" style={{ animationDelay: '0.15s' }}>
      <div className="w-48 rounded-[28px] border border-white/10 bg-app-surface/80 p-3.5 shadow-2xl backdrop-blur-md">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/15" />
        <div className="flex flex-col gap-2">
          {ROWS.map((row, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg bg-app-surface-2/80 px-2 py-1.5"
            >
              <span
                className="check-cycle flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500"
                style={{ animationDelay: `${i * 1.3}s` }}
              >
                <Check size={10} strokeWidth={3} className="text-white" />
              </span>
              <span className="h-2 rounded-full bg-white/10" style={{ width: row.width }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
