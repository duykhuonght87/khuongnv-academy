import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Clock3, PlayCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { courses, getCourse } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export function generateStaticParams() {
  return courses.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const course = getCourse((await params).slug);
  return { title: course?.title ?? "Khóa học" };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const course = getCourse((await params).slug);
  if (!course) notFound();
  const totalMinutes = course.lessons.reduce((sum, lesson) => sum + Number.parseInt(lesson.duration), 0);
  const supabase = await createClient();
  const { data: { user } } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  let hasAccess = false;
  if (supabase && user) {
    const [{ data: profile }, { data: courseRow }] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      supabase.from("courses").select("product_id").eq("slug", course.slug).single(),
    ]);
    if (profile?.role === "admin") hasAccess = true;
    else if (courseRow?.product_id) {
      const { data: access } = await supabase.from("user_product_access").select("id").eq("user_id", user.id).eq("product_id", courseRow.product_id).maybeSingle();
      hasAccess = Boolean(access);
    }
  }

  return (
    <AppShell active="courses">
      <Link className="back-row" href="/dashboard"><ArrowLeft /> Quay lại tổng quan</Link>
      <section className="course-hero" style={{ "--course-accent": course.accent } as React.CSSProperties}>
        <div>
          <div className="kicker"><span /> {course.code} · {course.level.toUpperCase()}</div>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="course-facts"><span><PlayCircle /> {course.lessons.length} bài học</span><span><Clock3 /> {totalMinutes} phút</span><span><CheckCircle2 /> Bài tập ứng dụng</span></div>
        </div>
        <div className="course-sigil" aria-hidden="true"><b>{course.code}</b><i /><i /><i /></div>
      </section>

      <section className="curriculum">
        <div className="dashboard-section-title"><div><span className="section-index">01</span><h2>Nội dung khóa học</h2></div><span>{course.lessons.length} bài · {totalMinutes} phút</span></div>
        <div className="lesson-list">
          {course.lessons.map((lesson, index) => (
            <Link href={lesson.preview || hasAccess ? `/learn/${course.slug}/${lesson.slug}` : user ? "/hoc-vien/kich-hoat" : `/login?next=/courses/${course.slug}`} key={lesson.slug}>
              <span className="lesson-index">{String(index + 1).padStart(2, "0")}</span>
              <div><b>{lesson.title}</b><span>{lesson.duration}{lesson.preview ? " · Học thử miễn phí" : ""}</span></div>
              <span className="lesson-action">{lesson.preview || hasAccess ? "Học bài" : "Cần quyền truy cập"} <ArrowUpRight /></span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
