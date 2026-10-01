import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CourseEditor } from "./course-editor";

export default async function CourseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const [{ data: course }, { data: modules }, { data: lessons }] = await Promise.all([
    supabase.from("courses").select("id,slug,code,title,description,level,status,thumbnail_url,product_id").eq("id", id).single(),
    supabase.from("course_modules").select("id,title,description,position").eq("course_id", id).order("position"),
    supabase.from("lessons").select("id,module_id,slug,title,content,video_url,download_url,duration_minutes,position,is_preview,status").eq("course_id", id).order("position"),
  ]);
  if (!course) notFound();
  return <CourseEditor initialCourse={course} initialModules={modules ?? []} initialLessons={lessons ?? []} />;
}
