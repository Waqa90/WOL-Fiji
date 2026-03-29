import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET() {
  try {
    const branches = await sql`SELECT * FROM branches WHERE is_active = true ORDER BY name`
    return NextResponse.json(branches)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 })
  }
}
