import { connectDB } from "@/utils/db/connectDB";
import MovieItem from "@/utils/model/Movie.model";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    connectDB();
    const movie = await MovieItem.findByIdAndDelete(id);
    if (!movie) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Movie not found",
      });
    }
    return NextResponse.json({
      status: 200,
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
}
