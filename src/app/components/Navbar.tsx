"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Student Management</h1>

      <div className="space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>

        {session ? (
          <>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-blue-600">
              Profile
            </Link>
            <button
              onClick={() => signOut()}
              className="text-gray-700 hover:text-blue-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => signIn()}
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </button>
            <Link href="/register" className="text-gray-700 hover:text-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
