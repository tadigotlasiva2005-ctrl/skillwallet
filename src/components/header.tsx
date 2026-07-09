'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Home,
  Search,
  Heart,
  GitCompare,
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Building2,
  Phone,
  Info,
  HelpCircle,
  DollarSign,
  Briefcase,
  Users,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAppStore, type Route, type UserRole } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV_LINKS: { label: string; route: Route; icon: React.ElementType }[] = [
  { label: 'Home', route: { name: 'home' }, icon: Home },
  { label: 'Listings', route: { name: 'listings' }, icon: Search },
  { label: 'Agents', route: { name: 'agents' }, icon: Users },
  { label: 'Pricing', route: { name: 'pricing' }, icon: DollarSign },
  { label: 'Services', route: { name: 'services' }, icon: Briefcase },
  { label: 'About', route: { name: 'about' }, icon: Info },
  { label: 'Contact', route: { name: 'contact' }, icon: Phone },
]

const MORE_LINKS: { label: string; route: Route; icon: React.ElementType }[] = [
  { label: 'FAQ', route: { name: 'faq' }, icon: HelpCircle },
  { label: 'Favorites', route: { name: 'favorites' }, icon: Heart },
  { label: 'Compare', route: { name: 'compare' }, icon: GitCompare },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const route = useAppStore((s) => s.route)
  const navigate = useAppStore((s) => s.navigate)
  const user = useAppStore((s) => s.user)
  const logout = useAppStore((s) => s.logout)
  const openAuthModal = useAppStore((s) => s.openAuthModal)
  const favorites = useAppStore((s) => s.favorites)
  const compare = useAppStore((s) => s.compare)
  const unreadCount = useAppStore((s) => s.unreadCount)
  const notifications = useAppStore((s) => s.notifications)
  const markAllRead = useAppStore((s) => s.markAllRead)
  const setRole = useAppStore((s) => s.setRole)

  const isActive = (r: Route) => route.name === r.name

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility bar */}
      <div className="hidden md:block border-b border-border/40 bg-secondary/40 backdrop-blur-md">
        <div className="container mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> +1 (800) 555-HUNT
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3 w-3" /> support@househunt.com
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Follow us:</span>
            {['Twitter', 'Instagram', 'LinkedIn'].map((s) => (
              <button key={s} className="hover:text-primary transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate({ name: 'home' })}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground shadow-md">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              House<span className="text-primary">Hunt</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.slice(0, 5).map((link) => (
              <NavLink
                key={link.label}
                active={isActive(link.route)}
                onClick={() => navigate(link.route)}
              >
                {link.label}
              </NavLink>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                  More <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {MORE_LINKS.map((link) => (
                  <DropdownMenuItem key={link.label} onClick={() => navigate(link.route)}>
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hidden sm:flex"
              onClick={() => navigate({ name: 'favorites' })}
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Button>

            {/* Compare */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hidden sm:flex"
              onClick={() => navigate({ name: 'compare' })}
              aria-label="Compare"
            >
              <GitCompare className="h-5 w-5" />
              {compare.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {compare.length}
                </span>
              )}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <span className="text-sm font-semibold">Notifications</span>
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'flex gap-3 border-b px-3 py-2.5 last:border-0',
                        !n.read && 'bg-primary/5'
                      )}
                    >
                      <div
                        className={cn(
                          'mt-1 h-2 w-2 shrink-0 rounded-full',
                          n.read ? 'bg-transparent' : 'bg-primary'
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {n.body}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate({ name: 'dashboard', tab: 'notifications' })}
                  >
                    View all
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border/60 bg-card pl-1 pr-2 py-1 hover:shadow-sm transition-all">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{user.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                      <Badge variant="secondary" className="mt-1 w-fit text-[10px] capitalize">
                        {user.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ name: 'dashboard' })}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ name: 'favorites' })}>
                    <Heart className="mr-2 h-4 w-4" /> Favorites
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Switch role (demo)
                  </DropdownMenuLabel>
                  {(['user', 'owner', 'admin'] as UserRole[]).map((r) => (
                    <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                      <span
                        className={cn(
                          'mr-2 h-2 w-2 rounded-full',
                          user.role === r ? 'bg-primary' : 'bg-transparent border border-border'
                        )}
                      />
                      <span className="capitalize">{r}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthModal('login')}
                >
                  Sign in
                </Button>
                <Button size="sm" onClick={() => openAuthModal('register')} className="shadow-soft">
                  Get started
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground">
                      <Home className="h-4 w-4" />
                    </div>
                    HouseHunt
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-1">
                  {[...NAV_LINKS, ...MORE_LINKS].map((link) => (
                    <button
                      key={link.label}
                      onClick={() => navigate(link.route)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive(link.route)
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-secondary'
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </button>
                  ))}
                  <div className="my-2 h-px bg-border" />
                  {user ? (
                    <>
                      <button
                        onClick={() => navigate({ name: 'dashboard' })}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </button>
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 px-1">
                      <Button onClick={() => openAuthModal('login')} variant="outline">
                        Sign in
                      </Button>
                      <Button onClick={() => openAuthModal('register')}>Get started</Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-underline"
          className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
        />
      )}
    </button>
  )
}
