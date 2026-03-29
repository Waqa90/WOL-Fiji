import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import sql from '@/lib/db'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) return null

        const [user] = await sql`
          SELECT * FROM users WHERE email = ${credentials.email} AND is_active = true
        `
        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password_hash)
        if (!isValid) return null

        const rolesRaw = await sql`
          SELECT access_level, branch_id FROM user_roles WHERE user_id = ${user.id}
        `
        const roles = rolesRaw.map((r: any) => ({
          access_level: Number(r.access_level),
          branch_id: (r.branch_id as string | null) ?? null,
        }))

        await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles,
          is_first_login: user.is_first_login,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.roles = (user as any).roles
        token.is_first_login = (user as any).is_first_login
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).roles = token.roles
        ;(session.user as any).is_first_login = token.is_first_login
      }
      return session
    },
  },
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
