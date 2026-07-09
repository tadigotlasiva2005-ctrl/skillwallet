import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// In-memory booking store (demo). Persists for the lifetime of the dev server.
// In production this would be a Prisma `Booking` model.
type Booking = {
  id: string
  propertyId: string
  propertyTitle: string
  propertyImage: string
  city: string
  userName: string
  userEmail: string
  userPhone: string
  date: string
  timeSlot: string
  message: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  createdAt: string
}

declare global {
  var __househunt_bookings: Booking[] | undefined
}
const bookings: Booking[] = globalThis.__househunt_bookings ?? []
globalThis.__househunt_bookings = bookings

// GET /api/bookings — list all bookings (owner/admin view) optionally filtered by userEmail
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userEmail = searchParams.get('userEmail')
  let result = bookings
  if (userEmail) result = bookings.filter((b) => b.userEmail === userEmail)
  return NextResponse.json({ data: result, total: result.length })
}

// POST /api/bookings — create a booking request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { propertyId, userName, userEmail, userPhone, date, timeSlot, message } = body

    if (!propertyId || !userName || !userEmail || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const property = await db.property.findUnique({
      where: { id: propertyId },
      select: { title: true, images: true, city: true },
    })
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const booking: Booking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      propertyId,
      propertyTitle: property.title,
      propertyImage: property.images.split(',')[0] || '/properties/prop1.png',
      city: property.city,
      userName,
      userEmail,
      userPhone: userPhone || '',
      date,
      timeSlot,
      message: message || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    bookings.push(booking)

    return NextResponse.json(booking, { status: 201 })
  } catch (e) {
    console.error('[api/bookings] error', e)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

// PATCH /api/bookings — update booking status (approve/reject/cancel)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status } = body
    const idx = bookings.findIndex((b) => b.id === id)
    if (idx === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    bookings[idx].status = status
    return NextResponse.json(bookings[idx])
  } catch (e) {
    console.error('[api/bookings PATCH] error', e)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
