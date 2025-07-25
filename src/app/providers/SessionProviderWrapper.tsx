// app/providers/SessionProviderWrapper.tsx
"use client"; // 👈 Required to make this a Client Component

import { SessionProvider } from "next-auth/react";
import React from "react";

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
