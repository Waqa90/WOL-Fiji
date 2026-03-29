import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, branch } = await request.json()
    if (!name || !email || !message) return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })

    await sql`INSERT INTO contact_messages (name, email, subject, message, branch_id) VALUES (${name}, ${email}, ${subject || null}, ${message}, ${branch || null})`
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 })
  }
}
