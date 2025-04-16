"use client";
import { Button } from "@material-tailwind/react";

export function MaterialButton({ children }) {
  return (
    <Button
      variant="outlined"
      className="py-1 rounded-full text-sm font-medium flex border-blue-600 hover:bg-blue-500 active:scale-95 transition-all"
    >
      {children}
    </Button>
  );
}
