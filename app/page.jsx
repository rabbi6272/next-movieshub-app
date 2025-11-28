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

import { SmallMovieCard } from "@/app/smallMovieCard";
import { Loader } from "@/components/loader";
import { SeparateMoviePage } from "./SeparateMoviePage";

import { useLocalStorage } from "@/utils/localStorage";
import { getAllMovies } from "@/utils/db/connectDB";
import { useSearchMovies } from "@/utils/hooks/useSearchMovies";

export default function HomePage() {
  const [savedMovies, setSavedMovies] = useState([]);
  const [category, setCategory] = useState("all");
  const [isLoading, setLoading] = useState(false);

  const [isShowingMovies, setIsShowingMovies] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState("");

  const { userID } = useLocalStorage();
  const { movies, isLoading: moviesLoading, error } = useSearchMovies();

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        const data = await getAllMovies(userID);
        setSavedMovies(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [userID]);

  let filteredMovies;

  if (category === "wantToWatch") {
    filteredMovies = savedMovies?.filter((movie) => movie.watched === false);
  } else if (category === "watched") {
    filteredMovies = savedMovies?.filter((movie) => movie.watched === true);
  } else {
    filteredMovies = savedMovies;
  }

  return (
    <div className="w-full">
      {isShowingMovies ? (
        <SeparateMoviePage
          isShowingMovies={isShowingMovies}
          setIsShowingMovies={setIsShowingMovies}
          selectedMovieId={selectedMovieId}
          setSelectedMovieId={setSelectedMovieId}
        />
      ) : (
        <HomepageContent
          movies={savedMovies}
          setMovies={setSavedMovies}
          filteredMovies={movies.length > 0 ? movies : filteredMovies}
          category={category}
          setCategory={setCategory}
          selectedMovieId={selectedMovieId}
          setSelectedMovieId={setSelectedMovieId}
          isShowingMovies={isShowingMovies}
          setIsShowingMovies={setIsShowingMovies}
        />
      )}
    </div>
  );
}

function HomepageContent({
  movies,
  setMovies,
  filteredMovies,
  setCategory,
  selectedMovieId,
  setSelectedMovieId,
  isShowingMovies,
  setIsShowingMovies,
}) {
  return (
    <div>
      <Select onValueChange={(value) => setCategory(value)} className="m-5 p-4">
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

      <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 px-4 my-2">
        {filteredMovies?.map((movie, index) => (
          <SmallMovieCard
            key={movie.id}
            movie={movie}
            index={index}
            setMovies={setMovies}
            movies={movies}
            selectedMovieId={selectedMovieId}
            setSelectedMovieId={setSelectedMovieId}
            isShowingMovies={isShowingMovies}
            setIsShowingMovies={setIsShowingMovies}
          />
        ))}
      </div>
    </div>
  );
}
