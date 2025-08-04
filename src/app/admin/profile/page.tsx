"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext"; // adjust path if needed
import { Input } from "@/app/components/Input";
import { Button } from "@/app/components/Button";
import toast from "react-hot-toast";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Image from "next/image";
import { UploadCloud, UserCircle } from "lucide-react";

export default function AdminProfile() {
  const {token } = useAuth()!;
  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    if (!token) return;
    fetch("https://mini-student-management-system-1.onrender.com/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "",
        });
        if (data.imageUrl) {
          setAvatarPreview(`https://mini-student-management-system-1.onrender.com/${data.imageUrl}`);
        }
      })
      .catch(() => toast.error("Failed to load profile"));
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const formData = new FormData();
    formData.append("avatar", file);

    fetch("https://mini-student-management-system-1.onrender.com/api/users/me/profile-picture", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Profile picture updated");
        setAvatarPreview(`https://mini-student-management-system-1.onrender.com${data.user.imageUrl}`);
      })
      .catch(() => toast.error("Failed to upload profile picture"));
  };

  const handleSave = () => {
    if (!token) return;
    fetch("https://mini-student-management-system-1.onrender.com/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Profile updated");
        setEditing(false);
      })
      .catch(() => toast.error("Failed to update profile"));
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Admin Profile</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-16 h-16 text-gray-400" />
            )}
            <div>
              <p className="text-lg font-semibold text-green-700">{formData.fullName}</p>
              <p className="text-sm text-gray-500">{formData.email}</p>
            </div>
          </div>

          {editing ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
                <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                <Input name="role" value={formData.role} readOnly disabled />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-green-700">Profile Picture</label>
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

              <div className="flex gap-4">
                <Button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Save</Button>
                <Button onClick={() => setEditing(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <p><strong className="text-green-700">Full Name:</strong> {formData.fullName}</p>
                <p><strong className="text-green-700">Email:</strong> {formData.email}</p>
                <p><strong className="text-green-700">Phone:</strong> {formData.phone || "N/A"}</p>
                <p><strong className="text-green-700">Role:</strong> {formData.role}</p>
              </div>
              <Button onClick={() => setEditing(true)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Edit Profile</Button>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
