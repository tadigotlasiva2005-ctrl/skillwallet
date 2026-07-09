'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

interface CityCard {
  city: string
  count: number
  gradient: string
  image: string
}

// Map city to a property image so each card has a unique photo
const CITY_IMAGES: Record<string, string> = {
  Miami: '/properties/prop1.png',
  'New York': '/properties/prop3.png',
  'Los Angeles': '/properties/prop2.png',
  Chicago: '/properties/prop4.png',
  Austin: '/properties/prop5.png',
  'San Diego': '/properties/prop6.png',
  Denver: '/properties/prop7.png',
  Seattle: '/properties/prop8.png',
  Boston: '/properties/prop9.png',
  Asheville: '/properties/prop10.png',
}

const FALLBACK_CITIES: CityCard[] = [
  { city: 'Miami', count: 12, gradient: 'from-emerald-500/80 to-teal-700/90', image: '/properties/prop1.png' },
  { city: 'New York', count: 18, gradient: 'from-amber-500/80 to-orange-700/90', image: '/properties/prop3.png' },
  { city: 'Los Angeles', count: 14, gradient: 'from-rose-500/80 to-red-700/90', image: '/properties/prop2.png' },
  { city: 'Chicago', count: 9, gradient: 'from-teal-500/80 to-cyan-700/90', image: '/properties/prop4.png' },
  { city: 'Austin', count: 11, gradient: 'from-emerald-600/80 to-green-800/90', image: '/properties/prop5.png' },
  { city: 'San Diego', count: 8, gradient: 'from-amber-400/80 to-yellow-700/90', image: '/properties/prop6.png' },
]

const GRADIENTS = [
  'from-emerald-500/80 to-teal-700/90',
  'from-amber-500/80 to-orange-700/90',
  'from-rose-500/80 to-red-700/90',
  'from-teal-500/80 to-cyan-700/90',
  'from-emerald-600/80 to-green-800/90',
  'from-amber-400/80 to-yellow-700/90',
]

export function PopularCities() {
  const navigate = useAppStore((s) => s.navigate)
  const setSearchQuery = useAppStore((s) => s.setSearchQuery)
  const [cities, setCities] = useState<CityCard[] | null>(null)

  useEffect(() => {
    api.stats
      .get()
      .then((s) => {
        if (s.cities.length === 0) {
          setCities(FALLBACK_CITIES)
          return
        }
        setCities(
          s.cities.slice(0, 6).map((c, i) => ({
            city: c.city,
            count: c.count,
            gradient: GRADIENTS[i % GRADIENTS.length],
            image: CITY_IMAGES[c.city] || `/properties/prop${(i % 10) + 1}.png`,
          }))
        )
      })
      .catch(() => setCities(FALLBACK_CITIES))
  }, [])

  const openCity = (city: string) => {
    setSearchQuery(city)
    navigate({ name: 'listings' })
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Locations"
          title="Popular cities"
          description="Explore the hottest real estate markets across the country — from coastal gems to urban centers."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities === null
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[5/3] w-full rounded-2xl" />
              ))
            : cities.map((c, i) => (
                <motion.button
                  key={c.city}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.3) }}
                  onClick={() => openCity(c.city)}
                  className="group relative aspect-[5/3] overflow-hidden rounded-2xl text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow"
                >
                  <Image
                    src={c.image}
                    alt={c.city}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={cn('absolute inset-0 bg-gradient-to-t', c.gradient)} />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                    <div className="flex items-center gap-1.5 text-sm text-white/80">
                      <MapPin className="h-4 w-4" />
                      United States
                    </div>
                    <div className="mt-1 flex items-end justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">{c.city}</h3>
                        <p className="text-sm text-white/85">
                          {c.count} {c.count === 1 ? 'listing' : 'listings'}
                        </p>
                      </div>
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 backdrop-blur-md transition-transform group-hover:scale-110 group-hover:bg-white/30">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
        </div>
      </div>
    </section>
  )
}
