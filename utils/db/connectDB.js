import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

function handleFirebaseError(error, operation) {
  console.error(error);
  throw new Error(`${operation} failed: ${error.message}`);
}

// Get all movies
export async function getAllMovies(userID) {
  if (!userID) {
    throw new Error("User ID is required");
  }
  try {
    const querySnapshot = await getDocs(collection(db, userID));
    const movies = [];
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() });
    });
    return movies;
  } catch (error) {
    handleFirebaseError(error, "getting movies");
  }
}

// Add a new movie
export async function addMovie(movieData, userID) {
  if (!userID) {
    throw new Error("User ID is required");
  }
  try {
    const docRef = await addDoc(collection(db, userID), movieData);
    return {
      success: true,
      message: "Movie added successfully",
    };
  } catch (error) {
    handleFirebaseError(error, "adding movie");
  }
}

// Update movie by ID
export async function updateMovie(movieId, updateData, userID) {
  if (!userID) {
    throw new Error("User ID is required");
  }
  try {
    const movieRef = doc(db, userID, movieId);
    await updateDoc(movieRef, updateData);

    // Get the updated document
    return { success: true, message: "Movie updated successfully" };
  } catch (error) {
    handleFirebaseError(error, "updating movie");
  }
}

// Delete movie by ID
export async function deleteMovie(movieId, userID) {
  if (!userID) {
    throw new Error("User ID is required");
  }
  try {
    await deleteDoc(doc(db, userID, movieId));
    return {
      success: true,
      message: "Movie deleted successfully",
    };
  } catch (error) {
    handleFirebaseError(error, "deleting movie");
  }
}
