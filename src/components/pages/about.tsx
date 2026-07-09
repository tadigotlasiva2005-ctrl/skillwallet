'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Building2, Users, Star, MapPin, ShieldCheck, Lightbulb, Heart, BadgeCheck } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import type { Agent } from '@/lib/types'

const STATS = [
  { icon: Building2, label: 'Properties', value: '10,000+' },
  { icon: Users, label: 'Active users', value: '50,000+' },
  { icon: BadgeCheck, label: 'Verified agents', value: '500+' },
  { icon: MapPin, label: 'Cities covered', value: '120+' },
]

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Transparency',
    description: 'No hidden fees, no fake listings. Every property, agent, and review on HouseHunt is verified and honest.',
    accent: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We invest in smart search, real-time chat, and data-driven insights so you always stay one step ahead.',
    accent: 'bg-amber-500/10 text-amber-600',
  },
  {
    icon: Heart,
    title: 'Trust',
    description: 'Our community is at the heart of everything we do. We earn it by delivering on our promises — every time.',
    accent: 'bg-rose-500/10 text-rose-600',
  },
]

export default function AboutPage() {
  const navigate = useAppStore((s) => s.navigate)
  const [agents, setAgents] = useState<Agent[] | null>(null)

  useEffect(() => {
    api.agents
      .list()
      .then((a) => setAgents(a))
      .catch(() => setAgents([]))
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10">
          <Image src="/properties/hero.png" alt="About HouseHunt" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/55 to-transparent" />
        </div>
        <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl text-white">
            <Badge className="mb-4 border-0 bg-amber-500/95 text-white">About us</Badge>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Reimagining the way homes are{' '}
              <span className="bg-gradient-to-r from-amber-300 to-primary bg-clip-text text-transparent">found</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              HouseHunt was founded on a simple idea: finding a home should feel exciting, not exhausting. We pair the
              best of technology with the warmth of human expertise to make property discovery joyful.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => navigate({ name: 'listings' })} className="bg-amber-500 text-white hover:bg-amber-600">
                Explore properties
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ name: 'contact' })}
                className="border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
              >
                Get in touch
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading
                align="left"
                eyebrow="Our mission"
                title="A platform built for people first"
                description="We believe technology should empower people, not replace them. That's why every feature on HouseHunt is designed to bring clarity, speed, and confidence to your property journey — whether you're renting your first apartment or buying your forever home."
              />
              <div className="mt-6 space-y-4">
                {[
                  'Curated, verified listings you can trust',
                  'Smart search that learns your preferences',
                  'Real-time chat with responsive agents',
                  'Transparent pricing with no hidden fees',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <BadgeCheck className="h-4 w-4" />
                    </span>
                    <p className="text-sm text-foreground/90">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-glow"
            >
              <Image src="/properties/hero.png" alt="Our mission" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/30 bg-white/15 p-4 backdrop-blur-xl">
                <p className="text-sm font-semibold text-white">"Home isn't a place, it's a feeling."</p>
                <p className="text-xs text-white/80">— The HouseHunt Team</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-4 rounded-3xl bg-gradient-to-r from-primary to-emerald-700 p-8 md:grid-cols-4 md:p-10">
            {STATS.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center gap-2 text-center text-primary-foreground md:items-start md:text-left"
                >
                  <Icon className="h-7 w-7 text-amber-300" />
                  <div className="text-2xl font-bold md:text-3xl">{s.value}</div>
                  <div className="text-xs uppercase tracking-wide text-primary-foreground/80 md:text-sm">{s.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Our values"
            title="What we stand for"
            description="The principles that guide every product decision and every customer interaction."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <Card className="h-full rounded-2xl border-border/60 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow">
                    <span className={`grid h-14 w-14 place-items-center rounded-2xl ${v.accent}`}>
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team preview */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Our team"
            title="Meet the agents behind HouseHunt"
            description="A trusted network of verified, top-rated agents ready to guide you home."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {agents === null
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
                ))
              : agents.slice(0, 4).map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                  >
                    <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow">
                      <div className="relative aspect-square w-full overflow-hidden">
                        <Image src={a.avatar} alt={a.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                        {a.verified && (
                          <Badge className="absolute left-3 top-3 border-0 bg-emerald-500/95 text-white">
                            <BadgeCheck className="mr-1 h-3 w-3" /> Verified
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{a.name}</h3>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-semibold">{a.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.company}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full border-primary/30 text-primary hover:bg-primary/5"
                          onClick={() => navigate({ name: 'agents' })}
                        >
                          View profile
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button onClick={() => navigate({ name: 'agents' })} variant="outline" className="rounded-full">
              See all agents
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
