'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Property } from './types'

// ---- Navigation routes (simulated multi-page SPA) ----
export type Route =
  | { name: 'home' }
  | { name: 'listings' }
  | { name: 'details'; id: string }
  | { name: 'favorites' }
  | { name: 'compare' }
  | { name: 'dashboard'; tab?: string }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'faq' }
  | { name: 'pricing' }
  | { name: 'services' }
  | { name: 'agents' }
  | { name: 'login' }
  | { name: 'register' }
  | { name: 'not-found' }

export type UserRole = 'guest' | 'user' | 'owner' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  phone: string
  joinedAt: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'agent'
  text: string
  time: string
}

export interface AppNotification {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  type: 'booking' | 'message' | 'system' | 'payment'
}

interface AppState {
  // Navigation
  route: Route
  navigate: (route: Route) => void

  // Auth
  user: AuthUser | null
  token: string | null
  login: (user: AuthUser, token: string) => void
  logout: () => void
  setRole: (role: UserRole) => void

  // Favorites (persisted)
  favorites: string[] // property ids
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean

  // Compare list (persisted, max 4)
  compare: string[]
  toggleCompare: (id: string) => void
  clearCompare: () => void

  // Recently viewed (persisted, max 8)
  recentlyViewed: string[]
  addRecentlyViewed: (id: string) => void

  // Search filters (transient — kept in memory across listing view)
  searchQuery: string
  setSearchQuery: (q: string) => void

  // Notifications
  notifications: AppNotification[]
  unreadCount: number
  markAllRead: () => void
  addNotification: (n: Omit<AppNotification, 'id' | 'time' | 'read'>) => void

  // Chat (mock real-time)
  chatOpen: boolean
  chatMessages: ChatMessage[]
  setChatOpen: (open: boolean) => void
  sendChatMessage: (text: string) => void

  // Auth modal
  authModalOpen: boolean
  authModalMode: 'login' | 'register'
  openAuthModal: (mode: 'login' | 'register') => void
  closeAuthModal: () => void
}

const seedNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Booking Confirmed',
    body: 'Your visit to Modern Infinity Villa is approved for Sat, 10:00 AM.',
    time: '2m ago',
    read: false,
    type: 'booking',
  },
  {
    id: 'n2',
    title: 'New Message',
    body: 'Sophia Bennett replied to your inquiry about the penthouse.',
    time: '1h ago',
    read: false,
    type: 'message',
  },
  {
    id: 'n3',
    title: 'Price Drop Alert',
    body: 'A property on your wishlist just dropped by 8%.',
    time: '3h ago',
    read: false,
    type: 'system',
  },
  {
    id: 'n4',
    title: 'Payment Receipt',
    body: 'Your booking fee of $250 was processed successfully.',
    time: '1d ago',
    read: true,
    type: 'payment',
  },
]

const seedChat: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'agent',
    text: "Hi there! 👋 I'm Sophia, your HouseHunt assistant. How can I help you find your dream home today?",
    time: 'Just now',
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      route: { name: 'home' },
      navigate: (route) => {
        set({ route })
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
      },

      // Auth
      user: null,
      token: null,
      login: (user, token) => {
        set({ user, token, authModalOpen: false })
        get().addNotification({
          title: 'Welcome back!',
          body: `You're signed in as ${user.name}.`,
          type: 'system',
        })
      },
      logout: () => set({ user: null, token: null, route: { name: 'home' } }),
      setRole: (role) => {
        const u = get().user
        if (u) set({ user: { ...u, role } })
      },

      // Favorites
      favorites: [],
      toggleFavorite: (id) => {
        const favs = get().favorites
        set({ favorites: favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id] })
      },
      isFavorite: (id) => get().favorites.includes(id),

      // Compare
      compare: [],
      toggleCompare: (id) => {
        const cmp = get().compare
        if (cmp.includes(id)) {
          set({ compare: cmp.filter((c) => c !== id) })
        } else if (cmp.length < 4) {
          set({ compare: [...cmp, id] })
        }
      },
      clearCompare: () => set({ compare: [] }),

      // Recently viewed
      recentlyViewed: [],
      addRecentlyViewed: (id) => {
        const rv = get().recentlyViewed.filter((r) => r !== id)
        set({ recentlyViewed: [id, ...rv].slice(0, 8) })
      },

      // Search
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      // Notifications
      notifications: seedNotifications,
      unreadCount: 3,
      markAllRead: () =>
        set({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }),
      addNotification: (n) =>
        set({
          notifications: [
            { ...n, id: `n_${Date.now()}`, time: 'Just now', read: false },
            ...get().notifications,
          ],
          unreadCount: get().unreadCount + 1,
        }),

      // Chat
      chatOpen: false,
      chatMessages: seedChat,
      setChatOpen: (open) => set({ chatOpen: open }),
      sendChatMessage: (text) => {
        const userMsg: ChatMessage = {
          id: `m_${Date.now()}`,
          sender: 'user',
          text,
          time: 'Just now',
        }
        set({ chatMessages: [...get().chatMessages, userMsg] })
        // Simulated agent reply
        setTimeout(() => {
          const replies = [
            "Great choice! I'd be happy to help with that. Could you share your preferred city and budget?",
            'Absolutely — I have several properties that match. Would you like to schedule a visit?',
            "That's a popular area right now. Let me pull up the best options for you.",
            'No problem! I can arrange a virtual tour or an in-person visit whenever suits you.',
          ]
          const reply: ChatMessage = {
            id: `m_${Date.now()}_a`,
            sender: 'agent',
            text: replies[Math.floor(Math.random() * replies.length)],
            time: 'Just now',
          }
          set({ chatMessages: [...get().chatMessages, reply] })
        }, 1200)
      },

      // Auth modal
      authModalOpen: false,
      authModalMode: 'login',
      openAuthModal: (mode) => set({ authModalOpen: true, authModalMode: mode }),
      closeAuthModal: () => set({ authModalOpen: false }),
    }),
    {
      name: 'househunt-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        compare: state.compare,
        recentlyViewed: state.recentlyViewed,
        user: state.user,
        token: state.token,
      }),
    }
  )
)
