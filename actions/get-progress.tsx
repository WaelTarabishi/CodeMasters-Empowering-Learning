import prismadb from "@/lib/prismadb";

const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapter = await prismadb.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });
    const publishedChapterIds = publishedChapter.map((chapter) => chapter.id);

    const validCompletedChapters = await prismadb.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });
    const progressPercentage =
      (validCompletedChapters / publishedChapterIds.length) * 100;
    return progressPercentage;
  } catch (err) {
    console.log("[GET_PROGRESS]", err);
    return 0;
  }
};

export default getProgress;
