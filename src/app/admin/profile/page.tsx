"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { Button } from "@/app/components/Button";
import toast from "react-hot-toast";

type AdminProfile = {
  fullName: string;
  email: string;
  phone: string;
  role: "admin";
  profilePic?: string;
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile>({
    fullName: "Aline Uwimana",
    email: "aline.admin@example.com",
    phone: "+250780000000",
    role: "admin",
    profilePic: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<AdminProfile>({
    defaultValues: profile,
  });

  useEffect(() => {
    // Simulate loading profile
    setValue("fullName", profile.fullName);
    setValue("email", profile.email);
    setValue("phone", profile.phone);
    setValue("role", profile.role);
  }, [profile, setValue]);

  const onSubmit = handleSubmit((data) => {
    toast.loading("Updating profile...");
    setTimeout(() => {
      setProfile(data);
      toast.dismiss();
      toast.success("Profile updated successfully!");
    }, 1000);
  });

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Admin Profile</h1>

        <form onSubmit={onSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Full Name"
            {...register("fullName", { required: "Full name is required" })}
            className="p-2 border rounded"
          />

          <input
            type="email"
            {...register("email")}
            className="p-2 border rounded bg-gray-100"
            readOnly
          />

          <input
            type="tel"
            placeholder="Phone Number"
            {...register("phone", { required: "Phone number is required" })}
            className="p-2 border rounded"
          />

          <input
            type="text"
            {...register("role")}
            readOnly
            className="p-2 border rounded bg-gray-100"
          />

          {/* Optional: Upload profile picture later */}

          <div className="flex gap-4 mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
