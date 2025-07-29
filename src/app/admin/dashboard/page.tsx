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
      <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-6 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-700">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Students */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4 animate-fade-in">
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-2xl font-semibold text-green-700">{totalStudents}</p>
            </div>
          </div>

          {/* Active Students */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4 animate-fade-in">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Students</p>
              <p className="text-2xl font-semibold text-green-700">{activeStudents}</p>
            </div>
          </div>

          {/* Graduated Students */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4 animate-fade-in">
            <div className="bg-green-100 p-3 rounded-full">
              <BarChart className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Graduated</p>
              <p className="text-2xl font-semibold text-green-700">{graduatedStudents}</p>
            </div>
          </div>
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