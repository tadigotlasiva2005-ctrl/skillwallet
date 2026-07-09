'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export type StatusFilter = 'all' | 'rent' | 'buy'

export interface ListingFilters {
  search: string
  status: StatusFilter
  type: string // 'all' or specific
  minPrice: number
  maxPrice: number
  bedrooms: number | null // null = any, else "X+"
  bathrooms: number | null
  furnished: boolean
  parking: boolean
  featured: boolean
  premium: boolean
  sort: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'rating' | 'featured'
}

export const DEFAULT_FILTERS: ListingFilters = {
  search: '',
  status: 'all',
  type: 'all',
  minPrice: 0,
  maxPrice: 5000000,
  bedrooms: null,
  bathrooms: null,
  furnished: false,
  parking: false,
  featured: false,
  premium: false,
  sort: 'newest',
}

const PROPERTY_TYPES = [
  'House',
  'Apartment',
  'Villa',
  'Condo',
  'Penthouse',
  'Studio',
  'Townhouse',
  'Cottage',
]

const BEDROOM_OPTIONS = [
  { label: 'Any', value: null },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
  { label: '5+', value: 5 },
]

const BATHROOM_OPTIONS = [
  { label: 'Any', value: null },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
]

function formatMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return `$${n}`
}

interface FilterPanelProps {
  filters: ListingFilters
  onChange: (next: ListingFilters) => void
  onClear: () => void
  className?: string
  onApplied?: () => void
}

export function FilterPanel({ filters, onChange, onClear, className, onApplied }: FilterPanelProps) {
  const set = <K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) =>
    onChange({ ...filters, [key]: value })

  const isRent = filters.status === 'rent'
  const priceMax = isRent ? 10000 : 5000000
  // Clamp the slider range when status switches
  const safeMin = Math.min(filters.minPrice, priceMax)
  const safeMax = Math.min(Math.max(filters.maxPrice, safeMin + 1), priceMax)

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'rent', label: 'Rent' },
    { value: 'buy', label: 'Buy' },
  ]

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.type !== 'all' ? 1 : 0) +
    (safeMin > 0 || safeMax < priceMax ? 1 : 0) +
    (filters.bedrooms !== null ? 1 : 0) +
    (filters.bathrooms !== null ? 1 : 0) +
    (filters.furnished ? 1 : 0) +
    (filters.parking ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.premium ? 1 : 0)

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">Filters</h3>
          {activeCount > 0 && (
            <Badge className="bg-primary/10 text-primary border-0">{activeCount} active</Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-7 text-xs text-muted-foreground hover:text-foreground">
            <X className="mr-1 h-3 w-3" /> Clear all
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="filter-search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="filter-search"
            placeholder="Title, city, address…"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Separator />

      {/* Status */}
      <div className="space-y-2">
        <Label>Listing status</Label>
        <div className="grid grid-cols-3 gap-2">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                const next = { ...filters, status: opt.value }
                // reset price range when switching rent/buy to keep slider sane
                if (opt.value === 'rent') {
                  next.minPrice = 0
                  next.maxPrice = 10000
                } else if (opt.value === 'buy') {
                  next.minPrice = 0
                  next.maxPrice = 5000000
                }
                onChange(next)
              }}
              className={cn(
                'h-9 rounded-md border text-sm font-medium transition-all',
                filters.status === opt.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background hover:bg-accent border-input'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label>Property type</Label>
        <Select value={filters.type} onValueChange={(v) => set('type', v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {PROPERTY_TYPES.map((t) => (
              <SelectItem key={t} value={t.toLowerCase()}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Price range</Label>
          <span className="text-xs text-muted-foreground">
            {isRent ? 'monthly rent' : 'sale price'}
          </span>
        </div>
        <Slider
          min={0}
          max={priceMax}
          step={isRent ? 100 : 25000}
          value={[safeMin, safeMax]}
          onValueChange={(vals) => {
            if (Array.isArray(vals) && vals.length === 2) {
              onChange({ ...filters, minPrice: vals[0], maxPrice: vals[1] })
            }
          }}
        />
        <div className="flex items-center justify-between gap-2">
          <Input
            type="number"
            value={safeMin}
            min={0}
            max={priceMax}
            onChange={(e) => set('minPrice', Math.max(0, Number(e.target.value) || 0))}
            className="h-8 text-xs"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            type="number"
            value={safeMax}
            min={0}
            max={priceMax}
            onChange={(e) => set('maxPrice', Math.min(priceMax, Number(e.target.value) || 0))}
            className="h-8 text-xs"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatMoney(safeMin)}</span>
          <span>{formatMoney(safeMax)}{safeMax >= priceMax ? '+' : ''}</span>
        </div>
      </div>

      <Separator />

      {/* Bedrooms */}
      <div className="space-y-2">
        <Label>Bedrooms</Label>
        <div className="grid grid-cols-6 gap-1.5">
          {BEDROOM_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => set('bedrooms', opt.value)}
              className={cn(
                'h-8 rounded-md border text-xs font-medium transition-all',
                filters.bedrooms === opt.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background hover:bg-accent border-input'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="space-y-2">
        <Label>Bathrooms</Label>
        <div className="grid grid-cols-5 gap-1.5">
          {BATHROOM_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => set('bathrooms', opt.value)}
              className={cn(
                'h-8 rounded-md border text-xs font-medium transition-all',
                filters.bathrooms === opt.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background hover:bg-accent border-input'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Toggles */}
      <div className="space-y-3">
        <ToggleRow
          label="Furnished only"
          description="Move-in ready homes"
          checked={filters.furnished}
          onChange={(v) => set('furnished', v)}
        />
        <ToggleRow
          label="Parking included"
          description="At least 1 parking spot"
          checked={filters.parking}
          onChange={(v) => set('parking', v)}
        />
        <ToggleRow
          label="Featured only"
          description="Handpicked by our team"
          checked={filters.featured}
          onChange={(v) => set('featured', v)}
        />
        <ToggleRow
          label="Premium only"
          description="Top-tier luxury listings"
          checked={filters.premium}
          onChange={(v) => set('premium', v)}
        />
      </div>

      {onApplied && (
        <Button onClick={onApplied} className="w-full lg:hidden">
          Show results
        </Button>
      )}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="space-y-0.5">
        <p className="text-sm font-medium leading-tight">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  )
}
