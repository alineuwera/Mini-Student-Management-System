"use client";

import { useSession } from "next-auth/react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import {
  UserCircle,
  UploadCloud
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const { data: session } = useSession();
  const user = session?.user;

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    role: user?.role || "admin",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-3xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Admin Profile</h1>

        <div className="bg-white p-6 rounded shadow">
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
              <p className="text-lg font-semibold">{formData.name}</p>
              <p className="text-sm text-gray-500">{formData.email}</p>
            </div>
          </div>

          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Full Name"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Email"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Phone Number"
              />

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
                  <label className="cursor-pointer bg-blue-50 px-4 py-2 rounded border border-blue-200 text-sm flex items-center gap-2 hover:bg-blue-100">
                    <UploadCloud className="w-4 h-4" /> Upload
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
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><span className="font-semibold">Name:</span> {formData.name}</p>
                <p><span className="font-semibold">Email:</span> {formData.email}</p>
                <p><span className="font-semibold">Phone:</span> {formData.phone || "N/A"}</p>
                <p><span className="font-semibold">Role:</span> {formData.role}</p>
              </div>

              <div className="mt-6">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
