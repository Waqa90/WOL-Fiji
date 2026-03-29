import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, request: prayerRequest, anonymous, branch } = body

    if (!prayerRequest) {
      return NextResponse.json({ error: 'Prayer request is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase.from('prayer_requests').insert({
      name: anonymous ? null : name,
      email: anonymous ? null : email,
      request: prayerRequest,
      is_anonymous: !!anonymous,
      branch_id: branch || null,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit prayer request' }, { status: 500 })
  }
}
