import { create } from "zustand";

export const useMovieStore = create((set) => ({
  movies: [],
  setMovies: (movies) => set({ movies }),

  // Search state
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  searchedMovies: [],
  setSearchedMovies: (searchedMovies) => set({ searchedMovies }),
  searchLoading: false,
  setSearchLoading: (searchLoading) => set({ searchLoading }),
  searchError: null,
  setSearchError: (searchError) => set({ searchError }),
}));

export const useLocalStorage = create((set) => ({
  userID: JSON.parse(localStorage.getItem("userID") || null),
  setUserID: (userID) => {
    set({ userID });
    localStorage.setItem("userID", JSON.stringify(userID));
  },
}));
