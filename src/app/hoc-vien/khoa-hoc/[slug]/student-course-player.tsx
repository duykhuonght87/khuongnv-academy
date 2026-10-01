"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Download, LockKeyhole, Play } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { roadmap } from "@/lib/admin-data";
import { createClient } from "@/lib/supabase/client";

type RoadmapItem = (typeof roadmap)[number];

const lessonNames = ["Bản đồ kết quả đầu ra", "Tư duy hệ thống cốt lõi", "Thiết kế quy trình với ChatGPT", "Tạo tài sản phiên bản đầu", "Kiểm chứng với người dùng thật", "Chuẩn hóa và tối ưu", "Đo lường tiến độ", "Kế hoạch hành động 7 ngày", "Review và nâng cấp", "Bài tập tổng kết"];

export function StudentCoursePlayer({ course }: { course: RoadmapItem }) {
  const [active, setActive] = useState(Math.min(4, course.lessons - 1));
  const [done, setDone] = useState<number[]>(course.progress === 100 ? Array.from({ length: course.lessons }, (_, index) => index) : [0, 1, 2, 3].slice(0, Math.round(course.lessons * course.progress / 100)));
  const locked = course.status === "Chưa mở khóa" && course.slug !== "landing-page-funnel";
  if (locked) return <StudentShell><section className="locked-course"><LockKeyhole /><span>LEVEL {course.level}</span><h1>Khóa học này chưa được mở.</h1><p>{course.title} sẽ được mở khi tài khoản của bạn có quyền truy cập.</p><Link className="button button-primary" href="/#chuong-trinh">Xem sản phẩm</Link></section></StudentShell>;
  const currentTitle = lessonNames[active] ?? `Bài học ${active + 1}`;
  async function complete() {
    setDone(current => current.includes(active) ? current : [...current, active]);
    const supabase = createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("lesson_progress").upsert({
          user_id: user.id,
          course_slug: course.slug,
          lesson_slug: `bai-${active + 1}`,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id,course_slug,lesson_slug" });
      }
    }
    if (active < course.lessons - 1) setActive(active + 1);
  }
  const percent = Math.round(done.length / course.lessons * 100);
  return <StudentShell active="/hoc-vien#roadmap"><div className="student-course-header"><Link href="/hoc-vien"><ArrowLeft /> Lộ trình OPC</Link><div><span>LEVEL {course.level}</span><h1>{course.title}</h1></div><div><span>{percent}%</span><div className="progress-track"><i style={{ width: `${percent}%` }} /></div></div></div><div className="student-course-layout"><aside className="module-list"><div><span>NỘI DUNG KHÓA HỌC</span><b>{course.lessons} bài học</b></div>{Array.from({ length: course.lessons }, (_, index) => <button className={active === index ? "active" : ""} onClick={() => setActive(index)} key={index}>{done.includes(index) ? <CheckCircle2 /> : <Circle />}<span><small>BÀI {String(index + 1).padStart(2, "0")}</small><b>{lessonNames[index] ?? `Bài học ${index + 1}`}</b></span></button>)}</aside><section className="student-lesson"><div className="student-video"><span>LEVEL {course.level} / BÀI {String(active + 1).padStart(2, "0")}</span><button aria-label="Phát bài học"><Play /></button><small>18:24</small></div><article><span>BÀI {String(active + 1).padStart(2, "0")}</span><h2>{currentTitle}</h2><p>Bài học giúp bạn chuyển một khái niệm thành hành động cụ thể trong hệ thống kinh doanh một người.</p><a className="download-link" href="#tai-lieu"><Download /> Tải worksheet bài học</a><div className="course-actions"><button disabled={active === 0} onClick={() => setActive(Math.max(0, active - 1))}><ArrowLeft /> Bài trước</button><button className="complete-button" onClick={complete}><CheckCircle2 /> Hoàn thành bài học</button><button disabled={active === course.lessons - 1} onClick={() => setActive(Math.min(course.lessons - 1, active + 1))}>Bài tiếp theo <ArrowRight /></button></div></article></section></div></StudentShell>;
}
