"use client";
import Link from "next/link";
import { Users, CheckCircle, BarChart } from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function AdminDashboard() {

  // Temporary mock stats — replace with real API/data
  const totalStudents = 8;
  const activeStudents = 3;
  const graduatedStudents = 5;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-6xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Students */}
          <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-2xl font-semibold">{totalStudents}</p>
            </div>
          </div>

          {/* Active Students */}
          <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckCircle className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Students</p>
              <p className="text-2xl font-semibold">{activeStudents}</p>
            </div>
          </div>

          {/* Graduated Students */}
          <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Graduated</p>
              <p className="text-2xl font-semibold">{graduatedStudents}</p>
            </div>
          </div>
        </div>

        {/* Student Management Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Student Management</h2>
          <p className="text-gray-600 mb-4">
            View, add, edit, and delete all student records from the management page.
          </p>
          <Link
            href="/admin/students"
            className="block w-full text-center bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Student Management
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
