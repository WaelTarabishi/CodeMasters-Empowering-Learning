import prismadb from "@/lib/prismadb";
import { isTeacher } from "@/lib/teachers";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await prismadb.course.create({
      data: {
        title,
        userId,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Inernal Error", { status: 500 });
  }
}
