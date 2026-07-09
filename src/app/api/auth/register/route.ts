import { NextRequest, NextResponse } from 'next/server'

// Demo register — mirrors login behavior (no real persistence in this demo).
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = {
      id: `u_${Buffer.from(email).toString('hex').slice(0, 12)}`,
      name: name || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: role || 'user',
      avatar: '/agents/agent1.png',
      phone: '',
      joinedAt: new Date().toISOString(),
    }
    const token = `demo.${Buffer.from(JSON.stringify({ uid: user.id, role: user.role })).toString('base64url')}.token`

    return NextResponse.json({ user, token }, { status: 201 })
  } catch (e) {
    console.error('[api/auth/register] error', e)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
