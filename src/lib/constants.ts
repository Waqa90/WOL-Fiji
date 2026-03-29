export const SITE_NAME = 'Word of Life Fiji'
export const SITE_DESCRIPTION = 'Word of Life Christian Church - Fiji Islands'
export const MOTHER_CHURCH_URL = 'https://wlwc.org'

export const BRANCHES = [
  { name: 'Sabeto', location: 'Sabeto, Nadi, Fiji', serviceTime: 'Sunday 10:00 AM' },
  { name: 'Dreketi', location: 'Dreketi, Vanua Levu, Fiji', serviceTime: 'Sunday 10:00 AM' },
  { name: 'Lau', location: 'Lau Group, Fiji', serviceTime: 'Sunday 10:00 AM' },
  { name: 'Suva', location: 'Suva, Viti Levu, Fiji', serviceTime: 'Sunday 10:00 AM' },
  { name: 'Taveuni', location: 'Taveuni, Fiji', serviceTime: 'Sunday 10:00 AM' },
] as const

export const ACCESS_LEVELS = {
  PUBLIC: 0,
  MUSICIAN: 1,
  MINISTRY_LEADER: 2,
  MEDIA_TEAM: 3,
  FINANCE_ADMIN: 4,
  BRANCH_ADMIN: 5,
  GLOBAL_ADMIN: 6,
  SUPER_ADMIN: 7,
} as const

export const FINANCE_CATEGORIES = {
  income: ['Tithe', 'Offering', 'Donation', 'Fundraiser', 'Other Income'],
  expense: ['Salary', 'Rent', 'Utilities', 'Supplies', 'Transport', 'Events', 'Maintenance', 'Other Expense'],
} as const

export const FOLLOW_UP_STATUSES = [
  { value: 'not_contacted', label: 'Not Contacted', color: 'text-red-500' },
  { value: 'contacted', label: 'Contacted', color: 'text-yellow-500' },
  { value: 'active', label: 'Active', color: 'text-green-500' },
  { value: 'inactive', label: 'Inactive', color: 'text-gray-500' },
] as const

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Branches', href: '/branches' },
  { label: 'Events', href: '/events' },
  { label: 'Sermons', href: '/coming-soon' },
  { label: 'Give', href: '/donate' },
  { label: 'Contact', href: '/contact' },
] as const
