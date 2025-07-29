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
import { Input } from "@/app/components/Input";
import { Button } from "@/app/components/Button";

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
      <div className="max-w-5xl mx-auto mt-10 p-4 sm:p-6 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6">Admin Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
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

              <div className="col-span-2">
                <label className="block text-sm font-medium text-green-700 mb-1">
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
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  className="bg-green-300 text-gray-800 px-4 py-2 rounded-md hover:bg-green-400 transition-colors duration-200"
                  onClick={() => setEditing(false)}
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
                <p><span className="font-semibold text-green-700">Role:</span> {formData.role}</p>
              </div>

              <div className="mt-6">
                <Button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
                  onClick={() => setEditing(true)}
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