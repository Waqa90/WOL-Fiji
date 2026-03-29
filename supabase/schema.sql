-- Word of Life Fiji - Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BRANCHES (5 Fiji locations)
CREATE TABLE branches (
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
);

-- 2. ACCESS LEVELS (Role definitions)
CREATE TABLE access_levels (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_first_login BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- 4. USER_ROLES (Flexible multi-role assignment)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_level INT NOT NULL REFERENCES access_levels(id),
  branch_id UUID REFERENCES branches(id),
  assigned_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, access_level, branch_id)
);

-- 5. MEMBERS (Per-branch member registry)
CREATE TABLE members (
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
);

-- 6. FINANCE ENTRIES
CREATE TABLE finance_entries (
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
);

-- 7. DONATIONS (Public giving via Stripe)
CREATE TABLE donations (
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
);

-- 8. EVENTS
CREATE TABLE events (
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
);

-- 9. PRAYER REQUESTS
CREATE TABLE prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  request TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'new',
  branch_id UUID REFERENCES branches(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CONTACT MESSAGES
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  branch_id UUID REFERENCES branches(id),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MUSICIANS (Public directory)
CREATE TABLE musicians (
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
);

-- 12. AUDIT LOG (Immutable)
CREATE TABLE audit_log (
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
);

-- Create indexes
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_branch ON user_roles(branch_id);
CREATE INDEX idx_members_branch ON members(branch_id);
CREATE INDEX idx_members_follow_up ON members(follow_up_status);
CREATE INDEX idx_finance_branch ON finance_entries(branch_id);
CREATE INDEX idx_finance_date ON finance_entries(entry_date);
CREATE INDEX idx_finance_type ON finance_entries(entry_type);
CREATE INDEX idx_donations_branch ON donations(branch_id);
CREATE INDEX idx_donations_date ON donations(created_at);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_audit_log_date ON audit_log(created_at);
CREATE INDEX idx_audit_log_user ON audit_log(changed_by);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);

-- Insert default access levels
INSERT INTO access_levels (id, name, description, permissions) VALUES
  (0, 'Public', 'Website visitors (no login)', '{"view_public": true}'),
  (1, 'Musician', 'Musicians and singers', '{"edit_own_profile": true, "view_musicians": true}'),
  (2, 'Ministry Leader', 'Ministry leaders', '{"manage_own_ministry": true}'),
  (3, 'Media Team', 'Video uploaders', '{"upload_media": true, "manage_media": true}'),
  (4, 'Finance Admin', 'Church treasurer', '{"input_finance": true, "view_finance": true, "export_finance": true}'),
  (5, 'Branch Admin', 'Branch pastors', '{"manage_branch": true, "manage_members": true, "view_branch_finance": true}'),
  (6, 'Global Admin', 'Senior pastor - view everything', '{"view_all": true, "view_finance": true, "manage_all_branches": true, "system_settings": true}'),
  (7, 'Super Admin', 'Office staff - manage users', '{"manage_users": true, "view_audit_logs": true, "create_users": true, "delete_users": true}');

-- Insert the 5 branches
INSERT INTO branches (name, location, service_times, description) VALUES
  ('Sabeto', 'Sabeto, Nadi, Fiji', 'Sunday 10:00 AM', 'Word of Life Sabeto Branch - serving the Sabeto community in Nadi.'),
  ('Dreketi', 'Dreketi, Vanua Levu, Fiji', 'Sunday 10:00 AM', 'Word of Life Dreketi Branch - serving the Dreketi community.'),
  ('Lau', 'Lau Group, Fiji', 'Sunday 10:00 AM', 'Word of Life Lau Branch - serving the Lau islands community.'),
  ('Suva', 'Suva, Viti Levu, Fiji', 'Sunday 10:00 AM', 'Word of Life Suva Branch - serving the capital city community.'),
  ('Taveuni', 'Taveuni, Fiji', 'Sunday 10:00 AM', 'Word of Life Taveuni Branch - serving the Garden Island community.');

-- Row Level Security Policies
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_finance_entries_updated_at BEFORE UPDATE ON finance_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_musicians_updated_at BEFORE UPDATE ON musicians FOR EACH ROW EXECUTE FUNCTION update_updated_at();
