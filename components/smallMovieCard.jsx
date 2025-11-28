"use client";
import Image from "next/image";
import { useState } from "react";

import { motion } from "framer-motion";

import { toast } from "react-toastify";

import { deleteMovie, updateMovie } from "@/utils/db/connectDB";
import { useLocalStorage } from "@/utils/localStorage";

export function SmallMovieCard({
  movie,
  index,
  setSelectedMovieId,
  isShowingMovies,
  setIsShowingMovies,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { userID } = useLocalStorage();

  // async function handleUpdateMovieStatus(movieData, newStatus) {
  //   try {
  //     setIsUpdating(true);

  //     const newMovie = {
  //       ...movieData,
  //       watched: newStatus === "watched" ? true : false,
  //     };
  //     toast.promise(
  //       (async () => {
  //         const { success, message } = await updateMovie(
  //           newMovie.id,
  //           newMovie,
  //           userID
  //         );
  //         if (success) {
  //           // Update local state
  //           const updatedMovies = movies.map((m) =>
  //             m.id === movie.id
  //               ? {
  //                   ...m,
  //                   watched: newStatus === "watched",
  //                   wantToWatch: newStatus === "watchlist",
  //                 }
  //               : m
  //           );
  //           setMovies(updatedMovies);
  //         } else {
  //           toast.error(message);
  //         }
  //         setIsLoading(false);
  //         return message;
  //       })(),
  //       {
  //         pending: "Updating movie...",
  //         success: "Movie updated successfully!",
  //         error: {
  //           render({ data }) {
  //             return data.message || "Failed to update movie!";
  //           },
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     toast.error("Failed to update movie status");
  //     console.error("Update error:", error);
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // }

  // async function handleDeleteMovie(id) {
  //   try {
  //     setIsLoading(true);

  //     toast.promise(
  //       (async () => {
  //         const { success, message } = await deleteMovie(id, userID);
  //         if (success) {
  //           setMovies(movies.filter((movie) => movie.id !== id));
  //         } else {
  //           throw new Error(message);
  //         }
  //         setIsLoading(false);
  //         return message;
  //       })(),
  //       {
  //         pending: "Deleting movie...",
  //         success: "Movie deleted successfully!",
  //         error: {
  //           render({ data }) {
  //             return data.message || "Failed to delete movie!";
  //           },
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     setIsLoading(false);
  //     toast.error(error.message);
  //   }
  // }

  return (
    <motion.div
      className="h-auto w-full mx-auto rounded-lg border-2 border-gray-200 flex flex-col p-2 cursor-pointer hover:bg-gray-200 transition-color duration-500"
      key={movie.imdbID}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={() => {
        setSelectedMovieId(movie.imdbID);
        setIsShowingMovies(!isShowingMovies);
      }}
    >
      {movie.Poster !== "N/A" ? (
        <Image
          width={130}
          height={100}
          style={{ height: "auto" }}
          src={movie.Poster}
          alt={movie.Title}
          className="rounded-md object-cover mx-auto"
        />
      ) : (
        <p className="text-red-400 py-5">Image not available</p>
      )}

      <div className="p-2 w-full flex flex-col gap-0.5 items-center">
        <h1 className="text-gray-600 text-base text-wrap font-medium font-nunito">
          {movie.Title}
        </h1>
        <p className="text-sm font-light text-gray-500">{movie.Year}</p>
      </div>
    </motion.div>
  );
}

// return (
//   <motion.div
//     className="relative h-[120px] w-full rounded-lg border-2 border-gray-200 flex flwx-col items-center justify-between p-1.5"
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ duration: 0.5, delay: 0.1 * index }}
//   >
//     <button
//       className="absolute top-[3px] right-[3px] text-[20px] text-gray-400 hover:text-gray-300 transition-all font-light cursor-pointer"
//       onClick={() => {
//         handleDeleteMovie(movie.id);
//       }}
//       disabled={isLoading}
//     >
//       <span className="material-symbols-rounded">
//         {isLoading ? "hourglass_empty" : "close"}
//       </span>
//     </button>

//     {movie.Poster !== "N/A" && (
//       <Image
//         width={75}
//         height={90}
//         src={movie.Poster}
//         alt={movie.Title}
//         className="rounded-md object-cover"
//         loading="lazy" // ✅ Add lazy loading
//         quality={65} // ✅ Reduce quality slightly (default 75)
//         placeholder="blur" // ✅ Add blur placeholder
//         blurDataURL="data:image/png;base64,iVBORw0KG..." // ✅ Tiny base64 image
//       />
//     )}

//     <div className="text-gray-300 w-full flex flex-col gap-0.5 items-center">
//       <h1 className="text-white text-base md:text-lg text-wrap font-semibold font-nunito">
//         {movie.Title}
//       </h1>
//       <p className="text-sm">🗓️{movie.Year}</p>
//       <p className="text-sm">⭐{movie.imdbRating}</p>
//       <p className="text-sm">📈{movie.imdbVotes}</p>
//     </div>

//     <div className="flex flex-col gap-2 pr-6">
//       <button
//         className={`${
//           movie.watched === false
//             ? "bg-blue-500 border-2 border-blue-600"
//             : "border border-gray-300"
//         } rounded-full font-medium px-3 py-1 grid place-items-center cursor-pointer disabled:opacity-50`}
//         onClick={() => handleUpdateMovieStatus(movie, "watchlist")}
//         disabled={isUpdating}
//       >
//         {isUpdating ? (
//           <span className="material-symbols-rounded animate-spin">
//             hourglass_empty
//           </span>
//         ) : movie.watched === false ? (
//           <span className="material-symbols-rounded">bookmark_added</span>
//         ) : (
//           <span className="material-symbols-rounded">bookmark_add</span>
//         )}
//       </button>
//       <button
//         className={`${
//           movie.watched === true
//             ? "bg-blue-500 border-2 border-blue-600"
//             : "border border-gray-300"
//         } rounded-full font-medium px-3 py-1 grid place-items-center cursor-pointer disabled:opacity-50`}
//         onClick={() => handleUpdateMovieStatus(movie, "watched")}
//         disabled={isUpdating}
//       >
//         {isUpdating ? (
//           <span className="material-symbols-rounded animate-spin">
//             hourglass_empty
//           </span>
//         ) : movie.watched === true ? (
//           <span className="material-symbols-rounded">done_all</span>
//         ) : (
//           <span className="material-symbols-rounded">check</span>
//         )}
//       </button>
//       {/* <button
//         className="px-6 py-2.5 rounded-full bg-transparent border-2 border-blue-600 cursor-pointer hover:bg-blue-500 active:scale-95 transition-all"
//           onClick={handleAddToWatchlist}
//       >
//         Add to Watchlist
//       </button>
//       <button
//         className="px-6 py-2.5 rounded-full bg-transparent border-2 border-blue-600 cursor-pointer hover:bg-blue-500 active:scale-95 transition-all"
//           onClick={handleAddToWatched}
//       >
//         Add to Watched
//       </button> */}
//     </div>
//   </motion.div>
// );
