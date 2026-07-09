import type { Property, PaginatedResponse, Agent, Review } from './types'

// HouseHunt API client — typed wrappers around fetch
const BASE = '/api'

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

export interface PropertyFilters {
  search?: string
  city?: string
  status?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  furnished?: boolean
  parking?: boolean
  featured?: boolean
  premium?: boolean
  sort?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'rating' | 'featured'
  page?: number
  limit?: number
}

function qs(filters: PropertyFilters): string {
  const p = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) p.set(k, String(v))
  })
  return p.toString()
}

export const api = {
  properties: {
    list: (filters: PropertyFilters = {}) =>
      http<PaginatedResponse<Property>>(`${BASE}/properties?${qs(filters)}`),
    get: (id: string) => http<Property>(`${BASE}/properties/${id}`),
    addReview: (id: string, body: { author: string; avatar?: string; rating: number; comment: string }) =>
      http<Review>(`${BASE}/properties/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
  agents: {
    list: () => http<Agent[]>(`${BASE}/agents`),
  },
  contact: {
    submit: (body: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
      http<{ success: boolean }>(`${BASE}/contact`, { method: 'POST', body: JSON.stringify(body) }),
  },
  newsletter: {
    subscribe: (email: string) =>
      http<{ success: boolean }>(`${BASE}/newsletter`, { method: 'POST', body: JSON.stringify({ email }) }),
  },
  stats: {
    get: () =>
      http<{
        totals: Record<string, number>
        breakdown: Record<string, number>
        cities: { city: string; count: number }[]
        types: { type: string; count: number }[]
        topProperties: any[]
      }>(`${BASE}/stats`),
  },
  bookings: {
    list: (userEmail?: string) =>
      http<{ data: any[]; total: number }>(`${BASE}/bookings${userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : ''}`),
    create: (body: any) =>
      http<any>(`${BASE}/bookings`, { method: 'POST', body: JSON.stringify(body) }),
    updateStatus: (id: string, status: string) =>
      http<any>(`${BASE}/bookings`, { method: 'PATCH', body: JSON.stringify({ id, status }) }),
  },
  auth: {
    login: (email: string, password: string, role?: string) =>
      http<{ user: any; token: string }>(`${BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      }),
    register: (body: { name: string; email: string; password: string; role?: string }) =>
      http<{ user: any; token: string }>(`${BASE}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
}

// Helper to format price (rent = /mo, buy = total)
export function formatPrice(price: number, status: string): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
  return status === 'rent' ? `${formatted}/mo` : formatted
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}
