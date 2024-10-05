import { signIn } from "next-auth/react"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/db"
import { use } from "react"
import NextAuth from "next-auth/next"

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  database: process.env.DATABASE_URL,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({
      profile,
    }: {
      profile: { email: string; name: string; picture: string }
    }) {
      const userExists = await db.user.findFirst({
        where: {
          email: profile.email,
        },
      })
      if (!userExists) {
        await db.user.create({
          data: {
            email: profile.email,
            username: profile.name,
            image: profile.picture,
          },
        })
      }
      return true
    },

    async session({
      session,
    }: {
      session: {
        user: {
          email: string
          id: string
          picture: string
        }
      }
      maxAge: 86400
    }) {
      const user = await db.user.findFirst({
        where: {
          email: session.user.email,
        },
      })
      session.user.id = user!.id.toString()
      return session
    },
  },
}

const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST }
