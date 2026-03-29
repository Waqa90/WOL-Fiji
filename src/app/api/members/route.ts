import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get('branch_id')

    const members = branchId
      ? await sql`
          SELECT m.*, b.name as branch_name
          FROM members m LEFT JOIN branches b ON b.id = m.branch_id
          WHERE m.branch_id = ${branchId}
          ORDER BY m.created_at DESC
        `
      : await sql`
          SELECT m.*, b.name as branch_name
          FROM members m LEFT JOIN branches b ON b.id = m.branch_id
          ORDER BY m.created_at DESC
        `

    return NextResponse.json(members)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    const body = await request.json()
    const { first_name, last_name, email, phone, address, branch_id, join_date, gender, date_of_birth, is_new_member, follow_up_status, notes } = body

    const [member] = await sql`
      INSERT INTO members (first_name, last_name, email, phone, address, branch_id, join_date, gender, date_of_birth, is_new_member, follow_up_status, notes, created_by)
      VALUES (${first_name}, ${last_name}, ${email || null}, ${phone || null}, ${address || null}, ${branch_id}, ${join_date || new Date().toISOString().split('T')[0]}, ${gender || null}, ${date_of_birth || null}, ${is_new_member ?? true}, ${follow_up_status || 'not_contacted'}, ${notes || null}, ${userId})
      RETURNING *
    `

    await sql`INSERT INTO audit_log (action, table_name, record_id, changed_by, new_value) VALUES ('member_created', 'members', ${member.id}, ${userId}, ${JSON.stringify(member)}::jsonb)`

    return NextResponse.json(member, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create member' }, { status: 500 })
  }
}
