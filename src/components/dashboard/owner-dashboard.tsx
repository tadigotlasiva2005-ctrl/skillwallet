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
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'
import {
  LayoutDashboard,
  Building2,
  CalendarClock,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Eye,
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Star,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { EmptyState } from '@/components/shared/empty-state'
import { DashboardShell, StatCard, PanelCard, type DashboardTab } from './dashboard-shell'
import { useAppStore } from '@/lib/store'
import { api, formatPrice, formatCompact } from '@/lib/api'
import type { Property } from '@/lib/types'
import { cn } from '@/lib/utils'

const TABS: DashboardTab[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'listings', label: 'My Listings', icon: Building2 },
  { id: 'bookings', label: 'Booking Requests', icon: CalendarClock },
  { id: 'revenue', label: 'Revenue', icon: TrendingUp },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
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

const BOOKING_STATUS_CLASS: Record<Booking['status'], string> = {
  pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  approved: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  rejected: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  completed: 'bg-primary/15 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
}

// Mock time-series
const REVENUE_DATA = [
  { month: 'Jan', revenue: 8200, target: 7500 },
  { month: 'Feb', revenue: 9100, target: 8000 },
  { month: 'Mar', revenue: 11200, target: 9000 },
  { month: 'Apr', revenue: 10800, target: 9500 },
  { month: 'May', revenue: 13400, target: 10000 },
  { month: 'Jun', revenue: 14800, target: 11000 },
  { month: 'Jul', revenue: 16200, target: 12000 },
  { month: 'Aug', revenue: 15500, target: 12500 },
  { month: 'Sep', revenue: 17400, target: 13000 },
  { month: 'Oct', revenue: 18900, target: 14000 },
  { month: 'Nov', revenue: 21300, target: 15000 },
  { month: 'Dec', revenue: 24800, target: 16000 },
]

const VIEWS_DATA = [
  { month: 'Jan', views: 420 },
  { month: 'Feb', views: 510 },
  { month: 'Mar', views: 680 },
  { month: 'Apr', views: 590 },
  { month: 'May', views: 740 },
  { month: 'Jun', views: 890 },
  { month: 'Jul', views: 1020 },
  { month: 'Aug', views: 1150 },
  { month: 'Sep', views: 1080 },
  { month: 'Oct', views: 1320 },
  { month: 'Nov', views: 1480 },
  { month: 'Dec', views: 1620 },
]

const REVENUE_BY_TYPE = [
  { type: 'House', value: 42800 },
  { type: 'Apartment', value: 31200 },
  { type: 'Villa', value: 58400 },
  { type: 'Penthouse', value: 24600 },
  { type: 'Studio', value: 8900 },
]

const PIE_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

const revenueChartConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
  target: { label: 'Target', color: 'var(--chart-2)' },
} satisfies ChartConfig

const viewsLineConfig = {
  views: { label: 'Views', color: 'var(--chart-1)' },
} satisfies ChartConfig

const revenueByTypeConfig = REVENUE_BY_TYPE.reduce((acc, item) => {
  acc[item.type] = { label: item.type }
  return acc
}, {} as ChartConfig)

export default function OwnerDashboard() {
  const route = useAppStore((s) => s.route)
  const navigate = useAppStore((s) => s.navigate)
  const user = useAppStore((s) => s.user)
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

  // Fetch all properties (owner's listings — demo: all properties)
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

  // Fetch all bookings
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

  // Derived metrics
  const totalViews = properties.reduce((s, p) => s + p.views, 0)
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length
  const monthlyRevenue = REVENUE_DATA[REVENUE_DATA.length - 1].revenue
  const topProperties = [...properties].sort((a, b) => b.views - a.views).slice(0, 5)

  // Booking actions
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
      toast.success(`Booking ${status}`, {
        description: `${b.propertyTitle} · ${b.userName}`,
      })
    } catch (e: any) {
      toast.error('Action failed', { description: e.message })
    }
  }

  return (
    <DashboardShell
      title="Owner Dashboard"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* ---------- OVERVIEW ---------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Building2}
              label="My Listings"
              value={properties.length}
              sublabel="Active properties"
              accent="primary"
            />
            <StatCard
              icon={Eye}
              label="Total Views"
              value={formatCompact(totalViews)}
              sublabel="All-time"
              accent="teal"
            />
            <StatCard
              icon={CalendarClock}
              label="Pending Requests"
              value={pendingBookings}
              sublabel="Awaiting approval"
              accent="amber"
            />
            <StatCard
              icon={DollarSign}
              label="Monthly Revenue"
              value={`$${monthlyRevenue.toLocaleString()}`}
              sublabel="This month"
              accent="rose"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <PanelCard title="Revenue Trend" description="Last 12 months">
              <ChartContainer config={revenueChartConfig} className="h-[280px] w-full">
                <AreaChart data={REVENUE_DATA} margin={{ left: -10, right: 10 }}>
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="target"
                    stroke="var(--color-target)"
                    strokeDasharray="4 4"
                    fill="none"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fill="url(#revGradient)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ChartContainer>
            </PanelCard>

            <PanelCard title="Top Performing" description="By total views">
              {propsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-secondary/50" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {topProperties.map((p, i) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 rounded-xl bg-secondary/40 p-2"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <button
                        onClick={() => navigate({ name: 'details', id: p.id })}
                        className="relative h-10 w-12 shrink-0 overflow-hidden rounded-md"
                      >
                        <Image
                          src={p.images[0] || '/properties/prop1.png'}
                          alt={p.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.city}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="flex items-center gap-1 text-sm font-semibold text-primary">
                          <Eye className="h-3 w-3" />
                          {formatCompact(p.views)}
                        </p>
                        <p className="flex items-center justify-end gap-1 text-xs text-amber-500">
                          <Star className="h-3 w-3 fill-current" />
                          {p.rating}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </PanelCard>
          </div>
        </div>
      )}

      {/* ---------- LISTINGS ---------- */}
      {activeTab === 'listings' && (
        <PanelCard
          title="My Listings"
          description={`${properties.length} properties`}
          action={
            <Button
              size="sm"
              onClick={() => toast.info('Demo: opens property creation form')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add new property
            </Button>
          }
        >
          {propsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary/50" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No listings yet"
              description="Add your first property to start receiving booking requests."
              action={
                <Button onClick={() => toast.info('Demo: opens property creation form')}>
                  Add property
                </Button>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40">
                    <TableHead>Property</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((p) => (
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
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {p.city}
                            </p>
                          </div>
                        </button>
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
                              Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatPrice(p.price, p.status)}
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatCompact(p.views)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          {p.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toast.info('Demo: opens property edit form', {
                                description: p.title,
                              })
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:text-rose-700"
                            onClick={() =>
                              toast.info('Demo: property deletion would be confirmed', {
                                description: p.title,
                              })
                            }
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

      {/* ---------- BOOKING REQUESTS ---------- */}
      {activeTab === 'bookings' && (
        <PanelCard
          title="Booking Requests"
          description={`${pendingBookings} pending · ${bookings.length} total`}
        >
          {bookingsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary/50" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="No booking requests"
              description="When users request visits to your properties, they'll appear here."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/60">
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
                          <p className="text-xs text-muted-foreground">{b.userPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <p>
                          {new Date(b.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">{b.timeSlot}</p>
                      </TableCell>
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

      {/* ---------- REVENUE ---------- */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value="$184,900"
              sublabel="All-time"
              accent="primary"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg / Property"
              value="$18,490"
              accent="teal"
            />
            <StatCard
              icon={Clock}
              label="This Month"
              value={`$${monthlyRevenue.toLocaleString()}`}
              accent="amber"
            />
            <StatCard
              icon={TrendingUp}
              label="Growth"
              value="+16.5%"
              sublabel="vs last month"
              accent="rose"
            />
          </div>

          <PanelCard title="Monthly Revenue" description="Last 12 months">
            <ChartContainer config={revenueChartConfig} className="h-[320px] w-full">
              <BarChart data={REVENUE_DATA} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ChartContainer>
          </PanelCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <PanelCard title="Revenue by Property Type" description="Distribution">
              <ChartContainer
                config={revenueByTypeConfig}
                className="h-[300px] w-full"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
                  <Pie
                    data={REVENUE_BY_TYPE}
                    dataKey="value"
                    nameKey="type"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {REVENUE_BY_TYPE.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ChartContainer>
            </PanelCard>

            <PanelCard title="Revenue Breakdown" description="By property type">
              <ul className="space-y-3">
                {REVENUE_BY_TYPE.map((item, i) => {
                  const total = REVENUE_BY_TYPE.reduce((s, x) => s + x.value, 0)
                  const pct = Math.round((item.value / total) * 100)
                  return (
                    <li key={item.type}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                          />
                          {item.type}
                        </span>
                        <span className="font-medium">
                          ${item.value.toLocaleString()} · {pct}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                          }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </PanelCard>
          </div>
        </div>
      )}

      {/* ---------- ANALYTICS ---------- */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <PanelCard title="Views Over Time" description="Total listing views per month">
            <ChartContainer config={viewsLineConfig} className="h-[300px] w-full">
              <LineChart data={VIEWS_DATA} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
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

          <div className="grid gap-6 lg:grid-cols-2">
            <PanelCard title="Views per Property" description="Top properties">
              <ChartContainer
                config={{
                  views: { label: 'Views', color: 'var(--chart-3)' },
                }}
                className="h-[300px] w-full"
              >
                <BarChart
                  data={topProperties.map((p) => ({
                    name: p.title.split(' ').slice(0, 2).join(' '),
                    views: p.views,
                  }))}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="views"
                    fill="var(--color-views)"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ChartContainer>
            </PanelCard>

            <PanelCard title="Listing Status Distribution" description="Across your portfolio">
              <ListingStatusChart properties={properties} />
            </PanelCard>
          </div>
        </div>
      )}

      {/* ---------- MESSAGES ---------- */}
      {activeTab === 'messages' && <OwnerMessagesPanel />}
    </DashboardShell>
  )
}

// ---------- Listing Status Radial ----------
function ListingStatusChart({ properties }: { properties: Property[] }) {
  const counts = React.useMemo(() => {
    const rent = properties.filter((p) => p.status === 'rent').length
    const buy = properties.filter((p) => p.status === 'buy').length
    const featured = properties.filter((p) => p.featured).length
    const premium = properties.filter((p) => p.premium).length
    return [
      { name: 'For Rent', value: rent, fill: 'var(--chart-1)' },
      { name: 'For Sale', value: buy, fill: 'var(--chart-2)' },
      { name: 'Featured', value: featured, fill: 'var(--chart-3)' },
      { name: 'Premium', value: premium, fill: 'var(--chart-4)' },
    ]
  }, [properties])

  const config = counts.reduce((acc, c) => {
    acc[c.name] = { label: c.name, color: c.fill }
    return acc
  }, {} as ChartConfig)

  if (properties.length === 0) {
    return (
      <div className="grid h-[280px] place-items-center text-sm text-muted-foreground">
        No listings yet
      </div>
    )
  }

  return (
    <ChartContainer config={config} className="h-[280px] w-full">
      <RadialBarChart
        data={counts}
        innerRadius="20%"
        outerRadius="100%"
        startAngle={90}
        endAngle={-270}
      >
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <RadialBar dataKey="value" background cornerRadius={8} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
        />
      </RadialBarChart>
    </ChartContainer>
  )
}

// ---------- Messages ----------
const OWNER_THREADS = [
  {
    id: 'ot1',
    name: 'Emma Wilson',
    avatar: '',
    role: 'Interested in Skyline Penthouse',
    preview: "Is the penthouse still available for a tour this Saturday?",
    time: '5m ago',
    unread: 2,
    messages: [
      { sender: 'them' as const, text: "Hi! I'm very interested in the Skyline Penthouse.", time: '9:30 AM' },
      { sender: 'them' as const, text: "Is the penthouse still available for a tour this Saturday?", time: '9:31 AM' },
    ],
  },
  {
    id: 'ot2',
    name: 'David Chen',
    avatar: '',
    role: 'Booked Garden View Apartment',
    preview: "Perfect, see you Saturday at 10am.",
    time: '1h ago',
    unread: 0,
    messages: [
      { sender: 'user' as const, text: "Your booking is confirmed for Saturday 10am.", time: '8:00 AM' },
      { sender: 'them' as const, text: "Perfect, see you Saturday at 10am.", time: '8:05 AM' },
    ],
  },
  {
    id: 'ot3',
    name: 'Olivia Brown',
    avatar: '',
    role: 'Asked about Infinity Villa',
    preview: "What's the security deposit for the villa?",
    time: '3h ago',
    unread: 1,
    messages: [
      { sender: 'them' as const, text: "What's the security deposit for the villa?", time: 'Yesterday' },
    ],
  },
]

function OwnerMessagesPanel() {
  const [activeId, setActiveId] = React.useState(OWNER_THREADS[0]?.id ?? '')
  const active = OWNER_THREADS.find((t) => t.id === activeId)
  const [draft, setDraft] = React.useState('')

  const send = () => {
    if (!draft.trim()) return
    toast.success('Message sent')
    setDraft('')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <PanelCard title="Conversations" description={`${OWNER_THREADS.length} active`}>
        <ScrollArea className="h-[480px] pr-2">
          <ul className="space-y-1">
            {OWNER_THREADS.map((t) => {
              const active = t.id === activeId
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveId(t.id)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors',
                      active ? 'bg-primary/10' : 'hover:bg-secondary/60'
                    )}
                  >
                    <Avatar className="h-10 w-10 border border-border/60">
                      <AvatarImage src={t.avatar} alt={t.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {t.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm line-clamp-1">{t.name}</p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {t.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{t.role}</p>
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
        <PanelCard title={active.name} description={active.role}>
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
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-3 flex gap-2 border-t border-border/60 pt-3">
              <Input
                placeholder="Type a reply..."
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
