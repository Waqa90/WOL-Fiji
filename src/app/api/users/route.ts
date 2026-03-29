import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const users = await sql`
      SELECT u.id, u.email, u.name, u.phone, u.is_active, u.created_at, u.last_login,
        json_agg(json_build_object('access_level', ur.access_level, 'branch_id', ur.branch_id, 'branch_name', b.name)) FILTER (WHERE ur.id IS NOT NULL) as user_roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN branches b ON b.id = ur.branch_id
      GROUP BY u.id ORDER BY u.created_at DESC
    `
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminId = (session.user as any).id
    const { email, name, password, roles } = await request.json()

    if (!email || !name || !password) return NextResponse.json({ error: 'Email, name, and password are required' }, { status: 400 })

    const passwordHash = await bcrypt.hash(password, 12)
    const [user] = await sql`INSERT INTO users (email, name, password_hash, created_by) VALUES (${email}, ${name}, ${passwordHash}, ${adminId}) RETURNING id, email, name`

    if (roles?.length > 0) {
      for (const role of roles) {
        await sql`INSERT INTO user_roles (user_id, access_level, branch_id, assigned_by) VALUES (${user.id}, ${role.access_level}, ${role.branch_id || null}, ${adminId}) ON CONFLICT DO NOTHING`
      }
    }

    await sql`INSERT INTO audit_log (action, table_name, record_id, changed_by, new_value) VALUES ('user_created', 'users', ${user.id}, ${adminId}, ${JSON.stringify({ email, name })}::jsonb)`

    return NextResponse.json(user, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create user' }, { status: 500 })
  }
}
