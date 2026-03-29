import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, email, request: prayerRequest, anonymous, branch } = await request.json()
    if (!prayerRequest) return NextResponse.json({ error: 'Prayer request is required' }, { status: 400 })

    await sql`INSERT INTO prayer_requests (name, email, request, is_anonymous, branch_id) VALUES (${anonymous ? null : (name || null)}, ${anonymous ? null : (email || null)}, ${prayerRequest}, ${!!anonymous}, ${branch || null})`
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to submit prayer request' }, { status: 500 })
  }
}
