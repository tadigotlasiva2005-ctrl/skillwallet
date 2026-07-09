import { NextResponse } from 'next/server'

// API health check for HouseHunt
export async function GET() {
  return NextResponse.json({
    name: 'HouseHunt API',
    version: '1.0.0',
    status: 'ok',
    endpoints: [
      '/api/properties',
      '/api/properties/[id]',
      '/api/properties/[id]/reviews',
      '/api/agents',
      '/api/contact',
      '/api/newsletter',
      '/api/stats',
      '/api/bookings',
      '/api/auth/login',
      '/api/auth/register',
    ],
  })
}
