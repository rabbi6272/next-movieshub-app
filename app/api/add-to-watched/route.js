import { NextResponse } from "next/server";

import { findMovieByTitle, addMovie, updateMovie } from "@/utils/db/connectDB";
import { createMovieObject } from "@/utils/model/Movie.model";

export async function POST(request) {
  const { movie } = await request.json();

  try {
    const existingMovie = await findMovieByTitle(movie.Title);

    if (existingMovie) {
      if (existingMovie.watched) {
        return NextResponse.json({
          status: 400,
          success: false,
          message: "Movie already exists in watched list",
        });
      } else {
        // Update existing movie to watched
        await updateMovie(existingMovie.id, {
          wantToWatch: false,
          watched: true,
          updatedAt: new Date(),
        });

        return NextResponse.json({
          status: 200,
          success: true,
          message: "Movie added to watched list",
        });
      }
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
        watched: true,
        wantToWatch: false,
      });

      await addMovie(movieData);

      return NextResponse.json({
        status: 201,
        success: true,
        message: "Movie added to watched list",
      });
    }
  } catch (error) {
    console.error("Error adding movie to watched list:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
