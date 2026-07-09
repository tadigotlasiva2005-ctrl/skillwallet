'use client'

import { motion } from 'framer-motion'

const PARTNERS = [
  'RealtyOne',
  'HomeLoan Co',
  'UrbanLiving',
  'PrimeMortgage',
  'EstatePro',
  'TrustRealty',
]

export function Partners() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border/60 bg-secondary/40 px-6 py-8 md:px-10"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by industry leaders
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-16">
            {PARTNERS.map((p) => (
              <span
                key={p}
                className="cursor-default text-lg font-bold tracking-tight text-muted-foreground/60 grayscale transition-all hover:text-primary hover:grayscale-0 md:text-xl"
              >
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
