"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CheckCircle, BarChart } from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminDashboard() {
  const { token } = useAuth()!;
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    graduatedStudents: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/admin/students/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-6 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-700">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Students" value={stats.totalStudents} icon={<Users className="text-green-600 w-6 h-6" />} />
          <StatCard label="Active Students" value={stats.activeStudents} icon={<CheckCircle className="text-green-600 w-6 h-6" />} />
          <StatCard label="Graduated" value={stats.graduatedStudents} icon={<BarChart className="text-green-600 w-6 h-6" />} />
        </div>

        {/* Student Management Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-2 text-green-700">Student Management</h2>
          <p className="text-gray-600 mb-4">
            View, add, edit, and delete all student records from the management page.
          </p>
          <Link
            href="/admin/students"
            className="block w-full text-center bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Go to Student Management
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4 animate-fade-in">
      <div className="bg-green-100 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-semibold text-green-700">{value}</p>
      </div>
    </div>
  );
}
