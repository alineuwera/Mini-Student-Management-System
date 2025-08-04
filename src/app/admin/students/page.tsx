"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/app/components/Button";
import ProtectedRoute from "@/app/components/ProtectedRoute";


type Student = {
  _id: string;
  fullName: string;
  email: string;
  course: string;
  enrollmentYear: string;
  status: "Active" | "Graduated" | "Dropped";
  role: "student" | "admin";
};

type StudentForm = {
  fullName: string;
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
    formState: {isSubmitting },
  } = useForm<StudentForm>();

  const filteredStudents = students.filter(
    (s) =>
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginated = filteredStudents.slice(
    (page - 1) * studentsPerPage,
    page * studentsPerPage
  );

  // Load all students
useEffect(() => {
  fetch("/api/admin/students", { 
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched students:", data);
      // Check if it's an array
      if (Array.isArray(data)) {
        setStudents(data);
      } else if (Array.isArray(data.students)) {
        setStudents(data.students); // in case it's wrapped in a 'students' key
      } else {
        toast.error("Invalid student data format");
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      toast.error("Failed to load students");
    });
}, []);


  // Add student
  const onAddStudent = handleSubmit((data) => {
    toast.loading("Adding student...");
    fetch("https://mini-student-management-system-1.onrender.com/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((newStudent) => {
        setStudents((prev) => [...prev, newStudent]);
        reset();
        setShowForm(false);
        toast.dismiss();
        toast.success("Student added!");
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to add student.");
      });
  });

  // Update student
  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    toast.loading("Updating student...");
    fetch(`https://mini-student-management-system-1.onrender.com/api/admin/students/${editingStudent._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" ,
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      credentials: "include",
      body: JSON.stringify(editingStudent),
    })
      .then((res) => res.json())
      .then((updated) => {
        setStudents((prev) =>
          prev.map((s) => (s._id === updated._id ? updated : s))
        );
        setEditingStudent(null);
        toast.dismiss();
        toast.success("Student updated!");
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Update failed.");
      });
  };

  // Delete student
  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    toast.loading("Deleting...");
    fetch(`https://mini-student-management-system-1.onrender.com/api/admin/students/${id}`, {
      headers: { "Content-Type": "application/json" ,
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setStudents((prev) => prev.filter((s) => s._id !== id));
        toast.dismiss();
        toast.success("Student deleted!");
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to delete student.");
      });
  };

  // Toggle role
  const handleToggleRole = (id: string) => {
    const student = students.find((s) => s._id === id);
    if (!student) return;
    const newRole = student.role === "admin" ? "student" : "admin";

    toast.loading("Changing role...");
    fetch(`https://mini-student-management-system-1.onrender.com/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
       },
      credentials: "include",
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStudents((prev) =>
          prev.map((s) => (s._id === id ? data.user : s))
        );
        toast.dismiss();
        toast.success("Role updated!");
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to change role.");
      });
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto mt-4 p-4 sm:p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Manage Students
        </h1>

        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or course..."
            className="p-3 border border-gray-300 rounded-lg w-full sm:w-72"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Student
          </Button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h2 className="text-2xl font-bold text-green-700 mb-4">New Student</h2>
            <form onSubmit={onAddStudent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Full Name"
                {...register("fullName", { required: "Required" })}
                className="p-3 border rounded"
              />
              <input
                placeholder="Email"
                type="email"
                {...register("email", { required: "Required" })}
                className="p-3 border rounded"
              />
              <input
                placeholder="Course"
                {...register("course", { required: "Required" })}
                className="p-3 border rounded"
              />
              <input
                placeholder="Enrollment Year"
                {...register("enrollmentYear", { required: "Required" })}
                className="p-3 border rounded"
              />
              <select {...register("status")} className="p-3 border rounded col-span-2">
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Dropped">Dropped</option>
              </select>
              <div className="flex gap-2 col-span-2">
                <Button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded">
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    reset();
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Edit form */}
        {editingStudent && (
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Edit Student</h2>
            <form onSubmit={handleUpdateStudent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={editingStudent.fullName}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, fullName: e.target.value })
                }
                className="p-3 border rounded"
              />
              <input
                value={editingStudent.email}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, email: e.target.value })
                }
                className="p-3 border rounded"
              />
              <input
                value={editingStudent.course}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, course: e.target.value })
                }
                className="p-3 border rounded"
              />
              <input
                value={editingStudent.enrollmentYear}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, enrollmentYear: e.target.value })
                }
                className="p-3 border rounded"
              />
              <select
                value={editingStudent.status}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    status: e.target.value as Student["status"],
                  })
                }
                className="p-3 border rounded col-span-2"
              >
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Dropped">Dropped</option>
              </select>
              <div className="flex gap-2 col-span-2">
                <Button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  Update
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Course</th>
                <th className="p-2 text-left">Year</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s._id} className="border-b hover:bg-green-50">
                  <td className="p-2">{s.fullName}</td>
                  <td className="p-2">{s.email}</td>
                  <td className="p-2">{s.course}</td>
                  <td className="p-2">{s.enrollmentYear}</td>
                  <td className="p-2">{s.status}</td>
                  <td className="p-2">{s.role}</td>
                  <td className="p-2 space-x-2">
                    <Button onClick={() => setEditingStudent(s)} className="text-sm bg-green-500 text-white px-2 py-1 rounded">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(s._id)} className="text-sm bg-red-500 text-white px-2 py-1 rounded">
                      Delete
                    </Button>
                    <Button onClick={() => handleToggleRole(s._id)} className="text-sm bg-blue-500 text-white px-2 py-1 rounded">
                      Make {s.role === "admin" ? "Student" : "Admin"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              onClick={() => setPage(p)}
              className={`px-4 py-2 rounded ${p === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {p}
            </Button>
          ))}
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Next
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
