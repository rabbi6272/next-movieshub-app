"use client";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { Loader } from "@/components/loader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addMovie } from "@/utils/db/connectDB";
import { useLocalStorage } from "@/store/store";
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

  const userID = useLocalStorage((state) => state.userID);

  const router = useRouter();

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
    if (!userID) {
      toast.error("Please login to add to watchlist");
      router.push("/login");
    }
    try {
      setIsLoading(true);
      const movieData = { ...movie, watched: false };
      const { success, message } = await addMovie(movieData, userID);
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
    if (!userID) {
      toast.error("Please login to add to watchlist");
      router.push("/login");
    }
    try {
      setIsLoading2(true);
      const movieData = { ...movie, watched: true };
      const { success, message } = await addMovie(movieData, userID);
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
    <>
      <Head>
        <title>
          {movie.Title
            ? `${movie.Title} (${movie.Year}) | MoviesHub`
            : "Movie Details | MoviesHub"}
        </title>
        <meta
          name="description"
          content={
            movie.Plot
              ? movie.Plot
              : "Movie details, ratings, and more on MoviesHub."
          }
        />
        <meta
          property="og:title"
          content={
            movie.Title
              ? `${movie.Title} (${movie.Year}) | MoviesHub`
              : "Movie Details | MoviesHub"
          }
        />
        <meta
          property="og:description"
          content={
            movie.Plot
              ? movie.Plot
              : "Movie details, ratings, and more on MoviesHub."
          }
        />
        <meta property="og:type" content="article" />
        {movie.Poster && movie.Poster !== "N/A" && (
          <meta property="og:image" content={movie.Poster} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        {/* Structured Data for Movie */}
        {movie.Title && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Movie",
                name: movie.Title,
                image:
                  movie.Poster && movie.Poster !== "N/A"
                    ? movie.Poster
                    : undefined,
                description: movie.Plot,
                director: movie.Director,
                datePublished: movie.Released,
                genre: movie.Genre,
                aggregateRating:
                  movie.imdbRating && movie.imdbVotes
                    ? {
                        "@type": "AggregateRating",
                        ratingValue: movie.imdbRating,
                        ratingCount: movie.imdbVotes.replace(/,/g, ""),
                      }
                    : undefined,
              }),
            }}
          />
        )}
        <meta
          name="twitter:title"
          content={
            movie.Title
              ? `${movie.Title} (${movie.Year}) | MoviesHub`
              : "Movie Details | MoviesHub"
          }
        />
        <meta
          name="twitter:description"
          content={
            movie.Plot
              ? movie.Plot
              : "Movie details, ratings, and more on MoviesHub."
          }
        />
        {movie.Poster && movie.Poster !== "N/A" && (
          <meta name="twitter:image" content={movie.Poster} />
        )}
      </Head>
      <div className="relative my-3 p-2 md:p-3 w-[95%] md:w-[60%] lg:w-[50%] mx-auto rounded-lg bg-white text-gray-500 flex flex-col items-center justify-between shadow-md">
        {loading && (
          <div className="h-full w-full grid place-items-center">
            <Loader />
          </div>
        )}
        <button
          className="absolute top-[5px] left-[5px] md:top-[10px] md:left-[10px] h-[40px] w-[40px] rounded-full bg-gray-100 active:scale-95 transition duration-300 grid place-items-center cursor-pointer"
          onClick={() => {
            setSelectedMovieId("");
            setIsShowingMovies(!isShowingMovies);
          }}
        >
          <span className="material-symbols-outlined text-gray-700">
            arrow_back
          </span>
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex-1 text-gray-500 py-2 lg:py-4 mx-auto flex flex-col gap-2 items-center justify-center text-base"
            >
              <h1 className="text-2xl lg:text-3xl text-gray-600 font-nunito font-bold">
                {movie.Title}
              </h1>
              <div className="w-full flex gap-6">
                <div className="flex-1 text-right">
                  <span>⭐{movie.imdbRating}</span>
                  <br />
                  <span>Year: {movie.Year}</span>
                  <br />
                  <span>Runtime: {movie.Runtime}</span>
                  <br />
                  <span>Director: {movie.Director}</span>
                  <br />
                </div>
                <div className="flex-1 text-left">
                  <span>📈{movie.imdbVotes}</span>
                  <br />
                  <span>Released: {movie.Released}</span>
                  <br />
                  <span>Genre: {movie.Genre}</span>
                  <br />
                  <span>Language: {movie.Language}</span>
                  <br />
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-justify lg:px-4 xl:px-6"
              >
                {movie.Plot}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex gap-8 md:gap-12"
            >
              <button
                className="px-6 py-2.5 border border-gray-300 rounded-full hover:bg-gray-200 transition-colors duration-500 cursor-pointer"
                onClick={handleAddToWatchlist}
              >
                {isLoading ? "Adding..." : "Want to Watch ?"}
              </button>
              <button
                className="px-6 py-2.5 border border-gray-300 rounded-full hover:bg-gray-200 transition-colors duration-500 cursor-pointer"
                onClick={handleAddToWatched}
              >
                {isLoading2 ? "Adding..." : "Watched ?"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}
