'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Heart,
  Share2,
  GitCompare,
  MapPin,
  Eye,
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
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  BadgeCheck,
  School,
  Hospital,
  Utensils,
  Bus,
  CreditCard,
  CalendarCheck,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { useAppStore } from '@/lib/store'
import { api, formatPrice, formatCompact } from '@/lib/api'
import type { Property } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface PropertyDetailsProps {
  propertyId: string
}

const TIME_SLOTS = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM']

const NEARBY = [
  { icon: School, label: 'Schools', distance: '0.8 mi' },
  { icon: Hospital, label: 'Hospitals', distance: '1.2 mi' },
  { icon: Utensils, label: 'Restaurants', distance: '0.3 mi' },
  { icon: Bus, label: 'Bus stops', distance: '0.2 mi' },
]

export function PropertyDetails({ propertyId }: PropertyDetailsProps) {
  const navigate = useAppStore((s) => s.navigate)
  const favorites = useAppStore((s) => s.favorites)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const compare = useAppStore((s) => s.compare)
  const toggleCompare = useAppStore((s) => s.toggleCompare)
  const addRecentlyViewed = useAppStore((s) => s.addRecentlyViewed)
  const user = useAppStore((s) => s.user)
  const openAuthModal = useAppStore((s) => s.openAuthModal)
  const addNotification = useAppStore((s) => s.addNotification)

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const addedRecentRef = useRef<string | null>(null)

  // Load property
  const loadProperty = useCallback(async () => {
    setLoading(true)
    setNotFound(false)
    try {
      const p = await api.properties.get(propertyId)
      setProperty(p)
      setActiveImage(0)
    } catch (e: any) {
      if (String(e?.message || '').includes('not found')) {
        setNotFound(true)
      } else {
        setNotFound(true)
      }
      setProperty(null)
    } finally {
      setLoading(false)
    }
  }, [propertyId])

  useEffect(() => {
    loadProperty()
  }, [loadProperty])

  // Track recently viewed (once per property id)
  useEffect(() => {
    if (addedRecentRef.current === propertyId) return
    addedRecentRef.current = propertyId
    addRecentlyViewed(propertyId)
  }, [propertyId, addRecentlyViewed])

  if (loading) return <DetailsSkeleton />

  if (notFound || !property) {
    return (
      <div className="min-h-[60vh] container mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={MapPin}
          title="Property not found"
          description="This listing may have been removed or the link is incorrect."
          action={
            <Button onClick={() => navigate({ name: 'listings' })} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Browse listings
            </Button>
          }
        />
      </div>
    )
  }

  const isFav = favorites.includes(property.id)
  const inCompare = compare.includes(property.id)
  const canCompare = compare.length < 4 || inCompare
  const images = property.images.length > 0 ? property.images : ['/properties/prop1.png']

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
    toast.success('Link copied!', { description: 'Share this property with anyone.' })
  }

  const handleFav = () => {
    toggleFavorite(property.id)
    toast(isFav ? 'Removed from favorites' : 'Added to favorites', {
      description: property.title,
    })
  }

  const handleCompare = () => {
    if (!canCompare) {
      toast('Compare list is full', { description: 'Remove a property to add another (max 4).' })
      return
    }
    toggleCompare(property.id)
    toast(inCompare ? 'Removed from compare' : 'Added to compare list', {
      description: `${compare.length + (inCompare ? 0 : 1)}/4 selected`,
    })
  }

  const handlePrevImage = () => setActiveImage((i) => (i - 1 + images.length) % images.length)
  const handleNextImage = () => setActiveImage((i) => (i + 1) % images.length)

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-background to-background pb-20">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <button onClick={() => navigate({ name: 'home' })} className="hover:text-primary">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate({ name: 'listings' })} className="hover:text-primary">
            Listings
          </button>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{property.title}</span>
        </div>

        {/* Gallery */}
        <Gallery
          images={images}
          title={property.title}
          activeImage={activeImage}
          onSelect={setActiveImage}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />

        {/* Header bar */}
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    'border-0',
                    property.status === 'rent'
                      ? 'bg-emerald-500/95 text-white'
                      : 'bg-amber-500/95 text-white'
                  )}
                >
                  For {property.status === 'rent' ? 'Rent' : 'Sale'}
                </Badge>
                {property.featured && (
                  <Badge className="bg-primary/95 text-primary-foreground border-0">Featured</Badge>
                )}
                {property.premium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    Premium
                  </Badge>
                )}
                {property.verified && (
                  <Badge variant="outline" className="gap-1 border-emerald-500/40 text-emerald-600">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </Badge>
                )}
                {property.furnished && (
                  <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
                    <Sofa className="h-3 w-3" /> Furnished
                  </Badge>
                )}
                <Badge variant="secondary" className="capitalize">{property.type}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{property.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="font-semibold text-foreground">{property.rating}</span>
                  <span>({property.reviews.length} reviews)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-primary" />
                  {formatCompact(property.views)} views
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="rounded-2xl bg-primary/10 px-5 py-3">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {formatPrice(property.price, property.status)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {property.status === 'rent' ? 'per month' : 'listing price'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isFav ? 'default' : 'outline'}
                  onClick={handleFav}
                  className="gap-2"
                >
                  <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
                  {isFav ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleShare} className="gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button
                  variant={inCompare ? 'default' : 'outline'}
                  onClick={handleCompare}
                  className="gap-2"
                >
                  <GitCompare className="h-4 w-4" /> Compare
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content 2-col */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Left column */}
          <div className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="flex w-full flex-wrap h-auto justify-start gap-1 bg-muted/60 p-1 rounded-xl">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({property.reviews.length})</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="mt-5">
                <Card className="rounded-2xl border-border/60 p-6 space-y-4">
                  <h2 className="text-xl font-semibold">About this property</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
                    <DetailStat icon={BedDouble} label="Bedrooms" value={`${property.bedrooms}`} />
                    <DetailStat icon={Bath} label="Bathrooms" value={`${property.bathrooms}`} />
                    <DetailStat icon={Maximize} label="Area" value={`${property.area.toLocaleString()} sqft`} />
                    <DetailStat icon={Car} label="Parking" value={`${property.parking} spots`} />
                  </div>
                </Card>
              </TabsContent>

              {/* Details */}
              <TabsContent value="details" className="mt-5">
                <Card className="rounded-2xl border-border/60 p-6">
                  <h2 className="text-xl font-semibold mb-4">Property details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <DetailCard icon={BedDouble} label="Bedrooms" value={`${property.bedrooms}`} />
                    <DetailCard icon={Bath} label="Bathrooms" value={`${property.bathrooms}`} />
                    <DetailCard icon={Maximize} label="Area" value={`${property.area.toLocaleString()} sqft`} />
                    <DetailCard icon={Car} label="Parking" value={`${property.parking}`} />
                    <DetailCard icon={Building2} label="Floor" value={property.floor ? `Floor ${property.floor}` : 'Ground'} />
                    <DetailCard icon={Calendar} label="Year built" value={`${property.yearBuilt}`} />
                    <DetailCard icon={Compass} label="Facing" value={property.facing || '—'} />
                    <DetailCard icon={Building} label="Balcony" value={property.balcony ? 'Yes' : 'No'} />
                    <DetailCard icon={Sofa} label="Furnished" value={property.furnished ? 'Yes' : 'No'} />
                    <DetailCard icon={CalendarCheck} label="Availability" value={property.availability || 'Immediate'} />
                    <DetailCard icon={Building2} label="Type" value={<span className="capitalize">{property.type}</span>} />
                    <DetailCard icon={MapPin} label="Zip code" value={property.zipCode} />
                  </div>
                </Card>
              </TabsContent>

              {/* Amenities */}
              <TabsContent value="amenities" className="mt-5">
                <Card className="rounded-2xl border-border/60 p-6">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  {property.amenities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {property.amenities.map((a) => (
                        <div
                          key={a}
                          className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2.5 border border-primary/10"
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm font-medium">{a}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No amenities listed.</p>
                  )}
                </Card>
              </TabsContent>

              {/* Location */}
              <TabsContent value="location" className="mt-5">
                <Card className="rounded-2xl border-border/60 p-6 space-y-5">
                  <div>
                    <h2 className="text-xl font-semibold">Location</h2>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {property.address}, {property.city}, {property.state}, {property.country}
                    </p>
                  </div>

                  <MapPlaceholder lat={property.lat} lng={property.lng} city={property.city} />

                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">What's nearby</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {NEARBY.map((n) => (
                        <div
                          key={n.label}
                          className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-secondary/30 p-4 text-center"
                        >
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                            <n.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{n.label}</div>
                            <div className="text-xs text-muted-foreground">{n.distance}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews" className="mt-5">
                <ReviewsSection property={property} onReviewAdded={loadProperty} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column — sticky */}
          <aside className="space-y-5">
            <div className="lg:sticky lg:top-24 space-y-5">
              <AgentCard property={property} />
              <BookingCard
                property={property}
                user={user}
                openAuthModal={openAuthModal}
                addNotification={addNotification}
              />
              {property.status === 'buy' ? (
                <PaymentCard
                  title="Make an offer"
                  description="Reserve this property with a refundable booking fee."
                  amount={250}
                  property={property}
                  addNotification={addNotification}
                />
              ) : (
                <PaymentCard
                  title="Pay deposit"
                  description="Secure this rental with a one-month security deposit."
                  amount={property.price}
                  property={property}
                  addNotification={addNotification}
                />
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

// ---- Gallery ----
function Gallery({
  images,
  title,
  activeImage,
  onSelect,
  onPrev,
  onNext,
}: {
  images: string[]
  title: string
  activeImage: number
  onSelect: (i: number) => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/60 bg-card">
        <Image
          src={images[activeImage]}
          alt={`${title} — image ${activeImage + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1000px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-foreground backdrop-blur-md hover:bg-white shadow-md transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={onNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-foreground backdrop-blur-md hover:bg-white shadow-md transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          {activeImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={cn(
                'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                i === activeImage
                  ? 'border-primary shadow-md scale-[1.03]'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ---- Detail stat (small) ----
function DetailStat({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  )
}

// ---- Detail card (larger) ----
function DetailCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold truncate">{value}</div>
      </div>
    </div>
  )
}

// ---- Map placeholder ----
function MapPlaceholder({ lat, lng, city }: { lat: number; lng: number; city: string }) {
  return (
    <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl border border-border/60">
      {/* Stylized background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Faux roads */}
      <div className="absolute top-1/3 left-0 right-0 h-2 bg-white/60" />
      <div className="absolute top-2/3 left-0 right-0 h-1.5 bg-white/50" />
      <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-white/60" />
      <div className="absolute left-3/4 top-0 bottom-0 w-1.5 bg-white/50" />

      {/* Pulsing marker */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span className="absolute -inset-6 animate-ping rounded-full bg-primary/20" />
          <span className="absolute -inset-3 rounded-full bg-primary/30" />
          <div className="relative grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <MapPin className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Address overlay */}
      <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-background/90 backdrop-blur-md border border-border/60 px-3 py-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium truncate">{city}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ---- Reviews section ----
function ReviewsSection({
  property,
  onReviewAdded,
}: {
  property: Property
  onReviewAdded: () => void
}) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [author, setAuthor] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const reviews = property.reviews
  const avg = property.rating
  const total = reviews.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !comment.trim()) {
      toast.error('Please fill in your name and comment.')
      return
    }
    setSubmitting(true)
    try {
      await api.properties.addReview(property.id, {
        author: author.trim(),
        rating,
        comment: comment.trim(),
      })
      toast.success('Review submitted!', { description: 'Thanks for sharing your feedback.' })
      setAuthor('')
      setComment('')
      setRating(5)
      onReviewAdded()
    } catch (e: any) {
      toast.error('Failed to submit review', { description: e?.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="rounded-2xl border-border/60 p-6 space-y-6">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{avg}</div>
            <div className="mt-1 flex items-center justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3.5 w-3.5',
                    i < Math.round(avg) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/40'
                  )}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Resident reviews</h2>
            <p className="text-sm text-muted-foreground">
              Based on {total} {total === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </div>

      {/* Review list */}
      {reviews.length > 0 ? (
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="flex gap-3 rounded-xl border border-border/60 bg-secondary/30 p-4"
            >
              <Avatar className="h-10 w-10 border border-border/60">
                {r.avatar ? (
                  <AvatarImage src={r.avatar} alt={r.author} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {r.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm">{r.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(r.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < r.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/40'
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No reviews yet. Be the first to share your experience!
        </div>
      )}

      {/* Write a review */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-border/60">
        <h3 className="text-base font-semibold">Write a review</h3>

        <div className="space-y-2">
          <Label>Your rating</Label>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${value} out of 5`}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      'h-6 w-6 transition-colors',
                      value <= (hoverRating || rating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-muted-foreground/40 hover:text-amber-400'
                    )}
                  />
                </button>
              )
            })}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating} / 5
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="review-author">Your name</Label>
          <Input
            id="review-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Jordan Smith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="review-comment">Your review</Label>
          <Textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience living in or visiting this property…"
            rows={3}
          />
        </div>

        <Button type="submit" disabled={submitting} className="gap-2">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Submitting…' : 'Submit review'}
        </Button>
      </form>
    </Card>
  )
}

// ---- Agent card ----
function AgentCard({ property }: { property: Property }) {
  const [contactOpen, setContactOpen] = useState(false)
  const [message, setMessage] = useState('')
  const agent = property.agent

  const handleCall = () => {
    toast.success('Connecting you to agent…', { description: `${agent.name} · ${agent.phone}` })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    toast.success('Message sent!', {
      description: `${agent.name} will get back to you shortly.`,
    })
    setMessage('')
    setContactOpen(false)
  }

  return (
    <Card className="rounded-2xl border-border/60 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-14 w-14 border-2 border-primary/20">
          <AvatarImage src={agent.avatar} alt={agent.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {agent.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold truncate">{agent.name}</h3>
            {agent.verified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
          </div>
          <p className="text-sm text-muted-foreground truncate">{agent.title}</p>
          <p className="text-xs text-muted-foreground">{agent.company}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-secondary/40 p-2">
          <div className="flex items-center justify-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-sm font-bold">{agent.rating}</span>
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Rating</div>
        </div>
        <div className="rounded-lg bg-secondary/40 p-2">
          <div className="text-sm font-bold">{agent.totalSales}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Sales</div>
        </div>
        <div className="rounded-lg bg-secondary/40 p-2">
          <div className="text-sm font-bold text-emerald-600">Verified</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Agent</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Phone className="h-3.5 w-3.5 text-primary" />
        {agent.phone}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Mail className="h-3.5 w-3.5 text-primary" />
        <span className="truncate">{agent.email}</span>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1 gap-2" onClick={() => setContactOpen(true)}>
          <Mail className="h-4 w-4" /> Contact
        </Button>
        <Button variant="outline" className="gap-2" onClick={handleCall}>
          <Phone className="h-4 w-4" /> Call
        </Button>
      </div>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {agent.name}</DialogTitle>
            <DialogDescription>
              Send a quick message about “{property.title}”. The agent typically replies within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="agent-msg">Message</Label>
              <Textarea
                id="agent-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder={`Hi ${agent.name}, I'm interested in "${property.title}". Is it still available?`}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setContactOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// ---- Booking card ----
function BookingCard({
  property,
  user,
  openAuthModal,
  addNotification,
}: {
  property: Property
  user: ReturnType<typeof useAppStore.getState>['user']
  openAuthModal: (m: 'login' | 'register') => void
  addNotification: ReturnType<typeof useAppStore.getState>['addNotification']
}) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string>('')
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const loggedIn = !!user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loggedIn) {
      openAuthModal('login')
      return
    }
    if (!date || !timeSlot || !name || !email || !phone) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    try {
      await api.bookings.create({
        propertyId: property.id,
        userName: name,
        userEmail: email,
        userPhone: phone,
        date: format(date, 'yyyy-MM-dd'),
        timeSlot,
        message: message.trim(),
      })
      toast.success('Visit requested!', {
        description: `${format(date, 'MMM d')} at ${timeSlot}`,
      })
      addNotification({
        title: 'Booking requested',
        body: `Your visit to "${property.title}" on ${format(date, 'MMM d')} at ${timeSlot} is pending confirmation.`,
        type: 'booking',
      })
      setMessage('')
    } catch (e: any) {
      toast.error('Failed to book visit', { description: e?.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="rounded-2xl border-border/60 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <CalendarCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">Book a visit</h3>
          <p className="text-xs text-muted-foreground">Pick a date & time that suits you</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Date picker */}
        <div className="space-y-1.5">
          <Label>Visit date</Label>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start font-normal"
              >
                <Calendar className="h-4 w-4 text-primary" />
                {date ? format(date, 'MMM d, yyyy') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarPicker
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d)
                  setPopoverOpen(false)
                }}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time slot */}
        <div className="space-y-1.5">
          <Label>Time slot</Label>
          <Select value={timeSlot} onValueChange={setTimeSlot}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="bk-name">Name</Label>
            <Input id="bk-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bk-email">Email</Label>
            <Input id="bk-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bk-phone">Phone</Label>
            <Input id="bk-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bk-msg">Message (optional)</Label>
            <Textarea id="bk-msg" rows={2} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Anything we should know?" />
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full gap-2">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Requesting…' : loggedIn ? 'Request visit' : 'Sign in to book'}
        </Button>
      </form>
    </Card>
  )
}

// ---- Payment card ----
function PaymentCard({
  title,
  description,
  amount,
  property,
  addNotification,
}: {
  title: string
  description: string
  amount: number
  property: Property
  addNotification: ReturnType<typeof useAppStore.getState>['addNotification']
}) {
  const [open, setOpen] = useState(false)
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!card || !expiry || !cvc) {
      toast.error('Please complete the card details.')
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    setOpen(false)
    setCard('')
    setExpiry('')
    setCvc('')
    toast.success('Payment processed!', {
      description: `${formatPrice(amount, property.status)} charged successfully.`,
    })
    addNotification({
      title: 'Payment successful',
      body: `Your payment of ${formatPrice(amount, property.status)} for "${property.title}" was processed.`,
      type: 'payment',
    })
  }

  return (
    <Card className="rounded-2xl border-border/60 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500/15 text-amber-600">
          <CreditCard className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-3">
        <span className="text-sm text-muted-foreground">Amount due</span>
        <span className="text-lg font-bold text-amber-600">{formatPrice(amount, property.status)}</span>
      </div>
      <Button
        variant="outline"
        className="w-full gap-2 border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
        onClick={() => setOpen(true)}
      >
        <CreditCard className="h-4 w-4" /> Pay now
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Secure payment</DialogTitle>
            <DialogDescription>
              You're about to pay {formatPrice(amount, property.status)} for “{property.title}”.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="card-num">Card number</Label>
              <Input
                id="card-num"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="card-exp">Expiry</Label>
                <Input id="card-exp" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM / YY" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="card-cvc">CVC</Label>
                <Input id="card-cvc" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" inputMode="numeric" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Payments are encrypted & secure. This is a demo — no real charge is made.
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Processing…' : `Pay ${formatPrice(amount, property.status)}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// ---- Skeleton ----
function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-background to-background pb-20">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Skeleton className="h-5 w-64 mb-4" />
        <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
        <div className="mt-6 flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-16 w-40 rounded-2xl" />
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
