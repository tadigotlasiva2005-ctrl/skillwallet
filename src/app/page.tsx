'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AuthModal } from '@/components/auth-modal'
import { ChatWidget } from '@/components/chat-widget'

// Views
import HomeView from '@/components/home/home-view'
import { ListingsView } from '@/components/listings/listings-view'
import { PropertyDetails } from '@/components/details/property-details'
import DashboardRouter from '@/components/dashboard/dashboard-router'
// Static / secondary pages
import AboutPage from '@/components/pages/about'
import AgentsPage from '@/components/pages/agents-page'
import { ComparePage } from '@/components/pages/compare'
import ContactPage from '@/components/pages/contact'
import FaqPage from '@/components/pages/faq-page'
import { FavoritesPage } from '@/components/pages/favorites'
import NotFoundPage from '@/components/pages/not-found'
import PricingPage from '@/components/pages/pricing'
import ServicesPage from '@/components/pages/services'

export default function Home() {
  const route = useAppStore((s) => s.route)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.name + (route.name === 'details' ? route.id : '') + (route.name === 'dashboard' ? route.tab || '' : '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderRoute(route)}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />

      {/* Floating overlays */}
      <ChatWidget />
      <AuthModal />
    </div>
  )
}

function renderRoute(route: ReturnType<typeof useAppStore.getState>['route']) {
  switch (route.name) {
    case 'home':
      return <HomeView />
    case 'listings':
      return <ListingsView />
    case 'details':
      return <PropertyDetails propertyId={route.id} />
    case 'favorites':
      return <FavoritesPage />
    case 'compare':
      return <ComparePage />
    case 'dashboard':
      return <DashboardRouter />
    case 'about':
      return <AboutPage />
    case 'agents':
      return <AgentsPage />
    case 'contact':
      return <ContactPage />
    case 'faq':
      return <FaqPage />
    case 'pricing':
      return <PricingPage />
    case 'services':
      return <ServicesPage />
    case 'login':
    case 'register':
      // These are handled via the modal; if navigated directly, render home.
      return <HomeView />
    case 'not-found':
    default:
      return <NotFoundPage />
  }
}
