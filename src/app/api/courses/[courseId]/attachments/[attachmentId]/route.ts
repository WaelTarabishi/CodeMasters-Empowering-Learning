import prismadb from "@/lib/prismadb";
import { isTeacher } from "@/lib/teachers";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = prismadb.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const attachment = await prismadb.attachment.delete({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });
    return NextResponse.json(attachment);
  } catch (err) {
    console.log("[COURSE_ID_ATTACHMENTS]", err);
    return new NextResponse("Inernal Error", { status: 500 });
  }
}
