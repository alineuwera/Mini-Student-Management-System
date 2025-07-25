"use client";

import { useState } from "react";
import { Input } from "@/app/components/Input";
import { Button } from "@/app/components/Button";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    // Next: Connect to backend API
    console.log({ fullName, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <Button type="submit">Create Account</Button>
      </form>
    </div>
  );
}
