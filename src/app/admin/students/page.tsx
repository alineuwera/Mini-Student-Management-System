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
        name: "Aline Uwimana",
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
    const confirm = window.confirm("Are you sure you want to delete this student?");
    if (confirm) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleToggleRole = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, role: s.role === "admin" ? "student" : "admin" } : s
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
      <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Manage Students</h1>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by name or course..."
            className="p-2 border rounded w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <Button onClick={() => setShowForm(true)}>+ Add Student</Button>
        </div>

        {showForm && (
          <div className="bg-gray-100 p-6 rounded mb-6">
            <h2 className="text-lg font-bold mb-4">New Student</h2>
            <form onSubmit={onAddStudent} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
                className="p-2 border rounded"
              />
              {errors.name && <p className="text-red-500 text-sm col-span-2">{errors.name.message}</p>}

              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="p-2 border rounded"
              />
              {errors.email && <p className="text-red-500 text-sm col-span-2">{errors.email.message}</p>}

              <input
                type="text"
                placeholder="Course"
                {...register("course", { required: "Course is required" })}
                className="p-2 border rounded"
              />
              {errors.course && <p className="text-red-500 text-sm col-span-2">{errors.course.message}</p>}

              <input
                type="text"
                placeholder="Enrollment Year"
                {...register("enrollmentYear", { required: "Year is required" })}
                className="p-2 border rounded"
              />
              {errors.enrollmentYear && <p className="text-red-500 text-sm col-span-2">{errors.enrollmentYear.message}</p>}

              <select
                {...register("status", { required: "Status is required" })}
                className="p-2 border rounded col-span-2"
                defaultValue="Active"
              >
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Dropped">Dropped</option>
              </select>

              <div className="col-span-2 flex gap-4 mt-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowForm(false);
                  }}
                  className="bg-gray-400 hover:bg-gray-500"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

         {editingStudent && (
          <div className="bg-yellow-100 p-6 rounded mb-6">
            <h2 className="text-lg font-bold mb-4 text-yellow-800">Edit Student</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.loading("Updating student...");
                setTimeout(() => {
                  setStudents((prev) =>
                    prev.map((s) => (s.id === editingStudent.id ? editingStudent : s))
                  );
                  setEditingStudent(null);
                  toast.dismiss();
                  toast.success("Student updated successfully!");
                }, 1000);
              }}
              className="grid grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={editingStudent.name}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, name: e.target.value })
                }
                required
                className="p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={editingStudent.email}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, email: e.target.value })
                }
                required
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Course"
                value={editingStudent.course}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, course: e.target.value })
                }
                className="p-2 border rounded"
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
                className="p-2 border rounded"
              />
              <select
                value={editingStudent.status}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    status: e.target.value as Student["status"],
                  })
                }
                className="p-2 border rounded col-span-2"
              >
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Dropped">Dropped</option>
              </select>

              <div className="col-span-2 flex gap-4 mt-2">
                <Button type="submit">Update</Button>
                <Button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="bg-gray-400 hover:bg-gray-500"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Course</th>
              <th className="p-2 border">Year</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">{s.email}</td>
                <td className="p-2 border">{s.course}</td>
                <td className="p-2 border">{s.enrollmentYear}</td>
                <td className="p-2 border">{s.status}</td>
                <td className="p-2 border">{s.role}</td>
                <td className="p-2 border space-x-2">
                  <Button onClick={() => setEditingStudent(s)}>Edit</Button>
                  <Button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </Button>
                  <Button onClick={() => handleToggleRole(s.id)}>
                    Make {s.role === "admin" ? "Student" : "Admin"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              onClick={() => setPage(p)}
              className={p === page ? "bg-blue-500 text-white" : ""}
            >
              {p}
            </Button>
          ))}

          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>

      </div>
    </ProtectedRoute>
  );
}
