"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

// Fake user for now
const mockUser: User = {
  id: "1",
  fullName: "Aline Uwera",
  email: "aline.admin@example.com",
  role: "admin",
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null); // ✅ Replaced `any` with `User`

  useEffect(() => {
    // Simulate checking auth from localStorage or cookie
    const savedUser = JSON.parse(localStorage.getItem("user") || "null") as User | null;
    if (savedUser) {
      setUser(savedUser);
    } else {
      // Fallback to mock
      setUser(mockUser);
    }
  }, []);

  return { user };
}
