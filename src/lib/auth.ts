import { getServerSession } from 'next-auth'

export async function getSession() {
  return getServerSession()
}

export function getMaxAccessLevel(roles: { access_level: number }[]): number {
  if (!roles || roles.length === 0) return 0
  return Math.max(...roles.map(r => r.access_level))
}

export function hasRole(roles: { access_level: number }[], minLevel: number): boolean {
  return getMaxAccessLevel(roles) >= minLevel
}

export function getUserBranchIds(roles: { access_level: number; branch_id: string | null }[]): string[] {
  return roles
    .filter(r => r.branch_id !== null)
    .map(r => r.branch_id as string)
}
