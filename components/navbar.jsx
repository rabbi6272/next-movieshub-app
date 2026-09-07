"use client";

import { ttTrailer } from "@/app/ui/fonts";

import { UserAvatar } from "@/components/UserAvatar";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <SmallNavbar />
      <LargeNavbar />
    </>
  );
}

function SmallNavbar() {
  return (
    <div className="md:hidden sticky top-0 z-50 bg-white shadow-md">
      <nav className="relative h-[70px] w-full flex items-center justify-between sm:px-4 px-6">
        <h1
          className={`${ttTrailer.className} font-bold text-gray-800 text-3xl `}
        >
          <Link href="/">MovieMania</Link>
        </h1>
        <div className="flex items-center justify-center gap-4">
          <Link href="/search">
            <span className="material-symbols-outlined text-gray-500">
              search
            </span>
          </Link>

          <UserAvatar size="md" />
        </div>
      </nav>
    </div>
  );
}

function LargeNavbar() {
  return (
    <nav className="hidden md:sticky top-0 z-20 h-[70px] bg-white w-full md:flex items-center justify-between md:px-10 lg:px-15 xl:px-20 shadow-md">
      <h1
        className={`${ttTrailer.className} font-bold text-gray-800 text-3xl `}
      >
        <Link href="/">MovieMania</Link>
      </h1>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/search"
        >
          <span className="material-symbols-outlined text-gray-500">
            search
          </span>
        </Link>

        <UserAvatar size="md" />
      </div>
    </nav>
  );
}
