"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="bg-white shadow-lg px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl sm:text-2xl font-bold text-green-700 tracking-tight">
        <Link href="/">SMS</Link>
      </h1>
      <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
        <Link
          href="/"
          className="text-gray-700 hover:text-green-600 text-sm sm:text-base font-medium transition-colors duration-200"
        >
          Home
        </Link>

        {!user && (
          <>
            <Link
              href="/login"
              className="text-gray-700 hover:text-green-600 text-sm sm:text-base font-medium transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-gray-700 hover:text-green-600 text-sm sm:text-base font-medium transition-colors duration-200"
            >
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            {/* Admin-specific link */}
            {user.role === "admin" && (
              <Link
                href="/admin/profile"
                className="text-gray-700 hover:text-green-600 text-sm sm:text-base font-medium transition-colors duration-200"
              >
                Profile
              </Link>
            )}

            <button
              onClick={() => signOut()}
              className="text-red-500 hover:text-red-600 text-sm sm:text-base font-medium transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}