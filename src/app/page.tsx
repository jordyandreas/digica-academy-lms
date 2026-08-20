import { HomeClient } from "@/components/home/HomeClient";
import { getPublicPrograms } from "@/features/programs/getPublicPrograms";
import { getPublishedCourses } from "@/features/courses/getPublishedCourses";
import { COURSES_ENABLED } from "@/constants/features";

export default async function Home() {
  const programsResult = await getPublicPrograms();
  const courses = COURSES_ENABLED ? await getPublishedCourses() : [];
  return (
    <HomeClient programsResult={programsResult} courses={courses} />
  );
}
