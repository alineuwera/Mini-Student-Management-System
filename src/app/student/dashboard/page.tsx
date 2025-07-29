"use client";

import { useSession } from "next-auth/react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { GraduationCap, BookOpenCheck, CalendarCheck2, UploadCloud, UserCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/app/components/Input";
import { Button } from "@/app/components/Button";

type FormData = {
  name: string;
  email: string;
  phone: string;
  course: string;
  enrollmentYear: string;
  status: string;
};

export default function StudentDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    course: "Software Engineering",
    enrollmentYear: "2023",
    status: "Active",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="max-w-5xl mx-auto mt-10 p-4 sm:p-6 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6">Student Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
            <GraduationCap className="w-10 h-10 text-green-600" />
            <div>
              <p className="text-gray-600 text-sm">Course</p>
              <p className="text-lg font-semibold text-green-700">{formData.course}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
            <CalendarCheck2 className="w-10 h-10 text-green-600" />
            <div>
              <p className="text-gray-600 text-sm">Enrollment Year</p>
              <p className="text-lg font-semibold text-green-700">{formData.enrollmentYear}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
            <BookOpenCheck className="w-10 h-10 text-green-600" />
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <p className="text-lg font-semibold text-green-700">{formData.status}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-green-700">Profile Info</h2>

          <div className="flex items-center gap-4 mb-6">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Profile Picture"
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-16 h-16 text-gray-400" />
            )}
            <div>
              <p className="text-lg font-semibold text-green-700">{formData.name}</p>
              <p className="text-sm text-gray-500">{formData.email}</p>
            </div>
          </div>

          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
              <Input
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="Course"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
              <Input
                name="enrollmentYear"
                value={formData.enrollmentYear}
                onChange={handleChange}
                placeholder="Enrollment Year"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              >
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Dropped">Dropped</option>
              </select>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-16 h-16 text-gray-400" />
                  )}
                  <label className="cursor-pointer bg-green-50 px-4 py-2 rounded-md border border-green-200 text-sm text-green-700 flex items-center gap-2 hover:bg-green-100 transition-colors duration-200">
                    <UploadCloud className="w-4 h-4 text-green-600" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="col-span-2 flex gap-4 mt-4">
                <Button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditing(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><span className="font-semibold text-green-700">Name:</span> {formData.name}</p>
                <p><span className="font-semibold text-green-700">Email:</span> {formData.email}</p>
                <p><span className="font-semibold text-green-700">Phone:</span> {formData.phone || "N/A"}</p>
                <p><span className="font-semibold text-green-700">Course:</span> {formData.course}</p>
                <p><span className="font-semibold text-green-700">Enrollment Year:</span> {formData.enrollmentYear}</p>
                <p><span className="font-semibold text-green-700">Status:</span> {formData.status}</p>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Edit Profile
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}