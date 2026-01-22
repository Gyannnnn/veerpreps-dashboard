import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken: string
    role: string,
    name:string
  }

  interface User {
    role: string
    accessToken: string,
    name: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    role: string,
    name: string
  }
}
