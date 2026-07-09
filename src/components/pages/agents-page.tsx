'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, BadgeCheck, Phone, Mail, Building2, TrendingUp } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import type { Agent } from '@/lib/types'
import { toast } from 'sonner'

export default function AgentsPage() {
  const navigate = useAppStore((s) => s.navigate)
  const [agents, setAgents] = useState<Agent[] | null>(null)

  useEffect(() => {
    api.agents
      .list()
      .then((a) => setAgents(a))
      .catch(() => setAgents([]))
  }, [])

  const handleContact = (a: Agent) => {
    toast.success(`Opening chat with ${a.name}`, {
      description: `You can reach them at ${a.email} or ${a.phone}.`,
    })
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-background py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Our agents"
            title="Meet our agents"
            description="Hand-picked, verified, and rated by thousands of happy clients. Connect with a trusted expert who knows your market inside out."
          />
        </div>
      </section>

      {/* Agents grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          {agents === null ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
              ))}
            </div>
          ) : agents.length === 0 ? (
            <p className="text-center text-muted-foreground">No agents found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {agents.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.3) }}
                >
                  <Card className="group overflow-hidden rounded-2xl border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow">
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={a.avatar}
                        alt={a.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {a.verified && (
                        <Badge className="absolute left-3 top-3 border-0 bg-emerald-500/95 text-white">
                          <BadgeCheck className="mr-1 h-3 w-3" /> Verified
                        </Badge>
                      )}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white">{a.name}</h3>
                          <p className="text-xs text-white/85">{a.title}</p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 backdrop-blur-md">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-white">{a.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4 text-primary/70" />
                        <span className="truncate">{a.company}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="rounded-lg bg-secondary/60 p-2">
                          <div className="flex items-center justify-center gap-1 text-sm font-semibold text-foreground">
                            <TrendingUp className="h-3.5 w-3.5 text-primary" />
                            {a.totalSales}
                          </div>
                          <div className="text-xs text-muted-foreground">Total sales</div>
                        </div>
                        <div className="rounded-lg bg-secondary/60 p-2">
                          <div className="text-sm font-semibold text-foreground">
                            {/* propertyCount not in Agent type, but API returns it */}
                            {(a as Agent & { propertyCount?: number }).propertyCount ?? 0}
                          </div>
                          <div className="text-xs text-muted-foreground">Listings</div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-primary/30 text-primary hover:bg-primary/5"
                          onClick={() => navigate({ name: 'listings' })}
                        >
                          View listings
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => handleContact(a)}
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Contact
                        </Button>
                      </div>

                      <div className="flex items-center gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {a.phone}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
