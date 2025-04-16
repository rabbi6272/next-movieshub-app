"use client";
import { useState, useEffect } from "react";
import { SmallMovieCard } from "@/components/smallMovieCard";
export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState("watchlist");

  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASEE_URL}/api/get-all-movies`,
        {
          method: "GET",
        }
      );
      const { data: movies } = await res.json();
      setMovies(movies);
    }
    fetchMovies();
  }, []);

  let filteredMovies;

  category === "watchlist"
    ? (filteredMovies = movies.filter((movie) => movie.wantToWatch))
    : (filteredMovies = movies.filter((movie) => movie.watched));

  return (
    <div className="w-[95%] md:w-[60%] lg:w-[40%] mx-auto my-2">
      <div className="w-full flex mb-1 transition-all duration-500">
        <button
          className={`flex-1 py-3 border-2 border-[#0d5c7f] ${
            category === "watchlist" && "bg-[#0d5c7f]"
          }  rounded-l`}
          onClick={() => setCategory("watchlist")}
        >
          Watchlist
        </button>
        <button
          className={`flex-1 py-3 border-2 border-[#0d5c7f] ${
            category === "watched" && "bg-[#0d5c7f]"
          }  rounded-r`}
          onClick={() => setCategory("watched")}
        >
          Watched
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {filteredMovies?.map((movie) => (
          <SmallMovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
