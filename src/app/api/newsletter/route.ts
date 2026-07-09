import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/newsletter — subscribe an email
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const existing = await db.newsletterSub.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }

    await db.newsletterSub.create({ data: { email } })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (e) {
    console.error('[api/newsletter] error', e)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
