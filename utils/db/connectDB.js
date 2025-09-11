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

// Collection name
const MOVIES_COLLECTION = "movies";

// Helper function to handle Firebase errors
function handleFirebaseError(error, operation) {
  console.error(`Error ${operation}:`, error);

  if (error.code === "permission-denied") {
    const message = error.message.includes("API has not been used")
      ? "Firestore API is not enabled. Please enable it in your Firebase console."
      : "Firestore security rules are blocking this operation. Please check your security rules.";

    throw new Error(`Firebase Error: ${message}`);
  }

  throw error;
}

// Get all movies
export async function getAllMovies() {
  try {
    const querySnapshot = await getDocs(collection(db, MOVIES_COLLECTION));
    const movies = [];
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() });
    });
    console.log(movies);
    return movies;
  } catch (error) {
    handleFirebaseError(error, "getting movies");
  }
}

// Add a new movie
export async function addMovie(movieData) {
  try {
    const docRef = await addDoc(collection(db, MOVIES_COLLECTION), movieData);
    return {
      success: true,
      message: "Movie added successfully",
    };
  } catch (error) {
    handleFirebaseError(error, "adding movie");
  }
}

// Update movie by ID
export async function updateMovie(movieId, updateData) {
  try {
    const movieRef = doc(db, MOVIES_COLLECTION, movieId);
    await updateDoc(movieRef, updateData);

    // Get the updated document
    const updatedDoc = await getDoc(movieRef);
    return { success: true, message: "Movie updated successfully" };
  } catch (error) {
    handleFirebaseError(error, "updating movie");
  }
}

// Delete movie by ID
export async function deleteMovie(movieId) {
  try {
    await deleteDoc(doc(db, MOVIES_COLLECTION, movieId));
    return {
      success: true,
      message: "Movie deleted successfully",
    };
  } catch (error) {
    handleFirebaseError(error, "deleting movie");
  }
}
