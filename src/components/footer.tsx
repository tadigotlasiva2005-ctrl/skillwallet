'use client'

import { Home, Mail, Phone, MapPin, Twitter, Instagram, Linkedin, Facebook, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore, type Route } from '@/lib/store'
import { toast } from 'sonner'
import { useState } from 'react'

const FOOTER_LINKS: { title: string; links: { label: string; route: Route }[] }[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', route: { name: 'home' } },
      { label: 'Property Listings', route: { name: 'listings' } },
      { label: 'Agents', route: { name: 'agents' } },
      { label: 'Pricing', route: { name: 'pricing' } },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', route: { name: 'about' } },
      { label: 'Services', route: { name: 'services' } },
      { label: 'Contact', route: { name: 'contact' } },
      { label: 'FAQ', route: { name: 'faq' } },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Dashboard', route: { name: 'dashboard' } },
      { label: 'Favorites', route: { name: 'favorites' } },
      { label: 'Compare', route: { name: 'compare' } },
      { label: 'Sign In', route: { name: 'login' } },
    ],
  },
]

export function Footer() {
  const navigate = useAppStore((s) => s.navigate)
  const [email, setEmail] = useState('')

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        toast.success('Subscribed!', { description: 'You will receive our latest listings & market insights.' })
        setEmail('')
      }
    } catch {
      toast.error('Subscription failed. Please try again.')
    }
  }

  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      {/* Newsletter strip */}
      <div className="border-b border-border/60">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-primary to-emerald-700 p-8 md:p-10 text-primary-foreground text-center md:flex-row md:justify-between md:text-left shadow-glow">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold">Stay ahead of the market</h3>
              <p className="mt-2 text-primary-foreground/80">
                Get the latest listings, price-drop alerts, and exclusive real estate insights delivered weekly.
              </p>
            </div>
            <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/15 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white/50"
              />
              <Button type="submit" variant="secondary" className="shrink-0">
                <Send className="h-4 w-4 mr-1.5" /> Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <button
              onClick={() => navigate({ name: 'home' })}
              className="flex items-center gap-2"
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground shadow-md">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">
                House<span className="text-primary">Hunt</span>
              </span>
            </button>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              The smart house rental & real estate platform. Discover verified properties, connect with
              trusted agents, and find your perfect home — all in one place.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a href="mailto:support@househunt.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" /> support@househunt.com
              </a>
              <a href="tel:+18005554868" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" /> +1 (800) 555-HUNT
              </a>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> 500 Realty Plaza, New York, NY
              </p>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground/80">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.route)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HouseHunt. All rights reserved. Built with Next.js, Prisma & Tailwind CSS.
          </p>
          <div className="flex items-center gap-3">
            {[Twitter, Instagram, Linkedin, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="grid h-8 w-8 place-items-center rounded-full border border-border/60 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
