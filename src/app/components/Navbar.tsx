"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Student Management</h1>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        {!session && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
        {session && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profile">Profile</Link>
            {session?.user?.role === "admin" && (
              <Link href="/admin/students">Admin</Link>
            )}

            <button onClick={() => signOut()} className="text-red-500 ml-2">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
