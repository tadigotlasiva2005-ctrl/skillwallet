import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { transformProperty } from '@/lib/types'

// GET /api/properties/[id] — single property with agent + reviews, increments views
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const row = await db.property.findUnique({
      where: { id },
      include: { agent: true, reviews: { orderBy: { date: 'desc' } } },
    })
    if (!row) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }
    // increment view count (fire-and-forget, non-blocking)
    db.property.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {})
    return NextResponse.json(transformProperty(row))
  } catch (e) {
    console.error('[api/properties/[id]] error', e)
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 })
  }
}
