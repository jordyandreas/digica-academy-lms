import { HomeClient } from "@/components/home/HomeClient";
import { getPublicPrograms } from "@/features/programs/getPublicPrograms";
import { getPublishedCourses } from "@/features/courses/getPublishedCourses";
import { getLatestPublishedArticles } from "@/features/articles/getPublishedArticles";
import { ARTICLES_ENABLED, COURSES_ENABLED } from "@/constants/features";

export const dynamic = "force-dynamic";

export default async function Home() {
  const programsResult = await getPublicPrograms();
  const courses = COURSES_ENABLED ? await getPublishedCourses() : [];
  const articles = ARTICLES_ENABLED ? await getLatestPublishedArticles(3) : [];
  return (
    <HomeClient
      programsResult={programsResult}
      courses={courses}
      articles={articles}
    />
  );
}
