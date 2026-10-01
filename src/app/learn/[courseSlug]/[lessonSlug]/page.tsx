import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, getLesson } from "@/lib/data";
import { LessonPlayer } from "./lesson-player";

export function generateStaticParams() {
  return courses.flatMap((course) => course.lessons.map((lesson) => ({ courseSlug: course.slug, lessonSlug: lesson.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> }): Promise<Metadata> {
  const value = await params;
  const { lesson } = getLesson(value.courseSlug, value.lessonSlug);
  return { title: lesson?.title ?? "Bài học" };
}

export default async function LearnPage({ params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> }) {
  const value = await params;
  const { course, lesson } = getLesson(value.courseSlug, value.lessonSlug);
  if (!course || !lesson) notFound();
  return <LessonPlayer course={course} lesson={lesson} />;
}
