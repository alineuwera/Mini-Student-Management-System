"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">SMS</h1>
      <div className="space-x-4">
        <Link href="/">Home</Link>

        {!user && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            {/* Admin-specific link */}
            {user.role === "admin" && <Link href="/admin/profile">Profile</Link>}

            <button
              onClick={() => signOut()}
              className="text-red-500 ml-2 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
