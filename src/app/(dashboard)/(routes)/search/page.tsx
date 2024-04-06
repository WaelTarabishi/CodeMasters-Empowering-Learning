import prismadb from "@/lib/prismadb";
import Categories from "./_components/categories";
import SearchInput from "@/components/ui/search-input";
import { getCourses } from "../../../../../actions/get-courses";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CoursesList from "./_components/courses-list";
interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}
const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const categories = await prismadb.category.findMany({
    orderBy: { name: "asc" },
  });
  const { userId } = auth();
  if (!userId) redirect("/");
  const courses = await getCourses({
    userId,
    ...searchParams,
  });
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
