"use client";
import { useState, useEffect } from "react";

export function useLocalStorage() {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const value = JSON.parse(localStorage.getItem("userID"));
      if (value === null) {
        localStorage.setItem(
          "userID",
          JSON.stringify(Math.random().toString(36).substring(2, 9))
        );
        setValue(value);
      } else {
        setValue(value);
      }
    }
  }, []);

  return { userID: value };
}
