import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    roles: { access_level: number; branch_id: string | null }[]
    is_first_login: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      roles: { access_level: number; branch_id: string | null }[]
      is_first_login: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    roles: { access_level: number; branch_id: string | null }[]
    is_first_login: boolean
  }
}
