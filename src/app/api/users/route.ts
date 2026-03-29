import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, phone, is_active, created_at, last_login, user_roles(access_level, branch_id, branches(name))')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, name, password, roles } = body

    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Email, name, and password required' }, { status: 400 })
    }

    const supabase = createServerClient()
    const passwordHash = await bcrypt.hash(password, 12)

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        name,
        password_hash: passwordHash,
        created_by: (session.user as any).id,
      })
      .select()
      .single()

    if (error) throw error

    // Assign roles
    if (roles && roles.length > 0) {
      const roleInserts = roles.map((role: any) => ({
        user_id: user.id,
        access_level: role.access_level,
        branch_id: role.branch_id || null,
        assigned_by: (session.user as any).id,
      }))

      await supabase.from('user_roles').insert(roleInserts)
    }

    await supabase.from('audit_log').insert({
      action: 'user_created',
      table_name: 'users',
      record_id: user.id,
      changed_by: (session.user as any).id,
      new_value: { email, name, roles },
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
