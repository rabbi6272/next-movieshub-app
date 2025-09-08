import { NextResponse } from "next/server";

import { findMovieByTitle, addMovie } from "@/utils/db/connectDB";
import { createMovieObject } from "@/utils/model/Movie.model";

export async function POST(request) {
  const { movie } = await request.json();

  try {
    const existingMovie = await findMovieByTitle(movie.Title);

    if (existingMovie) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: `Movie already exists in ${
          existingMovie.watched ? "watched list" : "watchlist"
        }`,
      });
    } else {
      const movieData = createMovieObject({
        Title: movie.Title,
        Year: movie.Year,
        Type: movie.Type,
        Genre: movie.Genre,
        Runtime: movie.Runtime,
        Poster: movie.Poster,
        imdbRating: movie.imdbRating,
        imdbVotes: movie.imdbVotes,
        watched: false,
        wantToWatch: true,
      });

      await addMovie(movieData);

      return NextResponse.json({
        status: 201,
        success: true,
        message: "Movie added to watchlist",
      });
    }
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
