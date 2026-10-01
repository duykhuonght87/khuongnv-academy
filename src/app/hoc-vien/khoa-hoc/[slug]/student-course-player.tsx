"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Download, ExternalLink, LockKeyhole, Play } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import type { StudentCourseDetail } from "@/lib/academy-types";
import { createClient } from "@/lib/supabase/client";

function embedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v") ? `https://www.youtube.com/embed/${parsed.searchParams.get("v")}` : url;
    if (parsed.hostname === "youtu.be") return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    return url;
  } catch { return url; }
}

export function StudentCoursePlayer({ course, fullName }: { course: StudentCourseDetail; fullName: string }) {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(course.completedLessonSlugs);
  const [message, setMessage] = useState("");
  if (!course.unlocked) return <StudentShell fullName={fullName}><section className="locked-course"><LockKeyhole /><span>{course.level}</span><h1>Khóa học này chưa được mở.</h1><p>{course.title} sẽ được mở khi tài khoản của bạn có quyền truy cập.</p><Link className="button button-primary" href="/hoc-vien/kich-hoat">Nhập mã kích hoạt</Link></section></StudentShell>;
  const lesson = course.lessons[active];
  const percent = course.lessons.length ? Math.round(done.length / course.lessons.length * 100) : 0;

  async function complete() {
    if (!lesson || done.includes(lesson.slug)) return;
    const supabase = createClient();
    const { data: { user } } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
    if (!supabase || !user) return setMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    const { error } = await supabase.from("lesson_progress").upsert({ user_id: user.id, course_slug: course.slug, lesson_slug: lesson.slug, completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: "user_id,course_slug,lesson_slug" });
    if (error) return setMessage(`Không thể lưu tiến độ: ${error.message}`);
    setDone(current => [...current, lesson.slug]);
    setMessage("Đã lưu tiến độ bài học.");
    if (active < course.lessons.length - 1) setActive(active + 1);
  }

  return <StudentShell active="/hoc-vien#roadmap" fullName={fullName}><div className="student-course-header"><Link href="/hoc-vien"><ArrowLeft /> Lộ trình OPC</Link><div><span>{course.level}</span><h1>{course.title}</h1></div><div><span>{percent}%</span><div className="progress-track"><i style={{ width: `${percent}%` }} /></div></div></div><div className="student-course-layout"><aside className="module-list"><div><span>NỘI DUNG KHÓA HỌC</span><b>{course.lessons.length} bài học</b></div>{course.lessons.map((item, index) => <button className={active === index ? "active" : ""} onClick={() => { setActive(index); setMessage(""); }} key={item.id}>{done.includes(item.slug) ? <CheckCircle2 /> : <Circle />}<span><small>{item.moduleTitle.toUpperCase()} · BÀI {String(index + 1).padStart(2, "0")}</small><b>{item.title}</b></span></button>)}</aside><section className="student-lesson">{lesson ? <><div className="student-video">{lesson.videoUrl ? <iframe src={embedUrl(lesson.videoUrl)} title={lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <><span>{course.level} / BÀI {String(active + 1).padStart(2, "0")}</span><Play /><small>Video đang được cập nhật</small></>}</div><article><span>BÀI {String(active + 1).padStart(2, "0")}</span><h2>{lesson.title}</h2><p>{lesson.content}</p>{lesson.downloadUrl ? <a className="download-link" href={lesson.downloadUrl} target="_blank" rel="noreferrer"><Download /> Tải tài liệu bài học <ExternalLink /></a> : <p className="muted">Tài liệu tải xuống đang được cập nhật.</p>}{message && <p className="form-message" role="status">{message}</p>}<div className="course-actions"><button disabled={active === 0} onClick={() => setActive(Math.max(0, active - 1))}><ArrowLeft /> Bài trước</button><button className="complete-button" disabled={done.includes(lesson.slug)} onClick={complete}><CheckCircle2 /> {done.includes(lesson.slug) ? "Đã hoàn thành" : "Hoàn thành bài học"}</button><button disabled={active === course.lessons.length - 1} onClick={() => setActive(Math.min(course.lessons.length - 1, active + 1))}>Bài tiếp theo <ArrowRight /></button></div></article></> : <div className="locked-course"><Play /><h2>Nội dung đang được cập nhật.</h2><p>Quản trị viên chưa xuất bản bài học cho khóa này.</p></div>}</section></div></StudentShell>;
}
