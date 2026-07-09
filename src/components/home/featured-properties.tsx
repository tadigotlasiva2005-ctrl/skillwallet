'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionHeading } from '@/components/shared/section-heading'
import { PropertyCard } from '@/components/property-card'
import { PropertyGridSkeleton } from '@/components/shared/skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import type { Property } from '@/lib/types'

type Tab = 'featured' | 'recent' | 'premium'

interface FetchState {
  loading: boolean
  properties: Property[]
  tab: Tab
}

export function FeaturedProperties() {
  const navigate = useAppStore((s) => s.navigate)
  const [tab, setTab] = useState<Tab>('featured')
  // Single state object: changing tab sets loading=true synchronously via the
  // tab change handler instead of inside the effect (avoids setState-in-effect lint).
  const [state, setState] = useState<FetchState>({ loading: true, properties: [], tab: 'featured' })
  const reqIdRef = useRef(0)

  const handleTabChange = (next: Tab) => {
    setTab(next)
    setState({ loading: true, properties: [], tab: next })
  }

  useEffect(() => {
    const filters: Parameters<typeof api.properties.list>[0] = { limit: 6 }
    if (tab === 'featured') filters.featured = true
    if (tab === 'premium') filters.premium = true
    if (tab === 'recent') filters.sort = 'newest'

    const reqId = ++reqIdRef.current
    api.properties
      .list(filters)
      .then((res) => {
        if (reqId !== reqIdRef.current) return
        setState({ loading: false, properties: res.data, tab })
      })
      .catch(() => {
        if (reqId !== reqIdRef.current) return
        setState({ loading: false, properties: [], tab })
      })
  }, [tab])

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured properties"
          description="A curated selection of our best-loved listings — verified, rated, and ready to tour."
        />

        <div className="mt-8 flex justify-center">
          <Tabs value={tab} onValueChange={(v) => handleTabChange(v as Tab)}>
            <TabsList>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-10">
          {state.loading ? (
            <PropertyGridSkeleton count={6} />
          ) : state.properties.length === 0 ? (
            <EmptyState
              icon={Home}
              title="No properties found"
              description="Try another tab or browse all listings."
              action={
                <Button onClick={() => navigate({ name: 'listings' })}>
                  <Sparkles className="mr-2 h-4 w-4" /> Browse all
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {state.properties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex justify-center"
        >
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ name: 'listings' })}
            className="gap-2 rounded-full border-primary/30 text-primary hover:bg-primary/5"
          >
            View all properties
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
