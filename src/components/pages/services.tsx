'use client'

import { motion } from 'framer-motion'
import {
  Home,
  Video,
  Landmark,
  Scale,
  ClipboardCheck,
  Truck,
  Search,
  Eye,
  CalendarCheck,
  KeyRound,
  ArrowRight,
} from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface Service {
  icon: typeof Home
  title: string
  description: string
  accent: string
}

const SERVICES: Service[] = [
  {
    icon: Home,
    title: 'Property Listing',
    description: 'List your property in minutes with our guided wizard. We optimize every listing for maximum visibility and reach.',
    accent: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: Video,
    title: 'Virtual Tours',
    description: 'Explore properties from anywhere with HD virtual tours and 3D walkthroughs — no appointment required.',
    accent: 'bg-amber-500/10 text-amber-600',
  },
  {
    icon: Landmark,
    title: 'Mortgage Assistance',
    description: 'Get pre-approved in minutes through our trusted lender network. Compare rates and find the best fit for you.',
    accent: 'bg-teal-500/10 text-teal-600',
  },
  {
    icon: Scale,
    title: 'Legal Support',
    description: 'Every transaction is backed by licensed attorneys who review leases, contracts, and disclosures on your behalf.',
    accent: 'bg-rose-500/10 text-rose-600',
  },
  {
    icon: ClipboardCheck,
    title: 'Home Inspection',
    description: 'Book certified inspectors who deliver detailed reports within 48 hours, so you can buy with confidence.',
    accent: 'bg-violet-500/10 text-violet-600',
  },
  {
    icon: Truck,
    title: 'Moving Services',
    description: 'From packing to delivery, our vetted moving partners handle the heavy lifting at exclusive HouseHunt rates.',
    accent: 'bg-orange-500/10 text-orange-600',
  },
]

const STEPS: { icon: typeof Search; title: string; description: string }[] = [
  { icon: Search, title: 'Search', description: 'Browse verified listings with smart filters that learn your taste.' },
  { icon: Eye, title: 'Visit', description: 'Schedule an in-person or virtual tour with a verified agent.' },
  { icon: CalendarCheck, title: 'Book', description: 'Make an offer or sign your lease — all paperwork digital.' },
  { icon: KeyRound, title: 'Move in', description: 'Pick up your keys and let us handle the move with our partners.' },
]

export default function ServicesPage() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-background py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Services"
            title="End-to-end services for every step"
            description="HouseHunt isn't just a listings site. From your first search to move-in day, we offer a complete suite of services to make your journey effortless."
          />
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.3) }}
                >
                  <Card className="group h-full rounded-2xl border-border/60 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow">
                    <span className={cn('grid h-14 w-14 place-items-center rounded-2xl transition-transform group-hover:scale-110', s.accent)}>
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                    <button
                      onClick={() => navigate({ name: 'contact' })}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                    >
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-16 md:py-20 bg-secondary/40">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="How it works"
            title="Four simple steps to home"
            description="Our streamlined process gets you from search to settled in record time."
          />

          <div className="relative mt-14">
            {/* Connector line on lg+ */}
            <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className="relative">
                      <span className="grid h-20 w-20 place-items-center rounded-full bg-card text-primary shadow-glow ring-4 ring-background">
                        <Icon className="h-9 w-9" />
                      </span>
                      <span className="absolute -right-1 -top-1 grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">{step.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Button onClick={() => navigate({ name: 'listings' })} size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Get started today
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
