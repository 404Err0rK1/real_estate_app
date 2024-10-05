import NextAuth from "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string // add your own user properties here
      name: string
      email: string
      image: string
    }
  }
}
