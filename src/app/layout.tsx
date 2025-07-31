// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
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
        <AuthProvider>
          <Navbar />
          <Toaster position="top-right" />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
