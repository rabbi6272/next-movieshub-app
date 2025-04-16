"use client";
import Image from "next/image";
import { Button } from "@material-tailwind/react";

export function SmallMovieCard({ movie }) {
  return (
    <div className="h-[120px] w-full rounded-lg bg-[#0d5c7f] flex items-center justify-between p-1.5">
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

      <div className="flex flex-col gap-2">
        <Button
          variant={movie.wantToWatch ? "filled" : "outlined"}
          size="sm"
          className={`${
            movie.wantToWatch ? "bg-blue-500 border-2 border-blue-600" : ""
          } rounded-full py-1.5 grid place-items-center cursor-pointer`}
        >
          {movie.wantToWatch ? (
            <span className="material-symbols-outlined">bookmark_added</span>
          ) : (
            <span className="material-symbols-outlined">bookmark_add</span>
          )}
        </Button>
        <Button
          variant={movie.watched ? "filled" : "outlined"}
          size="sm"
          className={`${
            movie.watched ? "bg-blue-500 border-2 border-blue-600" : ""
          } rounded-full py-1.5 grid place-items-center cursor-pointer`}
        >
          {movie.watched ? (
            <span className="material-symbols-outlined">done_all</span>
          ) : (
            <span className="material-symbols-outlined">check</span>
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
    </div>
  );
}
