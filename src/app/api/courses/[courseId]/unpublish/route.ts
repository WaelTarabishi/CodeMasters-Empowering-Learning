import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await prismadb.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!course) return new NextResponse("Not Found", { status: 404 });

    const ubPublishedCourse = await prismadb.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    return NextResponse.json(ubPublishedCourse);
  } catch (err) {
    console.log("[COURSE_ID_UN_PUBLISH]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
