"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SmallMovieCard } from "@/components/smallMovieCard";
import { Loader } from "@/components/loader";
import { SeparateMoviePage } from "../components/SeparateMoviePage";

import { useLocalStorage, useMovieStore } from "@/store/store";
import { getAllMovies } from "@/utils/db/connectDB";
import { useSearchMovies } from "@/utils/hooks/useSearchMovies";

export default function HomePage() {
  const [category, setCategory] = useState("all");
  const [isLoading, setLoading] = useState(false);

  const [isShowingMovies, setIsShowingMovies] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState("");

  const userID = useLocalStorage((state) => state.userID);
  const setUserID = useLocalStorage((state) => state.setUserID);

  const savedMovies = useMovieStore((state) => state.savedMovies);
  const setSavedMovies = useMovieStore((state) => state.setSavedMovies);

  const { searchedMovies, searchLoading, searchError } = useSearchMovies();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await getAllMovies(userID);
      console.log(data);
      setSavedMovies(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUserID(JSON.parse(localStorage.getItem("userID")));
    if (!userID) {
      return;
    }
    fetchMovies();
  }, [userID]);

  // Refetch when returning from movie details page
  useEffect(() => {
    if (!isShowingMovies && userID) {
      fetchMovies();
    }
  }, [isShowingMovies]);

  let filteredMovies;

  if (searchedMovies?.length > 0) {
    filteredMovies = searchedMovies;
  } else if (category === "wantToWatch") {
    filteredMovies = savedMovies?.filter((movie) => movie.watched === false);
  } else if (category === "watched") {
    filteredMovies = savedMovies?.filter((movie) => movie.watched === true);
  } else if (category === "all") {
    filteredMovies = savedMovies;
  }

  if (searchLoading || isLoading) {
    return (
      <div className="w-full h-[calc(100vh-70px)] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (searchError) {
    return (
      <div className="w-full h-[calc(100vh-70px)] flex items-center justify-center">
        <h1 className="text-xl font-semibold text-red-400">
          Error: {searchError}
        </h1>
      </div>
    );
  }

  if (isShowingMovies) {
    return (
      <SeparateMoviePage
        isShowingMovies={isShowingMovies}
        setIsShowingMovies={setIsShowingMovies}
        selectedMovieId={selectedMovieId}
        setSelectedMovieId={setSelectedMovieId}
      />
    );
  }

  if (filteredMovies?.length > 0 && !isShowingMovies) {
    return (
      <>
        <div className="w-full h-auto py-2 pl-2 md:pl-6 flex items-center">
          {" "}
          <span className="material-symbols-outlined text-gray-400 text-lg">
            filter_alt
          </span>
          <Select
            onValueChange={(value) => setCategory(value)}
            defaultValue={category}
          >
            <SelectTrigger className="w-[200px] border-gray-400 text-gray-600">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Movies</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="watched">Watched</SelectItem>
                <SelectItem value="wantToWatch">Want to watch</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 px-4 my-2">
          {filteredMovies?.map((movie, index) => (
            <SmallMovieCard
              key={movie.id}
              movie={movie}
              index={index}
              setSelectedMovieId={setSelectedMovieId}
              isShowingMovies={isShowingMovies}
              setIsShowingMovies={setIsShowingMovies}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-70px)] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold text-gray-600">No movies saved</h1>
      <p className="text-sm text-gray-400">Try searching for a movie.</p>
    </div>
  );
}
