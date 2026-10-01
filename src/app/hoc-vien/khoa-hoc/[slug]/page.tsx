import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStudentCourseDetail, getStudentDashboardData } from "@/lib/academy-queries";
import { StudentCoursePlayer } from "./student-course-player";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const course = await getStudentCourseDetail((await params).slug);
  return { title: course?.title ?? "Khóa học" };
}

export default async function StudentCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [course, dashboard] = await Promise.all([getStudentCourseDetail(slug), getStudentDashboardData()]);
  if (!course) notFound();
  return <StudentCoursePlayer course={course} fullName={dashboard?.fullName ?? "Học viên"} />;
}
