"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    toast.loading("Registering...");
    await new Promise((r) => setTimeout(r, 1000));
    toast.dismiss();
    toast.success("Registered successfully!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-gray-100 to-lime-100 p-4 sm:p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 animate-fade-in"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-700">
          Register for SMS
        </h1>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

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

          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              {...register("confirmPassword", { required: "Confirm your password" })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 hover:text-green-800 font-medium hover:underline transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}