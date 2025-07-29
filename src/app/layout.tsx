// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SMS",
  description: "Mini Student Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-green-100 via-gray-100 to-lime-100">
        <SessionProviderWrapper>
          <Navbar />
          <Toaster position="top-right" />
          <main>{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
