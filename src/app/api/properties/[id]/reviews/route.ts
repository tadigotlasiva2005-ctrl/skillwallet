import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/properties/[id]/reviews — add a review
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { author, avatar, rating, comment } = body

    if (!author || !rating || !comment) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const property = await db.property.findUnique({ where: { id } })
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const review = await db.review.create({
      data: {
        propertyId: id,
        author,
        avatar: avatar || '/agents/agent1.png',
        rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
        comment,
      },
    })

    // Recompute aggregate rating
    const agg = await db.review.aggregate({
      where: { propertyId: id },
      _avg: { rating: true },
    })
    await db.property.update({
      where: { id },
      data: { rating: Math.round((agg._avg.rating || 0) * 10) / 10 },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (e) {
    console.error('[api/properties/[id]/reviews] error', e)
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 })
  }
}
