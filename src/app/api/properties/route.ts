import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { transformProperty } from '@/lib/types'

// GET /api/properties — advanced filtering, sorting, pagination, search
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search') || undefined
    const city = searchParams.get('city') || undefined
    const status = searchParams.get('status') || undefined // rent | buy | all
    const type = searchParams.get('type') || undefined
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const furnished = searchParams.get('furnished')
    const parking = searchParams.get('parking')
    const featured = searchParams.get('featured')
    const premium = searchParams.get('premium')
    const sort = searchParams.get('sort') || 'newest'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '9', 10)))

    // Build Prisma where clause
    const where: any = { AND: [] }

    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
          { city: { contains: search } },
          { state: { contains: search } },
          { address: { contains: search } },
        ],
      })
    }
    if (city && city !== 'all') where.AND.push({ city: { contains: city } })
    if (status && status !== 'all') where.AND.push({ status })
    if (type && type !== 'all') where.AND.push({ type })
    if (minPrice) where.AND.push({ price: { gte: parseInt(minPrice, 10) } })
    if (maxPrice) where.AND.push({ price: { lte: parseInt(maxPrice, 10) } })
    if (bedrooms) where.AND.push({ bedrooms: { gte: parseInt(bedrooms, 10) } })
    if (bathrooms) where.AND.push({ bathrooms: { gte: parseInt(bathrooms, 10) } })
    if (furnished === 'true') where.AND.push({ furnished: true })
    if (parking === 'true') where.AND.push({ parking: { gt: 0 } })
    if (featured === 'true') where.AND.push({ featured: true })
    if (premium === 'true') where.AND.push({ premium: true })

    if (where.AND.length === 0) delete where.AND

    // Sorting
    const orderBy: any =
      sort === 'oldest'
        ? { createdAt: 'asc' }
        : sort === 'price-low'
          ? { price: 'asc' }
          : sort === 'price-high'
            ? { price: 'desc' }
            : sort === 'rating'
              ? { rating: 'desc' }
              : sort === 'featured'
                ? [{ featured: 'desc' }, { createdAt: 'desc' }]
                : { createdAt: 'desc' } // newest default

    const [total, rows] = await Promise.all([
      db.property.count({ where }),
      db.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { agent: true, reviews: true },
      }),
    ])

    const data = rows.map(transformProperty)

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (e) {
    console.error('[api/properties] error', e)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}
