import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
