"use client";
import { useState, useMemo } from "react";

export function useLocalStorage() {
  const [value, setValue] = useState("");

  useMemo(() => {
    if (typeof window !== "undefined") {
      const value = JSON.parse(localStorage.getItem("userID"));
      if (value === null || value === undefined) {
        // Generate a new random 7-character alphanumeric ID
        const newID = Math.random().toString(36).substring(2, 9);
        localStorage.setItem("userID", JSON.stringify(newID));
        setValue(newID);
      } else {
        setValue(value);
      }
    }
  }, []);

  return { userID: value };
}
