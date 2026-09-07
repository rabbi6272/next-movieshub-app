"use client";
import { useEffect, useMemo, useRef, useState } from "react";

import { SmallMovieCard } from "@/components/SmallMovieCard";
import { Loader } from "@/components/ui/loader";
import Pagination from "@/components/Pagination";
import { useSearchMovies } from "@/hooks/useSearchMovies";
import { Button } from "@/components/ui/Button";

const MEDIA_FILTERS = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Series" },
];

const SUGGESTED_SEARCHES = [
  "Inception",
  "Interstellar",
  "Dune",
  "Oppenheimer",
  "The Dark Knight",
];

export default function SearchPage() {
  const {
    searchQuery,
    setSearchQuery,
    searchedMovies,
    totalPages,
    totalResults,
    searchLoading,
    searchFetching,
    searchError,
    searchPage,
    setSearchPage,
    refetch,
  } = useSearchMovies();

  const [mediaFilter, setMediaFilter] = useState("all");
  const inputRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  const filteredMovies = useMemo(() => {
    if (mediaFilter === "all") return searchedMovies;
    return searchedMovies.filter(
      (movie) => (movie.media_type || "movie") === mediaFilter,
    );
  }, [searchedMovies, mediaFilter]);

  function handlePageChange(page) {
    setSearchPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = searchedMovies.length > 0;

  return (
    <div className="w-full pb-8">
      {/* Search bar */}
      <div className="w-full px-4 md:px-10 lg:px-15 xl:px-20 py-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative w-full max-w-2xl mx-auto"
          role="search"
        >
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies or TV shows..."
            aria-label="Search for movies or TV shows"
            autoComplete="off"
            className="w-full h-12 rounded-full border border-gray-400 focus:outline-none focus:border-blue-400 focus:ring focus:ring-blue-400/20 px-11 xl:px-14 text-gray-700 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </form>

        {/* Media type toggle */}
        {hasQuery && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {MEDIA_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setMediaFilter(filter.value)}
                className={`text-xs md:text-sm font-semibold rounded-full px-4 py-1.5 border border-gray-300 shadow-sm transition-all duration-300 cursor-pointer ${mediaFilter === filter.value
                  ? "bg-black text-white"
                  : "bg-transparent text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Searching indicator (keeps previous results visible) */}
      {searchFetching && !searchLoading && (
        <div className="flex justify-center py-3" aria-live="polite">
          <span className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 shadow-sm rounded-full px-5 py-2">
            <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            Searching…
          </span>
        </div>
      )}

      {/* First-ever load */}
      {searchLoading && (
        <div className="w-full h-[calc(100vh-70px-76px)] flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Error */}
      {!searchLoading && searchError && (
        <div className="w-full flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <span className="material-symbols-outlined text-4xl text-red-300">error</span>
            <h1 className="text-lg font-semibold text-red-400">
              Something went wrong while searching
            </h1>
            <Button
              onClick={() => refetch()}
              className="mt-2"
              size="lg"
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      {!searchLoading && !searchError && hasQuery && hasResults && (
        <>
          <div className="flex items-center justify-between px-4 md:px-6 mt-1 mb-2">
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              {totalResults > 0
                ? `Found ${totalResults.toLocaleString()} ${totalResults === 1 ? "title" : "titles"
                }`
                : "Searching…"}
            </p>
            {mediaFilter !== "all" && filteredMovies.length > 0 && (
              <p className="text-xs text-gray-400">
                Showing {filteredMovies.length} of {searchedMovies.length} on this page
              </p>
            )}
          </div>

          <div
            className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 gap-2 px-4 my-2"
            aria-busy={searchFetching}
          >
            {filteredMovies.map((movie, index) => (
              <SmallMovieCard
                key={movie.tmdbId || movie.id || index}
                movie={movie}
                index={index}
              />
            ))}
          </div>

          <Pagination
            currentPage={searchPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* No results for a query */}
      {!searchLoading && !searchError && hasQuery && !hasResults && (
        <div className="w-full flex flex-col items-center justify-center py-14 px-4 text-center">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">search_off</span>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-600">
            No results for &ldquo;{searchQuery.trim()}&rdquo;
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Check the spelling or try a different search.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 max-w-md">
            {SUGGESTED_SEARCHES.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setSearchQuery(suggestion)}
                className="text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-full px-3.5 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Blank query state */}
      {!searchQuery.trim() && (
        <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-center">
          <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">search</span>
          <h1 className="text-2xl font-semibold text-gray-600">Search for movies</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-full">
            Find your favorite movies and TV shows from millions of titles.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 max-w-full">
            <span className="text-xs text-gray-400 font-medium mr-1">Popular:</span>
            {SUGGESTED_SEARCHES.map((suggestion) => (
              <Button
                key={suggestion}
                onClick={() => setSearchQuery(suggestion)}
                size="sm"
                varient="outline"
                className="whitespace-nowrap"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}