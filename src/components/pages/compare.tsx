'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  GitCompare,
  Trash2,
  Plus,
  Trophy,
  Star,
  BedDouble,
  Bath,
  Maximize,
  Car,
  Building2,
  Calendar,
  Compass,
  Building,
  Sofa,
  MapPin,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SectionHeading } from '@/components/shared/section-heading'
import { EmptyState } from '@/components/shared/empty-state'
import { PropertyGridSkeleton } from '@/components/shared/skeletons'
import { useAppStore } from '@/lib/store'
import { api, formatPrice } from '@/lib/api'
import type { Property } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function ComparePage() {
  const compare = useAppStore((s) => s.compare)
  const toggleCompare = useAppStore((s) => s.toggleCompare)
  const clearCompare = useAppStore((s) => s.clearCompare)
  const navigate = useAppStore((s) => s.navigate)

  const [properties, setProperties] = useState<Property[]>([])
  const [fetchedSig, setFetchedSig] = useState<string>('')
  // Derive loading from comparing the current compare-list signature to the
  // last-fetched signature — avoids sync setState inside the fetch effect.
  const currentSig = useMemo(() => compare.join('|'), [compare])
  const loading = currentSig !== fetchedSig

  useEffect(() => {
    let cancelled = false
    // Promise.all([]) resolves immediately, so the empty case is handled by
    // the .then callback (async setState — safe per the lint rule).
    Promise.all(compare.map((id) => api.properties.get(id).catch(() => null))).then((results) => {
      if (cancelled) return
      const valid = results.filter((p): p is Property => p !== null)
      // Preserve order based on the compare array
      const ordered = compare
        .map((id) => valid.find((p) => p.id === id))
        .filter((p): p is Property => !!p)
      setProperties(ordered)
      setFetchedSig(currentSig)
    })
    return () => {
      cancelled = true
    }
  }, [compare, currentSig])

  const handleClearAll = () => {
    clearCompare()
    setProperties([])
    toast.success('Compare list cleared')
  }

  const handleRemove = (id: string) => {
    toggleCompare(id)
    toast('Removed from compare list')
  }

  // Compute "best value" indices for various rows
  const best = useMemo(() => {
    if (properties.length < 2) return { lowestPrice: -1, highestRating: -1, largestArea: -1, mostBeds: -1 }
    let lp = 0,
      lpv = properties[0].price
    let hr = 0,
      hrv = properties[0].rating
    let la = 0,
      lav = properties[0].area
    let mb = 0,
      mbv = properties[0].bedrooms
    properties.forEach((p, i) => {
      if (p.price < lpv) {
        lpv = p.price
        lp = i
      }
      if (p.rating > hrv) {
        hrv = p.rating
        hr = i
      }
      if (p.area > lav) {
        lav = p.area
        la = i
      }
      if (p.bedrooms > mbv) {
        mbv = p.bedrooms
        mb = i
      }
    })
    return { lowestPrice: lp, highestRating: hr, largestArea: la, mostBeds: mb }
  }, [properties])

  const showEmpty = !loading && properties.length < 2

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-background to-background pb-20">
      {/* Header */}
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <SectionHeading
            align="left"
            eyebrow="Side by side"
            title={
              <span className="flex items-center gap-3">
                Compare properties
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
                  <GitCompare className="h-5 w-5" />
                </span>
              </span>
            }
            description="Stack up to 4 properties next to each other to weigh the pros and cons. Best values are highlighted automatically."
          />

          <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-muted-foreground">
              {loading
                ? 'Loading…'
                : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} in compare list (max 4)`}
            </p>
            {properties.length > 0 && !loading && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate({ name: 'listings' })}
                  className="gap-2"
                  disabled={properties.length >= 4}
                >
                  <Plus className="h-4 w-4" /> Add more
                </Button>
                <Button variant="outline" onClick={handleClearAll} className="gap-2">
                  <Trash2 className="h-4 w-4" /> Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto max-w-7xl px-4 mt-8">
        {loading ? (
          <PropertyGridSkeleton count={3} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
        ) : showEmpty ? (
          <EmptyState
            icon={GitCompare}
            title={properties.length === 0 ? 'Nothing to compare yet' : 'Add at least 2 properties'}
            description="Use the compare icon on any property card to add it here. With 2 or more properties, you'll see a side-by-side breakdown of every detail."
            action={
              <Button onClick={() => navigate({ name: 'listings' })} className="gap-2">
                <Plus className="h-4 w-4" /> Browse listings
              </Button>
            }
          />
        ) : (
          <CompareTable
            properties={properties}
            best={best}
            onRemove={handleRemove}
            onOpen={(id) => navigate({ name: 'details', id })}
          />
        )}
      </div>
    </div>
  )
}

// ---- Compare table ----
interface Best { lowestPrice: number; highestRating: number; largestArea: number; mostBeds: number }

function CompareTable({
  properties,
  best,
  onRemove,
  onOpen,
}: {
  properties: Property[]
  best: Best
  onRemove: (id: string) => void
  onOpen: (id: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border/60 bg-card overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[720px]">
          <tbody>
            {/* Top action row */}
            <tr className="border-b border-border/60">
              <th className="w-40 sticky left-0 z-10 bg-card p-4 text-left align-top">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Property
                </span>
              </th>
              {properties.map((p) => (
                <td key={p.id} className="p-4 align-top min-w-[200px]">
                  <button
                    onClick={() => onOpen(p.id)}
                    className="relative block w-full aspect-[4/3] overflow-hidden rounded-xl group"
                  >
                    <Image
                      src={p.images[0] || '/properties/prop1.png'}
                      alt={p.title}
                      fill
                      sizes="220px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-2 left-2">
                      <Badge
                        className={cn(
                          'border-0 text-xs',
                          p.status === 'rent'
                            ? 'bg-emerald-500/95 text-white'
                            : 'bg-amber-500/95 text-white'
                        )}
                      >
                        For {p.status === 'rent' ? 'Rent' : 'Sale'}
                      </Badge>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemove(p.id)
                      }}
                      aria-label="Remove from compare"
                      className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-rose-500 backdrop-blur-md hover:bg-white hover:scale-110 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white font-semibold text-sm line-clamp-2 text-left">{p.title}</p>
                    </div>
                  </button>
                </td>
              ))}
            </tr>

            {/* Price */}
            <Row label="Price" icon={<Building2 className="h-3.5 w-3.5" />}>
              {properties.map((p, i) => (
                <Cell key={p.id} best={i === best.lowestPrice}>
                  <span className="text-lg font-bold text-primary">{formatPrice(p.price, p.status)}</span>
                </Cell>
              ))}
            </Row>

            {/* Status */}
            <Row label="Status">
              {properties.map((p) => (
                <Cell key={p.id}>
                  <Badge variant="secondary" className="capitalize">{p.status}</Badge>
                </Cell>
              ))}
            </Row>

            {/* Type */}
            <Row label="Type">
              {properties.map((p) => (
                <Cell key={p.id}>
                  <span className="capitalize">{p.type}</span>
                </Cell>
              ))}
            </Row>

            {/* City */}
            <Row label="City" icon={<MapPin className="h-3.5 w-3.5" />}>
              {properties.map((p) => (
                <Cell key={p.id}>{p.city}, {p.state}</Cell>
              ))}
            </Row>

            {/* Bedrooms */}
            <Row label="Bedrooms" icon={<BedDouble className="h-3.5 w-3.5" />}>
              {properties.map((p, i) => (
                <Cell key={p.id} best={i === best.mostBeds}>
                  {p.bedrooms}
                </Cell>
              ))}
            </Row>

            {/* Bathrooms */}
            <Row label="Bathrooms" icon={<Bath className="h-3.5 w-3.5" />}>
              {properties.map((p) => (
                <Cell key={p.id}>{p.bathrooms}</Cell>
              ))}
            </Row>

            {/* Area */}
            <Row label="Area" icon={<Maximize className="h-3.5 w-3.5" />}>
              {properties.map((p, i) => (
                <Cell key={p.id} best={i === best.largestArea}>
                  {p.area.toLocaleString()} sqft
                </Cell>
              ))}
            </Row>

            {/* Parking */}
            <Row label="Parking" icon={<Car className="h-3.5 w-3.5" />}>
              {properties.map((p) => (
                <Cell key={p.id}>{p.parking > 0 ? `${p.parking} spot${p.parking > 1 ? 's' : ''}` : 'None'}</Cell>
              ))}
            </Row>

            {/* Floor */}
            <Row label="Floor" icon={<Building2 className="h-3.5 w-3.5" />}>
              {properties.map((p) => (
                <Cell key={p.id}>{p.floor ? `Floor ${p.floor}` : 'Ground'}</Cell>
              ))}
            </Row>

            {/* Year built */}
            <Row label="Year built" icon={<Calendar className="h-3.5 w-3.5" />}>
              {properties.map((p) => (
                <Cell key={p.id}>{p.yearBuilt}</Cell>
              ))}
            </Row>

            {/* Furnished */}
            <Row label="Furnished" icon={<Sofa className="h-3.5 w-3.5" />}>
              {properties.map((p) => (
                <Cell key={p.id}>
                  {p.furnished ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Yes</span>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )}
                </Cell>
              ))}
            </Row>

            {/* Balcony */}
            <Row label="Balcony" icon={<Building className="h-3.5 w-3.5" />}>
              {properties.map((p) => (
                <Cell key={p.id}>
                  {p.balcony ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Yes</span>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )}
                </Cell>
              ))}
            </Row>

            {/* Facing */}
            <Row label="Facing" icon={<Compass className="h-3.5 w-3.5" />}>
              {properties.map((p) => (
                <Cell key={p.id}>{p.facing || '—'}</Cell>
              ))}
            </Row>

            {/* Rating */}
            <Row label="Rating" icon={<Star className="h-3.5 w-3.5" />}>
              {properties.map((p, i) => (
                <Cell key={p.id} best={i === best.highestRating}>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-semibold">{p.rating}</span>
                    <span className="text-xs text-muted-foreground">({p.reviews.length})</span>
                  </span>
                </Cell>
              ))}
            </Row>

            {/* Amenities */}
            <Row label="Amenities">
              {properties.map((p) => (
                <Cell key={p.id}>
                  <div className="flex flex-wrap gap-1 max-w-[220px]">
                    {p.amenities.slice(0, 5).map((a) => (
                      <Badge key={a} variant="secondary" className="text-[10px] font-normal leading-tight">
                        {a}
                      </Badge>
                    ))}
                    {p.amenities.length > 5 && (
                      <Badge variant="outline" className="text-[10px] font-normal leading-tight">
                        +{p.amenities.length - 5}
                      </Badge>
                    )}
                    {p.amenities.length === 0 && (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </div>
                </Cell>
              ))}
            </Row>

            {/* Agent */}
            <Row label="Agent">
              {properties.map((p) => (
                <Cell key={p.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={p.agent.avatar} alt={p.agent.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                        {p.agent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate flex items-center gap-1">
                        {p.agent.name}
                        {p.agent.verified && <ShieldCheck className="h-3 w-3 text-primary shrink-0" />}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">{p.agent.company}</div>
                    </div>
                  </div>
                </Cell>
              ))}
            </Row>

            {/* CTA row */}
            <Row label="">
              {properties.map((p) => (
                <td key={p.id} className="p-4 align-top">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpen(p.id)}
                    className="w-full gap-2"
                  >
                    View details
                  </Button>
                </td>
              ))}
            </Row>
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

function Row({
  label,
  icon,
  children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <tr className="border-b border-border/40 last:border-0 hover:bg-secondary/20">
      <th className="w-40 sticky left-0 z-10 bg-card p-4 text-left align-top">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {icon && <span className="text-primary">{icon}</span>}
          {label}
        </div>
      </th>
      {children}
    </tr>
  )
}

function Cell({
  best,
  children,
}: {
  best?: boolean
  children: React.ReactNode
}) {
  return (
    <td className="p-4 align-middle">
      <div className={cn('inline-flex items-center', best && 'rounded-md bg-primary/10 px-2 py-1')}>
        {best && (
          <Trophy className="mr-1.5 h-3.5 w-3.5 text-amber-500 shrink-0" aria-label="Best value" />
        )}
        <span className="text-sm">{children}</span>
      </div>
    </td>
  )
}
