"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuthStore, useMovieStore } from "@/store/store";

import { auth } from "@/utils/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";

const AUTH_STORAGE_KEY = "userID";

function getStoredUserID() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

function setStoredUserID(uid: string | null) {
  if (uid) {
    localStorage.setItem(AUTH_STORAGE_KEY, uid);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const userID = useAuthStore((state) => state.userID);
  const setUserID = useAuthStore((state) => state.setUserID);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setSearchQuery = useMovieStore((state) => state.setSearchQuery);
  const setSearchPage = useMovieStore((state) => state.setSearchPage);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setUserID(firebaseUser.uid);
        setIsAuthenticated(true);
        setStoredUserID(firebaseUser.uid);
      } else {
        const stored = getStoredUserID();
        if (stored) {
          setStoredUserID(null);
        }
        setUser(null);
        setUserID(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const savedUser = await signInWithEmailAndPassword(auth, email, password);
      const uid = savedUser.user.uid;
      setUser(auth.currentUser);
      setStoredUserID(uid);
      setIsAuthenticated(true);
      setUserID(uid);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const savedUser = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(savedUser.user, { displayName: fullName });

      const userID = savedUser.user.uid;
      setUser(auth.currentUser);
      setStoredUserID(userID);
      setIsAuthenticated(true);
      setUserID(userID);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      setUser(auth.currentUser);
      setStoredUserID(uid);
      setIsAuthenticated(true);
      setUserID(uid);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setStoredUserID(null);
    setUserID(null);
    setIsAuthenticated(false);
    setSearchQuery("");
    setSearchPage(1);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return {
    user,
    userID,
    isAuthenticated,
    signup,
    login,
    loginWithGoogle,
    logout,
    isLoading,
  };
}
