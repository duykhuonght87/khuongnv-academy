import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { courses, getLesson } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
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
  if (!lesson.preview) {
    const supabase = await createClient();
    const { data: { user } } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
    if (!user) redirect(`/login?next=/learn/${value.courseSlug}/${value.lessonSlug}`);
    const [{ data: profile }, { data: courseRow }] = await Promise.all([
      supabase!.from("profiles").select("role").eq("id", user.id).single(),
      supabase!.from("courses").select("product_id").eq("slug", value.courseSlug).single(),
    ]);
    if (profile?.role !== "admin") {
      if (!courseRow?.product_id) redirect("/hoc-vien");
      const { data: access } = await supabase!.from("user_product_access").select("id").eq("user_id", user.id).eq("product_id", courseRow.product_id).maybeSingle();
      if (!access) redirect("/hoc-vien/kich-hoat");
    }
  }
  return <LessonPlayer course={course} lesson={lesson} />;
}
