// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type AppUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

const users: AppUser[] = [
  {
    id: "1",
    name: "Aline Uwera",
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
        if (user) return user;
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
        const u = user as AppUser;
        token.role = u.role;
        token.name = u.name;
        token.email = u.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
