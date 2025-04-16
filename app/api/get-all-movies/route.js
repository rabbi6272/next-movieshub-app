import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { connectDB } from "@/utils/db/connectDB";
import MovieItem from "@/utils/model/Movie.model";

export async function GET() {
  try {
    connectDB();
    const movies = await MovieItem.find({}).lean();
    revalidatePath("/");
    return NextResponse.json({ data: movies });
  } catch (error) {
    return NextResponse.json({ message: "Error" });
  }
}
