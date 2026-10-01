"use client";

import { useEffect, useState } from "react";
import { BookOpen, Eye, Pencil, Plus, Video } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, StatusPill } from "@/components/admin-ui";
import { courses } from "@/lib/data";
import { roadmap } from "@/lib/admin-data";
import { createClient } from "@/lib/supabase/client";

type CourseRow = { id?: string; code: string; title: string; lessons: number; status: string };

export default function CoursesAdminPage() {
  const [showCreate, setShowCreate] = useState(false);
  const demoCourses: CourseRow[] = [...roadmap.slice(0, 3).map((item, index) => ({ code: `OPC-0${index + 1}`, title: item.title, lessons: item.lessons, status: index < 2 ? "Đã xuất bản" : "Bản nháp" })), ...courses.slice(1, 2).map(item => ({ code: item.code, title: item.title, lessons: item.lessons.length, status: "Đã xuất bản" }))];
  const [allCourses, setAllCourses] = useState<CourseRow[]>(demoCourses);
  const [courseName, setCourseName] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void supabase.from("courses").select("id,code,title,status").order("created_at").then(({ data }) => {
      if (data?.length) setAllCourses(data.map(course => ({ ...course, lessons: 0, status: course.status === "published" ? "Đã xuất bản" : "Bản nháp" })));
    });
  }, []);
  async function createCourse() {
    if (!courseName.trim() || !courseSlug.trim()) return;
    const next: CourseRow = { code: `KNA-${String(Date.now()).slice(-5)}`, title: courseName, lessons: 0, status: "Bản nháp" };
    setAllCourses(current => [...current, next]);
    setShowCreate(false);
    const supabase = createClient();
    if (supabase) await supabase.from("courses").insert({ code: next.code, title: courseName, slug: courseSlug, status: "draft", level: "Tùy chỉnh" });
  }
  return <AdminShell active="/admin/courses">
    <AdminHeader eyebrow="LMS / KHÓA HỌC" title="Quản lý khóa học" description="Tạo module, bài học và kết nối video bên ngoài." action={<button className="button button-primary" onClick={() => setShowCreate(value => !value)}><Plus /> Tạo khóa học</button>} />
    {showCreate && <div className="inline-create course-create"><div><span>KHÓA HỌC MỚI</span></div><input placeholder="Tên khóa học" value={courseName} onChange={event => setCourseName(event.target.value)} /><input placeholder="Slug" value={courseSlug} onChange={event => setCourseSlug(event.target.value)} /><input placeholder="Thumbnail URL" /><select><option>Bản nháp</option><option>Đã xuất bản</option></select><button className="button button-primary" onClick={createCourse}>Lưu bản nháp</button></div>}
    <section className="admin-card course-management-list">{allCourses.map((course, index) => <article key={`${course.code}-${index}`}><div className="course-manage-icon"><BookOpen /></div><div className="course-manage-copy"><span>{course.code}</span><h2>{course.title}</h2><p><Video /> {course.lessons} bài học · Cập nhật 01/10/2026</p></div><StatusPill status={course.status === "Đã xuất bản" ? "Hoàn thành" : "Chờ thanh toán"} /><div className="card-actions"><button><Eye /> Xem</button><button><Pencil /> Chỉnh sửa</button></div></article>)}</section>
  </AdminShell>;
}
