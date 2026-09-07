"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export default function SignupForm() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { isAuthenticated, signup } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isAuthenticated) {
      toast.error("User is already logged in");
      router.push("/");
      return;
    }

    const email = formData.email;
    const password = formData.password;
    const fullName = formData.fullName;
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }

    const signupPromise = signup(fullName, email, password).then(() => {
      router.push("/");
    }).catch((error) => {
      console.error(error);
    });

    toast.promise(signupPromise, {
      loading: "Signing up...",
      success: "Signed up successfully!",
      error: (err) => {
        const errorMessage =
          err?.customData?._tokenResponse?.error?.message ||
          err?.code?.replace("auth/", "").replace(/-/g, "_").toUpperCase() ||
          err?.message ||
          "Sign up failed!";

        const formattedMessage = errorMessage
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/^\w/, (c) => c.toUpperCase());

        return formattedMessage;
      },
    });
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-70px-32px)] px-4 sm:px-6 md:px-0">
      <form
        onSubmit={handleSubmit}
        className="space-y-3 w-full sm:w-[70%] md:w-[60%] lg:w-[40%] xl:w-[30%] p-4 md:p-5 xl:p-6 bg-white shadow-xl rounded-3xl"
      >
        <h1 className="text-3xl text-gray-700 font-medium text-center mb-2">
          Sign Up
        </h1>
        <div>
          <label htmlFor="fullName" className="pl-2 text-sm md:text-base font-semibold text-gray-600">
            Full Name*
          </label>
          <input
            required
            placeholder="John Doe"
            type={"text"}
            id="fullName"
            className={
              "w-full py-2 px-4 text-gray-700 text-sm md:text-base md:text-base placeholder:text-gray-400 placeholder:text-sm md:text-base bg-gray-50 border border-gray-300 rounded-full"
            }
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="email" className="pl-2 text-sm md:text-base font-semibold text-gray-600">
            Email*
          </label>
          <input
            required
            placeholder="someone@gmail.com"
            type={"text"}
            id="email"
            className={"w-full py-2 px-4 text-gray-700 text-sm md:text-base md:text-base placeholder:text-gray-400 placeholder:text-sm md:text-base bg-gray-50 border border-gray-300 rounded-full"}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="pl-2 text-sm md:text-base font-semibold text-gray-600">
            Password*{" "}
          </label>
          <input
            required
            placeholder="******"
            type={showPassword ? "text" : "password"}
            id="password"
            className={"w-full py-2 px-4 pr-10 text-gray-700 text-sm md:text-base placeholder:text-gray-400 placeholder:text-sm md:text-base bg-gray-50 border border-gray-300 rounded-full"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-6 top-[30%] translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </button>
        </div>


        <p className="w-full text-sm mb-3 text-gray-500">
          <span>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400">
              Login
            </Link>
          </span>
        </p>
        <Button size="md" className="w-full mb-2">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
