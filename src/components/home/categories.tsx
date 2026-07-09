'use client'

import { motion } from 'framer-motion'
import { Home, Building2, Castle, Building, Crown, Box, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CategoryDef {
  label: string
  type: string
  icon: typeof Home
  accent: string
  blurb: string
}

const CATEGORIES: CategoryDef[] = [
  { label: 'Houses', type: 'House', icon: Home, accent: 'bg-emerald-500/10 text-emerald-600', blurb: 'Family homes & estates' },
  { label: 'Apartments', type: 'Apartment', icon: Building2, accent: 'bg-amber-500/10 text-amber-600', blurb: 'City living made easy' },
  { label: 'Villas', type: 'Villa', icon: Castle, accent: 'bg-teal-500/10 text-teal-600', blurb: 'Luxury & privacy' },
  { label: 'Condos', type: 'Condo', icon: Building, accent: 'bg-rose-500/10 text-rose-600', blurb: 'Modern urban condos' },
  { label: 'Penthouses', type: 'Penthouse', icon: Crown, accent: 'bg-orange-500/10 text-orange-600', blurb: 'Top-floor luxury' },
  { label: 'Studios', type: 'Studio', icon: Box, accent: 'bg-violet-500/10 text-violet-600', blurb: 'Smart & compact' },
]

export function Categories() {
  const navigate = useAppStore((s) => s.navigate)
  const setSearchQuery = useAppStore((s) => s.setSearchQuery)
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    api.stats
      .get()
      .then((s) => {
        const map: Record<string, number> = {}
        s.types.forEach((t) => (map[t.type.toLowerCase()] = t.count))
        setCounts(map)
      })
      .catch(() => setCounts({}))
  }, [])

  const handleCategory = (type: string) => {
    setSearchQuery(type)
    navigate({ name: 'listings' })
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Browse"
          title="Browse by category"
          description="From cozy studios to luxury villas, explore properties by type and find the one that fits your lifestyle."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => {
            const Icon = c.icon
            const count = counts[c.type.toLowerCase()] ?? 0
            return (
              <motion.button
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.3) }}
                onClick={() => handleCategory(c.type)}
                className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <span className={cn('grid h-14 w-14 shrink-0 place-items-center rounded-2xl', c.accent)}>
                  <Icon className="h-7 w-7" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold group-hover:text-primary">{c.label}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{c.blurb}</p>
                  <p className="mt-1 text-xs font-medium text-primary">
                    {count > 0 ? `${count} listing${count === 1 ? '' : 's'}` : 'Explore listings'}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
