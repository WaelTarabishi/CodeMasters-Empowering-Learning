import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import GetChapterr from "../../../../../../../actions/get-chapter";
import Banner from "@/components/banner";
import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/course-progress-button";

const ChapterPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { chapterId, courseId } = params;
  const { userId } = auth();
  if (!userId) return redirect("/");
  const {
    attachments,
    chapter,
    course,
    muxData,
    nextChapter,
    purchase,
    userProgress,
  } = await GetChapterr({
    userId,
    chapterId: chapterId,
    courseId: courseId,
  });
  if (!chapter || !course) return redirect("/");
  const isLocked = !chapter.isFree && !purchase;
  const completedOnEnd = !!purchase && !userProgress?.isCompleted;
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          label="You already completed this chapter"
          variant={"success"}
        />
      )}
      {isLocked && (
        <Banner
          variant={"warning"}
          label="You need to purchase this course to watch this chapter"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completedOnEnd={completedOnEnd}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
          {purchase ? (
            // TODO: ADD COURSE PROGRESSBUTTON
            <>
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            </>
          ) : (
            <CourseEnrollButton courseId={courseId} price={course.price!} />
          )}
        </div>
        <Separator />
        <div>
          <Preview value={chapter.description!} />
        </div>
        {!!attachments.length && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  target="_blank"
                  href={attachment.url}
                  className="flex items-center p-3 border text-sky-700 w-full  bg-sky-200 rounded-md hover:underline">
                  <p className="line-clamp-1 ">
                    <File />
                    {attachment.name}
                  </p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterPage;
