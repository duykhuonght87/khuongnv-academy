"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader } from "@/components/admin-ui";
import { createClient } from "@/lib/supabase/client";

type Course = { id: string; slug: string; code: string; title: string; description: string; level: string; status: string; thumbnail_url: string | null; product_id: string | null };
type Module = { id: string; title: string; description: string; position: number };
type Lesson = { id: string; module_id: string | null; slug: string; title: string; content: string; video_url: string | null; download_url: string | null; duration_minutes: number; position: number; is_preview: boolean; status: string };

export function CourseEditor({ initialCourse, initialModules, initialLessons }: { initialCourse: Course; initialModules: Module[]; initialLessons: Lesson[] }) {
  const [course, setCourse] = useState(initialCourse);
  const [modules, setModules] = useState(initialModules);
  const [lessons, setLessons] = useState(initialLessons);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  async function saveCourse() {
    if (!supabase) return setMessage("Chưa kết nối Supabase.");
    const { error } = await supabase.from("courses").update({ slug: course.slug, title: course.title, description: course.description, level: course.level, status: course.status, thumbnail_url: course.thumbnail_url || null, updated_at: new Date().toISOString() }).eq("id", course.id);
    setMessage(error ? `Không thể lưu: ${error.message}` : "Đã lưu thông tin khóa học.");
  }
  async function addModule() {
    if (!supabase) return;
    const { data, error } = await supabase.from("course_modules").insert({ course_id: course.id, title: `Module ${modules.length + 1}`, position: modules.length + 1 }).select("id,title,description,position").single();
    if (error) return setMessage(`Không thể tạo module: ${error.message}`);
    setModules(current => [...current, data]);
  }
  async function updateModule(item: Module) {
    if (!supabase) return;
    const { error } = await supabase.from("course_modules").update({ title: item.title, description: item.description, updated_at: new Date().toISOString() }).eq("id", item.id);
    setMessage(error ? `Không thể lưu module: ${error.message}` : "Đã lưu module.");
  }
  async function addLesson(moduleId: string) {
    if (!supabase) return;
    const position = lessons.filter(item => item.module_id === moduleId).length + 1;
    const { data, error } = await supabase.from("lessons").insert({ course_id: course.id, module_id: moduleId, slug: `${course.slug}-bai-${position}`, title: "Bài học mới", position, status: "draft" }).select("id,module_id,slug,title,content,video_url,download_url,duration_minutes,position,is_preview,status").single();
    if (error) return setMessage(`Không thể tạo bài học: ${error.message}`);
    setLessons(current => [...current, data]);
  }
  async function saveLesson(item: Lesson) {
    if (!supabase) return;
    const { error } = await supabase.from("lessons").update({ slug: item.slug, title: item.title, content: item.content, video_url: item.video_url || null, download_url: item.download_url || null, duration_minutes: item.duration_minutes, is_preview: item.is_preview, status: item.status, updated_at: new Date().toISOString() }).eq("id", item.id);
    setMessage(error ? `Không thể lưu bài học: ${error.message}` : "Đã lưu bài học.");
  }
  async function removeLesson(item: Lesson) {
    if (!supabase || !window.confirm(`Xóa bài học “${item.title}”?`)) return;
    const { error } = await supabase.from("lessons").delete().eq("id", item.id);
    if (error) return setMessage(`Không thể xóa: ${error.message}`);
    setLessons(current => current.filter(lesson => lesson.id !== item.id));
  }

  return <AdminShell active="/admin/courses"><AdminHeader eyebrow="LMS / BIÊN TẬP" title={course.title} description="Chỉnh sửa thông tin, module, video và tài liệu bài học." action={<button className="button button-primary" onClick={saveCourse}><Save /> Lưu khóa học</button>} />
    {message && <p className="admin-form-message" role="status">{message}</p>}
    <section className="admin-card course-editor-form"><label>Tên khóa học<input value={course.title} onChange={event => setCourse({ ...course, title: event.target.value })} /></label><label>Slug<input value={course.slug} onChange={event => setCourse({ ...course, slug: event.target.value })} /></label><label>Cấp độ<input value={course.level} onChange={event => setCourse({ ...course, level: event.target.value })} /></label><label>Trạng thái<select value={course.status} onChange={event => setCourse({ ...course, status: event.target.value })}><option value="draft">Bản nháp</option><option value="published">Đã xuất bản</option></select></label><label className="wide">Mô tả<textarea rows={4} value={course.description} onChange={event => setCourse({ ...course, description: event.target.value })} /></label><label className="wide">Thumbnail URL<input value={course.thumbnail_url ?? ""} onChange={event => setCourse({ ...course, thumbnail_url: event.target.value })} /></label></section>
    <div className="course-editor-heading"><h2>Module và bài học</h2><button className="button button-ghost" onClick={addModule}><Plus /> Thêm module</button></div>
    <section className="course-modules-editor">{modules.map(module => <article className="admin-card module-editor" key={module.id}><div className="module-editor-head"><input aria-label="Tên module" value={module.title} onChange={event => setModules(current => current.map(item => item.id === module.id ? { ...item, title: event.target.value } : item))} /><button onClick={() => updateModule(module)}><Save /> Lưu module</button><button onClick={() => addLesson(module.id)}><Plus /> Thêm bài</button></div><textarea aria-label="Mô tả module" rows={2} value={module.description} onChange={event => setModules(current => current.map(item => item.id === module.id ? { ...item, description: event.target.value } : item))} />
      <div className="lesson-editor-list">{lessons.filter(item => item.module_id === module.id).map(lesson => <div className="lesson-editor" key={lesson.id}><div className="lesson-editor-grid"><label>Tiêu đề<input value={lesson.title} onChange={event => setLessons(current => current.map(item => item.id === lesson.id ? { ...item, title: event.target.value } : item))} /></label><label>Slug<input value={lesson.slug} onChange={event => setLessons(current => current.map(item => item.id === lesson.id ? { ...item, slug: event.target.value } : item))} /></label><label>Video URL<input value={lesson.video_url ?? ""} onChange={event => setLessons(current => current.map(item => item.id === lesson.id ? { ...item, video_url: event.target.value } : item))} /></label><label>Tài liệu URL<input value={lesson.download_url ?? ""} onChange={event => setLessons(current => current.map(item => item.id === lesson.id ? { ...item, download_url: event.target.value } : item))} /></label><label>Thời lượng (phút)<input type="number" min="0" value={lesson.duration_minutes} onChange={event => setLessons(current => current.map(item => item.id === lesson.id ? { ...item, duration_minutes: Number(event.target.value) } : item))} /></label><label>Trạng thái<select value={lesson.status} onChange={event => setLessons(current => current.map(item => item.id === lesson.id ? { ...item, status: event.target.value } : item))}><option value="draft">Bản nháp</option><option value="published">Đã xuất bản</option></select></label><label className="checkbox-label"><input type="checkbox" checked={lesson.is_preview} onChange={event => setLessons(current => current.map(item => item.id === lesson.id ? { ...item, is_preview: event.target.checked } : item))} /> Cho phép xem thử</label><label className="wide">Nội dung<textarea rows={4} value={lesson.content} onChange={event => setLessons(current => current.map(item => item.id === lesson.id ? { ...item, content: event.target.value } : item))} /></label></div><div className="lesson-editor-actions"><button onClick={() => saveLesson(lesson)}><Save /> Lưu bài học</button><button className="danger" onClick={() => removeLesson(lesson)}><Trash2 /> Xóa</button></div></div>)}</div>
    </article>)}</section>
  </AdminShell>;
}
