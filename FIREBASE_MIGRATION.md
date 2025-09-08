# Firebase Migration Guide

This guide outlines the changes made to migrate from MongoDB to Firebase Firestore.

## Summary of Changes

### 1. Dependencies Updated

- **Removed**: `mongoose` (MongoDB ORM)
- **Added**: `firebase` (Firebase SDK)

### 2. Database Configuration

- **Old**: `utils/db/connectDB.js` - MongoDB connection
- **New**: `utils/db/firebaseConfig.js` - Firebase initialization
- **Updated**: `utils/db/connectDB.js` - Firebase Firestore utility functions

### 3. Data Model Changes

- **Old**: `utils/model/Movie.model.js` - Mongoose schema
- **New**: `utils/model/Movie.model.js` - Firebase document structure and helper functions

### 4. API Routes Updated

All API routes have been updated to use Firebase Firestore:

- `app/api/get-all-movies/route.js`
- `app/api/add-to-watchlist/route.js`
- `app/api/add-to-watched/route.js`
- `app/api/delete-movie/route.js`

## Firebase Setup Required

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Set up security rules for Firestore

### 2. Get Firebase Configuration

1. Go to Project Settings > General
2. Scroll down to "Your apps" section
3. Click "Web" icon to add a web app
4. Copy the Firebase configuration object

### 3. Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 4. Firestore Security Rules

In the Firebase Console, go to Firestore Database > Rules and set up appropriate security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to movies collection
    match /movies/{document} {
      allow read, write: if true; // Adjust based on your security needs
    }
  }
}
```

## Key Differences

### MongoDB vs Firebase Structure

**MongoDB (Old)**:

```javascript
// Schema-based with Mongoose
const movieSchema = new mongoose.Schema({
  Title: { type: String },
  watched: { type: Boolean, default: false },
});

// Usage
const movie = new MovieItem(data);
await movie.save();
```

**Firebase (New)**:

```javascript
// No schema required, flexible documents
const movieData = {
  Title: "Movie Title",
  watched: false,
  createdAt: new Date(),
};

// Usage
await addDoc(collection(db, "movies"), movieData);
```

### API Changes

**MongoDB Pattern**:

```javascript
connectDB();
const movies = await MovieItem.find({}).lean();
```

**Firebase Pattern**:

```javascript
const movies = await getAllMovies(); // Uses utility function
```

## Data Migration

If you have existing data in MongoDB, you'll need to export it and import it into Firestore:

1. Export data from MongoDB
2. Transform data format if needed
3. Import data into Firestore using Firebase Admin SDK or the console

## Testing

After setup:

1. Update your `.env.local` with Firebase credentials
2. Run `npm run dev`
3. Test all movie operations:
   - Add to watchlist
   - Add to watched
   - View all movies
   - Delete movies

## Benefits of Firebase

1. **Real-time updates**: Firestore provides real-time listeners
2. **Offline support**: Built-in offline capabilities
3. **Scalability**: Automatic scaling
4. **Security**: Granular security rules
5. **Integration**: Easy integration with other Firebase services

## Document Structure

Each movie document in Firestore will have:

```javascript
{
  id: "auto-generated-id",
  Title: "string",
  Year: "string",
  Type: "string",
  Genre: "string",
  Runtime: "string",
  Poster: "string",
  imdbRating: "string",
  imdbVotes: "string",
  watched: boolean,
  wantToWatch: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All API routes now include proper error handling with detailed error messages for debugging.
