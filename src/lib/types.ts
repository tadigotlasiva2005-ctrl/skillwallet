// HouseHunt - Shared TypeScript types

export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  title: string
  company: string
  rating: number
  totalSales: number
  verified: boolean
}

export interface Review {
  id: string
  propertyId: string
  author: string
  avatar: string
  rating: number
  comment: string
  date: string
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  type: string
  status: string // 'rent' | 'buy'
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  furnished: boolean
  floor: number
  balcony: boolean
  yearBuilt: number
  facing: string
  amenities: string[] // parsed from CSV
  images: string[] // parsed from CSV
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  lat: number
  lng: number
  featured: boolean
  premium: boolean
  verified: boolean
  availability: string
  rating: number
  views: number
  createdAt: string
  agent: Agent
  reviews: Review[]
}

export interface PropertyFilters {
  search?: string
  city?: string
  status?: string // 'rent' | 'buy' | 'all'
  type?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  furnished?: boolean
  parking?: boolean
  sort?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'rating' | 'featured'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Helper to transform a raw DB property row into the API shape
export function transformProperty(row: any): Property {
  return {
    ...row,
    amenities: row.amenities ? row.amenities.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    images: row.images ? row.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    agent: row.agent,
    reviews: (row.reviews || []).map((r: any) => ({ ...r, date: r.date.toISOString ? r.date.toISOString() : r.date })),
    createdAt: row.createdAt.toISOString ? row.createdAt.toISOString() : row.createdAt,
  }
}
