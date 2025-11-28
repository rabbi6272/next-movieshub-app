"use client";
import { ttTrailers } from "@/app/ui/fonts";

import { useSearchMovies } from "@/utils/hooks/useSearchMovies";

export default function Navbar() {
  const { query, setQuery } = useSearchMovies();
  return (
    <nav className="sticky top-0 z-20 h-[70px] bg-white w-full flex items-center justify-between px-4 md:px-8 lg:px-14 shadow">
      <h1
        className={`${ttTrailers.className} italic font-extrabold text-gray-800 text-3xl order-1`}
      >
        MoviesHub
      </h1>
      <div className="flex-wrap flex-1 lg:flex justify-end relative w-full order-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className="w-full md:w-1/2 lg:w-1/3  h-12 rounded-full border border-gray-400 focus:outline focus:outline-blue-400 px-5 text-gray-700 placeholder:text-gray-400"
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
      <div className="lg:hidden flex items-center justify-center order-2">
        {" "}
      </div>
    </nav>
  );
}
