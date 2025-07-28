"use client";

import { useState } from "react";
import { Input } from "@/app/components/Input";
import { Button } from "@/app/components/Button";
import ProtectedRoute from "../components/ProtectedRoute";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "Aline Uwera",
    email: "aline@example.com",
    phone: "+250 788 123 456",
    course: "Software Engineering",
    enrollmentYear: "2023",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Later: connect to API to update profile
    console.log("Updated Profile:", profile);
  };

  return (
    <ProtectedRoute allowedRoles={["student", "admin"]}>
    <div className="max-w-2xl mx-auto mt-12 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={profile.fullName}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          value={profile.email}
          readOnly
        />
        <Input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={profile.phone}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="course"
          placeholder="Course of Study"
          value={profile.course}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="enrollmentYear"
          placeholder="Enrollment Year"
          value={profile.enrollmentYear}
          onChange={handleChange}
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
    </ProtectedRoute>
  );
}
