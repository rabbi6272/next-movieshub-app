# 🔥 Firebase Setup Guide

You're seeing permission errors because Firestore needs to be properly configured. Follow these steps:

## 🚨 IMMEDIATE FIXES NEEDED

### 1. Enable Firestore API

**Click this link and enable the API**:
👉 https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=movies-hub-89d08

### 2. Set up Firestore Database

1. Go to **Firebase Console**: https://console.firebase.google.com/project/movies-hub-89d08
2. Click **"Firestore Database"** in the left sidebar
3. Click **"Create database"**
4. Choose **"Start in test mode"** (allows read/write access for 30 days)
5. Select a location (choose closest to your users)

### 3. Configure Security Rules (FOR DEVELOPMENT)

In Firebase Console → Firestore Database → Rules tab, use these **temporary** rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 🚨 DEVELOPMENT ONLY - Change before production!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANT**: These rules allow anyone to access your database. Perfect for development, but **MUST** be changed before going live!

### 4. Production Security Rules (FOR LATER)

When ready for production, replace with secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /movies/{movieId} {
      // Allow anyone to read movies
      allow read: if true;

      // Only allow writes from your app's domain
      allow write: if request.auth != null;

      // Or restrict to your app domain:
      // allow write: if request.headers['origin'] == 'https://yourdomain.com';
    }
  }
}
```

## 🔄 After Setup

1. **Wait 2-3 minutes** for changes to propagate
2. **Refresh your app** at http://localhost:3000
3. **Test adding movies** - should work now!

## 🐛 Still Having Issues?

If you still see errors after setup:

### Check if API is enabled:

```bash
# Open this URL in browser:
https://console.cloud.google.com/apis/library/firestore.googleapis.com?project=movies-hub-89d08
```

### Verify Database exists:

1. Go to Firebase Console
2. Check if "Firestore Database" shows a database (not "Get started")
3. Look for a collection called "movies"

### Check Network:

- Ensure you have internet connection
- Try disabling VPN if using one
- Check if your firewall blocks Google services

## 📊 Current Project Info

- **Project ID**: `movies-hub-89d08`
- **Region**: You'll choose this during database creation
- **Collections**: `movies` (will be created automatically)

## 🎯 Quick Test

After setup, try adding a movie from your app. You should see:

1. ✅ No permission errors in console
2. ✅ Movies appear in Firebase Console → Firestore Database
3. ✅ App shows success messages

---

**Need help?** The error messages in your terminal will be much clearer after these steps!
