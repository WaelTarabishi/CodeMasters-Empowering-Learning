import Link from "next/link";
import { columns } from "./_componets/columns";
import { DataTable } from "./_componets/data-table";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const CoursesPage = async () => {
  const { userId } = auth();
  if (!userId) redirect("/");
  const courses = await prismadb.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
