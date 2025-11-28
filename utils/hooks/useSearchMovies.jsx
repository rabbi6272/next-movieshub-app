"use client";
import { useEffect } from "react";
import { useMovieStore } from "../../store/store";

export function useSearchMovies() {
  const searchQuery = useMovieStore((state) => state.searchQuery);
  const setSearchQuery = useMovieStore((state) => state.setSearchQuery);
  const searchedMovies = useMovieStore((state) => state.searchedMovies);
  const setSearchedMovies = useMovieStore((state) => state.setSearchedMovies);
  const searchLoading = useMovieStore((state) => state.searchLoading);
  const setSearchLoading = useMovieStore((state) => state.setSearchLoading);
  const searchError = useMovieStore((state) => state.searchError);
  const setSearchError = useMovieStore((state) => state.setSearchError);

  useEffect(() => {
    const controler = new AbortController();
    const signal = controler.signal;

    async function searchMovies() {
      if (searchQuery === "") {
        setSearchError(null);
        setSearchedMovies([]);
        setSearchLoading(false);
        return;
      }

      try {
        setSearchLoading(true);
        setSearchError(null);
        setSearchedMovies([]);
        const response = await fetch(
          `https://www.omdbapi.com/?s=${searchQuery}&apikey=5cc173f0`,
          { signal }
        );
        const data = await response.json();
        if (data.Response === "True") {
          setSearchedMovies([...data.Search]);
          setSearchError(null);
        } else {
          setSearchError("❌ Movie not found");
          setSearchedMovies([]);
        }
      } catch (error) {
        // Don't set error if request was aborted
        if (error.name !== "AbortError" && !signal.aborted) {
          console.error(`Error occurred:`, error);
          setSearchError(`Error: ${error.message}`);
        }
      } finally {
        if (!signal.aborted) {
          setSearchLoading(false);
        }
      }
    }

    searchMovies();
    return () => {
      controler.abort();
    };
  }, [searchQuery, setSearchedMovies, setSearchLoading, setSearchError]);

  return {
    query: searchQuery,
    setQuery: setSearchQuery,
    searchedMovies,
    searchLoading,
    searchError,
  };
}
