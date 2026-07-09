'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Heart,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  Bell,
  UserCog,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  Download,
  Send,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PropertyCard } from '@/components/property-card'
import { EmptyState } from '@/components/shared/empty-state'
import { PropertyGridSkeleton } from '@/components/shared/skeletons'
import { DashboardShell, StatCard, PanelCard, type DashboardTab } from './dashboard-shell'
import { useAppStore } from '@/lib/store'
import { api, formatPrice } from '@/lib/api'
import type { Property } from '@/lib/types'
import { cn } from '@/lib/utils'

const TABS: DashboardTab[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'saved', label: 'Saved Properties', icon: Heart },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: UserCog },
]

interface Booking {
  id: string
  propertyId: string
  propertyTitle: string
  propertyImage: string
  city: string
  userName: string
  userEmail: string
  userPhone: string
  date: string
  timeSlot: string
  message: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  createdAt: string
}

interface MockPayment {
  id: string
  date: string
  property: string
  amount: number
  status: 'Paid' | 'Pending' | 'Refunded'
  method: string
  invoice: string
}

interface ChatThread {
  id: string
  name: string
  avatar: string
  role: string
  preview: string
  time: string
  unread: number
  messages: { sender: 'user' | 'them'; text: string; time: string }[]
}

const MOCK_PAYMENTS: MockPayment[] = [
  { id: 'p1', date: '2024-11-12', property: 'Modern Infinity Villa', amount: 250, status: 'Paid', method: 'Visa •••• 4242', invoice: 'INV-2024-0192' },
  { id: 'p2', date: '2024-10-28', property: 'Skyline Penthouse Suite', amount: 4800, status: 'Paid', method: 'Visa •••• 4242', invoice: 'INV-2024-0178' },
  { id: 'p3', date: '2024-10-04', property: 'Garden View Apartment', amount: 1800, status: 'Paid', method: 'Mastercard •••• 5512', invoice: 'INV-2024-0163' },
  { id: 'p4', date: '2024-09-19', property: 'Cozy Downtown Studio', amount: 950, status: 'Refunded', method: 'Visa •••• 4242', invoice: 'INV-2024-0148' },
  { id: 'p5', date: '2024-09-02', property: 'Seaside Luxury Retreat', amount: 250, status: 'Pending', method: 'Amex •••• 1007', invoice: 'INV-2024-0131' },
]

const MOCK_THREADS: ChatThread[] = [
  {
    id: 't1',
    name: 'Sophia Bennett',
    avatar: '/agents/agent1.png',
    role: 'Listing Agent · Skyline Penthouse',
    preview: "Great! I'll send over the lease agreement today.",
    time: '2m ago',
    unread: 2,
    messages: [
      { sender: 'them', text: "Hi! Thanks for your interest in the penthouse.", time: '10:01 AM' },
      { sender: 'user', text: "Yes, I'd love to schedule a tour this weekend.", time: '10:03 AM' },
      { sender: 'them', text: "Saturday 10am works perfectly. I'll book it for you.", time: '10:05 AM' },
      { sender: 'them', text: "Great! I'll send over the lease agreement today.", time: '10:06 AM' },
    ],
  },
  {
    id: 't2',
    name: 'Marcus Lee',
    avatar: '/agents/agent2.png',
    role: 'Listing Agent · Garden View Apartment',
    preview: 'The deposit can be paid in two installments.',
    time: '3h ago',
    unread: 0,
    messages: [
      { sender: 'user', text: "Hi Marcus, is the deposit refundable?", time: 'Yesterday' },
      { sender: 'them', text: "Yes, fully refundable within 30 days of move-out.", time: 'Yesterday' },
      { sender: 'user', text: "Can I split it into two payments?", time: 'Today' },
      { sender: 'them', text: "The deposit can be paid in two installments.", time: 'Today' },
    ],
  },
  {
    id: 't3',
    name: 'Priya Sharma',
    avatar: '/agents/agent3.png',
    role: 'Listing Agent · Seaside Luxury Retreat',
    preview: 'Would you like to add a virtual tour as well?',
    time: '1d ago',
    unread: 1,
    messages: [
      { sender: 'them', text: "Hello! I noticed you favorited the Seaside Retreat.", time: '1d ago' },
      { sender: 'them', text: "Would you like to add a virtual tour as well?", time: '1d ago' },
    ],
  },
]

const BOOKING_STATUS_CLASS: Record<Booking['status'], string> = {
  pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  approved: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  rejected: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  completed: 'bg-primary/15 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
}

export default function UserDashboard() {
  const route = useAppStore((s) => s.route)
  const navigate = useAppStore((s) => s.navigate)
  const user = useAppStore((s) => s.user)
  const favorites = useAppStore((s) => s.favorites)
  const recentlyViewed = useAppStore((s) => s.recentlyViewed)
  const notifications = useAppStore((s) => s.notifications)
  const markAllRead = useAppStore((s) => s.markAllRead)
  const addNotification = useAppStore((s) => s.addNotification)

  const initialTab =
    route.name === 'dashboard' && route.tab && TABS.some((t) => t.id === route.tab)
      ? route.tab
      : 'overview'
  const [activeTab, setActiveTab] = React.useState(initialTab)

  // Sync tab when route.tab changes (e.g., from header notification bell)
  React.useEffect(() => {
    if (route.name === 'dashboard' && route.tab && route.tab !== activeTab) {
      setActiveTab(route.tab)
    }
  }, [route])

  // ---------- Data fetching ----------
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [bookingsSig, setBookingsSig] = React.useState<string>('')
  const userEmail = user?.email ?? ''
  const currentBookingsSig = `b_${userEmail}`
  const bookingsLoading = currentBookingsSig !== bookingsSig
  React.useEffect(() => {
    if (!userEmail) return
    let cancelled = false
    api.bookings.list(userEmail).then((res) => {
      if (!cancelled) {
        setBookings(res.data as Booking[])
        setBookingsSig(currentBookingsSig)
      }
    }).catch(() => {
      if (!cancelled) {
        setBookings([])
        setBookingsSig(currentBookingsSig)
      }
    })
    return () => {
      cancelled = true
    }
  }, [currentBookingsSig])

  // Saved properties fetch
  const [savedProps, setSavedProps] = React.useState<Property[]>([])
  const [savedSig, setSavedSig] = React.useState<string>('')
  const currentSavedSig = `s_${favorites.join('|')}`
  const savedLoading = currentSavedSig !== savedSig
  React.useEffect(() => {
    if (favorites.length === 0) {
      setSavedProps([])
      setSavedSig(currentSavedSig)
      return
    }
    let cancelled = false
    Promise.all(
      favorites.map((id) => api.properties.get(id).catch(() => null))
    ).then((arr) => {
      if (!cancelled) {
        setSavedProps(arr.filter(Boolean) as Property[])
        setSavedSig(currentSavedSig)
      }
    })
    return () => {
      cancelled = true
    }
  }, [currentSavedSig])

  // Recently viewed fetch (top 4)
  const [recentProps, setRecentProps] = React.useState<Property[]>([])
  const [recentSig, setRecentSig] = React.useState<string>('')
  const recentIds = recentlyViewed.slice(0, 4)
  const currentRecentSig = `r_${recentIds.join('|')}`
  const recentLoading = currentRecentSig !== recentSig
  React.useEffect(() => {
    if (recentIds.length === 0) {
      setRecentProps([])
      setRecentSig(currentRecentSig)
      return
    }
    let cancelled = false
    Promise.all(
      recentIds.map((id) => api.properties.get(id).catch(() => null))
    ).then((arr) => {
      if (!cancelled) {
        setRecentProps(arr.filter(Boolean) as Property[])
        setRecentSig(currentRecentSig)
      }
    })
    return () => {
      cancelled = true
    }
  }, [currentRecentSig])

  // ---------- Actions ----------
  const cancelBooking = async (b: Booking) => {
    try {
      await api.bookings.updateStatus(b.id, 'cancelled')
      setBookings((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, status: 'cancelled' } : x))
      )
      addNotification({
        title: 'Booking cancelled',
        body: `Your visit to ${b.propertyTitle} was cancelled.`,
        type: 'booking',
      })
      toast.success('Booking cancelled', { description: b.propertyTitle })
    } catch (e: any) {
      toast.error('Failed to cancel booking', { description: e.message })
    }
  }

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'rejected')
  const totalSpent = MOCK_PAYMENTS
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <DashboardShell
      title="User Dashboard"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Heart}
              label="Saved Properties"
              value={favorites.length}
              sublabel="In your wishlist"
              accent="primary"
            />
            <StatCard
              icon={Eye}
              label="Recent Views"
              value={recentlyViewed.length}
              sublabel="Last 8 properties"
              accent="teal"
            />
            <StatCard
              icon={CalendarCheck}
              label="Active Bookings"
              value={activeBookings.length}
              sublabel="Visits scheduled"
              accent="amber"
            />
            <StatCard
              icon={CreditCard}
              label="Total Spent"
              value={`$${totalSpent.toLocaleString()}`}
              sublabel="All-time"
              accent="rose"
            />
          </div>

          <PanelCard
            title="Recently viewed"
            description="Pick up where you left off"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ name: 'listings' })}
              >
                Browse all
              </Button>
            }
          >
            {recentLoading ? (
              <PropertyGridSkeleton count={4} className="lg:grid-cols-4" />
            ) : recentProps.length === 0 ? (
              <EmptyState
                icon={Eye}
                title="No recently viewed properties"
                description="Properties you view will show up here for quick access."
                action={
                  <Button onClick={() => navigate({ name: 'listings' })}>
                    Browse properties
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recentProps.map((p) => (
                  <PropertyCard key={p.id} property={p} compact />
                ))}
              </div>
            )}
          </PanelCard>

          <PanelCard title="Recent activity" description="Latest updates on your account">
            <ul className="space-y-3">
              {notifications.slice(0, 5).map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-3 rounded-xl bg-secondary/40 p-3"
                >
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{n.body}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
                </li>
              ))}
            </ul>
          </PanelCard>
        </div>
      )}

      {activeTab === 'saved' && (
        <PanelCard
          title="Saved Properties"
          description={`${favorites.length} properties in your wishlist`}
          action={
            <Button onClick={() => navigate({ name: 'listings' })} size="sm">
              Browse properties
            </Button>
          }
        >
          {savedLoading ? (
            <PropertyGridSkeleton count={6} />
          ) : savedProps.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No saved properties yet"
              description="Tap the heart icon on any property to save it here for later."
              action={
                <Button onClick={() => navigate({ name: 'listings' })}>
                  Explore listings
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {savedProps.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </PanelCard>
      )}

      {activeTab === 'bookings' && (
        <PanelCard
          title="Your Bookings"
          description="Manage your property visit requests"
        >
          {bookingsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-secondary/50"
                />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="No bookings yet"
              description="Schedule visits to your favorite properties and they'll appear here."
              action={
                <Button onClick={() => navigate({ name: 'listings' })}>
                  Find properties
                </Button>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40">
                    <TableHead>Property</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <button
                          onClick={() =>
                            navigate({ name: 'details', id: b.propertyId })
                          }
                          className="flex items-center gap-3 text-left"
                        >
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={b.propertyImage || '/properties/prop1.png'}
                              alt={b.propertyTitle}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium line-clamp-1">{b.propertyTitle}</p>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {b.city}
                            </p>
                          </div>
                        </button>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(b.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-sm">{b.timeSlot}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            'border-0 capitalize',
                            BOOKING_STATUS_CLASS[b.status]
                          )}
                        >
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {(b.status === 'pending' || b.status === 'approved') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelBooking(b)}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </PanelCard>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={CreditCard}
              label="Total Spent"
              value={`$${totalSpent.toLocaleString()}`}
              accent="primary"
            />
            <StatCard
              icon={Clock}
              label="This Month"
              value="$2,800"
              accent="amber"
            />
            <StatCard
              icon={CheckCircle2}
              label="Successful Payments"
              value={MOCK_PAYMENTS.filter((p) => p.status === 'Paid').length}
              accent="teal"
            />
          </div>

          <PanelCard title="Payment History" description="All your past transactions">
            <div className="overflow-hidden rounded-xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40">
                    <TableHead>Date</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PAYMENTS.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">
                        {new Date(p.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="font-medium">{p.property}</TableCell>
                      <TableCell className="font-semibold">
                        ${p.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.method}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            'border-0',
                            p.status === 'Paid' &&
                              'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
                            p.status === 'Pending' &&
                              'bg-amber-500/15 text-amber-600 dark:text-amber-400',
                            p.status === 'Refunded' &&
                              'bg-muted text-muted-foreground'
                          )}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast.success('Receipt downloaded', {
                              description: `${p.invoice}.pdf`,
                            })
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PanelCard>
        </div>
      )}

      {activeTab === 'messages' && <MessagesPanel />}

      {activeTab === 'notifications' && (
        <PanelCard
          title="Notifications"
          description={`${notifications.filter((n) => !n.read).length} unread`}
          action={
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          }
        >
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up!"
            />
          ) : (
            <ul className="space-y-2">
              {notifications.map((n) => {
                const Icon =
                  n.type === 'booking'
                    ? CalendarCheck
                    : n.type === 'message'
                    ? MessageSquare
                    : n.type === 'payment'
                    ? CreditCard
                    : Bell
                return (
                  <li
                    key={n.id}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border p-4 transition-colors',
                      n.read
                        ? 'border-border/60 bg-card'
                        : 'border-primary/30 bg-primary/5'
                    )}
                  >
                    <div
                      className={cn(
                        'mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg',
                        n.read
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary/15 text-primary'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{n.title}</p>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </PanelCard>
      )}

      {activeTab === 'profile' && <ProfilePanel />}
    </DashboardShell>
  )
}

// ---------- Messages Panel ----------
function MessagesPanel() {
  const [activeId, setActiveId] = React.useState(MOCK_THREADS[0]?.id ?? '')
  const active = MOCK_THREADS.find((t) => t.id === activeId)
  const [draft, setDraft] = React.useState('')

  const send = () => {
    if (!draft.trim()) return
    toast.success('Message sent', { description: 'The agent will respond shortly.' })
    setDraft('')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <PanelCard title="Conversations" description="Your active chats">
        <ScrollArea className="h-[480px] pr-2">
          <ul className="space-y-1">
            {MOCK_THREADS.map((t) => {
              const active = t.id === activeId
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveId(t.id)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors',
                      active
                        ? 'bg-primary/10'
                        : 'hover:bg-secondary/60'
                    )}
                  >
                    <Avatar className="h-10 w-10 border border-border/60">
                      <AvatarImage src={t.avatar} alt={t.name} />
                      <AvatarFallback>{t.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm line-clamp-1">{t.name}</p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {t.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {t.role}
                      </p>
                      <p className="mt-1 text-xs line-clamp-1">{t.preview}</p>
                    </div>
                    {t.unread > 0 && (
                      <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                        {t.unread}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </ScrollArea>
      </PanelCard>

      {active && (
        <PanelCard
          title={active.name}
          description={active.role}
          action={
            <Button variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          }
        >
          <div className="flex h-[420px] flex-col">
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
                {active.messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex',
                      m.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-2 text-sm',
                        m.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-secondary text-secondary-foreground rounded-bl-md'
                      )}
                    >
                      <p>{m.text}</p>
                      <p
                        className={cn(
                          'mt-1 text-xs opacity-70',
                          m.sender === 'user'
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground'
                        )}
                      >
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-3 flex gap-2 border-t border-border/60 pt-3">
              <Input
                placeholder="Type a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send()
                }}
              />
              <Button onClick={send} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PanelCard>
      )}
    </div>
  )
}

// ---------- Profile Panel ----------
function ProfilePanel() {
  const user = useAppStore((s) => s.user)
  const [name, setName] = React.useState(user?.name ?? '')
  const [email, setEmail] = React.useState(user?.email ?? '')
  const [phone, setPhone] = React.useState(user?.phone ?? '')
  const [bio, setBio] = React.useState(
    'Looking for a cozy family home in a friendly neighborhood with great schools nearby.'
  )

  if (!user) return null
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <PanelCard title="Profile Information" description="Update your personal details">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Demo: photo upload would open here')}>
                Change photo
              </Button>
              <p className="mt-1.5 text-xs text-muted-foreground">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Full Name</Label>
              <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-email">Email</Label>
              <Input
                id="p-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-phone">Phone</Label>
              <Input
                id="p-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input value={user.role.toUpperCase()} disabled className="bg-muted/40" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-bio">Bio</Label>
            <Textarea
              id="p-bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => toast.info('No changes to discard')}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                toast.success('Profile updated', {
                  description: 'Your changes have been saved.',
                })
              }
            >
              Save changes
            </Button>
          </div>
        </div>
      </PanelCard>

      <div className="space-y-4">
        <PanelCard title="Account Summary">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-medium">
                {new Date(user.joinedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account type</span>
              <Badge className="border-0 bg-primary/10 text-primary capitalize">
                {user.role}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono text-xs">{user.id.slice(0, 12)}…</span>
            </div>
          </div>
        </PanelCard>

        <PanelCard title="Quick Actions">
          <div className="grid gap-2">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => toast.info('Demo: password change form')}
            >
              Change password
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => toast.info('Demo: notification preferences')}
            >
              Notification settings
            </Button>
            <Button
              variant="outline"
              className="justify-start text-rose-600 hover:text-rose-700"
              onClick={() => toast.info('Demo: account deletion flow')}
            >
              Delete account
            </Button>
          </div>
        </PanelCard>
      </div>
    </div>
  )
}
