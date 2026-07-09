'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Sparkles, Crown, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SectionHeading } from '@/components/shared/section-heading'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface Tier {
  name: string
  price: string
  period?: string
  description: string
  icon: typeof Sparkles
  features: string[]
  cta: string
  highlight?: boolean
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for casual browsers and first-time renters.',
    icon: Rocket,
    features: ['Browse all listings', 'Save up to 10 favorites', 'Basic search filters', 'Email support'],
    cta: 'Get started free',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For serious renters and active home-buyers.',
    icon: Sparkles,
    features: [
      'Everything in Starter',
      'Unlimited favorites & compare (up to 4)',
      'Advanced search & saved alerts',
      'Priority booking requests',
      'Real-time agent chat',
      'Priority support',
    ],
    cta: 'Start 14-day trial',
    highlight: true,
  },
  {
    name: 'Business',
    price: '$99',
    period: '/mo',
    description: 'For agents, owners, and real estate pros.',
    icon: Crown,
    features: [
      'Everything in Pro',
      'List unlimited properties',
      'Analytics dashboard & reports',
      'Featured & premium listing badges',
      'Team collaboration (up to 5 seats)',
      'Dedicated account manager',
    ],
    cta: 'Talk to sales',
  },
]

const COMPARISON_ROWS: { label: string; starter: boolean | string; pro: boolean | string; business: boolean | string }[] = [
  { label: 'Browse all listings', starter: true, pro: true, business: true },
  { label: 'Saved favorites', starter: '10', pro: 'Unlimited', business: 'Unlimited' },
  { label: 'Compare properties', starter: false, pro: true, business: true },
  { label: 'Advanced search filters', starter: false, pro: true, business: true },
  { label: 'Real-time agent chat', starter: false, pro: true, business: true },
  { label: 'Priority bookings', starter: false, pro: true, business: true },
  { label: 'List properties', starter: false, pro: false, business: true },
  { label: 'Featured & premium badges', starter: false, pro: false, business: true },
  { label: 'Analytics dashboard', starter: false, pro: false, business: true },
  { label: 'Team seats', starter: '1', pro: '1', business: '5' },
  { label: 'Support', starter: 'Email', pro: 'Priority email', business: 'Dedicated manager' },
]

const FAQS = [
  { q: 'Can I switch plans anytime?', a: 'Yes — upgrade, downgrade, or cancel anytime from your dashboard. Changes take effect immediately and we prorate any difference.' },
  { q: 'Is there a free trial for Pro?', a: 'Yes! Every Pro plan starts with a 14-day free trial. No credit card required.' },
  { q: 'Do you offer discounts for annual billing?', a: 'Yes, pay annually and save 20% on any paid plan. The discount is applied automatically at checkout.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, ACH, and PayPal. Business plans can also pay by invoice.' },
]

export default function PricingPage() {
  const openAuthModal = useAppStore((s) => s.openAuthModal)
  const [billing] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-background py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, transparent pricing"
            description="Choose the plan that fits your journey. No hidden fees, cancel anytime, and a 14-day free trial on every paid plan."
          />
          <div className="mt-6 flex justify-center">
            <Badge className="border-0 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              {billing === 'monthly' ? 'Monthly billing' : 'Yearly billing · Save 20%'}
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {TIERS.map((tier, i) => {
              const Icon = tier.icon
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className={cn(
                    'relative',
                    tier.highlight && 'lg:-mt-4'
                  )}
                >
                  <Card
                    className={cn(
                      'flex h-full flex-col rounded-2xl border-border/60 p-6 shadow-sm transition-all hover:-translate-y-1 md:p-8',
                      tier.highlight && 'border-primary/40 shadow-glow ring-2 ring-primary/20'
                    )}
                  >
                    {tier.highlight && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 border-0 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-xs font-semibold text-white shadow-md">
                        Most Popular
                      </Badge>
                    )}

                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'grid h-12 w-12 place-items-center rounded-2xl',
                        tier.highlight ? 'bg-primary/10 text-primary' : 'bg-secondary text-foreground'
                      )}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold">{tier.name}</h3>
                        <p className="text-xs text-muted-foreground">{tier.description}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-end gap-1">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      {tier.period && <span className="mb-1 text-sm text-muted-foreground">{tier.period}</span>}
                    </div>

                    <Button
                      onClick={() => openAuthModal('register')}
                      className={cn(
                        'mt-6 w-full',
                        tier.highlight
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      )}
                    >
                      {tier.cta}
                    </Button>

                    <ul className="mt-6 space-y-3">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-foreground/90">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Compare" title="Full feature comparison" description="See exactly what's included in each plan." />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="mt-10 overflow-hidden rounded-2xl border border-border/60 shadow-sm"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/60">
                  <TableHead className="w-1/2 text-sm font-semibold">Feature</TableHead>
                  <TableHead className="text-center text-sm font-semibold">Starter</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-primary">Pro</TableHead>
                  <TableHead className="text-center text-sm font-semibold">Business</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON_ROWS.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    <TableCell className="text-center"><Cell value={row.starter} /></TableCell>
                    <TableCell className="text-center bg-primary/5"><Cell value={row.pro} /></TableCell>
                    <TableCell className="text-center"><Cell value={row.business} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </div>
      </section>

      {/* FAQ snippet */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="FAQ" title="Pricing questions, answered" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:p-8"
          >
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-primary" />
  if (value === false) return <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
  return <span className="text-sm font-medium">{value}</span>
}
