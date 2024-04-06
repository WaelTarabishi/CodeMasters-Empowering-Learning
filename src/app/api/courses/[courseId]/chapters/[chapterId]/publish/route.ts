import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCourse = await prismadb.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const chapter = await prismadb.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    const muxData = await prismadb.muxData.findUnique({
      where: {
        chapterId,
      },
    });
    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    const publishedChpater = await prismadb.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedChpater);
  } catch (err) {
    console.log("[CHAPTER_PUBLISH]", err);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
