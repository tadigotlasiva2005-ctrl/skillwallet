'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SectionHeading } from '@/components/shared/section-heading'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: 'Visit us',
    lines: ['123 Market Street, Suite 400', 'San Francisco, CA 94103'],
    accent: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: Phone,
    title: 'Call us',
    lines: ['+1 (800) 555-0142', 'Mon–Fri, 9am–6pm PT'],
    accent: 'bg-amber-500/10 text-amber-600',
  },
  {
    icon: Mail,
    title: 'Email us',
    lines: ['hello@househunt.com', 'support@househunt.com'],
    accent: 'bg-teal-500/10 text-teal-600',
  },
  {
    icon: Clock,
    title: 'Hours',
    lines: ['Mon–Fri: 9am – 6pm', 'Sat–Sun: 10am – 4pm'],
    accent: 'bg-rose-500/10 text-rose-600',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await api.contact.submit(form)
      toast.success('Message sent!', { description: "We'll get back to you within 24 hours." })
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err: any) {
      toast.error('Failed to send message', { description: err?.message || 'Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-background py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Contact"
            title="Let's talk"
            description="Have a question, suggestion, or partnership idea? We'd love to hear from you. Reach out and our team will respond within one business day."
          />
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="rounded-2xl border-border/60 p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-bold">Send us a message</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fill out the form and we'll get back to you shortly.
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full name *</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Jane Doe"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@example.com"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us a bit more..."
                      rows={5}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Right: info + map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {CONTACT_INFO.map((c) => {
                  const Icon = c.icon
                  return (
                    <Card key={c.title} className="rounded-2xl border-border/60 p-5 shadow-sm">
                      <span className={`grid h-11 w-11 place-items-center rounded-xl ${c.accent}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-3 text-sm font-semibold">{c.title}</h3>
                      {c.lines.map((l) => (
                        <p key={l} className="text-sm text-muted-foreground">{l}</p>
                      ))}
                    </Card>
                  )
                })}
              </div>

              {/* Stylized map placeholder */}
              <Card className="relative aspect-[4/3] overflow-hidden rounded-2xl border-border/60 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50" />
                {/* Fake streets */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute left-0 right-0 top-1/3 h-1 bg-emerald-700/40" />
                  <div className="absolute left-0 right-0 top-2/3 h-1 bg-emerald-700/40" />
                  <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-emerald-700/40" />
                  <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-emerald-700/40" />
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
                    <MapPin className="h-8 w-8" />
                  </span>
                  <p className="mt-3 rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-foreground shadow-sm">
                    HouseHunt HQ
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
