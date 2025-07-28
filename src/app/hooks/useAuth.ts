"use client";

import { useEffect, useState } from "react";

// Fake user for now
const mockUser = {
  id: "1",
  fullName: "Aline Uwera",
  email: "aline.admin@example.com",
  role: "admin",
};

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Simulate checking auth from localStorage or cookie
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (savedUser) {
      setUser(savedUser);
    } else {
      // Fallback to mock
      setUser(mockUser);
    }
  }, []);

  return { user };
}
