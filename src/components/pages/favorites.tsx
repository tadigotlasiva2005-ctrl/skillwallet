'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2, Search, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PropertyCard } from '@/components/property-card'
import { PropertyGridSkeleton } from '@/components/shared/skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { SectionHeading } from '@/components/shared/section-heading'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import type { Property } from '@/lib/types'
import { toast } from 'sonner'

export function FavoritesPage() {
  const favorites = useAppStore((s) => s.favorites)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const navigate = useAppStore((s) => s.navigate)

  const [properties, setProperties] = useState<Property[]>([])
  const [fetchedSig, setFetchedSig] = useState<string>('')
  // Derive loading from comparing the current favorites signature to the
  // last-fetched signature — avoids sync setState inside the fetch effect.
  const currentSig = useMemo(() => favorites.join('|'), [favorites])
  const loading = currentSig !== fetchedSig

  useEffect(() => {
    let cancelled = false
    // Promise.all([]) resolves immediately, so the empty case is handled by
    // the .then callback (async setState — safe per the lint rule).
    Promise.all(
      favorites.map((id) => api.properties.get(id).catch(() => null))
    ).then((results) => {
      if (cancelled) return
      const valid = results.filter((p): p is Property => p !== null)
      // Preserve order based on the favorites array
      const ordered = favorites
        .map((id) => valid.find((p) => p.id === id))
        .filter((p): p is Property => !!p)
      setProperties(ordered)
      setFetchedSig(currentSig)
    })
    return () => {
      cancelled = true
    }
  }, [favorites, currentSig])

  const handleClearAll = () => {
    if (favorites.length === 0) return
    // Snapshot current favorites so we don't toggle ones added later
    const snapshot = [...favorites]
    snapshot.forEach((id) => toggleFavorite(id))
    setProperties([])
    toast.success('Favorites cleared', {
      description: `${snapshot.length} ${snapshot.length === 1 ? 'property' : 'properties'} removed.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-background to-background pb-20">
      {/* Header */}
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <SectionHeading
            align="left"
            eyebrow="Your collection"
            title={
              <span className="flex items-center gap-3">
                Saved favorites
                <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-500/15 text-rose-500">
                  <Heart className="h-5 w-5 fill-current" />
                </span>
              </span>
            }
            description="Properties you've saved for later. They stay here even after you leave — ready to revisit any time."
          />

          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {loading
                ? 'Loading…'
                : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} saved`}
            </p>
            {properties.length > 0 && !loading && (
              <Button variant="outline" onClick={handleClearAll} className="gap-2">
                <Trash2 className="h-4 w-4" /> Clear all
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto max-w-7xl px-4 mt-8">
        {loading ? (
          <PropertyGridSkeleton count={6} />
        ) : properties.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Tap the heart icon on any property to save it here. Your saved homes make it easy to compare and revisit later."
            action={
              <Button onClick={() => navigate({ name: 'listings' })} className="gap-2">
                <Search className="h-4 w-4" /> Browse listings
              </Button>
            }
          />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {properties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </motion.div>

            <Card className="mt-8 rounded-2xl border-dashed border-border/70 bg-secondary/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="font-semibold flex items-center gap-2 justify-center sm:justify-start">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Ready to compare your top picks?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a few favorites to the compare list and weigh them side by side.
                </p>
              </div>
              <Button
                onClick={() => navigate({ name: 'compare' })}
                variant="outline"
                className="gap-2 rounded-full border-primary/30 text-primary hover:bg-primary/5"
              >
                Open compare <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
