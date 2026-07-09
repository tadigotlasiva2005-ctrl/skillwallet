'use client'

import Image from 'next/image'
import { Heart, BedDouble, Bath, Maximize, Car, Star, MapPin, Eye, GitCompare } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { formatPrice, formatCompact } from '@/lib/api'
import type { Property } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PropertyCardProps {
  property: Property
  index?: number
  compact?: boolean
}

export function PropertyCard({ property, index = 0, compact = false }: PropertyCardProps) {
  const navigate = useAppStore((s) => s.navigate)
  const favorites = useAppStore((s) => s.favorites)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const compare = useAppStore((s) => s.compare)
  const toggleCompare = useAppStore((s) => s.toggleCompare)
  const addRecentlyViewed = useAppStore((s) => s.addRecentlyViewed)

  const isFav = favorites.includes(property.id)
  const inCompare = compare.includes(property.id)
  const canCompare = compare.length < 4 || inCompare

  const open = () => {
    addRecentlyViewed(property.id)
    navigate({ name: 'details', id: property.id })
  }

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(property.id)
    toast(isFav ? 'Removed from favorites' : 'Added to favorites', {
      description: property.title,
    })
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canCompare) {
      toast('Compare list is full', { description: 'Remove a property to add another (max 4).' })
      return
    }
    toggleCompare(property.id)
    toast(inCompare ? 'Removed from compare' : 'Added to compare list', {
      description: `${compare.length + (inCompare ? 0 : 1)}/4 selected`,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        onClick={open}
        className="group relative overflow-hidden rounded-2xl border-border/60 bg-card cursor-pointer transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
      >
        {/* Image */}
        <div className={cn('relative overflow-hidden', compact ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
          <Image
            src={property.images[0] || '/properties/prop1.png'}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge
              className={cn(
                'border-0 shadow-md text-xs font-semibold',
                property.status === 'rent'
                  ? 'bg-emerald-500/95 text-white hover:bg-emerald-500'
                  : 'bg-amber-500/95 text-white hover:bg-amber-500'
              )}
            >
              For {property.status === 'rent' ? 'Rent' : 'Sale'}
            </Badge>
            {property.featured && (
              <Badge className="bg-primary/95 text-primary-foreground border-0 shadow-md text-xs">
                Featured
              </Badge>
            )}
            {property.premium && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md text-xs">
                Premium
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            <button
              onClick={handleFav}
              aria-label="Toggle favorite"
              className={cn(
                'grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition-all',
                isFav
                  ? 'bg-rose-500 text-white shadow-md scale-105'
                  : 'bg-white/80 text-foreground hover:bg-white hover:scale-110'
              )}
            >
              <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
            </button>
            <button
              onClick={handleCompare}
              aria-label="Add to compare"
              className={cn(
                'grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition-all',
                inCompare
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'bg-white/80 text-foreground hover:bg-white hover:scale-110'
              )}
            >
              <GitCompare className="h-4 w-4" />
            </button>
          </div>

          {/* Price */}
          <div className="absolute bottom-3 left-3">
            <div className="rounded-lg bg-black/40 px-3 py-1.5 backdrop-blur-md">
              <span className="text-lg font-bold text-white">
                {formatPrice(property.price, property.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <div className="flex items-center gap-1 shrink-0 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-semibold">{property.rating}</span>
              </div>
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">
                {property.address}, {property.city}, {property.state}
              </span>
            </p>
          </div>

          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
          )}

          {/* Specs */}
          <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm">
            <Spec icon={<BedDouble className="h-4 w-4" />} value={`${property.bedrooms}`} label="Beds" />
            <Spec icon={<Bath className="h-4 w-4" />} value={`${property.bathrooms}`} label="Baths" />
            <Spec icon={<Maximize className="h-4 w-4" />} value={formatCompact(property.area)} label="sqft" />
            {property.parking > 0 ? (
              <Spec icon={<Car className="h-4 w-4" />} value={`${property.parking}`} label="Parking" />
            ) : (
              <Spec icon={<Eye className="h-4 w-4" />} value={formatCompact(property.views)} label="views" />
            )}
          </div>

          {/* Amenities */}
          {!compact && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {property.amenities.slice(0, 3).map((a) => (
                <Badge key={a} variant="secondary" className="text-xs font-normal">
                  {a}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{property.amenities.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

function Spec({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className="text-primary/70">{icon}</span>
      <span className="font-semibold text-foreground">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  )
}
