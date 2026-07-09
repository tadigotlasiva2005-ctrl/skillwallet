'use client'

import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SectionHeading } from '@/components/shared/section-heading'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

interface QA {
  q: string
  a: string
}

const FAQS: QA[] = [
  {
    q: 'How do I list my property on HouseHunt?',
    a: 'Create a free account, switch to "Owner" mode from your dashboard, and click "Add Property". Fill in the listing details, upload photos, set your price, and submit. Our team verifies every listing within 24 hours before it goes live.',
  },
  {
    q: 'How do property bookings and tours work?',
    a: 'On any property page, click "Schedule a Visit" to pick a date and time. The listing agent will approve your request, and you will get a confirmation in your dashboard and via email. You can also request a virtual tour if available.',
  },
  {
    q: 'Are my payments secure?',
    a: 'Absolutely. HouseHunt uses end-to-end encryption for all transactions. Booking fees and deposits are held in escrow and only released to the owner once your visit or move-in is confirmed. You will always receive a digital receipt.',
  },
  {
    q: 'How are agents verified?',
    a: 'Every agent on HouseHunt undergoes identity verification, license checks, and a background screening. Verified agents display a green checkmark badge on their profile. You can also read reviews from previous clients before reaching out.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes. You can cancel any pending or approved booking from your dashboard up to 24 hours before the scheduled time. Refunds are processed automatically based on the cancellation policy shown on the listing.',
  },
  {
    q: 'What are premium listings?',
    a: 'Premium listings are properties highlighted by owners for extra visibility. They appear at the top of search results, feature larger photos, and include a "Premium" badge. Premium status does not affect the property price — only its placement.',
  },
]

export function FaqSection() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Quick answers to the questions we hear most. Still curious? Reach out anytime."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:p-8"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-primary/5 p-5 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <HelpCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Still have questions?</p>
                <p className="text-xs text-muted-foreground">Our support team is here to help, 7 days a week.</p>
              </div>
            </div>
            <Button onClick={() => navigate({ name: 'contact' })} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Contact support
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
