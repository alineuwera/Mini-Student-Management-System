"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import Link from "next/link";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    toast.loading("Logging in...");

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    toast.dismiss();

    if (res?.ok) {
      toast.success("Login successful!");

      // Wait a bit and fetch session role
      setTimeout(async () => {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        const role = session?.user?.role;

        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/student/dashboard");
        }
      }, 500);
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-gray-100 to-lime-100 p-4 sm:p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 animate-fade-in"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-700">
          Login to SMS
        </h1>

        <div className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-green-600 hover:text-green-800 font-medium hover:underline transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}