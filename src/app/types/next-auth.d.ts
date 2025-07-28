import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      name?: string;
      email?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    name?: string;
    email?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    name?: string;
    email?: string;
  }
}
