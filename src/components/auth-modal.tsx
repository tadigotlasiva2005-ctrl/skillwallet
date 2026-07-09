'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff, Home, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore, type UserRole } from '@/lib/store'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function AuthModal() {
  const open = useAppStore((s) => s.authModalOpen)
  const mode = useAppStore((s) => s.authModalMode)
  const closeAuthModal = useAppStore((s) => s.closeAuthModal)
  const openAuthModal = useAppStore((s) => s.openAuthModal)
  const login = useAppStore((s) => s.login)

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')
  const [role, setRole] = React.useState<UserRole>('user')
  const [showPass, setShowPass] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setEmail('')
      setPassword('')
      setName('')
      setRole('user')
      setShowPass(false)
    }
  }, [open, mode])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result =
        mode === 'login'
          ? await api.auth.login(email, password, role)
          : await api.auth.register({ name, email, password, role })
      login(result.user, result.token)
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!', {
        description: `Signed in as ${result.user.name}`,
      })
    } catch (err: any) {
      toast.error('Authentication failed', { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (r: UserRole) => {
    setLoading(true)
    api.auth.login(`demo.${r}@househunt.com`, 'demo123', r).then((res) => {
      login(res.user, res.token)
      toast.success('Quick login', { description: `Exploring as ${r}` })
    }).finally(() => setLoading(false))
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeAuthModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl"
          >
            {/* Header banner */}
            <div className="relative h-28 bg-gradient-to-br from-primary to-emerald-700 overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              <button
                onClick={closeAuthModal}
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute -bottom-6 left-6 grid h-14 w-14 place-items-center rounded-2xl bg-card shadow-lg border border-border/40">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground">
                  <Home className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="p-6 pt-8">
              <h2 className="text-xl font-bold">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === 'login'
                  ? 'Sign in to access your dashboard, favorites, and bookings.'
                  : 'Join HouseHunt to find, save, and manage properties.'}
              </p>

              <form onSubmit={submit} className="mt-5 space-y-4">
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="pl-9"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-9 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Role selector */}
                <div className="space-y-1.5">
                  <Label>I am a...</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['user', 'owner', 'admin'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={cn(
                          'rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-all',
                          role === r
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/40 hover:bg-secondary'
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                      onClick={() => toast.info('Password reset link sent (demo)', { description: 'Check your inbox for reset instructions.' })}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button type="submit" className="w-full shadow-soft" disabled={loading}>
                  {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
                </Button>
              </form>

              {/* Quick demo login */}
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-2 text-xs text-muted-foreground">or quick demo as</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(['user', 'owner', 'admin'] as UserRole[]).map((r) => (
                    <Button
                      key={r}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="capitalize text-xs"
                      disabled={loading}
                      onClick={() => quickLogin(r)}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => openAuthModal(mode === 'login' ? 'register' : 'login')}
                  className="font-semibold text-primary hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
