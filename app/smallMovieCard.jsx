"use client";
import Image from "next/image";

import { motion } from "framer-motion";

import { Button } from "@material-tailwind/react";
import { toast } from "react-toastify";

export function SmallMovieCard({ movie, index, movies, setMovies }) {
  async function handleDeleteMovie(id) {
    try {
      const res = await fetch(`/api/delete-movie?id=${id}`, {
        method: "DELETE",
      });
      const { status, success, message } = await res.json();
      if (success) {
        toast.success(message);
        setMovies(movies.filter((movie) => movie._id !== id));
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <motion.div
      className="relative h-[120px] w-full rounded-lg bg-[#0d5c7f] flex items-center justify-between p-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <button
        className="absolute top-[3px] right-[3px] text-[20px] text-gray-400 hover:text-gray-300 transition-all font-light cursor-pointer"
        onClick={() => {
          handleDeleteMovie(movie._id);
        }}
      >
        <span className="material-symbols-rounded">close</span>
      </button>

      {movie.Poster !== "N/A" && (
        <Image
          width={75}
          height={90}
          src={movie.Poster}
          alt={movie.Title}
          className="rounded-md object-cover"
        />
      )}

      <div className="text-gray-300 w-full flex flex-col gap-0.5 items-center">
        <h1 className="text-white text-base md:text-lg text-wrap font-semibold font-nunito">
          {movie.Title}
        </h1>
        <p className="text-sm">🗓️{movie.Year}</p>
        <p className="text-sm">⭐{movie.imdbRating}</p>
        <p className="text-sm">📈{movie.imdbVotes}</p>
      </div>

      <div className="flex flex-col gap-2 pr-6">
        <Button
          size="sm"
          className={`${
            movie.wantToWatch
              ? "bg-blue-500 border-2 border-blue-600"
              : "border border-gray-300"
          } rounded-full font-medium py-1.5 grid place-items-center cursor-pointer`}
        >
          {movie.wantToWatch ? (
            <span className="material-symbols-rounded">bookmark_added</span>
          ) : (
            <span className="material-symbols-rounded">bookmark_add</span>
          )}
        </Button>
        <Button
          size="sm"
          className={`${
            movie.watched
              ? "bg-blue-500 border-2 border-blue-600"
              : "border border-gray-300"
          } rounded-full font-medium py-1.5 grid place-items-center cursor-pointer`}
        >
          {movie.watched ? (
            <span className="material-symbols-rounded">done_all</span>
          ) : (
            <span className="material-symbols-rounded">check</span>
          )}
        </Button>
        {/* <button
          className="px-6 py-2.5 rounded-full bg-transparent border-2 border-blue-600 cursor-pointer hover:bg-blue-500 active:scale-95 transition-all"
            onClick={handleAddToWatchlist}
        >
          Add to Watchlist
        </button>
        <button
          className="px-6 py-2.5 rounded-full bg-transparent border-2 border-blue-600 cursor-pointer hover:bg-blue-500 active:scale-95 transition-all"
            onClick={handleAddToWatched}
        >
          Add to Watched
        </button> */}
      </div>
    </motion.div>
  );
}
