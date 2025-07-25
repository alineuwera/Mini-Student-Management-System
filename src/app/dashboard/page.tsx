"use client";

import { useSession } from "next-auth/react";

export default function StudentDashboard() {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        Welcome, {user?.name || "Student"}!
      </h1>

      <div className="space-y-2">
        <p><span className="font-semibold">Email:</span> {user?.email}</p>
        <p><span className="font-semibold">Course:</span> Software Engineering</p>
        <p><span className="font-semibold">Enrollment Year:</span> 2023</p>
        <p><span className="font-semibold">Status:</span> Active</p>
      </div>

      <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
