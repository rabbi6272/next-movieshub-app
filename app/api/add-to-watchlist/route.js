import { NextResponse } from "next/server";

import { connectDB } from "@/utils/db/connectDB";
import MovieItem from "@/utils/model/Movie.model";

export async function POST(request) {
  const { movie } = await request.json();

  try {
    connectDB();
    const savedMovie = await MovieItem.findOne({ Title: movie.Title });
    if (savedMovie) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: `Movie already exists in ${
          savedMovie.watched ? "watched list" : "watchlist"
        }`,
      });
    } else {
      const data = new MovieItem({
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
      await data.save();
      return NextResponse.json({
        status: 201,
        success: true,
        message: "Movie added to watchlist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
}
