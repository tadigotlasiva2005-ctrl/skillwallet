'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Search, Star, MapPin, BadgeCheck, Building2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'
import { api, formatPrice } from '@/lib/api'
import type { Property } from '@/lib/types'
import { cn } from '@/lib/utils'

const CITIES = ['Miami', 'Austin', 'Denver', 'New York', 'San Diego', 'Seattle', 'Boston', 'Asheville', 'Chicago', 'Los Angeles']
const TYPES = ['House', 'Apartment', 'Villa', 'Condo', 'Penthouse', 'Studio', 'Townhouse', 'Cottage']

export function Hero() {
  const navigate = useAppStore((s) => s.navigate)
  const setSearchQuery = useAppStore((s) => s.setSearchQuery)

  const [location, setLocation] = useState<string>('all')
  const [type, setType] = useState<string>('all')
  const [status, setStatus] = useState<'rent' | 'buy' | 'all'>('all')
  const [featured, setFeatured] = useState<Property | null>(null)

  useEffect(() => {
    api.properties
      .list({ featured: true, limit: 1 })
      .then((res) => setFeatured(res.data[0] ?? null))
      .catch(() => setFeatured(null))
  }, [])

  const handleSearch = () => {
    // Compose a search query string the listings page can use
    const parts: string[] = []
    if (location !== 'all') parts.push(location)
    if (type !== 'all') parts.push(type)
    setSearchQuery(parts.join(' '))
    navigate({ name: 'listings' })
  }

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/properties/hero.png"
          alt="HouseHunt hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: copy + search */}
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-5 border-0 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <BadgeCheck className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
                Trusted by 50,000+ families
              </Badge>

              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                Find your dream home,
                <br />
                the{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-primary bg-clip-text text-transparent">
                  smart way
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
                Discover thousands of verified rental and for-sale properties across top cities.
                Powerful search, real-time agent chat, and smart dashboards — all in one place.
              </p>
            </motion.div>

            {/* Glass search bar */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 rounded-2xl border border-white/30 bg-white/10 p-3 backdrop-blur-2xl md:p-4"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_auto_auto]">
                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wide text-white/70">
                    Location
                  </label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-11 w-full border-white/20 bg-white/95 text-foreground">
                      <MapPin className="mr-1.5 h-4 w-4 text-primary" />
                      <SelectValue placeholder="Any city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All cities</SelectItem>
                      {CITIES.map((c) => (
                        <SelectItem key={c} value={c.toLowerCase()}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wide text-white/70">
                    Property type
                  </label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-11 w-full border-white/20 bg-white/95 text-foreground">
                      <Building2 className="mr-1.5 h-4 w-4 text-primary" />
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {TYPES.map((t) => (
                        <SelectItem key={t} value={t.toLowerCase()}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status toggle */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wide text-white/70">
                    Listing
                  </label>
                  <div className="flex h-11 items-center gap-1 rounded-md border border-white/20 bg-white/95 p-1">
                    {(['all', 'rent', 'buy'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={cn(
                          'h-full flex-1 rounded-sm px-3 text-sm font-medium capitalize transition-colors',
                          status === s ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'
                        )}
                      >
                        {s === 'all' ? 'All' : s === 'rent' ? 'Rent' : 'Buy'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search button */}
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    size="lg"
                    className="h-11 w-full gap-2 bg-amber-500 text-white hover:bg-amber-600 lg:w-auto"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Quick stat chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <Chip icon={<Building2 className="h-4 w-4" />} label="10K+ Properties" />
              <Chip icon={<Star className="h-4 w-4 fill-amber-300 text-amber-300" />} label="4.9 Avg Rating" />
              <Chip icon={<BadgeCheck className="h-4 w-4 text-emerald-300" />} label="500+ Verified Agents" />
            </motion.div>
          </div>

          {/* Right: floating featured property card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="hidden lg:block"
          >
            {featured ? (
              <FeaturedPreview property={featured} onOpen={() => navigate({ name: 'details', id: featured.id })} />
            ) : (
              <div className="glass-strong aspect-[4/5] w-full max-w-md rounded-3xl p-6 animate-pulse" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
      {icon}
      {label}
    </div>
  )
}

function FeaturedPreview({
  property,
  onOpen,
}: {
  property: Property
  onOpen: () => void
}) {
  return (
    <div className="relative ml-auto w-full max-w-md">
      {/* Glow */}
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-amber-500/30 to-primary/30 blur-2xl" />

      <div className="glass-strong overflow-hidden rounded-3xl shadow-2xl">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={property.images[0] || '/properties/prop1.png'}
            alt={property.title}
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge className="border-0 bg-amber-500 text-white">Featured</Badge>
            {property.verified && (
              <Badge className="border-0 bg-emerald-500/95 text-white">
                <BadgeCheck className="mr-1 h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-white/80">{property.city}</p>
              <p className="text-lg font-bold text-white">{property.title}</p>
            </div>
            <div className="rounded-lg bg-black/50 px-3 py-1.5 backdrop-blur-md">
              <span className="text-base font-bold text-white">
                {formatPrice(property.price, property.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-foreground">{property.rating} / 5.0</p>
                <p className="text-xs text-muted-foreground">Avg rating</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{property.bedrooms} bd · {property.bathrooms} ba</p>
              <p className="text-xs text-muted-foreground">{property.area.toLocaleString()} sqft</p>
            </div>
          </div>

          <Button onClick={onOpen} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            View this property
          </Button>
        </div>
      </div>
    </div>
  )
}
