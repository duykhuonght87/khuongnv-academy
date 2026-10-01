"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Eye, Pencil, Plus, Video, X } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, StatusPill } from "@/components/admin-ui";
import { createClient } from "@/lib/supabase/client";

type CourseRow = { id: string; slug: string; code: string; title: string; lessons: number; status: string };

export default function CoursesAdminPage() {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [allCourses, setAllCourses] = useState<CourseRow[]>([]);
  const [courseName, setCourseName] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [status, setStatus] = useState("draft");
  const [message, setMessage] = useState("");

  async function loadCourses() {
    const supabase = createClient(); if (!supabase) return;
    const { data, error } = await supabase.from("courses").select("id,slug,code,title,status,lessons(count)").order("position").order("created_at");
    if (error) { setMessage(`Không thể tải khóa học: ${error.message}`); return; }
    setAllCourses((data ?? []).map(course => ({ id: course.id, slug: course.slug, code: course.code, title: course.title, lessons: course.lessons?.[0]?.count ?? 0, status: course.status === "published" ? "Đã xuất bản" : "Bản nháp" })));
  }
  useEffect(() => {
    const supabase = createClient(); if (!supabase) return;
    void supabase.from("courses").select("id,slug,code,title,status,lessons(count)").order("position").order("created_at").then(({ data, error }) => {
      if (error) { setMessage(`Không thể tải khóa học: ${error.message}`); return; }
      setAllCourses((data ?? []).map(course => ({ id: course.id, slug: course.slug, code: course.code, title: course.title, lessons: course.lessons?.[0]?.count ?? 0, status: course.status === "published" ? "Đã xuất bản" : "Bản nháp" })));
    });
  }, []);
  async function createCourse() {
    if (!courseName.trim() || !courseSlug.trim()) { setMessage("Vui lòng nhập tên và slug khóa học."); return; }
    const supabase = createClient(); if (!supabase) { setMessage("Chưa kết nối Supabase."); return; }
    const code = `KNA-${String(Date.now()).slice(-5)}`;
    const { data, error } = await supabase.from("courses").insert({ code, title: courseName.trim(), slug: courseSlug.trim(), thumbnail_url: thumbnail.trim() || null, status, level: "Tùy chỉnh" }).select("id").single();
    if (error) { setMessage(`Không thể tạo: ${error.message}`); return; }
    setShowCreate(false); setCourseName(""); setCourseSlug(""); setThumbnail(""); setMessage("Đã tạo khóa học."); await loadCourses();
    if (data?.id) router.push(`/admin/courses/${data.id}`);
  }
  return <AdminShell active="/admin/courses">
    <AdminHeader eyebrow="LMS / KHÓA HỌC" title="Quản lý khóa học" description="Tạo module, bài học và kết nối video bên ngoài." action={<button className="button button-primary" onClick={() => setShowCreate(value => !value)}><Plus /> Tạo khóa học</button>} />
    {showCreate && <div className="inline-create course-create"><div><span>KHÓA HỌC MỚI</span><button onClick={() => setShowCreate(false)} aria-label="Đóng"><X /></button></div><input aria-label="Tên khóa học" placeholder="Tên khóa học" value={courseName} onChange={event => setCourseName(event.target.value)} /><input aria-label="Slug khóa học" placeholder="slug-khoa-hoc" value={courseSlug} onChange={event => setCourseSlug(event.target.value)} /><input aria-label="Thumbnail URL" placeholder="Thumbnail URL" value={thumbnail} onChange={event => setThumbnail(event.target.value)} /><select aria-label="Trạng thái" value={status} onChange={event => setStatus(event.target.value)}><option value="draft">Bản nháp</option><option value="published">Đã xuất bản</option></select><button className="button button-primary" onClick={createCourse}>Lưu khóa học</button></div>}
    {message && <p className="admin-form-message" role="status">{message}</p>}
    <section className="admin-card course-management-list">{allCourses.map(course => <article key={course.id}><div className="course-manage-icon"><BookOpen /></div><div className="course-manage-copy"><span>{course.code}</span><h2>{course.title}</h2><p><Video /> {course.lessons} bài học</p></div><StatusPill status={course.status === "Đã xuất bản" ? "Hoàn thành" : "Chờ thanh toán"} /><div className="card-actions"><Link className="admin-action-link" href={`/hoc-vien/khoa-hoc/${course.slug}`} target="_blank"><Eye /> Xem</Link><Link className="admin-action-link" href={`/admin/courses/${course.id}`}><Pencil /> Chỉnh sửa</Link></div></article>)}{allCourses.length === 0 && <p className="empty-state">Chưa có khóa học.</p>}</section>
  </AdminShell>;
}
