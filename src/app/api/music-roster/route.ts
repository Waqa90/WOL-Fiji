import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import sql from '@/lib/db'
import { hasRole, getUserBranchIds } from '@/lib/auth'

// GET /api/music-roster - Fetch roster for a specific date/type
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const scheduleType = searchParams.get('schedule_type') // saturday_practice or sunday_service
    const scheduleDate = searchParams.get('schedule_date')
    const branchId = searchParams.get('branch_id')

    const userId = (session.user as any)?.id
    const roles = (session.user as any)?.roles || []
    const branchIds = getUserBranchIds(roles)
    const hasAdminAccess = hasRole(roles, 5) // Branch Admin or higher

    // For simplicity, fetch all rosters and filter in memory
    // A better approach would be to build proper SQL conditions
    const allRosters = await sql`
      SELECT mr.*, u.name as created_by_name
      FROM music_roster mr
      LEFT JOIN users u ON u.id = mr.created_by
      ORDER BY mr.schedule_date DESC, mr.schedule_type
    `

    // Filter based on parameters
    let filtered = allRosters
    if (!hasAdminAccess && branchIds.length > 0) {
      filtered = filtered.filter((r: any) => branchIds.includes(r.branch_id))
    }
    if (scheduleType) {
      filtered = filtered.filter((r: any) => r.schedule_type === scheduleType)
    }
    if (scheduleDate) {
      filtered = filtered.filter((r: any) => r.schedule_date === scheduleDate)
    }
    if (branchId) {
      filtered = filtered.filter((r: any) => r.branch_id === branchId)
    }

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Music roster fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch roster' }, { status: 500 })
  }
}

// POST /api/music-roster - Create or update roster
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const roles = (session.user as any)?.roles || []
    const minRole = hasRole(roles, 2) // Ministry Leader or higher can edit rosters
    if (!minRole) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id, schedule_type, schedule_date, musicians, songs, notes, branch_id } = await request.json()
    const userId = (session.user as any)?.id

    if (!schedule_type || !schedule_date || !branch_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (id) {
      // Update existing roster
      const [roster] = await sql`
        UPDATE music_roster
        SET schedule_type = ${schedule_type},
            schedule_date = ${schedule_date},
            musicians = ${musicians ? JSON.stringify(musicians) : null},
            songs = ${songs ? JSON.stringify(songs) : null},
            notes = ${notes || null},
            updated_by = ${userId},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      // Audit log
      await sql`
        INSERT INTO audit_log (action, table_name, record_id, changed_by, new_value)
        VALUES ('roster_updated', 'music_roster', ${id}, ${userId}, ${JSON.stringify(roster)}::jsonb)
      `

      return NextResponse.json(roster)
    } else {
      // Create new roster
      const [roster] = await sql`
        INSERT INTO music_roster (schedule_type, schedule_date, musicians, songs, notes, created_by, branch_id, updated_at, created_at)
        VALUES (${schedule_type}, ${schedule_date}, ${musicians ? JSON.stringify(musicians) : null},
                ${songs ? JSON.stringify(songs) : null}, ${notes || null}, ${userId}, ${branch_id}, NOW(), NOW())
        RETURNING *
      `

      // Audit log
      await sql`
        INSERT INTO audit_log (action, table_name, record_id, changed_by, new_value)
        VALUES ('roster_created', 'music_roster', ${roster.id}, ${userId}, ${JSON.stringify(roster)}::jsonb)
      `

      return NextResponse.json(roster)
    }
  } catch (error) {
    console.error('Music roster save error:', error)
    return NextResponse.json({ error: 'Failed to save roster' }, { status: 500 })
  }
}
