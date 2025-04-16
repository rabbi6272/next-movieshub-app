import { NextResponse } from "next/server";

import { connectDB } from "@/utils/db/connectDB";
import MovieItem from "@/utils/model/Movie.model";

export async function POST(request) {
  const { movie } = await request.json();

  try {
    connectDB();
    const savedMovie = await MovieItem.findOne({ Title: movie.Title });
    if (savedMovie) {
      if (savedMovie.watched) {
        return NextResponse.json({
          status: 400,
          success: false,
          message: "Movie already exists in watched list",
        });
      } else {
        savedMovie.wantToWatch = false;
        savedMovie.watched = true;
        await savedMovie.save();
        return NextResponse.json({
          status: 200,
          success: true,
          message: "Movie added to watched list",
        });
      }
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
        watched: true,
        wantToWatch: false,
      });
      await data.save();
      return NextResponse.json({
        status: 201,
        success: true,
        message: "Movie added to watched list",
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
