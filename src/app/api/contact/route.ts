import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/contact — save a contact message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    const record = await db.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || '',
        subject: subject || 'General Inquiry',
        message,
      },
    })

    return NextResponse.json({ success: true, id: record.id }, { status: 201 })
  } catch (e) {
    console.error('[api/contact] error', e)
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 })
  }
}
