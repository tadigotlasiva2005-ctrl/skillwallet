import { NextRequest, NextResponse } from 'next/server'

// Demo auth — returns a mock user + token. In production this would verify
// against MongoDB with bcrypt + issue a JWT. Role can be 'user' | 'owner' | 'admin'.
export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Demo: any valid email/password logs in. Role defaults to 'user' unless specified.
    const user = {
      id: `u_${Buffer.from(email).toString('hex').slice(0, 12)}`,
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: role || 'user',
      avatar: '/agents/agent1.png',
      phone: '+1 (555) 010-2030',
      joinedAt: new Date().toISOString(),
    }
    const token = `demo.${Buffer.from(JSON.stringify({ uid: user.id, role: user.role })).toString('base64url')}.token`

    return NextResponse.json({ user, token })
  } catch (e) {
    console.error('[api/auth/login] error', e)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
