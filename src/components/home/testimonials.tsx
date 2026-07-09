'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { cn } from '@/lib/utils'

interface Testimonial {
  name: string
  role: string
  avatar: string
  quote: string
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Mitchell',
    role: 'Homeowner, Miami',
    avatar: '/agents/agent1.png',
    rating: 5,
    quote:
      "HouseHunt made finding our dream home a breeze. The verified listings gave us peace of mind and our agent was incredibly responsive. We moved in within three weeks!",
  },
  {
    name: 'James Carter',
    role: 'Renter, Austin',
    avatar: '/agents/agent2.png',
    rating: 5,
    quote:
      "The advanced search filters saved me hours of scrolling. I narrowed down to exactly the kind of studio I wanted and booked a tour in minutes. Couldn't be happier.",
  },
  {
    name: 'Priya Sharma',
    role: 'Investor, New York',
    avatar: '/agents/agent3.png',
    rating: 5,
    quote:
      "As an investor, I rely on accurate data. HouseHunt's dashboards and property analytics are top-notch. I've closed four deals through the platform this year alone.",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by thousands of renters & buyers"
          description="Real stories from real people who found their perfect home with HouseHunt."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.1, 0.3) }}
              className="relative rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <Quote className="absolute right-5 top-5 h-10 w-10 text-primary/10" />

              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
                "{t.quote}"
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-primary/20">
                  <Image src={t.avatar} alt={t.name} fill sizes="44px" className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
