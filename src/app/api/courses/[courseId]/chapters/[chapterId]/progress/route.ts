import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();
    const { chapterId, courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userProgress = await prismadb.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });
    return NextResponse.json(userProgress);
  } catch (err) {
    console.log("[CHAPTER_ID_PROGRESS]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
