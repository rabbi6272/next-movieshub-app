"use client";
import { useState } from "react";
import Image from "next/image";

import { motion } from "framer-motion";

import { useSearchMovies } from "@/utils/hooks/useSearchMovies";
import { Loader } from "@/components/loader";
import { SeparateMoviePage } from "@/app/movies/SeparateMoviePage";

export default function MoviesPage() {
  const [isShowingMovies, setIsShowingMovies] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const { query, setQuery, movies, isLoading, error } = useSearchMovies();

  const renderMovieList = () => {
    if (isLoading) {
      return (
        <div className="h-full w-full grid place-items-center">
          <Loader />
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-500 my-6">{error}</p>;
    }

    return (
      <div className="flex flex-col gap-1 my-2">
        {movies?.map((movie, index) => (
          <motion.div
            className="h-[100px] w-full rounded-lg bg-[#0d5c7f] hover:bg-[#114d69] flex items-center justify-between p-1.5 cursor-pointer"
            key={movie.imdbID}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => {
              setSelectedMovieId(movie.imdbID);
              setIsShowingMovies(!isShowingMovies);
            }}
          >
            {movie.Poster !== "N/A" && (
              <Image
                width={60}
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
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {isShowingMovies ? (
        <SeparateMoviePage
          selectedMovieId={selectedMovieId}
          setSelectedMovieId={setSelectedMovieId}
          isShowingMovies={isShowingMovies}
          setIsShowingMovies={setIsShowingMovies}
        />
      ) : (
        <div className="w-[95%] md:w-[60%] lg:w-[40%] mx-auto my-3 ">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies..."
            className="w-full h-12 rounded-full border-2 border-[#0d5c7f] focus:outline-none px-4 text-white  placeholder:text-gray-400"
          />
          {renderMovieList()}
        </div>
      )}
    </div>
  );
}
