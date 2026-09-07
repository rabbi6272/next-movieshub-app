import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";

import type { Playlist, PlaylistItem } from "@/types/playlist";

function handleFirebaseError(error: unknown, operation: string): never {
  console.error(error);
  const message = error instanceof Error ? error.message : "Unknown error";
  throw new Error(`${operation} failed: ${message}`);
}

const now = () => new Date().toISOString();

// Get all playlists owned by a user (newest first)
export async function getPlaylists(userID: string) {
  if (!userID) {
    throw new Error("User ID is required");
  }
  try {
    const q = query(
      collection(db, "playlists"),
      where("ownerId", "==", userID),
    );
    const querySnapshot = await getDocs(q);
    const playlists: Playlist[] = [];
    querySnapshot.forEach((doc) => {
      playlists.push({ ...(doc.data() as Omit<Playlist, "id">), id: doc.id });
    });
    playlists.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return playlists;
  } catch (error) {
    handleFirebaseError(error, "getting playlists");
  }
}

// Get a single playlist by ID
export async function getPlaylist(playlistId: string) {
  if (!playlistId) {
    throw new Error("Playlist ID is required");
  }
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    const snapshot = await getDoc(playlistRef);
    if (!snapshot.exists()) return null;
    return { ...(snapshot.data() as Omit<Playlist, "id">), id: snapshot.id };
  } catch (error) {
    handleFirebaseError(error, "getting playlist");
  }
}

// Create a new playlist
export async function createPlaylist(
  ownerId: string,
  { name, description }: { name: string; description?: string },
) {
  if (!ownerId) {
    throw new Error("User ID is required");
  }
  if (!name || !name.trim()) {
    throw new Error("Playlist name is required");
  }
  try {
    const timestamp = now();
    await addDoc(collection(db, "playlists"), {
      ownerId,
      name: name.trim(),
      description: description?.trim() || "",
      movieCount: 0,
      shareToken: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    return { success: true, message: "Playlist created" };
  } catch (error) {
    handleFirebaseError(error, "creating playlist");
  }
}

// Update playlist metadata (name / description)
export async function updatePlaylist(
  playlistId: string,
  updates: Partial<Pick<Playlist, "name" | "description" | "movieCount" | "shareToken">>,
) {
  if (!playlistId) {
    throw new Error("Playlist ID is required");
  }
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    await updateDoc(playlistRef, { ...updates, updatedAt: now() });
    return { success: true, message: "Playlist updated" };
  } catch (error) {
    handleFirebaseError(error, "updating playlist");
  }
}

// Delete a playlist and all of its items
export async function deletePlaylist(playlistId: string) {
  if (!playlistId) {
    throw new Error("Playlist ID is required");
  }
  try {
    const batch = writeBatch(db);
    const itemsSnapshot = await getDocs(collection(db, "playlists", playlistId, "items"));
    itemsSnapshot.forEach((item) => {
      batch.delete(item.ref);
    });
    batch.delete(doc(db, "playlists", playlistId));
    await batch.commit();
    return { success: true, message: "Playlist deleted" };
  } catch (error) {
    handleFirebaseError(error, "deleting playlist");
  }
}

// Get all items in a playlist
export async function getPlaylistItems(playlistId: string) {
  if (!playlistId) {
    throw new Error("Playlist ID is required");
  }
  try {
    const itemsSnapshot = await getDocs(
      query(
        collection(db, "playlists", playlistId, "items"),
        orderBy("addedAt", "desc"),
      ),
    );
    const items: PlaylistItem[] = [];
    itemsSnapshot.forEach((item) => {
      items.push({ ...(item.data() as Omit<PlaylistItem, "id">), id: item.id });
    });
    return items;
  } catch (error) {
    handleFirebaseError(error, "getting playlist items");
  }
}

// Add a movie/TV show to a playlist (no-op if already present)
export async function addItemToPlaylist(
  playlistId: string,
  item: Omit<PlaylistItem, "id" | "addedAt">,
) {
  if (!playlistId) {
    throw new Error("Playlist ID is required");
  }
  try {
    const itemsRef = collection(db, "playlists", playlistId, "items");
    const existing = await getDocs(
      query(itemsRef, where("tmdbId", "==", item.tmdbId)),
    );
    const alreadyExists = existing.docs.some(
      (doc) => doc.data().media_type === item.media_type,
    );
    if (alreadyExists) {
      return { success: false, message: "Already in this playlist" };
    }
    await addDoc(itemsRef, { ...item, addedAt: now() });
    await refreshPlaylistCount(playlistId);
    return { success: true, message: "Added to playlist" };
  } catch (error) {
    handleFirebaseError(error, "adding item to playlist");
  }
}

// Remove an item from a playlist
export async function removeItemFromPlaylist(playlistId: string, itemId: string) {
  if (!playlistId || !itemId) {
    throw new Error("Playlist ID and item ID are required");
  }
  try {
    await deleteDoc(doc(db, "playlists", playlistId, "items", itemId));
    await refreshPlaylistCount(playlistId);
    return { success: true, message: "Removed from playlist" };
  } catch (error) {
    handleFirebaseError(error, "removing item from playlist");
  }
}

// Re-sync the movieCount field on a playlist from its items subcollection
async function refreshPlaylistCount(playlistId: string) {
  const itemsSnapshot = await getDocs(collection(db, "playlists", playlistId, "items"));
  await updateDoc(doc(db, "playlists", playlistId), {
    movieCount: itemsSnapshot.size,
    updatedAt: now(),
  });
}