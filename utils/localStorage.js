"use client";
import { useState, useMemo } from "react";

export function useLocalStorage() {
  const [value, setValue] = useState("");

  useMemo(() => {
    if (typeof window !== "undefined") {
      const value = JSON.parse(localStorage.getItem("userID"));
      if (value) {
        setValue(value);
      }
    }
    if (value) {
      localStorage.setItem("userID", JSON.stringify(value));
    }
  }, [value]);

  return { userID: value, setUserID: setValue };
}
