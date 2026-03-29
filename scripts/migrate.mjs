import { neon } from '@neondatabase/serverless'

const DATABASE_URL = 'postgresql://neondb_owner:npg_CITL9yB2AUwe@ep-summer-brook-a73o4qoo.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const sql = neon(DATABASE_URL)

async function migrate() {
  console.log('Running WOL Fiji migration...\n')

  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

  await sql`CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    pastor_name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    service_times TEXT,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`
  console.log('OK branches')

  await sql`CREATE TABLE IF NOT EXISTS access_levels (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`
  console.log('OK access_levels')

  await sql`CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_first_login BOOLEAN DEFAULT TRUE,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
  )`
  console.log('OK users')

  await sql`CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_level INT NOT NULL REFERENCES access_levels(id),
    branch_id UUID REFERENCES branches(id),
    assigned_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, access_level, branch_id)
  )`
  console.log('OK user_roles')

  await sql`CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    branch_id UUID NOT NULL REFERENCES branches(id),
    join_date DATE DEFAULT CURRENT_DATE,
    date_of_birth DATE,
    gender VARCHAR(20),
    is_new_member BOOLEAN DEFAULT TRUE,
    follow_up_status VARCHAR(50) DEFAULT 'not_contacted',
    follow_up_date DATE,
    follow_up_notes TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`
  console.log('OK members')

  await sql`CREATE TABLE IF NOT EXISTS finance_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_type VARCHAR(50) NOT NULL CHECK (entry_type IN ('income', 'expense')),
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    entry_date DATE DEFAULT CURRENT_DATE,
    branch_id UUID REFERENCES branches(id),
    receipt_url TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`
  console.log('OK finance_entries')

  await sql`CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_name VARCHAR(255),
    donor_email VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'FJD',
    branch_id UUID REFERENCES branches(id),
    payment_method VARCHAR(50) DEFAULT 'stripe',
    stripe_payment_id VARCHAR(255),
    stripe_session_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`
  console.log('OK donations')

  await sql`CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    branch_id UUID REFERENCES branches(id),
    is_public BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`
  console.log('OK events')

  await sql`CREATE TABLE IF NOT EXISTS prayer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    request TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'new',
    branch_id UUID REFERENCES branches(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`
  console.log('OK prayer_requests')

  await sql`CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    branch_id UUID REFERENCES branches(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`
  console.log('OK contact_messages')

  await sql`CREATE TABLE IF NOT EXISTS musicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    instruments TEXT[],
    bio TEXT,
    photo_url TEXT,
    branch_id UUID REFERENCES branches(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`
  console.log('OK musicians')

  await sql`CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    changed_by UUID REFERENCES users(id),
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`
  console.log('OK audit_log')

  await sql`CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_user_roles_branch ON user_roles(branch_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_members_branch ON members(branch_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_members_status ON members(follow_up_status)`
  await sql`CREATE INDEX IF NOT EXISTS idx_finance_branch ON finance_entries(branch_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_finance_date ON finance_entries(entry_date)`
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_date ON audit_log(created_at)`
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(changed_by)`
  console.log('OK indexes')

  await sql`INSERT INTO access_levels (id, name, description, permissions) VALUES
    (0, 'Public', 'Website visitors', '{"view_public": true}'),
    (1, 'Musician', 'Musicians and singers', '{"edit_own_profile": true}'),
    (2, 'Ministry Leader', 'Ministry leaders', '{"manage_own_ministry": true}'),
    (3, 'Media Team', 'Video uploaders', '{"upload_media": true}'),
    (4, 'Finance Admin', 'Church treasurer', '{"input_finance": true, "view_finance": true}'),
    (5, 'Branch Admin', 'Branch pastors', '{"manage_branch": true, "manage_members": true}'),
    (6, 'Global Admin', 'Senior pastor', '{"view_all": true, "manage_all_branches": true}'),
    (7, 'Super Admin', 'Office staff', '{"manage_users": true, "view_audit_logs": true}')
  ON CONFLICT (id) DO NOTHING`
  console.log('OK access_levels seeded')

  await sql`INSERT INTO branches (name, location, service_times, description) VALUES
    ('Sabeto', 'Sabeto, Nadi, Fiji', 'Sunday 10:00 AM', 'Word of Life Sabeto Branch.'),
    ('Dreketi', 'Dreketi, Vanua Levu, Fiji', 'Sunday 10:00 AM', 'Word of Life Dreketi Branch.'),
    ('Lau', 'Lau Group, Fiji', 'Sunday 10:00 AM', 'Word of Life Lau Branch.'),
    ('Suva', 'Suva, Viti Levu, Fiji', 'Sunday 10:00 AM', 'Word of Life Suva Branch.'),
    ('Taveuni', 'Taveuni, Fiji', 'Sunday 10:00 AM', 'Word of Life Taveuni Branch.')
  ON CONFLICT DO NOTHING`
  console.log('OK branches seeded (5 branches)')

  console.log('\nMigration complete!')
}

migrate().catch(e => { console.error('Migration failed:', e.message); process.exit(1) })
