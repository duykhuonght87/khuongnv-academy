"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Menu, Play, X } from "lucide-react";
import { Brand } from "@/components/brand";
import type { Course, Lesson } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

export function LessonPlayer({ course, lesson }: { course: Course; lesson: Lesson }) {
  const storageKey = `kna-progress-${course.slug}`;
  const [completed, setCompleted] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    const timer = window.setTimeout(() => setCompleted(JSON.parse(saved)), 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  const index = course.lessons.findIndex((item) => item.slug === lesson.slug);
  const next = course.lessons[index + 1];
  const previous = course.lessons[index - 1];
  const progress = useMemo(() => Math.round((completed.length / course.lessons.length) * 100), [completed, course.lessons.length]);

  async function toggleComplete() {
    const nextCompleted = completed.includes(lesson.slug) ? completed.filter((slug) => slug !== lesson.slug) : [...completed, lesson.slug];
    setCompleted(nextCompleted);
    localStorage.setItem(storageKey, JSON.stringify(nextCompleted));
    const supabase = createClient();
    const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
    if (supabase && data.user) {
      await supabase.from("lesson_progress").upsert({ user_id: data.user.id, course_slug: course.slug, lesson_slug: lesson.slug, completed_at: nextCompleted.includes(lesson.slug) ? new Date().toISOString() : null }, { onConflict: "user_id,course_slug,lesson_slug" });
    }
  }

  return (
    <div className="learn-layout">
      <header className="learn-header"><Brand /><div className="learn-course-name"><span>{course.code}</span><b>{course.title}</b></div><button onClick={() => setOpen(true)} aria-label="Mở danh sách bài học"><Menu /></button></header>
      <aside className={`lesson-sidebar ${open ? "open" : ""}`}>
        <div className="lesson-sidebar-head"><Link href={`/courses/${course.slug}`}><ArrowLeft /> Tổng quan khóa</Link><button onClick={() => setOpen(false)} aria-label="Đóng danh sách"><X /></button></div>
        <div className="sidebar-progress"><div><span>Tiến độ khóa học</span><b>{progress}%</b></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
        <nav aria-label="Danh sách bài học">
          {course.lessons.map((item) => (
            <Link className={item.slug === lesson.slug ? "active" : ""} href={`/learn/${course.slug}/${item.slug}`} key={item.slug} onClick={() => setOpen(false)}>
              {completed.includes(item.slug) ? <CheckCircle2 /> : <Circle />}
              <span><small>BÀI {String(item.order).padStart(2, "0")}</small><b>{item.title}</b><em>{item.duration}</em></span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lesson-main">
        <div className="video-frame">
          <div className="video-grid" />
          <button aria-label="Phát video bài học"><Play /></button>
          <span>{lesson.duration}</span>
          <strong>{course.code} / {String(lesson.order).padStart(2, "0")}</strong>
        </div>
        <article className="lesson-content">
          <div className="lesson-title-row"><div><span>BÀI {String(lesson.order).padStart(2, "0")}</span><h1>{lesson.title}</h1></div><button className={completed.includes(lesson.slug) ? "complete active" : "complete"} onClick={toggleComplete}>{completed.includes(lesson.slug) ? <CheckCircle2 /> : <Check />} {completed.includes(lesson.slug) ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}</button></div>
          {lesson.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="action-box"><span>HÀNH ĐỘNG TRONG 24 GIỜ</span><p>Viết câu trả lời của bạn vào sổ làm việc, chọn một việc nhỏ và hoàn thành trước khi chuyển sang bài tiếp theo.</p></div>
          <nav className="lesson-pagination">
            {previous ? <Link href={`/learn/${course.slug}/${previous.slug}`}><ArrowLeft /><span><small>BÀI TRƯỚC</small><b>{previous.title}</b></span></Link> : <span />}
            {next ? <Link href={`/learn/${course.slug}/${next.slug}`}><span><small>BÀI TIẾP THEO</small><b>{next.title}</b></span><ArrowRight /></Link> : <Link href={`/courses/${course.slug}`}><span><small>HOÀN TẤT</small><b>Về khóa học</b></span><ArrowRight /></Link>}
          </nav>
        </article>
      </main>
    </div>
  );
}
