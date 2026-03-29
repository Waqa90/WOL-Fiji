import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get('branch_id')
    const entryType = searchParams.get('type')

    const supabase = createServerClient()

    let query = supabase
      .from('finance_entries')
      .select('*, branches(name)')
      .order('entry_date', { ascending: false })

    if (branchId) query = query.eq('branch_id', branchId)
    if (entryType) query = query.eq('entry_type', entryType)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch finance entries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('finance_entries')
      .insert({
        ...body,
        created_by: (session.user as any).id,
      })
      .select()
      .single()

    if (error) throw error

    await supabase.from('audit_log').insert({
      action: 'finance_entry_created',
      table_name: 'finance_entries',
      record_id: data.id,
      changed_by: (session.user as any).id,
      new_value: data,
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create finance entry' }, { status: 500 })
  }
}
