'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarClock,
  CreditCard,
  BarChart3,
  FileText,
  Star,
  Settings as SettingsIcon,
  Eye,
  DollarSign,
  UserCheck,
  Shield,
  Download,
  Check,
  X,
  Trash2,
  Ban,
  Search,
  Flag,
  MapPin,
  TrendingUp,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { EmptyState } from '@/components/shared/empty-state'
import { DashboardShell, StatCard, PanelCard, type DashboardTab } from './dashboard-shell'
import { useAppStore } from '@/lib/store'
import { api, formatPrice, formatCompact } from '@/lib/api'
import type { Property } from '@/lib/types'
import { cn } from '@/lib/utils'

const TABS: DashboardTab[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'listings', label: 'Listings', icon: Building2 },
  { id: 'bookings', label: 'Bookings', icon: CalendarClock },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
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

interface MockUser {
  id: string
  name: string
  email: string
  avatar: string
  role: 'user' | 'owner' | 'admin'
  status: 'Active' | 'Blocked'
  joined: string
}

interface MockPayment {
  id: string
  date: string
  user: string
  property: string
  amount: number
  status: 'Paid' | 'Pending' | 'Refunded'
  method: string
  invoice: string
}

const BOOKING_STATUS_CLASS: Record<Booking['status'], string> = {
  pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  approved: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  rejected: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  completed: 'bg-primary/15 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
}

// ---------- Mock data ----------
const MOCK_USERS: MockUser[] = [
  { id: 'u1', name: 'Sophia Bennett', email: 'sophia.b@mail.com', avatar: '/agents/agent1.png', role: 'owner', status: 'Active', joined: 'Jan 2024' },
  { id: 'u2', name: 'Marcus Lee', email: 'marcus.lee@mail.com', avatar: '/agents/agent2.png', role: 'owner', status: 'Active', joined: 'Feb 2024' },
  { id: 'u3', name: 'Priya Sharma', email: 'priya.s@mail.com', avatar: '/agents/agent3.png', role: 'user', status: 'Active', joined: 'Mar 2024' },
  { id: 'u4', name: 'David Chen', email: 'david.chen@mail.com', avatar: '', role: 'user', status: 'Active', joined: 'Mar 2024' },
  { id: 'u5', name: 'Olivia Brown', email: 'olivia.b@mail.com', avatar: '', role: 'user', status: 'Blocked', joined: 'Apr 2024' },
  { id: 'u6', name: 'James Wilson', email: 'james.w@mail.com', avatar: '', role: 'owner', status: 'Active', joined: 'May 2024' },
  { id: 'u7', name: 'Emma Davis', email: 'emma.d@mail.com', avatar: '', role: 'user', status: 'Active', joined: 'Jun 2024' },
  { id: 'u8', name: 'Liam Garcia', email: 'liam.g@mail.com', avatar: '', role: 'user', status: 'Active', joined: 'Jul 2024' },
  { id: 'u9', name: 'Ava Martinez', email: 'ava.m@mail.com', avatar: '', role: 'user', status: 'Blocked', joined: 'Aug 2024' },
  { id: 'u10', name: 'Noah Rodriguez', email: 'noah.r@mail.com', avatar: '', role: 'owner', status: 'Active', joined: 'Sep 2024' },
]

const MOCK_PAYMENTS: MockPayment[] = Array.from({ length: 15 }).map((_, i) => {
  const statuses: MockPayment['status'][] = ['Paid', 'Paid', 'Paid', 'Pending', 'Paid', 'Refunded', 'Paid']
  const methods = ['Visa •••• 4242', 'Mastercard •••• 5512', 'Amex •••• 1007', 'Visa •••• 8888']
  const properties = ['Modern Infinity Villa', 'Skyline Penthouse Suite', 'Garden View Apartment', 'Seaside Luxury Retreat', 'Cozy Downtown Studio']
  const users = ['Sophia Bennett', 'Marcus Lee', 'Priya Sharma', 'David Chen', 'Emma Davis', 'Liam Garcia']
  const d = new Date()
  d.setDate(d.getDate() - i * 5)
  return {
    id: `pay${i + 1}`,
    date: d.toISOString().slice(0, 10),
    user: users[i % users.length],
    property: properties[i % properties.length],
    amount: [250, 4800, 1800, 950, 3200, 1250][i % 6],
    status: statuses[i % statuses.length],
    method: methods[i % methods.length],
    invoice: `INV-2024-${String(200 + i).padStart(4, '0')}`,
  }
})

const GROWTH_DATA = [
  { month: 'Jan', users: 6420, properties: 820 },
  { month: 'Feb', users: 7180, properties: 945 },
  { month: 'Mar', users: 7890, properties: 1080 },
  { month: 'Apr', users: 8530, properties: 1180 },
  { month: 'May', users: 9210, properties: 1310 },
  { month: 'Jun', users: 9870, properties: 1430 },
  { month: 'Jul', users: 10520, properties: 1560 },
  { month: 'Aug', users: 11280, properties: 1680 },
  { month: 'Sep', users: 11940, properties: 1820 },
  { month: 'Oct', users: 12480, properties: 1950 },
  { month: 'Nov', users: 13110, properties: 2090 },
  { month: 'Dec', users: 13760, properties: 2230 },
]

const VIEWS_TREND = [
  { month: 'Jan', views: 4200 },
  { month: 'Feb', views: 5100 },
  { month: 'Mar', views: 6800 },
  { month: 'Apr', views: 5900 },
  { month: 'May', views: 7400 },
  { month: 'Jun', views: 8900 },
  { month: 'Jul', views: 10200 },
  { month: 'Aug', views: 11500 },
  { month: 'Sep', views: 10800 },
  { month: 'Oct', views: 13200 },
  { month: 'Nov', views: 14800 },
  { month: 'Dec', views: 16200 },
]

const REVENUE_TREND = [
  { month: 'Jan', revenue: 142000 },
  { month: 'Feb', revenue: 158000 },
  { month: 'Mar', revenue: 174000 },
  { month: 'Apr', revenue: 168000 },
  { month: 'May', revenue: 195000 },
  { month: 'Jun', revenue: 218000 },
  { month: 'Jul', revenue: 232000 },
  { month: 'Aug', revenue: 248000 },
  { month: 'Sep', revenue: 268000 },
  { month: 'Oct', revenue: 289000 },
  { month: 'Nov', revenue: 312000 },
  { month: 'Dec', revenue: 348000 },
]

const PIE_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-1)']

const growthConfig = {
  users: { label: 'Users', color: 'var(--chart-1)' },
  properties: { label: 'Properties', color: 'var(--chart-2)' },
} satisfies ChartConfig

const viewsTrendConfig = {
  views: { label: 'Views', color: 'var(--chart-1)' },
} satisfies ChartConfig

const revenueTrendConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
} satisfies ChartConfig

export default function AdminDashboard() {
  const route = useAppStore((s) => s.route)
  const navigate = useAppStore((s) => s.navigate)
  const addNotification = useAppStore((s) => s.addNotification)

  const initialTab =
    route.name === 'dashboard' && route.tab && TABS.some((t) => t.id === route.tab)
      ? route.tab
      : 'overview'
  const [activeTab, setActiveTab] = React.useState(initialTab)

  React.useEffect(() => {
    if (route.name === 'dashboard' && route.tab && route.tab !== activeTab) {
      setActiveTab(route.tab)
    }
  }, [route])

  // Stats
  const [stats, setStats] = React.useState<any>(null)
  const [statsSig, setStatsSig] = React.useState<string>('')
  const currentStatsSig = 'stats_v1'
  const statsLoading = currentStatsSig !== statsSig
  React.useEffect(() => {
    let cancelled = false
    api.stats.get().then((s) => {
      if (!cancelled) {
        setStats(s)
        setStatsSig(currentStatsSig)
      }
    }).catch(() => {
      if (!cancelled) setStatsSig(currentStatsSig)
    })
    return () => {
      cancelled = true
    }
  }, [currentStatsSig])

  // Properties
  const [properties, setProperties] = React.useState<Property[]>([])
  const [propsSig, setPropsSig] = React.useState<string>('')
  const currentPropsSig = 'all_props'
  const propsLoading = currentPropsSig !== propsSig
  React.useEffect(() => {
    let cancelled = false
    api.properties.list({ limit: 50 }).then((res) => {
      if (!cancelled) {
        setProperties(res.data)
        setPropsSig(currentPropsSig)
      }
    }).catch(() => {
      if (!cancelled) {
        setProperties([])
        setPropsSig(currentPropsSig)
      }
    })
    return () => {
      cancelled = true
    }
  }, [currentPropsSig])

  // Bookings
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [bookingsSig, setBookingsSig] = React.useState<string>('')
  const currentBookingsSig = 'all_bookings'
  const bookingsLoading = currentBookingsSig !== bookingsSig
  const fetchBookings = React.useCallback(() => {
    api.bookings.list().then((res) => {
      setBookings(res.data as Booking[])
      setBookingsSig(currentBookingsSig + '_' + Date.now())
    }).catch(() => {
      setBookings([])
      setBookingsSig(currentBookingsSig + '_' + Date.now())
    })
  }, [])
  React.useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  // Listing filter
  const [listingFilter, setListingFilter] = React.useState<string>('all')
  const filteredListings = React.useMemo(() => {
    if (listingFilter === 'all') return properties
    if (listingFilter === 'verified') return properties.filter((p) => p.verified)
    if (listingFilter === 'featured') return properties.filter((p) => p.featured)
    if (listingFilter === 'premium') return properties.filter((p) => p.premium)
    return properties.filter((p) => p.status === listingFilter)
  }, [properties, listingFilter])

  const updateBookingStatus = async (b: Booking, status: Booking['status']) => {
    try {
      await api.bookings.updateStatus(b.id, status)
      setBookings((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, status } : x))
      )
      addNotification({
        title: `Booking ${status}`,
        body: `${b.userName}'s visit to ${b.propertyTitle} was ${status}.`,
        type: 'booking',
      })
      toast.success(`Booking ${status}`, { description: b.propertyTitle })
    } catch (e: any) {
      toast.error('Action failed', { description: e.message })
    }
  }

  return (
    <DashboardShell
      title="Admin Dashboard"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* ---------- OVERVIEW ---------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Users} label="Total Users" value="12,480" sublabel="+580 this month" accent="primary" />
            <StatCard
              icon={Building2}
              label="Total Properties"
              value={stats?.totals?.properties ?? '—'}
              sublabel={statsLoading ? 'Loading…' : 'Across all cities'}
              accent="teal"
            />
            <StatCard icon={DollarSign} label="Total Revenue" value="$2.4M" sublabel="All-time" accent="amber" />
            <StatCard icon={UserCheck} label="Pending Approvals" value="7" sublabel="Awaiting review" accent="rose" />
          </div>

          <PanelCard title="Platform Growth" description="Users vs Properties over 12 months">
            <ChartContainer config={growthConfig} className="h-[320px] w-full">
              <AreaChart data={GROWTH_DATA} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-users)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-users)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="propsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-properties)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-properties)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
                <Area type="monotone" dataKey="users" stroke="var(--color-users)" fill="url(#usersGrad)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="properties" stroke="var(--color-properties)" fill="url(#propsGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ChartContainer>
          </PanelCard>

          <PanelCard title="Recent Activity" description="Latest platform events">
            <ul className="space-y-3">
              {[
                { icon: UserCheck, color: 'bg-emerald-500/15 text-emerald-600', text: 'New owner James Wilson registered', time: '5m ago' },
                { icon: Building2, color: 'bg-primary/15 text-primary', text: 'Property "Seaside Luxury Retreat" was listed', time: '32m ago' },
                { icon: CalendarClock, color: 'bg-amber-500/15 text-amber-600', text: '3 new booking requests pending approval', time: '1h ago' },
                { icon: CreditCard, color: 'bg-rose-500/15 text-rose-600', text: 'Payment of $4,800 processed for Skyline Penthouse', time: '2h ago' },
                { icon: Star, color: 'bg-amber-500/15 text-amber-600', text: 'New 5-star review on Modern Infinity Villa', time: '4h ago' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <li key={i} className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3">
                    <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', item.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="flex-1 text-sm">{item.text}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                  </li>
                )
              })}
            </ul>
          </PanelCard>
        </div>
      )}

      {/* ---------- USERS ---------- */}
      {activeTab === 'users' && <UsersPanel />}

      {/* ---------- LISTINGS ---------- */}
      {activeTab === 'listings' && (
        <PanelCard
          title="All Listings"
          description={`${properties.length} properties`}
          action={
            <Select value={listingFilter} onValueChange={setListingFilter}>
              <SelectTrigger size="sm" className="w-[150px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Listings</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
                <SelectItem value="buy">For Sale</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          }
        >
          {propsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary/50" />
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <EmptyState icon={Building2} title="No listings" description="No properties match this filter." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40">
                    <TableHead>Property</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredListings.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <button
                          onClick={() => navigate({ name: 'details', id: p.id })}
                          className="flex items-center gap-3 text-left"
                        >
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={p.images[0] || '/properties/prop1.png'}
                              alt={p.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium line-clamp-1">{p.title}</p>
                            <p className="text-xs text-muted-foreground">{p.type}</p>
                          </div>
                        </button>
                      </TableCell>
                      <TableCell className="text-sm">{p.agent?.name ?? '—'}</TableCell>
                      <TableCell className="text-sm">{p.city}</TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatPrice(p.price, p.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            className={cn(
                              'border-0',
                              p.status === 'rent'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            )}
                          >
                            {p.status === 'rent' ? 'Rent' : 'Sale'}
                          </Badge>
                          {p.verified && (
                            <Badge className="border-0 bg-primary/10 text-primary">
                              <Shield className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatCompact(p.views)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-emerald-600 hover:text-emerald-700"
                            onClick={() => toast.success('Listing approved', { description: p.title })}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-amber-600 hover:text-amber-700"
                            onClick={() => toast.info('Listing flagged for review', { description: p.title })}
                          >
                            <Flag className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-rose-600 hover:text-rose-700"
                            onClick={() => toast.info('Listing removal would be confirmed', { description: p.title })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </PanelCard>
      )}

      {/* ---------- BOOKINGS ---------- */}
      {activeTab === 'bookings' && (
        <PanelCard
          title="All Bookings"
          description={`${bookings.length} total · ${bookings.filter((b) => b.status === 'pending').length} pending`}
        >
          {bookingsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary/50" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No bookings" description="Booking requests will appear here." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40">
                    <TableHead>Property</TableHead>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Date / Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
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
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{b.userName}</p>
                          <p className="text-xs text-muted-foreground">{b.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <p>
                          {new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-muted-foreground">{b.timeSlot}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('border-0 capitalize', BOOKING_STATUS_CLASS[b.status])}>
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {b.status === 'pending' ? (
                          <div className="flex justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="default"
                              className="h-8 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => updateBookingStatus(b, 'approved')}
                            >
                              <Check className="h-3.5 w-3.5" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-rose-300 text-rose-600 hover:bg-rose-50"
                              onClick={() => updateBookingStatus(b, 'rejected')}
                            >
                              <X className="h-3.5 w-3.5" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
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

      {/* ---------- PAYMENTS ---------- */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={DollarSign} label="Total Revenue" value="$2.4M" sublabel="All-time" accent="primary" />
            <StatCard icon={TrendingUp} label="This Month" value="$348k" sublabel="+11.5%" accent="teal" />
            <StatCard icon={Activity} label="Transactions" value={MOCK_PAYMENTS.length} sublabel="Last 30 days" accent="amber" />
            <StatCard icon={CreditCard} label="Avg Order" value="$1,890" accent="rose" />
          </div>

          <PanelCard title="All Payments" description="Platform-wide payment history">
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40">
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PAYMENTS.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">
                        {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{p.user}</TableCell>
                      <TableCell className="text-sm">{p.property}</TableCell>
                      <TableCell className="font-semibold">${p.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.method}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            'border-0',
                            p.status === 'Paid' && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
                            p.status === 'Pending' && 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
                            p.status === 'Refunded' && 'bg-muted text-muted-foreground'
                          )}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.success('Invoice downloaded', { description: `${p.invoice}.pdf` })}
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

      {/* ---------- ANALYTICS ---------- */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <PanelCard title="Properties by City" description="Listing distribution">
              <ChartContainer
                config={{ count: { label: 'Properties', color: 'var(--chart-1)' } }}
                className="h-[300px] w-full"
              >
                <BarChart
                  data={(stats?.cities ?? []).slice(0, 6)}
                  margin={{ left: -10, right: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="city" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ChartContainer>
            </PanelCard>

            <PanelCard title="Properties by Type" description="Type distribution">
              <ChartContainer
                config={(stats?.types ?? []).reduce((acc: ChartConfig, t: any) => {
                  acc[t.type] = { label: t.type }
                  return acc
                }, {})}
                className="h-[300px] w-full"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
                  <Pie
                    data={stats?.types ?? []}
                    dataKey="count"
                    nameKey="type"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {(stats?.types ?? []).map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
                </PieChart>
              </ChartContainer>
            </PanelCard>
          </div>

          <PanelCard title="Views Trend" description="Monthly platform views">
            <ChartContainer config={viewsTrendConfig} className="h-[300px] w-full">
              <LineChart data={VIEWS_TREND} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-views)"
                  strokeWidth={2.5}
                  dot={{ fill: 'var(--color-views)', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </PanelCard>

          <PanelCard title="Revenue Trend" description="Monthly platform revenue">
            <ChartContainer config={revenueTrendConfig} className="h-[300px] w-full">
              <AreaChart data={REVENUE_TREND} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  fill="url(#adminRevGrad)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ChartContainer>
          </PanelCard>
        </div>
      )}

      {/* ---------- REPORTS ---------- */}
      {activeTab === 'reports' && <ReportsPanel />}

      {/* ---------- REVIEWS ---------- */}
      {activeTab === 'reviews' && <ReviewsPanel properties={properties} propsLoading={propsLoading} />}

      {/* ---------- SETTINGS ---------- */}
      {activeTab === 'settings' && <AdminSettingsPanel />}
    </DashboardShell>
  )
}

// ---------- Users Panel ----------
function UsersPanel() {
  const [query, setQuery] = React.useState('')
  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return MOCK_USERS
    return MOCK_USERS.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <PanelCard
      title="Users"
      description={`${MOCK_USERS.length} total users`}
      action={
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-[220px] pl-9"
          />
        </div>
      }
    >
      <div className="overflow-x-auto rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/40">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border/60">
                      {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {u.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      'border-0 capitalize',
                      u.role === 'admin' && 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
                      u.role === 'owner' && 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
                      u.role === 'user' && 'bg-primary/10 text-primary'
                    )}
                  >
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      'border-0',
                      u.status === 'Active'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.joined}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() =>
                        toast.info(`Demo: ${u.status === 'Active' ? 'Block' : 'Unblock'} user`, {
                          description: u.name,
                        })
                      }
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-rose-600 hover:text-rose-700"
                      onClick={() => toast.info('Demo: user deletion flow', { description: u.name })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filtered.length === 0 && (
        <p className="mt-4 text-center text-sm text-muted-foreground">No users match "{query}"</p>
      )}
    </PanelCard>
  )
}

// ---------- Reports Panel ----------
function ReportsPanel() {
  const reportCards = [
    { title: 'Monthly Report', desc: 'November 2024 summary', icon: FileText, color: 'bg-primary/10 text-primary' },
    { title: 'User Report', desc: 'All registered users', icon: Users, color: 'bg-teal-500/15 text-teal-600' },
    { title: 'Property Report', desc: 'All listed properties', icon: Building2, color: 'bg-amber-500/15 text-amber-600' },
    { title: 'Revenue Report', desc: 'Yearly financial summary', icon: DollarSign, color: 'bg-rose-500/15 text-rose-600' },
  ]

  const recentReports = [
    { name: 'Monthly Report - Nov 2024', date: 'Dec 1, 2024', size: '2.4 MB', type: 'PDF' },
    { name: 'User Growth Q3 2024', date: 'Oct 5, 2024', size: '1.8 MB', type: 'PDF' },
    { name: 'Property Performance Q3', date: 'Oct 3, 2024', size: '3.1 MB', type: 'PDF' },
    { name: 'Revenue Report - Sep 2024', date: 'Oct 1, 2024', size: '1.2 MB', type: 'PDF' },
  ]

  return (
    <div className="space-y-6">
      <PanelCard title="Generate Report" description="Download detailed reports as PDF">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reportCards.map((r) => {
            const Icon = r.icon
            return (
              <Card key={r.title} className="rounded-2xl border-border/60 bg-card p-5">
                <div className={cn('grid h-11 w-11 place-items-center rounded-xl', r.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold">{r.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{r.desc}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => toast.success('Generating PDF...', { description: r.title })}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </Card>
            )
          })}
        </div>
      </PanelCard>

      <PanelCard title="Recent Reports" description="Recently generated reports">
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40">
                <TableHead>Report Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="text-sm">{r.size}</TableCell>
                  <TableCell>
                    <Badge className="border-0 bg-primary/10 text-primary">{r.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.success('Report downloaded', { description: r.name })}
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
  )
}

// ---------- Reviews Panel ----------
function ReviewsPanel({ properties, propsLoading }: { properties: Property[]; propsLoading: boolean }) {
  const [reviews, setReviews] = React.useState<any[]>([])
  const [reviewsSig, setReviewsSig] = React.useState<string>('')
  const reviewPropsSig = properties.slice(0, 6).map((p) => p.id).join('|')
  const currentSig = `rv_${reviewPropsSig}`
  const loading = currentSig !== reviewsSig || propsLoading

  React.useEffect(() => {
    if (properties.length === 0) return
    let cancelled = false
    Promise.all(
      properties.slice(0, 6).map((p) =>
        api.properties.get(p.id).then((full) => full.reviews.map((r) => ({ ...r, propertyTitle: p.title, propertyId: p.id })))
      )
    ).then((arrs) => {
      if (!cancelled) {
        const flat = arrs.flat().slice(0, 12)
        setReviews(flat)
        setReviewsSig(currentSig)
      }
    }).catch(() => {
      if (!cancelled) {
        setReviews([])
        setReviewsSig(currentSig)
      }
    })
    return () => {
      cancelled = true
    }
  }, [currentSig])

  return (
    <PanelCard title="Review Moderation" description={`${reviews.length} reviews to review`}>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary/50" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews" description="Reviews from your properties will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40">
                <TableHead>Property</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((r, i) => (
                <TableRow key={r.id ?? i}>
                  <TableCell className="font-medium text-sm line-clamp-1 max-w-[180px]">
                    {r.propertyTitle}
                  </TableCell>
                  <TableCell className="text-sm">{r.author}</TableCell>
                  <TableCell>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={cn(
                            'h-3.5 w-3.5',
                            j < r.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'
                          )}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[280px] text-sm text-muted-foreground line-clamp-2">
                    {r.comment}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-emerald-600 hover:text-emerald-700"
                        onClick={() => toast.success('Review approved', { description: r.propertyTitle })}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-amber-600 hover:text-amber-700"
                        onClick={() => toast.info('Review flagged', { description: r.propertyTitle })}
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-rose-600 hover:text-rose-700"
                        onClick={() => toast.info('Review deletion confirmed', { description: r.propertyTitle })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PanelCard>
  )
}

// ---------- Settings Panel ----------
function AdminSettingsPanel() {
  const [siteName, setSiteName] = React.useState('HouseHunt')
  const [supportEmail, setSupportEmail] = React.useState('support@househunt.com')
  const [maintenance, setMaintenance] = React.useState(false)
  const [allowRegistration, setAllowRegistration] = React.useState(true)
  const [requireApproval, setRequireApproval] = React.useState(true)
  const [description, setDescription] = React.useState(
    'HouseHunt — the smart way to find your next home.'
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <PanelCard title="Site Settings" description="Manage platform configuration">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="support-email">Support Email</Label>
              <Input
                id="support-email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="site-desc">Site Description</Label>
            <Textarea
              id="site-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <ToggleRow
              title="Maintenance Mode"
              desc="Temporarily disable access to the platform"
              checked={maintenance}
              onCheckedChange={setMaintenance}
            />
            <ToggleRow
              title="Allow New Registrations"
              desc="Let new users sign up for accounts"
              checked={allowRegistration}
              onCheckedChange={setAllowRegistration}
            />
            <ToggleRow
              title="Require Listing Approval"
              desc="Manually approve new property listings before they go live"
              checked={requireApproval}
              onCheckedChange={setRequireApproval}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => toast.info('No changes to discard')}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                toast.success('Settings saved', {
                  description: 'Platform configuration updated.',
                })
              }
            >
              Save settings
            </Button>
          </div>
        </div>
      </PanelCard>

      <div className="space-y-4">
        <PanelCard title="System Status">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">API Status</span>
              <Badge className="border-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Operational
              </Badge>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Database</span>
              <Badge className="border-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Healthy
              </Badge>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">CDN</span>
              <Badge className="border-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Fast
              </Badge>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-mono text-xs">v2.4.1</span>
            </li>
          </ul>
        </PanelCard>

        <PanelCard title="Danger Zone">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start border-rose-300 text-rose-600 hover:bg-rose-50"
              onClick={() => toast.info('Demo: cache clear flow')}
            >
              Clear cache
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-rose-300 text-rose-600 hover:bg-rose-50"
              onClick={() => toast.info('Demo: database backup flow')}
            >
              Backup database
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-rose-300 text-rose-600 hover:bg-rose-50"
              onClick={() => toast.info('Demo: factory reset flow')}
            >
              Reset platform
            </Button>
          </div>
        </PanelCard>
      </div>
    </div>
  )
}

function ToggleRow({
  title,
  desc,
  checked,
  onCheckedChange,
}: {
  title: string
  desc: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
