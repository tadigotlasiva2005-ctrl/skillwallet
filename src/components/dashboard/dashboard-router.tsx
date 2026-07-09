'use client'

import * as React from 'react'
import { useAppStore } from '@/lib/store'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { UserCog } from 'lucide-react'
import UserDashboard from './user-dashboard'
import OwnerDashboard from './owner-dashboard'
import AdminDashboard from './admin-dashboard'

export default function DashboardRouter() {
  const user = useAppStore((s) => s.user)
  const openAuthModal = useAppStore((s) => s.openAuthModal)

  if (!user) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <EmptyState
          icon={UserCog}
          title="Sign in required"
          description="Please sign in to access your dashboard, manage bookings, saved properties, and messages."
          action={
            <Button onClick={() => openAuthModal('login')} size="lg">
              Sign in to continue
            </Button>
          }
        />
      </div>
    )
  }

  // Block guests from accessing dashboards
  if (user.role === 'guest') {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <EmptyState
          icon={UserCog}
          title="Pick a role to continue"
          description="Choose a dashboard role (user, owner, or admin) from the auth screen to explore the dashboards."
          action={
            <Button onClick={() => openAuthModal('login')} size="lg">
              Sign in
            </Button>
          }
        />
      </div>
    )
  }

  if (user.role === 'owner') return <OwnerDashboard />
  if (user.role === 'admin') return <AdminDashboard />
  return <UserDashboard />
}
