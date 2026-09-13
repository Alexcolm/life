import { Loader2, Lock, Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { AnimatedBackground } from '../components/AnimatedBackground'
import { Logo } from '../components/Logo'
import { PhonePreview } from '../components/PhonePreview'
import { useAuth } from './AuthContext'

export function LoginPage() {
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
    } catch {
      setError('Email o contraseña incorrectos.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-app-bg px-4">
      <AnimatedBackground />

      <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-14">
        <div className="fade-in-up flex flex-col items-center text-center sm:items-end sm:text-right">
          <div className="mb-4 flex flex-col items-center gap-3 sm:items-end">
            <div className="logo-ring rounded-2xl">
              <Logo size={52} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-gray-100">LIFE</h1>
              <p className="mt-1 text-sm text-gray-500">Tu panel personal, a mano.</p>
            </div>
          </div>
          <PhonePreview />
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-in w-full max-w-sm rounded-2xl border border-app-border bg-app-surface/90 p-8 shadow-2xl backdrop-blur-md"
          style={{ animationDelay: '0.1s' }}
        >
          <label className="mb-1 block text-sm text-gray-400" htmlFor="email">
            Email
          </label>
          <div className="relative mb-4">
            <Mail size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface-2 py-2 pr-3 pl-9 text-gray-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            />
          </div>

          <label className="mb-1 block text-sm text-gray-400" htmlFor="password">
            Contraseña
          </label>
          <div className="relative mb-6">
            <Lock size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface-2 py-2 pr-3 pl-9 text-gray-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-medium text-white transition hover:scale-[1.01] hover:bg-blue-400 active:scale-[0.99] disabled:opacity-50"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
