// "use client";
import { useEffect, useState } from "react";
import { useMovieStore } from "../../store/store";

export function useSearchMovies() {
  const [query, setQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const movies = useMovieStore((state) => state.movies);
  const setMovies = useMovieStore((state) => state.setMovies);

  useEffect(() => {
    const controler = new AbortController();
    const signal = controler.signal;

    async function searchMovies() {
      if (query === "") {
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setMovies([]);
        const response = await fetch(
          `https://www.omdbapi.com/?s=${query}&apikey=5cc173f0`,
          { signal }
        );
        const data = await response.json();
        if (data.Response === "True") {
          setMovies([...data.Search]);
          setError(null);
        } else {
          setError("❌ Movie not found");
        }
      } catch (error) {
        console.error(`Error occurred: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    searchMovies();
    return () => {
      controler.abort("Aborting in cleanup");
    };
  }, [query]);

  return { query, setQuery, movies, isLoading, error };
}
