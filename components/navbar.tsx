"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ttTrailer } from "@/app/ui/fonts";

import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "./ui/Button";

export default function Navbar() {
  const router = useRouter();
  return (
    <>
      <SmallNavbar router={router} />
      <LargeNavbar router={router} />
    </>
  );
}

function SmallNavbar({ router }) {
  return (
    <div className="md:hidden sticky top-0 z-50 bg-white">
      <nav className="relative h-[70px] w-full flex items-center justify-between sm:px-4 px-6">
        <h1
          className={`${ttTrailer.className} font-bold text-gray-800 text-3xl `}
        >
          <Link href="/">MovieMania</Link>
        </h1>
        <div className="flex items-center justify-center">
          <Button onClick={() => router.push("/search")} size="md" icon="search" varient="outline" className="border-none shadow-none" />
          <UserAvatar size="md" />
        </div>
      </nav>
    </div>
  );
}

function LargeNavbar({ router }) {
  return (
    <div className="hidden md:block">
      <nav className="hidden md:sticky top-0 z-20 h-[70px] bg-white w-full md:flex items-center justify-between md:px-10 lg:px-15 xl:px-20">
        <h1
          className={`${ttTrailer.className} font-bold text-gray-800 text-3xl `}
        >
          <Link href="/">MovieMania</Link>
        </h1>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => router.push("/search")} size="md" icon="search" varient="outline" className="border-none shadow-none" />
          <UserAvatar size="md" />
        </div>
      </nav>
    </div>
  );
}
