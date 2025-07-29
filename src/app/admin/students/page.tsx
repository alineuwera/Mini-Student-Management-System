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
      <div className="mx-auto mt-4 p-4 bg-white rounded shadow sm:p-6 lg:mt-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4 sm:text-3xl">
          Manage Students
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or course..."
            className="p-2 border rounded w-full sm:w-64 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto"
          >
            + Add Student
          </Button>
        </div>

        {showForm && (
          <div className="bg-gray-100 p-4 rounded mb-4 sm:p-6">
            <h2 className="text-lg font-bold mb-4 sm:text-xl">New Student</h2>
            <form
              onSubmit={onAddStudent}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
              />
              {errors.name && (
                <p className="text-red-500 text-sm col-span-full">
                  {errors.name.message}
                </p>
              )}

              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm col-span-full">
                  {errors.email.message}
                </p>
              )}

              <input
                type="text"
                placeholder="Course"
                {...register("course", { required: "Course is required" })}
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
              />
              {errors.course && (
                <p className="text-red-500 text-sm col-span-full">
                  {errors.course.message}
                </p>
              )}

              <input
                type="text"
                placeholder="Enrollment Year"
                {...register("enrollmentYear", {
                  required: "Year is required",
                })}
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
              />
              {errors.enrollmentYear && (
                <p className="text-red-500 text-sm col-span-full">
                  {errors.enrollmentYear.message}
                </p>
              )}

              <select
                {...register("status", { required: "Status is required" })}
                className="p-2 border rounded w-full col-span-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                defaultValue="Active"
              >
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Dropped">Dropped</option>
              </select>

              <div className="col-span-full flex flex-col sm:flex-row gap-4 mt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowForm(false);
                  }}
                  className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {editingStudent && (
          <div className="bg-gray-100 p-4 rounded mb-4 sm:p-6">
            <h2 className="text-lg font-bold mb-4 sm:text-xl text-green-700">
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
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <input
                type="text"
                placeholder="Name"
                value={editingStudent.name}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, name: e.target.value })
                }
                required
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
              />
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
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
              />
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
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
              />
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
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
              />
              <select
                value={editingStudent.status}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    status: e.target.value as Student["status"],
                  })
                }
                className="p-2 border rounded w-full col-span-full focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
              >
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Dropped">Dropped</option>
              </select>

              <div className="col-span-full flex flex-col sm:flex-row gap-4 mt-2">
                <Button type="submit" className="w-full sm:w-auto">
                  Update
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-green-500 to-green-700 text-white">
              <th className="p-2 border-b border-green-300 text-left font-semibold hidden sm:table-cell">
                Name
              </th>
              <th className="p-2 border-b border-green-300 text-left font-semibold hidden md:table-cell">
                Email
              </th>
              <th className="p-2 border-b border-green-300 text-left font-semibold hidden sm:table-cell">
                Course
              </th>
              <th className="p-2 border-b border-green-300 text-left font-semibold hidden md:table-cell">
                Year
              </th>
              <th className="p-2 border-b border-green-300 text-left font-semibold hidden sm:table-cell">
                Status
              </th>
              <th className="p-2 border-b border-green-300 text-left font-semibold hidden md:table-cell">
                Role
              </th>
              <th className="p-2 border-b border-green-300 text-left font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((s) => (
              <tr
                key={s.id}
                className="border-b border-green-200 hover:bg-green-50 transition-colors duration-200"
              >
                <td className="p-2 border-r border-green-200 text-left whitespace-nowrap sm:table-cell">
                  <span className="sm:hidden font-semibold">Name: </span>
                  {s.name}
                </td>
                <td className="p-2 border-r border-green-200 text-left truncate max-w-xs md:table-cell">
                  <span className="md:hidden font-semibold">Email: </span>
                  {s.email}
                </td>
                <td className="p-2 border-r border-green-200 text-left whitespace-nowrap sm:table-cell">
                  <span className="sm:hidden font-semibold">Course: </span>
                  {s.course}
                </td>
                <td className="p-2 border-r border-green-200 text-left whitespace-nowrap md:table-cell">
                  <span className="md:hidden font-semibold">Year: </span>
                  {s.enrollmentYear}
                </td>
                <td className="p-2 border-r border-green-200 text-left whitespace-nowrap sm:table-cell">
                  <span className="sm:hidden font-semibold">Status: </span>
                  {s.status}
                </td>
                <td className="p-2 border-r border-green-200 text-left whitespace-nowrap md:table-cell">
                  <span className="md:hidden font-semibold">Role: </span>
                  {s.role}
                </td>
                <td className="p-2 border-r border-green-200 text-left flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    onClick={() => setEditingStudent(s)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-sm w-full sm:w-auto"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm w-full sm:w-auto"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => handleToggleRole(s.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-sm w-full sm:w-auto"
                  >
                    Make {s.role === "admin" ? "Student" : "Admin"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="w-full sm:w-auto"
          >
            Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              onClick={() => setPage(p)}
              className={`w-full sm:w-auto ${
                p === page ? "bg-blue-500 text-white" : ""
              }`}
            >
              {p}
            </Button>
          ))}

          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
