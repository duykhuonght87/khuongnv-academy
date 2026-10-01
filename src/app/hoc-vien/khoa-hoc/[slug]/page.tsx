import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { roadmap } from "@/lib/admin-data";
import { StudentCoursePlayer } from "./student-course-player";

export function generateStaticParams() { return roadmap.map(item => ({ slug: item.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = roadmap.find(item => item.slug === slug);
  return { title: course?.title ?? "Khóa học" };
}

export default async function StudentCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = roadmap.find(item => item.slug === slug);
  if (!course) notFound();
  return <StudentCoursePlayer course={course} />;
}
