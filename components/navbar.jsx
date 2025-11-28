"use client";
import { ttTrailers } from "@/app/ui/fonts";

import { useSearchMovies } from "@/utils/hooks/useSearchMovies";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const { query, setQuery } = useSearchMovies();
  return (
    <>
      <SmallNavbar query={query} setQuery={setQuery} />
      <LargeNavbar query={query} setQuery={setQuery} />
    </>
  );
}

function SmallNavbar({ query, setQuery }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="sticky top-0 z-50 md:hidden bg-white shadow">
      <nav className="relative h-[70px]  w-full flex items-center justify-between px-4 md:px-8 lg:px-14 ">
        <h1
          className={`${ttTrailers.className} italic font-extrabold text-gray-800 text-3xl `}
        >
          MoviesHub
        </h1>
        <div className="flex items-center justify-center text-gray-800">
          <span
            className="material-symbols-outlined "
            onClick={() => setIsOpen(!isOpen)}
          >
            menu
          </span>
        </div>
      </nav>
      {isOpen && (
        <div
          className={`relative w-full pb-2 px-4 ${isOpen ? "show" : "hide"}`}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies..."
            className="w-full h-12 rounded-full border border-gray-400 focus:outline focus:outline-blue-400 px-5 text-gray-700 placeholder:text-gray-400"
          />
          <lord-icon
            src="https://cdn.lordicon.com/wjyqkiew.json"
            trigger="loop"
            delay="2500"
            stroke="bold"
            style={{
              width: 30,
              height: 30,
              position: "absolute",
              right: 25,
              top: 8,
            }}
          ></lord-icon>
        </div>
      )}
    </div>
  );
}

function LargeNavbar({ query, setQuery }) {
  return (
    <nav className="hidden md:sticky top-0 z-20 h-[70px] bg-white w-full md:flex items-center justify-between md:px-10 lg:px-15 xl:px-20 shadow">
      <h1
        className={`${ttTrailers.className} italic font-extrabold text-gray-800 text-3xl `}
      >
        MoviesHub
      </h1>
      <div className="flex justify-end relative w-full ">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className="md:w-1/2 lg:w-[45%] xl:w-[35%] h-12 rounded-full border border-gray-400 focus:outline focus:outline-blue-400 px-5 text-gray-700 placeholder:text-gray-400"
        />
        <lord-icon
          src="https://cdn.lordicon.com/wjyqkiew.json"
          trigger="loop"
          delay="2500"
          stroke="bold"
          style={{
            width: 30,
            height: 30,
            position: "absolute",
            right: 10,
            top: 8,
          }}
        ></lord-icon>
      </div>
    </nav>
  );
}
