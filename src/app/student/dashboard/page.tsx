"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  BookOpenCheck,
  CalendarCheck2,
  UserCircle,
} from "lucide-react";
import { Input } from "@/app/components/Input";
import { Button } from "@/app/components/Button";

type FormData = {
  fullName: string;
  email: string;
  phone?: string;
  course?: string;
  enrollmentYear?: number;
  status?: string;
  imageUrl?: string;
};

export default function StudentDashboard() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    course: "",
    enrollmentYear: new Date().getFullYear(),
    status: "Active",
    imageUrl: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized. Please log in.");
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("https://mini-student-management-system-1.onrender.com/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = await res.json();
        if (!res.ok) throw new Error(user.message);

        setFormData(user);
        setAvatarPreview(
          user.imageUrl ? "https://mini-student-management-system-1.onrender.com/" + user.imageUrl : null
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to load profile.");
        }
      }
    };

    fetchProfile();
  }, [token, router]);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataImage,
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success("Profile picture updated!");

      setAvatarPreview("https://mini-student-management-system-1.onrender.com/" + result.user.imageUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to upload picture");
      }
    }
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      const res = await fetch("https://mini-student-management-system-1.onrender.com/api/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Update failed");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 sm:p-6 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6">
        Student Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card icon={<GraduationCap />} label="Course" value={formData.course} />
        <Card
          icon={<CalendarCheck2 />}
          label="Enrollment Year"
          value={formData.enrollmentYear || ""}
        />
        <Card icon={<BookOpenCheck />} label="Status" value={formData.status} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-green-700">Profile Info</h2>

        <div className="flex items-center gap-4 mb-6">
          {avatarPreview &&
          avatarPreview.trim() !== "" &&
          avatarPreview !== "https://mini-student-management-system-1.onrender.com" ? (
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
            <p className="text-lg font-semibold text-green-700">
              {formData.fullName}
            </p>
            <p className="text-sm text-gray-500">{formData.email}</p>
          </div>
        </div>

        {editing ? (
          <EditForm
            formData={formData}
            onChange={handleChange}
            onUpload={handleAvatarUpload}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <DisplayForm formData={formData} onEdit={() => setEditing(true)} />
        )}
      </div>
    </div>
  );
}

function Card({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
      <div className="w-10 h-10 text-green-600">{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-lg font-semibold text-green-700">{value || "N/A"}</p>
      </div>
    </div>
  );
}

function EditForm({
  formData,
  onChange,
  onUpload,
  onSave,
  onCancel,
}: {
  formData: FormData;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        name="fullName"
        value={formData.fullName}
        onChange={onChange}
        placeholder="Full Name"
      />
      <Input
        name="email"
        value={formData.email}
        onChange={onChange}
        placeholder="Email"
      />
      <Input
        name="phone"
        value={formData.phone}
        onChange={onChange}
        placeholder="Phone Number"
      />
      <Input
        name="course"
        value={formData.course}
        onChange={onChange}
        placeholder="Course"
      />
      <Input
        name="enrollmentYear"
        value={formData.enrollmentYear}
        onChange={onChange}
        placeholder="Enrollment Year"
      />
      <select
        name="status"
        value={formData.status}
        onChange={onChange}
        className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
      >
        <option value="Active">Active</option>
        <option value="Graduated">Graduated</option>
        <option value="Dropped">Dropped</option>
      </select>

      <div className="col-span-2 mt-2">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Upload Profile Picture
        </label>
        <input type="file" accept="image/*" onChange={onUpload} />
      </div>

      <div className="col-span-2 flex gap-4 mt-4">
        <Button onClick={onSave}>Save</Button>
        <Button onClick={onCancel} className="bg-gray-300 text-black">
          Cancel
        </Button>
      </div>
    </div>
  );
}

function DisplayForm({
  formData,
  onEdit,
}: {
  formData: FormData;
  onEdit: () => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p>
          <span className="font-semibold text-green-700">Name:</span>{" "}
          {formData.fullName}
        </p>
        <p>
          <span className="font-semibold text-green-700">Email:</span>{" "}
          {formData.email}
        </p>
        <p>
          <span className="font-semibold text-green-700">Phone:</span>{" "}
          {formData.phone || "N/A"}
        </p>
        <p>
          <span className="font-semibold text-green-700">Course:</span>{" "}
          {formData.course}
        </p>
        <p>
          <span className="font-semibold text-green-700">Enrollment Year:</span>{" "}
          {formData.enrollmentYear}
        </p>
        <p>
          <span className="font-semibold text-green-700">Status:</span>{" "}
          {formData.status}
        </p>
      </div>

      <div className="mt-6">
        <Button onClick={onEdit}>Edit Profile</Button>
      </div>
    </>
  );
}
