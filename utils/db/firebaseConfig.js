import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyA8F7uZIng4N4qlxwK7Afl0G8kdvDCENt4",
  authDomain: "movies-hub-89d08.firebaseapp.com",
  projectId: "movies-hub-89d08",
  storageBucket: "movies-hub-89d08.firebasestorage.app",
  messagingSenderId: "1092352196560",
  appId: "1:1092352196560:web:a0fdb263761922c6a943d5",
  measurementId: "G-09JHYT4XB2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
if (typeof window !== "undefined") {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      "6Lcdxw8sAAAAAMpQTeySKzUNNsTRb3yxeRorE7vy"
    ),
    isTokenAutoRefreshEnabled: true, // Automatically refresh tokens
  });
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
