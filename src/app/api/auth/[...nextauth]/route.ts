import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

// TEMPORARY USER DATA (replace with real DB in future)
const users = [
  {
    id: "1",
    name: "Aline Uwimana",
    email: "aline@example.com",
    password: "aline123",
    role: "student",
  },
  {
    id: "2",
    name: "Admin Boss",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as {
          role?: string;
          name?: string;
          email?: string;
        };

        token.role = u.role;
        token.name = u.name;
        token.email = u.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
