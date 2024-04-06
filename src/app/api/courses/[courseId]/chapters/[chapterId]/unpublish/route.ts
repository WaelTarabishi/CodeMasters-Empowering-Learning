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

    const unPublishedChpater = await prismadb.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedChpatersInCourse = await prismadb.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
    });
    if (!publishedChpatersInCourse.length) {
      await prismadb.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unPublishedChpater);
  } catch (err) {
    console.log("[CHAPTER_UNPUBLISH]", err);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
