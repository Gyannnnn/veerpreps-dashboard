import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import axios from "axios"
import type { User } from "next-auth"

interface BackendAuthResponse {
    message: string
    token: string
    role: string
    name: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },

    providers: [
        Credentials({
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },

            async authorize(credentials): Promise<User | null> {
                if (!credentials?.email || !credentials?.password) return null

                try {
                    const response = await axios.post<BackendAuthResponse>(
                        "http://localhost:8000/api/user/auth/signin",
                        {
                            email: credentials.email as string,
                            password: credentials.password as string,
                        }
                    )

                    const data = response.data
                    if (!data?.token) {
                        throw new Error("Invalid email or password")
                    }

                    return {
                        id: data.token,
                        email: credentials.email as string,
                        role: data.role,
                        name: data.name
                    } as User & { role: string }
                } catch (error) {
                    throw new Error("Invalid email or password"
                    )
                }
            }
            ,
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.accessToken = user.id
                token.role = (user as any).role
                token.name = (user as any).name
            }
            return token
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken as string
            session.role = token.role as string
            session.name = token.name as string
            return session
        }

    },
})
