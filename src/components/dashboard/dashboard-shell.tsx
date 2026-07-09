'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { UserCog, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore, type UserRole } from '@/lib/store'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'

export interface DashboardTab {
  id: string
  label: string
  icon: LucideIcon
}

interface DashboardShellProps {
  title: string
  tabs: DashboardTab[]
  activeTab: string
  onTabChange: (id: string) => void
  children: React.ReactNode
}

const ROLE_LABEL: Record<UserRole, string> = {
  guest: 'Guest',
  user: 'User',
  owner: 'Owner',
  admin: 'Admin',
}

const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  guest: 'bg-muted text-muted-foreground',
  user: 'bg-primary/10 text-primary',
  owner: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  admin: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
}

export function DashboardShell({
  title,
  tabs,
  activeTab,
  onTabChange,
  children,
}: DashboardShellProps) {
  const user = useAppStore((s) => s.user)
  const setRole = useAppStore((s) => s.setRole)
  const openAuthModal = useAppStore((s) => s.openAuthModal)

  if (!user) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <EmptyState
          icon={UserCog}
          title="Sign in required"
          description="Please sign in to access your dashboard, manage your bookings, saved properties, and messages."
          action={
            <Button onClick={() => openAuthModal('login')} size="lg">
              Sign in to continue
            </Button>
          }
        />
      </div>
    )
  }

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden rounded-2xl border-border/60 bg-gradient-to-br from-card via-card to-primary/5">
          <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Badge
                    className={cn('border-0 font-medium', ROLE_BADGE_CLASS[user.role])}
                  >
                    {ROLE_LABEL[user.role]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="text-sm font-medium">
                  {new Date(user.joinedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">Switch role (demo)</span>
                <Select
                  value={user.role}
                  onValueChange={(v) => setRole(v as UserRole)}
                >
                  <SelectTrigger className="w-[150px]" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar nav (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Card className="rounded-2xl border-border/60 bg-card p-2">
              <nav className="flex flex-col gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const active = tab.id === activeTab
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
                      className={cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                        active
                          ? 'bg-primary text-primary-foreground shadow-soft'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{tab.label}</span>
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-transform',
                          active
                            ? 'translate-x-0 opacity-100'
                            : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'
                        )}
                      />
                    </button>
                  )
                })}
              </nav>
            </Card>
            <p className="mt-3 px-3 text-xs text-muted-foreground">{title}</p>
          </div>
        </aside>

        {/* Mobile horizontal scroll tabs */}
        <div className="lg:hidden">
          <div className="sticky top-16 z-20 -mx-4 mb-4 overflow-x-auto bg-background/80 px-4 py-2 backdrop-blur-md no-scrollbar">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const active = tab.id === activeTab
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all whitespace-nowrap',
                      active
                        ? 'bg-primary text-primary-foreground shadow-soft'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-w-0"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

// Small reusable stat card used across dashboards
export function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  accent = 'primary',
}: {
  icon: LucideIcon
  label: string
  value: React.ReactNode
  sublabel?: string
  accent?: 'primary' | 'amber' | 'teal' | 'rose'
}) {
  const accentClass = {
    primary: 'bg-primary/10 text-primary',
    amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    teal: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
    rose: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  }[accent]

  return (
    <Card className="rounded-2xl border-border/60 bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
          {sublabel && (
            <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
          )}
        </div>
        <div className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', accentClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  )
}

// Section card with header
export function PanelCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn('rounded-2xl border-border/60 bg-card p-6', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </Card>
  )
}
