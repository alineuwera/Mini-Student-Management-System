"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (
      status === "authenticated" &&
      allowedRoles &&
      !allowedRoles.includes(session?.user?.role || "")
    ) {
      router.push("/unauthorized"); // Optional: make this page
    }
  }, [status, session, allowedRoles, router]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
