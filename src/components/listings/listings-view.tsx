'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { PropertyCard } from '@/components/property-card'
import { PropertyGridSkeleton } from '@/components/shared/skeletons'
import { EmptyState } from '@/components/shared/empty-state'
import { SectionHeading } from '@/components/shared/section-heading'
import { useAppStore } from '@/lib/store'
import { api, formatPrice } from '@/lib/api'
import type { Property } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  FilterPanel,
  DEFAULT_FILTERS,
  type ListingFilters,
} from './filter-panel'

type ViewMode = 'grid' | 'list'
type SortOption = ListingFilters['sort']

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  'price-low': 'Price: Low to High',
  'price-high': 'Price: High to Low',
  rating: 'Top rated',
  featured: 'Featured first',
}

const PAGE_SIZE = 9

export function ListingsView() {
  const searchQuery = useAppStore((s) => s.searchQuery)
  const setSearchQuery = useAppStore((s) => s.setSearchQuery)
  const navigate = useAppStore((s) => s.navigate)

  // Initialise filters from the global search query (one-shot)
  const [filters, setFilters] = useState<ListingFilters>(() => ({
    ...DEFAULT_FILTERS,
    search: searchQuery || '',
  }))
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery || '')
  const [page, setPage] = useState(1)
  const [view, setView] = useState<ViewMode>('grid')
  const [sheetOpen, setSheetOpen] = useState(false)

  const [data, setData] = useState<{
    properties: Property[]
    total: number
    totalPages: number
  }>({ properties: [], total: 0, totalPages: 1 })
  const [fetchedSig, setFetchedSig] = useState<string>('')
  const resultsRef = useRef<HTMLDivElement>(null)

  // Clear the consumed searchQuery from the store (Zustand setter — safe)
  useEffect(() => {
    if (searchQuery) setSearchQuery('')
  }, [searchQuery, setSearchQuery])

  // Debounce search input (300ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(filters.search)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [filters.search])

  // Compute a signature for the current request so we can derive loading
  // without calling setState synchronously inside the fetch effect.
  const currentSig = useMemo(
    () =>
      JSON.stringify({
        s: debouncedSearch,
        st: filters.status,
        t: filters.type,
        min: filters.minPrice,
        max: filters.maxPrice,
        bed: filters.bedrooms,
        bath: filters.bathrooms,
        fur: filters.furnished,
        par: filters.parking,
        fea: filters.featured,
        pre: filters.premium,
        sort: filters.sort,
        page,
      }),
    [
      debouncedSearch,
      filters.status,
      filters.type,
      filters.minPrice,
      filters.maxPrice,
      filters.bedrooms,
      filters.bathrooms,
      filters.furnished,
      filters.parking,
      filters.featured,
      filters.premium,
      filters.sort,
      page,
    ]
  )

  const loading = currentSig !== fetchedSig

  // Fetch whenever the request signature changes
  useEffect(() => {
    let cancelled = false
    const apiFilters: Parameters<typeof api.properties.list>[0] = {
      search: debouncedSearch || undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
      type: filters.type !== 'all' ? filters.type : undefined,
      minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
      maxPrice:
        filters.maxPrice > 0 &&
        filters.maxPrice < (filters.status === 'rent' ? 10000 : 5000000)
          ? filters.maxPrice
          : undefined,
      bedrooms: filters.bedrooms ?? undefined,
      bathrooms: filters.bathrooms ?? undefined,
      furnished: filters.furnished || undefined,
      parking: filters.parking || undefined,
      featured: filters.featured || undefined,
      premium: filters.premium || undefined,
      sort: filters.sort,
      page,
      limit: PAGE_SIZE,
    }
    api.properties
      .list(apiFilters)
      .then((res) => {
        if (cancelled) return
        setData({
          properties: res.data,
          total: res.total,
          totalPages: res.totalPages || 1,
        })
        setFetchedSig(currentSig)
      })
      .catch(() => {
        if (cancelled) return
        setData({ properties: [], total: 0, totalPages: 1 })
        setFetchedSig(currentSig)
      })
    return () => {
      cancelled = true
    }
  }, [currentSig, debouncedSearch, filters, page])

  // Scroll to top of results when page changes
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [page])

  const clearFilters = () => {
    setFilters({ ...DEFAULT_FILTERS })
    setDebouncedSearch('')
    setPage(1)
  }

  const handlePageChange = (next: number) => {
    if (next < 1 || next > data.totalPages) return
    setPage(next)
  }

  const pageNumbers = useMemo(() => {
    const arr: (number | '…')[] = []
    const add = (n: number) => arr.push(n)
    if (data.totalPages <= 7) {
      for (let i = 1; i <= data.totalPages; i++) add(i)
    } else {
      add(1)
      if (page > 3) arr.push('…')
      const start = Math.max(2, page - 1)
      const end = Math.min(data.totalPages - 1, page + 1)
      for (let i = start; i <= end; i++) add(i)
      if (page < data.totalPages - 2) arr.push('…')
      add(data.totalPages)
    }
    return arr
  }, [page, data.totalPages])

  const showEmpty = !loading && data.properties.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-background to-background pb-16">
      {/* Page header */}
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <SectionHeading
            align="left"
            eyebrow="Browse"
            title="Find your place"
            description="Search through our verified listings with powerful filters — refine by price, rooms, amenities, and more."
          />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Card className="rounded-2xl border-border/60 bg-card p-5">
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onClear={clearFilters}
                />
              </Card>
            </div>
          </aside>

          {/* Results */}
          <div ref={resultsRef} className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2">
                      <SlidersHorizontal className="h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:max-w-[340px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filter properties</SheetTitle>
                    </SheetHeader>
                    <div className="px-4 pb-6">
                      <FilterPanel
                        filters={filters}
                        onChange={setFilters}
                        onClear={clearFilters}
                        onApplied={() => setSheetOpen(false)}
                      />
                      <SheetClose className="hidden" />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="text-sm text-muted-foreground">
                  {loading ? (
                    <span className="animate-pulse">Loading…</span>
                  ) : (
                    <span>
                      Showing <span className="font-semibold text-foreground">{data.properties.length}</span> of{' '}
                      <span className="font-semibold text-foreground">{data.total}</span> properties
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <Select
                  value={filters.sort}
                  onValueChange={(v) => setFilters({ ...filters, sort: v as SortOption })}
                >
                  <SelectTrigger size="sm" className="w-[170px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(SORT_LABELS) as SortOption[]).map((k) => (
                      <SelectItem key={k} value={k}>
                        {SORT_LABELS[k]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View toggle */}
                <div className="hidden sm:flex items-center rounded-md border border-input bg-background p-0.5">
                  <button
                    aria-label="Grid view"
                    onClick={() => setView('grid')}
                    className={cn(
                      'grid h-7 w-7 place-items-center rounded transition-colors',
                      view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="List view"
                    onClick={() => setView('list')}
                    className={cn(
                      'grid h-7 w-7 place-items-center rounded transition-colors',
                      view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                    )}
                  >
                    <ListIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Active filter chips */}
            <ActiveFilterChips filters={filters} onRemove={(key) => {
              if (key === 'search') setFilters({ ...filters, search: '' })
              else if (key === 'status') setFilters({ ...filters, status: 'all' })
              else if (key === 'type') setFilters({ ...filters, type: 'all' })
              else if (key === 'bedrooms') setFilters({ ...filters, bedrooms: null })
              else if (key === 'bathrooms') setFilters({ ...filters, bathrooms: null })
              else if (key === 'furnished') setFilters({ ...filters, furnished: false })
              else if (key === 'parking') setFilters({ ...filters, parking: false })
              else if (key === 'featured') setFilters({ ...filters, featured: false })
              else if (key === 'premium') setFilters({ ...filters, premium: false })
              setPage(1)
            }} />

            {/* Results grid / list / skeleton / empty */}
            {loading ? (
              <PropertyGridSkeleton count={6} className={view === 'list' ? 'grid-cols-1' : ''} />
            ) : showEmpty ? (
              <EmptyState
                icon={Search}
                title="No properties found"
                description="Try adjusting your filters or broaden your search to see more results."
                action={
                  <Button onClick={clearFilters} className="gap-2">
                    Clear filters
                  </Button>
                }
              />
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.properties.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {data.properties.map((p, i) => (
                  <PropertyListItem key={p.id} property={p} index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && data.totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <nav className="flex items-center gap-1" aria-label="Pagination">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  {pageNumbers.map((n, i) =>
                    n === '…' ? (
                      <span key={`e${i}`} className="px-2 text-muted-foreground">
                        …
                      </span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => handlePageChange(n)}
                        aria-current={n === page ? 'page' : undefined}
                        className={cn(
                          'h-9 min-w-9 px-3 rounded-md text-sm font-medium transition-all',
                          n === page
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'border border-input bg-background hover:bg-accent'
                        )}
                      >
                        {n}
                      </button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === data.totalPages}
                    className="gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- Active filter chips ----
function ActiveFilterChips({
  filters,
  onRemove,
}: {
  filters: ListingFilters
  onRemove: (key: keyof ListingFilters | string) => void
}) {
  const chips: { key: string; label: string }[] = []
  if (filters.search) chips.push({ key: 'search', label: `“${filters.search}”` })
  if (filters.status !== 'all') chips.push({ key: 'status', label: filters.status === 'rent' ? 'For Rent' : 'For Sale' })
  if (filters.type !== 'all') chips.push({ key: 'type', label: filters.type.charAt(0).toUpperCase() + filters.type.slice(1) })
  if (filters.bedrooms !== null) chips.push({ key: 'bedrooms', label: `${filters.bedrooms}+ beds` })
  if (filters.bathrooms !== null) chips.push({ key: 'bathrooms', label: `${filters.bathrooms}+ baths` })
  if (filters.furnished) chips.push({ key: 'furnished', label: 'Furnished' })
  if (filters.parking) chips.push({ key: 'parking', label: 'Parking' })
  if (filters.featured) chips.push({ key: 'featured', label: 'Featured' })
  if (filters.premium) chips.push({ key: 'premium', label: 'Premium' })

  if (chips.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <Badge
          key={c.key}
          variant="secondary"
          className="gap-1 rounded-full bg-primary/10 text-primary pl-3 pr-1.5 py-1"
        >
          {c.label}
          <button
            onClick={() => onRemove(c.key)}
            aria-label={`Remove ${c.label}`}
            className="grid h-4 w-4 place-items-center rounded-full hover:bg-primary/20"
          >
            <span className="text-xs leading-none">×</span>
          </button>
        </Badge>
      ))}
    </div>
  )
}

// ---- List view item ----
function PropertyListItem({ property, index }: { property: Property; index: number }) {
  const navigate = useAppStore((s) => s.navigate)
  const addRecentlyViewed = useAppStore((s) => s.addRecentlyViewed)
  const open = () => {
    addRecentlyViewed(property.id)
    navigate({ name: 'details', id: property.id })
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.2) }}
    >
      <Card
        onClick={open}
        className="overflow-hidden rounded-2xl border-border/60 bg-card p-0 cursor-pointer transition-all hover:shadow-glow hover:-translate-y-0.5 flex flex-col sm:flex-row"
      >
        <div className="relative sm:w-72 h-48 sm:h-auto shrink-0 overflow-hidden">
          <img
            src={property.images[0] || '/properties/prop1.png'}
            alt={property.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge
              className={cn(
                'border-0 shadow-md text-xs font-semibold',
                property.status === 'rent'
                  ? 'bg-emerald-500/95 text-white'
                  : 'bg-amber-500/95 text-white'
              )}
            >
              For {property.status === 'rent' ? 'Rent' : 'Sale'}
            </Badge>
          </div>
        </div>
        <div className="flex-1 p-5 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors">
                {property.title}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {property.address}, {property.city}, {property.state}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-bold text-primary">
                {formatPrice(property.price, property.status)}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
          <div className="mt-auto flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/60">
            <span><span className="font-semibold text-foreground">{property.bedrooms}</span> beds</span>
            <span><span className="font-semibold text-foreground">{property.bathrooms}</span> baths</span>
            <span><span className="font-semibold text-foreground">{property.area.toLocaleString()}</span> sqft</span>
            <span className="ml-auto flex items-center gap-1 text-amber-500">
              ★ <span className="font-semibold">{property.rating}</span>
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Re-export for convenience
export { FilterPanel }
