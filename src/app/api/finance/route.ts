import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get('branch_id')
    const entryType = searchParams.get('type')

    let entries
    if (branchId && entryType) {
      entries = await sql`SELECT f.*, b.name as branch_name FROM finance_entries f LEFT JOIN branches b ON b.id = f.branch_id WHERE f.branch_id = ${branchId} AND f.entry_type = ${entryType} ORDER BY f.entry_date DESC`
    } else if (branchId) {
      entries = await sql`SELECT f.*, b.name as branch_name FROM finance_entries f LEFT JOIN branches b ON b.id = f.branch_id WHERE f.branch_id = ${branchId} ORDER BY f.entry_date DESC`
    } else if (entryType) {
      entries = await sql`SELECT f.*, b.name as branch_name FROM finance_entries f LEFT JOIN branches b ON b.id = f.branch_id WHERE f.entry_type = ${entryType} ORDER BY f.entry_date DESC`
    } else {
      entries = await sql`SELECT f.*, b.name as branch_name FROM finance_entries f LEFT JOIN branches b ON b.id = f.branch_id ORDER BY f.entry_date DESC`
    }

    return NextResponse.json(entries)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch finance entries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    const { entry_type, category, amount, description, entry_date, branch_id } = await request.json()

    const [entry] = await sql`
      INSERT INTO finance_entries (entry_type, category, amount, description, entry_date, branch_id, created_by)
      VALUES (${entry_type}, ${category}, ${amount}, ${description || null}, ${entry_date || new Date().toISOString().split('T')[0]}, ${branch_id || null}, ${userId})
      RETURNING *
    `

    await sql`INSERT INTO audit_log (action, table_name, record_id, changed_by, new_value) VALUES ('finance_entry_created', 'finance_entries', ${entry.id}, ${userId}, ${JSON.stringify(entry)}::jsonb)`

    return NextResponse.json(entry, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create entry' }, { status: 500 })
  }
}
