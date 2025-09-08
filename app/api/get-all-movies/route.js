import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getAllMovies } from "@/utils/db/connectDB";

export async function GET() {
  try {
    const movies = await getAllMovies();
    revalidatePath("/");
    return NextResponse.json({ data: movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      {
        message: "Error fetching movies",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
