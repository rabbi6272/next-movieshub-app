import { create } from "zustand";

export const useMovieStore = create((set) => ({
  movies: [],
  setMovies: (movies) => set({ movies }),
}));
