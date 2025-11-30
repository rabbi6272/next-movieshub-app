"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/db/firebaseConfig";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

import { useLocalStorage } from "@/store/store";

export default function SignupForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const userID = useLocalStorage((state) => state.userID);
  const setUserID = useLocalStorage((state) => state.setUserID);

  async function handleSubmit(event) {
    event.preventDefault();
    const email = formData.email;
    const password = formData.password;
    if (userID) {
      toast.error("User is already logged in");
      return;
    }
    const signupPromise = createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then((userCredential) => {
      localStorage.setItem("userID", JSON.stringify(userCredential.user.uid));
      setUserID(userCredential.user.uid);
      return userCredential;
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

    setFormData({ email: "", password: "" });
    router.push("/");
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-70px)] px-4 md:px-0">
      <form
        onSubmit={handleSubmit}
        className="space-y-3 max-w-full md:w-[50%] lg:w-[40%] xl:w-[30%] p-5 bg-white shadow-md rounded-lg"
      >
        <h1 className="text-2xl text-gray-700 font-bold text-center">
          Sign Up
        </h1>
        <label htmlFor="email" className="text-sm text-gray-600">
          Email*
        </label>
        <Input
          required
          placeholder="someone@gmail.com"
          type={"text"}
          id="email"
          className={"text-gray-700"}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label htmlFor="password" className="text-sm text-gray-600">
          Password*
        </label>
        <Input
          required
          placeholder="******"
          type={"password"}
          id="password"
          className={"text-gray-700"}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <p className="w-full text-xs mb-3 text-gray-500 flex justify-between">
          <span>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400">
              Login
            </Link>
          </span>
          <span className=" text-blue-400">Forgot Password?</span>
        </p>
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}
