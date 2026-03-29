import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import sql from '@/lib/db'

// GET /api/musicians - Fetch all musicians (public route)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const instrumentFilter = searchParams.get('instrument')
    const branchFilter = searchParams.get('branch')

    let musicians
    if (instrumentFilter && branchFilter) {
      musicians = await sql`
        SELECT m.*, COALESCE(json_agg(json_build_object('level', ur.access_level, 'branch_id', ur.branch_id)) FILTER (WHERE ur.user_id IS NOT NULL), '[]'::json) as roles
        FROM musicians m
        LEFT JOIN user_roles ur ON m.user_id = ur.user_id
        WHERE m.is_active = TRUE AND m.instrument_specialty = ${instrumentFilter} AND m.branch_id = ${branchFilter}
        GROUP BY m.id ORDER BY m.name
      `
    } else if (instrumentFilter) {
      musicians = await sql`
        SELECT m.*, COALESCE(json_agg(json_build_object('level', ur.access_level, 'branch_id', ur.branch_id)) FILTER (WHERE ur.user_id IS NOT NULL), '[]'::json) as roles
        FROM musicians m
        LEFT JOIN user_roles ur ON m.user_id = ur.user_id
        WHERE m.is_active = TRUE AND m.instrument_specialty = ${instrumentFilter}
        GROUP BY m.id ORDER BY m.name
      `
    } else if (branchFilter) {
      musicians = await sql`
        SELECT m.*, COALESCE(json_agg(json_build_object('level', ur.access_level, 'branch_id', ur.branch_id)) FILTER (WHERE ur.user_id IS NOT NULL), '[]'::json) as roles
        FROM musicians m
        LEFT JOIN user_roles ur ON m.user_id = ur.user_id
        WHERE m.is_active = TRUE AND m.branch_id = ${branchFilter}
        GROUP BY m.id ORDER BY m.name
      `
    } else {
      musicians = await sql`
        SELECT m.*, COALESCE(json_agg(json_build_object('level', ur.access_level, 'branch_id', ur.branch_id)) FILTER (WHERE ur.user_id IS NOT NULL), '[]'::json) as roles
        FROM musicians m
        LEFT JOIN user_roles ur ON m.user_id = ur.user_id
        WHERE m.is_active = TRUE
        GROUP BY m.id ORDER BY m.name
      `
    }
    return NextResponse.json(musicians)
  } catch (error) {
    console.error('Musicians fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch musicians' }, { status: 500 })
  }
}

// POST /api/musicians - Create or update musician (requires auth)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, name, bio, photo_url, instrument_specialty, instruments, video_url, lyrics_text, branch_id } =
      await request.json()

    const userId = (session.user as any)?.id

    if (id) {
      // Update existing musician
      const [musician] = await sql`
        UPDATE musicians
        SET name = ${name}, bio = ${bio || null}, photo_url = ${photo_url || null},
            instrument_specialty = ${instrument_specialty || null},
            instruments = ${instruments ? JSON.stringify(instruments) : null},
            video_url = ${video_url || null},
            lyrics_text = ${lyrics_text || null},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      // Audit log
      await sql`
        INSERT INTO audit_log (action, table_name, record_id, changed_by, new_value)
        VALUES ('musician_updated', 'musicians', ${id}, ${userId}, ${JSON.stringify(musician)}::jsonb)
      `

      return NextResponse.json(musician)
    } else {
      // Create new musician
      const [musician] = await sql`
        INSERT INTO musicians (name, bio, photo_url, instrument_specialty, instruments, video_url, lyrics_text, branch_id, is_active, created_at, updated_at)
        VALUES (${name}, ${bio || null}, ${photo_url || null}, ${instrument_specialty || null},
                ${instruments ? JSON.stringify(instruments) : null}, ${video_url || null}, ${lyrics_text || null},
                ${branch_id || null}, TRUE, NOW(), NOW())
        RETURNING *
      `

      // Audit log
      await sql`
        INSERT INTO audit_log (action, table_name, record_id, changed_by, new_value)
        VALUES ('musician_created', 'musicians', ${musician.id}, ${userId}, ${JSON.stringify(musician)}::jsonb)
      `

      return NextResponse.json(musician)
    }
  } catch (error) {
    console.error('Musician create/update error:', error)
    return NextResponse.json({ error: 'Failed to save musician' }, { status: 500 })
  }
}

// PUT /api/musicians/:id - Update musician video/lyrics
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, video_url, lyrics_text } = await request.json()
    const userId = (session.user as any)?.id

    const [musician] = await sql`
      UPDATE musicians
      SET video_url = ${video_url || null},
          lyrics_text = ${lyrics_text || null},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    // Audit log
    await sql`
      INSERT INTO audit_log (action, table_name, record_id, changed_by, new_value)
      VALUES ('musician_video_updated', 'musicians', ${id}, ${userId}, ${JSON.stringify({ video_url, lyrics_text })}::jsonb)
    `

    return NextResponse.json(musician)
  } catch (error) {
    console.error('Musician update error:', error)
    return NextResponse.json({ error: 'Failed to update musician' }, { status: 500 })
  }
}
