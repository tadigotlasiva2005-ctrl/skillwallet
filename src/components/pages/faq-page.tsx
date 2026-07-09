'use client'

import { motion } from 'framer-motion'
import { HelpCircle, MessageCircle, ArrowRight } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SectionHeading } from '@/components/shared/section-heading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'

interface QA {
  q: string
  a: string
}

const CATEGORIES: { name: string; items: QA[] }[] = [
  {
    name: 'General',
    items: [
      {
        q: 'What is HouseHunt?',
        a: 'HouseHunt is a smart real estate platform that helps you discover, rent, and buy verified properties. We combine advanced search, real-time chat with agents, and a clean dashboard so you can manage everything in one place.',
      },
      {
        q: 'Do I need an account to browse listings?',
        a: "No — browsing is free and open. You only need an account to favorite properties, schedule visits, leave reviews, or post listings as an owner.",
      },
      {
        q: 'Which cities does HouseHunt cover?',
        a: 'We currently cover 120+ cities across the United States, with new markets added every month. Use the city filter on the listings page to see what is available near you.',
      },
      {
        q: 'Is HouseHunt available as a mobile app?',
        a: 'Our website is fully responsive and works beautifully on phones and tablets. Native iOS and Android apps are on the roadmap for later this year.',
      },
    ],
  },
  {
    name: 'Buying',
    items: [
      {
        q: 'Can I make an offer directly through HouseHunt?',
        a: 'Yes. On any property page, click "Make an Offer" to submit your terms. The listing agent will respond within 24 hours via your dashboard inbox.',
      },
      {
        q: 'Are the listing prices negotiable?',
        a: 'In most cases, yes. Use the chat feature to discuss offers with the agent. Some premium and verified listings are listed at firm prices, which will be clearly noted on the property page.',
      },
      {
        q: 'Do you help with mortgages?',
        a: 'We partner with leading mortgage providers to give you pre-approval in minutes. Visit our Services page or contact support to get matched with a lender.',
      },
    ],
  },
  {
    name: 'Renting',
    items: [
      {
        q: 'What documents do I need to rent?',
        a: 'Typically you will need a government-issued ID, proof of income (recent pay stubs or tax returns), and a reference from a previous landlord. Your agent will confirm the exact list for each property.',
      },
      {
        q: 'How long does the application process take?',
        a: 'Most applications are reviewed within 48 hours. You can track status in real time from your dashboard under "Bookings & Applications".',
      },
      {
        q: 'Are utilities included in rent?',
        a: 'It varies by listing. Each property page clearly lists which utilities are included and which are billed separately.',
      },
    ],
  },
  {
    name: 'Payments',
    items: [
      {
        q: 'Is it safe to pay through HouseHunt?',
        a: 'Yes. All payments are encrypted end-to-end and processed through PCI-compliant gateways. Booking fees and deposits are held in escrow until your visit or move-in is confirmed.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major credit and debit cards, ACH transfers, and popular digital wallets. Some agents also accept wire transfers for large transactions.',
      },
      {
        q: 'How do refunds work?',
        a: 'Refunds are processed automatically based on the cancellation policy shown on each listing. Most refunds appear on your card within 5–7 business days.',
      },
    ],
  },
  {
    name: 'Account',
    items: [
      {
        q: 'How do I switch between user and owner accounts?',
        a: 'Open your dashboard and use the role switcher in the sidebar. You can switch between User, Owner, and (if applicable) Admin modes anytime without logging out.',
      },
      {
        q: 'I forgot my password. What should I do?',
        a: 'On the login page, click "Forgot password" and enter your email. We will send you a secure reset link that expires in 30 minutes.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Settings → Account → Delete account. You will be asked to confirm. Your data is permanently removed within 30 days, in line with our privacy policy.',
      },
    ],
  },
]

export default function FaqPage() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-background py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Help center"
            title="Frequently Asked Questions"
            description="Browse our most-asked questions by category. If you can't find what you're looking for, our team is one click away."
          />
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            {/* Accordion categories */}
            <div className="space-y-10">
              {CATEGORIES.map((cat) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                      <HelpCircle className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-bold">{cat.name}</h2>
                  </div>
                  <Card className="mt-4 rounded-2xl border-border/60 p-4 shadow-sm md:p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {cat.items.map((item, i) => (
                        <AccordionItem key={i} value={`${cat.name}-${i}`}>
                          <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Sticky sidebar */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <Card className="rounded-2xl border-border/60 bg-gradient-to-br from-primary to-emerald-700 p-6 text-primary-foreground shadow-glow">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-md">
                  <MessageCircle className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-xl font-bold">Still have questions?</h3>
                <p className="mt-2 text-sm text-primary-foreground/85">
                  Our friendly support team is here to help, 7 days a week. Get a response in minutes — not days.
                </p>
                <Button
                  onClick={() => navigate({ name: 'contact' })}
                  className="mt-5 w-full gap-2 bg-amber-500 text-white hover:bg-amber-600"
                >
                  Contact us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Card>

              <Card className="mt-4 rounded-2xl border-border/60 p-5 shadow-sm">
                <h4 className="text-sm font-semibold">Quick links</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {['Pricing', 'Services', 'Browse listings', 'Meet our agents'].map((l) => {
                    const route =
                      l === 'Pricing' ? { name: 'pricing' as const }
                      : l === 'Services' ? { name: 'services' as const }
                      : l === 'Browse listings' ? { name: 'listings' as const }
                      : { name: 'agents' as const }
                    return (
                      <li key={l}>
                        <button
                          onClick={() => navigate(route)}
                          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          {l}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
