"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRouter } from "next/navigation";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
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

    try {
      const res = await fetch(`http://localhost:4000/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const result = await res.json();
      toast.dismiss();

      if (!res.ok) {
        toast.error(result.message || "Registration failed");
        return;
      }

      toast.success("Registered successfully!");
      router.push("/login");
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
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <Input
          placeholder="Full Name"
          {...register("fullName", { required: "Full name is required" })}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName.message}</p>
        )}

        <Input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <Input
          type="text"
          placeholder="Phone Number"
          {...register("phone", { required: "Phone number is required" })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}

        <Input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />

        <Input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", { required: "Confirm your password" })}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
