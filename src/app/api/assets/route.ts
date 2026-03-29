import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import sql from '@/lib/db'
import { hasRole } from '@/lib/auth'
import { deleteFromBlob } from '@/lib/blob'

// GET /api/assets - Fetch all assets (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const roles = (session.user as any)?.roles || []
    if (!hasRole(roles, 5)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const fileType = searchParams.get('file_type')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let assets
    if (fileType) {
      assets = await sql`
        SELECT a.*, u.name as uploaded_by_name
        FROM asset_uploads a
        LEFT JOIN users u ON u.id = a.uploaded_by
        WHERE a.file_type = ${fileType}
        ORDER BY a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      assets = await sql`
        SELECT a.*, u.name as uploaded_by_name
        FROM asset_uploads a
        LEFT JOIN users u ON u.id = a.uploaded_by
        ORDER BY a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    return NextResponse.json(assets)
  } catch (error) {
    console.error('Assets fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
  }
}

// POST /api/assets - Upload new asset
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const roles = (session.user as any)?.roles || []
    if (!hasRole(roles, 3)) return NextResponse.json({ error: 'Forbidden - Media Team access required' }, { status: 403 })

    const { file_name, file_type, file_size, file_url, branch_id, description, is_public } = await request.json()
    const userId = (session.user as any)?.id

    if (!file_name || !file_type || !file_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['image', 'video', 'document'].includes(file_type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const [asset] = await sql`
      INSERT INTO asset_uploads (file_name, file_type, file_size, file_url, uploaded_by, branch_id, description, is_public, created_at)
      VALUES (${file_name}, ${file_type}, ${file_size || null}, ${file_url}, ${userId}, ${branch_id || null}, ${description || null}, ${is_public || false}, NOW())
      RETURNING *
    `

    // Audit log
    await sql`
      INSERT INTO audit_log (action, table_name, record_id, changed_by, new_value)
      VALUES ('asset_uploaded', 'asset_uploads', ${asset.id}, ${userId}, ${JSON.stringify(asset)}::jsonb)
    `

    return NextResponse.json(asset)
  } catch (error) {
    console.error('Asset upload error:', error)
    return NextResponse.json({ error: 'Failed to upload asset' }, { status: 500 })
  }
}

// DELETE /api/assets/:id - Delete asset
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const roles = (session.user as any)?.roles || []
    if (!hasRole(roles, 5)) return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = (session.user as any)?.id

    if (!id) return NextResponse.json({ error: 'Missing asset ID' }, { status: 400 })

    const [asset] = await sql`SELECT * FROM asset_uploads WHERE id = ${id}`

    if (!asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 })

    // Delete from Vercel Blob
    try {
      await deleteFromBlob(asset.file_url)
    } catch (err) {
      console.warn('Failed to delete from blob:', err)
      // Continue anyway - delete from DB even if blob delete fails
    }

    // Delete from database
    await sql`DELETE FROM asset_uploads WHERE id = ${id}`

    // Audit log
    await sql`
      INSERT INTO audit_log (action, table_name, record_id, changed_by, old_value)
      VALUES ('asset_deleted', 'asset_uploads', ${id}, ${userId}, ${JSON.stringify(asset)}::jsonb)
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Asset delete error:', error)
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 })
  }
}
