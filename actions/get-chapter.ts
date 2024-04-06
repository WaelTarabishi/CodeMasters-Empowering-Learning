import prismadb from "@/lib/prismadb";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

const GetChapterr = async ({
  chapterId,
  courseId,
  userId,
}: GetChapterProps) => {
  try {
    const purchase = await prismadb.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    const course = await prismadb.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });
    const chapter = await prismadb.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });
    if (!chapter || !course) {
      throw new Error("Chapter or Course not found");
    }
    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;
    if (purchase) {
      attachments = await prismadb.attachment.findMany({
        where: {
          courseId,
        },
      });
    }
    if (chapter.isFree || purchase) {
      muxData = await prismadb.muxData.findUnique({
        where: {
          chapterId: chapterId,
        },
      });
      // console.log("This is mux Data", muxData);
    }
    nextChapter = await prismadb.chapter.findFirst({
      where: {
        courseId,
        isPublished: true,
        position: {
          gt: chapter?.position,
        },
      },
      orderBy: { position: "asc" },
    });
    // console.log(nextChapter, "this is next chapter");
    const userProgress = await prismadb.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (err) {
    console.log("[GET_CHAPTER]", err);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};

export default GetChapterr;
