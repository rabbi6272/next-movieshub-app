"use client";
import Image from "next/image";

import { motion } from "framer-motion";

import { Loader } from "@/components/loader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function SeparateMoviePage({
  selectedMovieId,
  setSelectedMovieId,
  isShowingMovies,
  setIsShowingMovies,
}) {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?i=${selectedMovieId}&apikey=5cc173f0`, {
      cache: "force-cache",
    })
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
      });
  }, [selectedMovieId]);

  async function handleAddToWatchlist() {
    try {
      setIsLoading(true);
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BASEE_URL}/api/add-to-watchlist`,
        {
          method: "POST",
          body: JSON.stringify({ movie }),
        }
      );
      const { status, success, message } = await data.json();
      if (success) {
        toast.success(message, {
          position: "bottom-center",
          autoClose: 1500,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
        });
        setSelectedMovieId("");
        setIsShowingMovies(!isShowingMovies);
      } else {
        toast.error(message, {
          position: "bottom-center",
          autoClose: 1500,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 1500,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function handleAddToWatched() {
    try {
      setIsLoading2(true);
      const data = await fetch(`/api/add-to-watched`, {
        method: "POST",
        body: JSON.stringify({ movie }),
      });
      const { status, success, message } = await data.json();
      if (success) {
        toast.success(message, {
          position: "bottom-center",
          autoClose: 1500,
          closeOnClick: false,
          draggable: true,
        });
        setSelectedMovieId("");
        setIsShowingMovies(!isShowingMovies);
      } else {
        toast.error(message, {
          position: "bottom-center",
          autoClose: 1500,
          closeOnClick: false,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 1500,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading2(false);
    }
  }

  return (
    <div className="relative my-3 p-2 md:p-3 w-[95%] md:w-[60%] lg:w-[45%] mx-auto rounded-lg bg-[#0d5c7f] flex flex-col items-center justify-between">
      {loading && (
        <div className="h-full w-full grid place-items-center">
          <Loader />
        </div>
      )}
      <button
        className="absolute top-[5px] left-[5px] md:top-[10px] md:left-[10px] h-[40px] w-[40px] rounded-full bg-[#23B1F3] active:scale-95 transition duration-300 grid place-items-center"
        onClick={() => {
          setSelectedMovieId("");
          setIsShowingMovies(!isShowingMovies);
        }}
      >
        <span className="material-symbols-rounded">arrow_back</span>
      </button>
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-between"
        >
          {movie.Poster !== "N/A" && (
            <Image
              height={200}
              width={250}
              src={movie.Poster}
              alt={movie.Title}
              className="rounded-md object-cover aspect-auto"
            />
          )}

          <div className="flex-1 text-gray-300 p-2 lg:p-4 mx-auto flex flex-col gap-2 items-center justify-center text-base">
            <h1 className="text-xl text-white font-nunito font-bold">
              {movie.Title}
            </h1>
            <p className="flex gap-8">
              <span>⭐{movie.imdbRating}</span>
              <span>📈{movie.imdbVotes}</span>
            </p>
            <p className="flex gap-8">
              <span>Year: {movie.Year}</span>
              <span>Released: {movie.Released}</span>
            </p>
            <p className="flex gap-8">
              <span>Runtime: {movie.Runtime}</span>
              <span>Genre: {movie.Genre}</span>
            </p>
            <p className="flex gap-8">
              <span>Director: {movie.Director}</span>
              <span>Language: {movie.Language}</span>
            </p>
            <p>{movie.Plot}</p>
          </div>

          <div className="flex gap-4 ">
            <button
              // className="px-3.5 md:px-6 py-2.5 rounded-full bg-transparent border-2 border-blue-400 cursor-pointer hover:bg-blue-500 active:scale-95 transition-all duration-500"
              className="ui-button rounded-full"
              onClick={handleAddToWatchlist}
            >
              {isLoading ? "Adding..." : "Want to Watch"}
            </button>
            <button
              className="ui-button rounded-full"
              // className="px-3.5 md:px-6 py-2.5 rounded-full bg-transparent border-2 border-blue-400 cursor-pointer hover:bg-blue-500 active:scale-95 transition-all duration-500"
              onClick={handleAddToWatched}
            >
              {isLoading2 ? "Adding..." : "Already Watched"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
