import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/stats — aggregate platform analytics for dashboards & home stats
export async function GET() {
  try {
    const [
      totalProperties,
      totalAgents,
      totalReviews,
      rentCount,
      buyCount,
      featuredCount,
      premiumCount,
      verifiedCount,
      totalViews,
      avgRatingAgg,
      priceAgg,
    ] = await Promise.all([
      db.property.count(),
      db.agent.count(),
      db.review.count(),
      db.property.count({ where: { status: 'rent' } }),
      db.property.count({ where: { status: 'buy' } }),
      db.property.count({ where: { featured: true } }),
      db.property.count({ where: { premium: true } }),
      db.property.count({ where: { verified: true } }),
      db.property.aggregate({ _sum: { views: true } }),
      db.property.aggregate({ _avg: { rating: true } }),
      db.property.aggregate({ _sum: { price: true }, _avg: { price: true } }),
    ])

    // City distribution
    const citiesRaw = await db.property.groupBy({
      by: ['city'],
      _count: { city: true },
      orderBy: { _count: { city: 'desc' } },
      take: 6,
    })

    // Type distribution
    const typesRaw = await db.property.groupBy({
      by: ['type'],
      _count: { type: true },
      orderBy: { _count: { type: 'desc' } },
    })

    // Top properties by views
    const topProperties = await db.property.findMany({
      orderBy: { views: 'desc' },
      take: 5,
      select: { id: true, title: true, city: true, price: true, views: true, rating: true, status: true },
    })

    return NextResponse.json({
      totals: {
        properties: totalProperties,
        agents: totalAgents,
        reviews: totalReviews,
        views: totalViews._sum.views || 0,
        avgRating: Math.round((avgRatingAgg._avg.rating || 0) * 10) / 10,
        avgPrice: Math.round(priceAgg._avg.price || 0),
        totalValue: priceAgg._sum.price || 0,
      },
      breakdown: {
        rent: rentCount,
        buy: buyCount,
        featured: featuredCount,
        premium: premiumCount,
        verified: verifiedCount,
      },
      cities: citiesRaw.map((c) => ({ city: c.city, count: c._count.city })),
      types: typesRaw.map((t) => ({ type: t.type, count: t._count.type })),
      topProperties,
    })
  } catch (e) {
    console.error('[api/stats] error', e)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
