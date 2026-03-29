import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const logs = await sql`
      SELECT al.*, u.name as user_name FROM audit_log al
      LEFT JOIN users u ON u.id = al.changed_by
      ORDER BY al.created_at DESC LIMIT 200
    `
    return NextResponse.json(logs)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 })
  }
}
