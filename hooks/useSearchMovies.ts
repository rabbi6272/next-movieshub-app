"use client";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMulti, normalizeMovieForCard } from "@/api/tmdb";
import { useMovieStore } from "@/store/store";
import { useDebouncedValue } from "@/hooks/useDebounce";
import type { Movie } from "@/types/movie";

const DEBOUNCE_MS = 300;

type SearchResponse = {
  results: Movie[];
  totalPages: number;
  totalResults: number;
};

const EMPTY_SEARCH: SearchResponse = { results: [], totalPages: 0, totalResults: 0 };

export function useSearchMovies() {
  const searchQuery = useMovieStore((state) => state.searchQuery);
  const setSearchQuery = useMovieStore((state) => state.setSearchQuery);
  const searchPage = useMovieStore((state) => state.searchPage);
  const setSearchPage = useMovieStore((state) => state.setSearchPage);

  const debouncedQuery = useDebouncedValue(searchQuery.trim(), DEBOUNCE_MS);

  const {
    data = EMPTY_SEARCH,
    isLoading: searchLoading,
    isFetching: searchFetching,
    error: searchError,
    refetch,
  } = useQuery<SearchResponse>({
    queryKey: ["search", debouncedQuery, searchPage],
    queryFn: async ({ signal }) => {
      if (!debouncedQuery) return EMPTY_SEARCH;
      const data = await searchMulti(debouncedQuery, searchPage, signal);
      return {
        results: data.results
          .filter((item) => item.media_type === "movie" || item.media_type === "tv")
          .map(normalizeMovieForCard),
        totalPages: data.total_pages || 0,
        totalResults: data.total_results || 0,
      };
    },
    enabled: !!debouncedQuery,
    placeholderData: (prev) => prev ?? EMPTY_SEARCH,
  });

  const searchForMovies = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setSearchPage(1);
    },
    [setSearchQuery, setSearchPage],
  );

  return {
    searchQuery,
    setSearchQuery: searchForMovies,
    searchedMovies: data.results || [],
    totalPages: data.totalPages || 0,
    totalResults: data.totalResults || 0,
    searchLoading,
    searchFetching,
    searchError: searchError?.message || null,
    searchPage,
    setSearchPage,
    refetch,
  };
}