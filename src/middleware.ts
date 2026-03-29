export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/members/:path*', '/admin/finance/:path*', '/admin/users/:path*', '/admin/audit-log/:path*', '/admin/music/:path*', '/admin/assets/:path*'],
}
