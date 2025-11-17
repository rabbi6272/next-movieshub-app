# Database Integration Documentation

## Overview

This Next.js application uses **Firebase Firestore** as its primary database to store user movie watchlists and watched movies. The database integration follows a user-centric approach where each user gets a unique collection identified by a randomly generated `userID`.

---

## Architecture

### Database Structure

```
Firestore Database
│
└── [userID] (Collection) - Unique per user
    │
    ├── [movieId_1] (Document)
    │   ├── Title: string
    │   ├── Year: string
    │   ├── Poster: string
    │   ├── Plot: string
    │   ├── Director: string
    │   ├── Genre: string
    │   ├── imdbRating: string
    │   ├── watched: boolean
    │   └── ... (other OMDB API fields)
    │
    ├── [movieId_2] (Document)
    └── ...
```

### User Identification System

- Each user is assigned a unique ID stored in browser's localStorage
- UserID is a 7-character random string (e.g., "a3k9x2m")
- Provides isolation between different users' data
- No authentication required (anonymous user tracking)

---

## Core Database Files

### 1. `/utils/db/firebaseConfig.js`

#### Purpose

Initializes and configures the Firebase application connection.

#### Functions & Exports

##### `app` (Firebase App Instance)

```javascript
const app = initializeApp(firebaseConfig);
```

- **Type:** Firebase App Object
- **Description:** The main Firebase application instance
- **Configuration:** Contains API keys, project IDs, and Firebase service endpoints
- **Usage:** Root instance for all Firebase services

##### `db` (Firestore Database Instance)

```javascript
export const db = getFirestore(app);
```

- **Type:** Firestore Database Object
- **Description:** The Cloud Firestore database reference
- **Purpose:** Used across the app to perform all database operations
- **Exports:** Named export that can be imported anywhere in the application

#### Security Note

⚠️ **CRITICAL:** Firebase configuration keys are currently exposed in the client-side code. While Firebase uses security rules for protection, consider:

- Using environment variables for production
- Implementing Firebase Security Rules
- Restricting API keys to specific domains

---

### 2. `/utils/db/connectDB.js`

This file contains all CRUD (Create, Read, Update, Delete) operations for the movie database.

#### Helper Functions

##### `handleFirebaseError(error, operation)`

```javascript
function handleFirebaseError(error, operation)
```

**Parameters:**

- `error` (Object): The Firebase error object
- `operation` (String): Description of the operation that failed (e.g., "getting movies")

**Purpose:**

- Centralized error handling for all Firebase operations
- Provides user-friendly error messages
- Handles specific Firebase error codes

**Error Handling:**

1. **Permission Denied Errors:**

   - Detects if Firestore API is not enabled
   - Checks for security rule violations
   - Provides actionable error messages

2. **Generic Errors:**
   - Logs error to console for debugging
   - Re-throws error for upstream handling

**Returns:** Throws an error with descriptive message

**Example Usage:**

```javascript
try {
  // Firebase operation
} catch (error) {
  handleFirebaseError(error, "adding movie");
}
```

---

#### CRUD Operations

##### `getAllMovies(userID)`

```javascript
export async function getAllMovies(userID)
```

**Purpose:** Fetches all movies from a user's collection

**Parameters:**

- `userID` (String): The unique identifier for the user's collection

**Process:**

1. Queries the Firestore collection matching the `userID`
2. Iterates through all documents in the collection
3. Constructs an array with document data plus document ID
4. Returns the complete array of movies

**Returns:**

- `Promise<Array>`: Array of movie objects
- Each object contains:
  - `id`: Firestore document ID
  - All fields stored in the document (Title, Year, watched, etc.)

**Error Handling:**

- Catches and processes errors via `handleFirebaseError`
- Logs "getting movies" as the operation type

**Usage Example:**

```javascript
const userMovies = await getAllMovies("a3k9x2m");
// Returns: [
//   { id: "doc123", Title: "Inception", Year: "2010", watched: false, ... },
//   { id: "doc456", Title: "The Matrix", Year: "1999", watched: true, ... }
// ]
```

**Performance Consideration:**

- Fetches ALL documents in the collection
- No pagination implemented
- Could be slow with large collections (100+ movies)

---

##### `addMovie(movieData, userID)`

```javascript
export async function addMovie(movieData, userID)
```

**Purpose:** Adds a new movie to the user's collection

**Parameters:**

- `movieData` (Object): The complete movie object to store
  - Typically includes: Title, Year, Poster, Plot, Director, Genre, imdbRating, watched, etc.
- `userID` (String): The unique identifier for the user's collection

**Process:**

1. Creates a reference to the user's collection
2. Adds a new document with auto-generated ID
3. Stores all fields from `movieData`
4. Returns success confirmation

**Returns:**

```javascript
{
  success: true,
  message: "Movie added successfully"
}
```

**Error Handling:**

- Catches Firebase errors via `handleFirebaseError`
- Operation label: "adding movie"

**Usage Example:**

```javascript
const movieData = {
  Title: "Inception",
  Year: "2010",
  Poster: "https://...",
  Plot: "A thief who steals...",
  watched: false,
  // ... other fields from OMDB API
};

const result = await addMovie(movieData, "a3k9x2m");
// Returns: { success: true, message: "Movie added successfully" }
```

**Important Notes:**

- Does NOT check for duplicates
- Auto-generates document IDs (not using imdbID as key)
- Same movie can be added multiple times

---

##### `updateMovie(movieId, updateData, userID)`

```javascript
export async function updateMovie(movieId, updateData, userID)
```

**Purpose:** Updates an existing movie document

**Parameters:**

- `movieId` (String): The Firestore document ID of the movie to update
- `updateData` (Object): Fields to update (can be partial or complete movie object)
- `userID` (String): The unique identifier for the user's collection

**Process:**

1. Creates a reference to the specific document
2. Updates only the fields provided in `updateData`
3. Fetches the updated document (currently unused)
4. Returns success confirmation

**Returns:**

```javascript
{
  success: true,
  message: "Movie updated successfully"
}
```

**Error Handling:**

- Catches Firebase errors via `handleFirebaseError`
- Operation label: "updating movie"

**Usage Example:**

```javascript
// Mark a movie as watched
await updateMovie("doc123", { watched: true }, "a3k9x2m");

// Update multiple fields
await updateMovie(
  "doc123",
  {
    watched: true,
    userRating: 5,
    reviewNotes: "Great movie!",
  },
  "a3k9x2m"
);
```

**Performance Note:**

- The function fetches the updated document but doesn't return it
- Consider removing the `getDoc` call if not needed

---

##### `deleteMovie(movieId, userID)`

```javascript
export async function deleteMovie(movieId, userID)
```

**Purpose:** Permanently removes a movie from the user's collection

**Parameters:**

- `movieId` (String): The Firestore document ID to delete
- `userID` (String): The unique identifier for the user's collection

**Process:**

1. Creates a reference to the specific document
2. Deletes the document from Firestore
3. Returns success confirmation

**Returns:**

```javascript
{
  success: true,
  message: "Movie deleted successfully"
}
```

**Error Handling:**

- Catches Firebase errors via `handleFirebaseError`
- Operation label: "deleting movie"

**Usage Example:**

```javascript
await deleteMovie("doc123", "a3k9x2m");
// Movie is permanently removed from Firestore
```

**Important:**

- Deletion is permanent and immediate
- No confirmation prompt at the database level
- No soft-delete or archive functionality

---

### 3. `/utils/localSrorage.js` (typo: should be localStorage.js)

#### Purpose

Manages user identification through browser localStorage with React hooks.

#### `useLocalStorage()` Hook

```javascript
export function useLocalStorage()
```

**Purpose:** Custom React hook that manages userID in localStorage

**Returns:**

```javascript
{
  userID: string; // The user's unique identifier
}
```

**Process:**

1. **State Management:**

   - Initializes `value` state as empty string
   - Returns the value as `userID`

2. **Effect Hook Logic:**
   - Only runs in browser environment (checks `window`)
   - Attempts to retrieve existing `userID` from localStorage
   - **If userID doesn't exist (null):**
     - Generates a new random 7-character alphanumeric ID
     - Stores it in localStorage
     - Sets state (note: sets to old null value, not new ID - bug!)
   - **If userID exists:**
     - Sets the existing value to state

**ID Generation:**

```javascript
Math.random().toString(36).substring(2, 9);
```

- Generates random number
- Converts to base-36 string (0-9, a-z)
- Extracts 7 characters
- Example outputs: "a3k9x2m", "5f8h2n1", "b9z4k7p"

**Known Issues:**

1. **Bug on First Visit:**

   ```javascript
   if (value === null) {
     localStorage.setItem("userID", ...);
     setValue(value); // ❌ Sets to null instead of new ID
   }
   ```

   - Should be: `setValue(newlyGeneratedID)`
   - Causes userID to be `null` on first render

2. **Re-render Dependency:**
   - Effect has no dependencies, only runs once
   - May not update if localStorage changes externally

**Usage Example:**

```javascript
function MyComponent() {
  const { userID } = useLocalStorage();

  useEffect(() => {
    if (userID) {
      fetchUserMovies(userID);
    }
  }, [userID]);
}
```

**Privacy & Persistence:**

- Data persists across browser sessions
- Cleared when browser data is cleared
- Unique per browser/device
- Not synced across devices

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Opens App                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              useLocalStorage() Hook Executes                 │
│  - Checks localStorage for existing userID                   │
│  - Creates new userID if none exists                         │
│  - Returns userID to component                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Component Uses userID                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  HomePage (/)                                        │  │
│  │  - Calls getAllMovies(userID)                       │  │
│  │  - Displays watchlist/watched movies                │  │
│  │  - Updates movies via updateMovie(id, data, userID)│  │
│  │  - Deletes movies via deleteMovie(id, userID)      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MoviesPage (/movies)                               │  │
│  │  - Searches OMDB API for movies                     │  │
│  │  - Displays search results                          │  │
│  │  - Navigates to SeparateMoviePage                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SeparateMoviePage                                   │  │
│  │  - Fetches movie details from OMDB                  │  │
│  │  - Calls addMovie(movieData, userID)               │  │
│  │  - Adds to watchlist or watched collection          │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Firebase Firestore                          │
│                                                              │
│  Collection: [userID]                                        │
│  ├── Document: [auto-generated-id-1]                        │
│  │   └── { Title, Year, watched, ... }                     │
│  ├── Document: [auto-generated-id-2]                        │
│  │   └── { Title, Year, watched, ... }                     │
│  └── ...                                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration Points

### 1. HomePage (`/app/page.jsx`)

**Database Operations:**

- **Read:** `getAllMovies(userID)` on component mount
- **Update:** `updateMovie()` when toggling watch status
- **Delete:** `deleteMovie()` when removing movies

**State Management:**

- Fetches movies into local state
- Filters by category (watchlist/watched)
- Re-fetches on mount (dependency issue - uses functions as deps)

### 2. SeparateMoviePage (`/app/movies/SeparateMoviePage.jsx`)

**Database Operations:**

- **Create:** `addMovie()` when adding to watchlist or watched

**Integration:**

- Combines OMDB API data with Firebase storage
- Sets `watched` field based on user selection
- Redirects after successful addition

### 3. SmallMovieCard (`/app/smallMovieCard.jsx`)

**Database Operations:**

- **Update:** `updateMovie()` for status changes
- **Delete:** `deleteMovie()` for removal

**Features:**

- Optimistic UI updates (updates local state)
- Toast notifications for feedback
- Loading states during operations

---

## External API Integration

### OMDB API

**Purpose:** Fetches movie metadata (poster, plot, ratings, etc.)

**Endpoints Used:**

1. **Search:** `https://www.omdbapi.com/?s={query}&apikey=5cc173f0`

   - Used in: `useSearchMovies` hook
   - Returns: Array of movie search results

2. **Details:** `https://www.omdbapi.com/?i={imdbID}&apikey=5cc173f0`
   - Used in: `SeparateMoviePage`
   - Returns: Complete movie details

**API Key:** `5cc173f0` (exposed in client-side code)

**Cache Strategy:**

- `force-cache` used for detail requests
- Prevents redundant API calls
- Reduces API quota usage

---

## State Management

### Zustand Store (`/store/store.js`)

**Purpose:** Global state for movie search results

```javascript
{
  movies: [], // Search results from OMDB
  setMovies: (movies) => {...}
}
```

**Usage:**

- Stores temporary search results
- Not persisted (resets on page refresh)
- Only used in search functionality
- Separate from Firebase-stored movies

**Note:** Not currently used for Firebase movie data

---

## Security Considerations

### Current Security Posture

❌ **Vulnerabilities:**

1. **Exposed Firebase Config:** API keys visible in client code
2. **No Security Rules:** Firestore rules not documented/may not exist
3. **No User Authentication:** Anonymous access via localStorage
4. **Exposed OMDB API Key:** Can be abused by others

⚠️ **Risks:**

- Users could potentially access other users' collections
- No data validation on writes
- No rate limiting
- API quota abuse

### Recommended Improvements

1. **Firebase Security Rules:**

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{userID}/{movieId} {
         allow read, write: if request.auth != null || request.auth.token.uid == userID;
       }
     }
   }
   ```

2. **Environment Variables:**

   - Move API keys to `.env.local`
   - Use `process.env.NEXT_PUBLIC_FIREBASE_API_KEY`

3. **API Key Restrictions:**
   - Restrict Firebase keys to your domain
   - Restrict OMDB key to your domain

---

## Performance Analysis

### Current Performance Characteristics

**Strengths:**
✅ Firestore auto-indexes for fast queries
✅ Real-time capabilities (not currently used)
✅ Scalable NoSQL structure

**Weaknesses:**
❌ No pagination (fetches all movies at once)
❌ No caching strategy (re-fetches on every mount)
❌ Redundant getDoc call in updateMovie
❌ Multiple re-renders due to dependency issues

---

## Error Handling

### Current Implementation

- Centralized error handler for Firebase operations
- Try-catch blocks in all async operations
- Toast notifications for user feedback
- Console logging for debugging

### Error Types Handled

1. **Permission Denied:** Specific Firebase errors
2. **Network Errors:** Caught but not specifically handled
3. **API Errors:** OMDB API failures caught in components

---

## Testing Recommendations

### Unit Tests

```javascript
// Example test for addMovie
describe("addMovie", () => {
  it("should add movie to user collection", async () => {
    const movieData = { Title: "Test Movie", watched: false };
    const result = await addMovie(movieData, "test-user-id");
    expect(result.success).toBe(true);
  });
});
```

### Integration Tests

- Test complete user flow (search → add → view → delete)
- Verify localStorage persistence
- Test error handling scenarios

---

## Monitoring & Logging

### Current Logging

- Console.error for all database errors
- Console.log in some catch blocks
- No structured logging system

### Recommendations

- Implement error tracking (e.g., Sentry)
- Firebase Analytics integration
- Performance monitoring

---

## Database Limitations & Quotas

### Firestore Free Tier (Spark Plan)

- **Stored Data:** 1 GiB
- **Document Reads:** 50,000/day
- **Document Writes:** 20,000/day
- **Document Deletes:** 20,000/day

### Current Usage Estimate

- Each movie: ~2 KB
- 100 movies: ~200 KB
- Well within free tier limits for small user base

---

## Migration Considerations

### Future Scalability

If the app grows beyond localStorage-based users:

1. **Add Firebase Authentication**

   - Replace localStorage userID
   - Enable proper security rules
   - Support multiple devices per user

2. **Optimize Data Structure**

   ```javascript
   users (collection)
   └── [authUID] (document)
       └── movies (subcollection)
           └── [movieId] (document)
   ```

3. **Add Pagination**

   - Limit queries to 20-50 movies
   - Implement infinite scroll
   - Reduce initial load time

4. **Add Caching Layer**
   - React Query or SWR
   - Reduce Firestore reads
   - Better offline support

---

## Conclusion

This database integration provides a functional foundation for a personal movie tracking app. The architecture is simple and effective for small-scale usage but would benefit from authentication, security rules, and optimization for production deployment.

---

## Quick Reference

### Import Statements

```javascript
// Database operations
import {
  getAllMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from "@/utils/db/connectDB";

// User identification
import { useLocalStorage } from "@/utils/localSrorage";

// Firebase instance (if needed)
import { db } from "@/utils/db/firebaseConfig";
```

### Common Patterns

```javascript
// Get user's movies
const { userID } = useLocalStorage();
const movies = await getAllMovies(userID);

// Add a movie
await addMovie({ ...movieData, watched: false }, userID);

// Update movie status
await updateMovie(movieId, { watched: true }, userID);

// Delete a movie
await deleteMovie(movieId, userID);
```
