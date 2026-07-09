'use client'

import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

export default function NotFoundPage() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-amber-50" />
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <span className="grid h-24 w-24 place-items-center rounded-3xl bg-primary/10 text-primary shadow-glow md:h-28 md:w-28">
              <Search className="h-12 w-12 md:h-14 md:w-14" />
            </span>
            <div className="absolute -right-3 -top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-md">
              404
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-7xl font-bold tracking-tight md:text-9xl"
          >
            <span className="bg-gradient-to-r from-primary via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              404
            </span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-2xl font-bold md:text-3xl"
          >
            Page not found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-3 max-w-md text-muted-foreground"
          >
            We couldn't find the page you were looking for. It may have moved, been renamed, or never existed.
            Let's get you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              onClick={() => navigate({ name: 'home' })}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Home className="h-4 w-4" />
              Back to home
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ name: 'listings' })}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse listings
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
