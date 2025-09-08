// Firebase doesn't require schema definitions like MongoDB
// This file defines the structure for documentation purposes

export const movieStructure = {
  Title: "string",
  Year: "string",
  Type: "string",
  Genre: "string", // Fixed typo from "ype" to "type"
  Runtime: "string",
  Poster: "string",
  imdbRating: "string",
  imdbVotes: "string",
  watched: "boolean", // default: false
  wantToWatch: "boolean", // default: false
};

// Helper function to create a movie object with default values
export function createMovieObject({
  Title,
  Year,
  Type,
  Genre,
  Runtime,
  Poster,
  imdbRating,
  imdbVotes,
  watched = false,
  wantToWatch = false,
}) {
  return {
    Title,
    Year,
    Type,
    Genre,
    Runtime,
    Poster,
    imdbRating,
    imdbVotes,
    watched,
    wantToWatch,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
