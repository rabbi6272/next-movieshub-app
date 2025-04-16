import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  Title: { type: String },
  Year: { type: String },
  Type: { type: String },
  Genre: { ype: String },
  Runtime: { type: String },
  Poster: { type: String },
  imdbRating: { type: String },
  imdbVotes: { type: String },
  watched: { type: Boolean, default: false },
  wantToWatch: { type: Boolean, default: false },
});

const MovieItem =
  mongoose.models.MovieItem || mongoose.model("MovieItem", movieSchema);

export default MovieItem;
