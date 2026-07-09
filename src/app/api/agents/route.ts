import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/agents — list all agents with property counts
export async function GET(_req: NextRequest) {
  try {
    const agents = await db.agent.findMany({
      include: {
        _count: { select: { properties: true } },
      },
      orderBy: { rating: 'desc' },
    })
    const data = agents.map((a) => ({
      ...a,
      propertyCount: a._count.properties,
      _count: undefined,
    }))
    return NextResponse.json(data)
  } catch (e) {
    console.error('[api/agents] error', e)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}
