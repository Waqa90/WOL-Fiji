export interface Branch {
  id: string
  name: string
  location: string
  pastor_name: string | null
  phone: string | null
  email: string | null
  service_times: string | null
  description: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  is_first_login: boolean
  created_at: string
  last_login: string | null
}

export interface UserRole {
  id: string
  user_id: string
  access_level: number
  branch_id: string | null
  assigned_by: string
  created_at: string
}

export interface Member {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  address: string | null
  branch_id: string
  join_date: string
  date_of_birth: string | null
  gender: string | null
  is_new_member: boolean
  follow_up_status: string
  follow_up_date: string | null
  follow_up_notes: string | null
  notes: string | null
  is_active: boolean
  created_by: string
  created_at: string
}

export interface FinanceEntry {
  id: string
  entry_type: 'income' | 'expense'
  category: string
  amount: number
  description: string | null
  entry_date: string
  branch_id: string | null
  receipt_url: string | null
  created_by: string
  created_at: string
}

export interface Donation {
  id: string
  donor_name: string | null
  donor_email: string | null
  amount: number
  currency: string
  branch_id: string | null
  payment_method: string
  stripe_payment_id: string | null
  status: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  branch_id: string | null
  is_public: boolean
  image_url: string | null
  created_at: string
}

export interface PrayerRequest {
  id: string
  name: string | null
  email: string | null
  request: string
  is_anonymous: boolean
  status: string
  branch_id: string | null
  created_at: string
}

export interface AuditLogEntry {
  id: string
  action: string
  table_name: string | null
  record_id: string | null
  changed_by: string
  old_value: any
  new_value: any
  created_at: string
}
