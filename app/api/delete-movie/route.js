import { deleteMovie } from "@/utils/db/connectDB";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({
      status: 400,
      success: false,
      message: "Movie ID is required",
    });
  }

  try {
    const deleted = await deleteMovie(id);

    if (!deleted) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Movie not found",
      });
    }

    revalidatePath("/");

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
