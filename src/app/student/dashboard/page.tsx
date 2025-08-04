"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/Input";
import { Button } from "@/app/components/Button";
import { UploadCloud, UserCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const { user, token } = useAuth()!;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: "",
    enrollmentYear: new Date().getFullYear(),
    status: "Active",
    imageUrl: "",
    role: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized. Please log in.");
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://mini-student-management-system-1.onrender.com/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setFormData(data);
        setAvatarPreview(data.imageUrl || null);
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to load profile.");
      }
    };

    fetchProfile();
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const formDataImage = new FormData();
    formDataImage.append("profilePicture", file);

    try {
      const res = await fetch(
        "https://mini-student-management-system-1.onrender.com/api/users/me/profile-picture",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataImage,
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success("Profile picture updated!");

      setAvatarPreview(result.user.imageUrl);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to upload picture");
    }
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        "https://mini-student-management-system-1.onrender.com/api/users/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        {user?.role === "admin" ? "Admin" : "Student"} Profile
      </h1>

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

          <label className="cursor-pointer bg-green-50 px-4 py-2 rounded-md border border-green-200 text-sm text-green-700 flex items-center gap-2 hover:bg-green-100 transition-colors duration-200">
            <UploadCloud className="w-4 h-4 text-green-600" /> Upload
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>

        {editing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
              <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
              <Input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Phone" />
              {user?.role === "student" && (
                <>
                  <Input name="course" value={formData.course || ""} onChange={handleChange} placeholder="Course" />
                  <Input
                    name="enrollmentYear"
                    value={formData.enrollmentYear || ""}
                    onChange={handleChange}
                    placeholder="Enrollment Year"
                  />
                  <Input
                    name="status"
                    value={formData.status || ""}
                    onChange={handleChange}
                    placeholder="Status"
                  />
                </>
              )}
              <Input name="role" value={formData.role} readOnly disabled />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                Save
              </Button>
              <Button onClick={() => setEditing(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <p><strong className="text-green-700">Full Name:</strong> {formData.fullName}</p>
              <p><strong className="text-green-700">Email:</strong> {formData.email}</p>
              <p><strong className="text-green-700">Phone:</strong> {formData.phone || "N/A"}</p>
              <p><strong className="text-green-700">Role:</strong> {formData.role}</p>
              {user?.role === "student" && (
                <>
                  <p><strong className="text-green-700">Course:</strong> {formData.course}</p>
                  <p><strong className="text-green-700">Enrollment Year:</strong> {formData.enrollmentYear}</p>
                  <p><strong className="text-green-700">Status:</strong> {formData.status}</p>
                </>
              )}
            </div>

            <Button onClick={() => setEditing(true)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Edit Profile
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
