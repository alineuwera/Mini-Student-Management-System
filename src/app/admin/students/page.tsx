"use client";

import { Button } from "@/app/components/Button";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  enrollmentYear: string;
  status: "Active" | "Graduated" | "Dropped";
  role: "student" | "admin";
};

type StudentForm = {
  name: string;
  email: string;
  course: string;
  enrollmentYear: string;
  status: "Active" | "Graduated" | "Dropped";
};

export default function AdminStudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const studentsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentForm>();

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginated = filteredStudents.slice(
    (page - 1) * studentsPerPage,
    page * studentsPerPage
  );

  useEffect(() => {
    setStudents([
      {
        id: "1",
        name: "Aline Uwera",
        email: "aline@example.com",
        course: "Software Engineering",
        enrollmentYear: "2023",
        status: "Active",
        role: "student",
      },
      {
        id: "2",
        name: "John Doe",
        email: "john@example.com",
        course: "Data Science",
        enrollmentYear: "2022",
        status: "Graduated",
        role: "admin",
      },
    ]);
  }, []);

  const handleDelete = (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirm) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleToggleRole = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, role: s.role === "admin" ? "student" : "admin" }
          : s
      )
    );
  };

  const onAddStudent = handleSubmit((data) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newEntry: Student = {
      id,
      name: data.name,
      email: data.email,
      course: data.course,
      enrollmentYear: data.enrollmentYear,
      status: data.status,
      role: "student",
    };

    toast.loading("Adding student...");
    setTimeout(() => {
      setStudents([...students, newEntry]);
      reset();
      setShowForm(false);
      toast.dismiss();
      toast.success("Student added successfully!");
    }, 1000);
  });

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto mt-4 p-4 sm:p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4">
          Manage Students
        </h1>

        <div className="flex flex-col sm:flex-row items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or course..."
            className="p-3 border border-gray-300 rounded-lg w-full sm:w-72 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            + Add Student
          </Button>
        </div>

        {showForm && (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4">
              New Student
            </h2>
            <form
              onSubmit={onAddStudent}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Course"
                  {...register("course", { required: "Course is required" })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                />
                {errors.course && (
                  <p className="text-red-500 text-sm mt-1">{errors.course.message}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Enrollment Year"
                  {...register("enrollmentYear", { required: "Year is required" })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                />
                {errors.enrollmentYear && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.enrollmentYear.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <select
                  {...register("status", { required: "Status is required" })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                  defaultValue="Active"
                >
                  <option value="Active">Active</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Dropped">Dropped</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>
              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowForm(false);
                  }}
                  className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {editingStudent && (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4">
              Edit Student
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.loading("Updating student...");
                setTimeout(() => {
                  setStudents((prev) =>
                    prev.map((s) =>
                      s.id === editingStudent.id ? editingStudent : s
                    )
                  );
                  setEditingStudent(null);
                  toast.dismiss();
                  toast.success("Student updated successfully!");
                }, 1000);
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={editingStudent.name}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, name: e.target.value })
                  }
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={editingStudent.email}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      email: e.target.value,
                    })
                  }
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Course"
                  value={editingStudent.course}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      course: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Enrollment Year"
                  value={editingStudent.enrollmentYear}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      enrollmentYear: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                />
              </div>
              <div className="sm:col-span-2">
                <select
                  value={editingStudent.status}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      status: e.target.value as Student["status"],
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                >
                  <option value="Active">Active</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Update
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

      {/* Table */}
<div className="relative overflow-x-auto">
  <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
  <table className="w-full min-w-[1000px] table-auto border-collapse bg-white rounded-lg shadow-lg">
    <thead>
      <tr className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <th className="p-2 sm:p-3 text-left font-semibold">Name</th>
        <th className="p-2 sm:p-3 text-left font-semibold">Email</th>
        <th className="p-2 sm:p-3 text-left font-semibold">Course</th>
        <th className="p-2 sm:p-3 text-left font-semibold">Year</th>
        <th className="p-2 sm:p-3 text-left font-semibold">Status</th>
        <th className="p-2 sm:p-3 text-left font-semibold">Role</th>
        <th className="p-2 sm:p-3 text-left font-semibold">Actions</th>
      </tr>
    </thead>
    <tbody>
      {paginated.map((s) => (
        <tr key={s.id} className="border-b border-gray-200 hover:bg-green-50 transition-colors duration-200">
          <td className="p-2 sm:p-3 text-left whitespace-nowrap">{s.name}</td>
          <td className="p-2 sm:p-3 text-left truncate max-w-xs">{s.email}</td>
          <td className="p-2 sm:p-3 text-left whitespace-nowrap">{s.course}</td>
          <td className="p-2 sm:p-3 text-left whitespace-nowrap">{s.enrollmentYear}</td>
          <td className="p-2 sm:p-3 text-left whitespace-nowrap">{s.status}</td>
          <td className="p-2 sm:p-3 text-left whitespace-nowrap">{s.role}</td>
          <td className="p-2 sm:p-3 text-left flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              onClick={() => setEditingStudent(s)}
              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm w-full sm:w-auto"
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(s.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm w-full sm:w-auto"
            >
              Delete
            </Button>
            <Button
              onClick={() => handleToggleRole(s.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm w-full sm:w-auto"
            >
              Make {s.role === "admin" ? "Student" : "Admin"}
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-200"
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              onClick={() => setPage(p)}
              className={`w-full sm:w-auto ${p === page ? "bg-blue-600 text-white" : "bg-gray-300"} px-4 py-2 rounded transition duration-200`}
            >
              {p}
            </Button>
          ))}
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-200"
          >
            Next
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  )
};