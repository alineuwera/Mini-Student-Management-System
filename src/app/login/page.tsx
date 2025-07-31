"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

type LoginData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>();

  const { login } = useAuth()!;

  const onSubmit = async (data: LoginData) => {
    toast.loading("Logging in...");

    try {
      const res = await fetch(`http://localhost:4000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      toast.dismiss();

      if (!res.ok) {
        toast.error(result.message || "Login failed");
        return;
      }

      // Save in context (also saves to localStorage)
      login(result.user, result.token);

      toast.success("Login successful!");
      console.log("TOKEN FROM BACKEND:", result.token);

      // Redirect based on role
      router.push(result.user.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    } catch {
      toast.dismiss();
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <Input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <Input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
