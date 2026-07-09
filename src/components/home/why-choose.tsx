'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, SlidersHorizontal, MessageCircle, CreditCard } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { cn } from '@/lib/utils'

interface Feature {
  icon: typeof ShieldCheck
  title: string
  description: string
  accent: string
}

const FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    description: 'Every property is checked by our team so you can browse with confidence — no fakes, no surprises.',
    accent: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: SlidersHorizontal,
    title: 'Advanced Search',
    description: 'Filter by price, amenities, location, furnished status, and dozens of other criteria in real time.',
    accent: 'bg-amber-500/10 text-amber-600',
  },
  {
    icon: MessageCircle,
    title: 'Real-time Chat',
    description: 'Connect instantly with agents and owners through our built-in secure messaging system.',
    accent: 'bg-teal-500/10 text-teal-600',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Book visits and pay deposits safely with end-to-end encryption and transparent receipts.',
    accent: 'bg-rose-500/10 text-rose-600',
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Why HouseHunt"
          title="The smarter way to find your home"
          description="We blend cutting-edge tech with human expertise to make every step of your property journey effortless."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.08, 0.32) }}
                className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <span className={cn('grid h-14 w-14 place-items-center rounded-2xl transition-transform group-hover:scale-110', f.accent)}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
