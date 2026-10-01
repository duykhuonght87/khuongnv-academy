import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Check, LockKeyhole, Play, Sparkles } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { getStudentDashboardData } from "@/lib/academy-queries";

export const metadata: Metadata = { title: "Khu học viên" };

export default async function StudentDashboardPage() {
  const data = await getStudentDashboardData();
  const fullName = data?.fullName ?? "Học viên";
  const firstName = fullName.split(" ").filter(Boolean).at(-1) ?? "bạn";
  const courses = data?.courses ?? [];
  const lastCourse = data?.lastLesson ? courses.find(course => course.slug === data.lastLesson?.courseSlug) : courses.find(course => course.unlocked && course.progress < 100);

  return <StudentShell fullName={fullName}>
    <header className="student-header"><div><span>KHƯƠNGNV ACADEMY / HỌC VIÊN</span><h1>Xin chào, {firstName}.</h1><p>Tiếp tục xây doanh nghiệp một người của bạn, từng level một.</p></div><Link className="button button-ghost" href="/hoc-vien/kich-hoat">Kích hoạt sản phẩm</Link></header>
    <section className="opc-overview">
      <div className="opc-copy"><span>LỘ TRÌNH OPC · 90 NGÀY</span><h2>Bạn đã đi được <em>{data?.overallProgress ?? 0}%</em> hành trình.</h2><div className="opc-progress"><div><i style={{ width: `${data?.overallProgress ?? 0}%` }} /></div><span>{data?.completedLevels ?? 0} / {courses.length || 6} LEVEL</span></div><p>Hoàn thành từng bài học để tiến độ được lưu tự động vào tài khoản.</p></div>
      <div className="last-lesson"><span><Play /></span><div><small>BÀI HỌC TIẾP THEO</small><h3>{lastCourse?.title ?? "Kích hoạt khóa học đầu tiên"}</h3><p>{lastCourse ? `${lastCourse.level} · ${lastCourse.progress}% hoàn thành` : "Chưa có khóa học được mở"}</p><Link href={lastCourse ? `/hoc-vien/khoa-hoc/${lastCourse.slug}` : "/hoc-vien/kich-hoat"}>{lastCourse ? "Tiếp tục học" : "Nhập mã kích hoạt"} <ArrowUpRight /></Link></div></div>
    </section>
    <section className="student-section" id="roadmap"><div className="student-section-head"><div><span>01 / ROADMAP</span><h2>Lộ trình 6 Level</h2></div><p>Làm chủ ChatGPT → đóng gói → bán và tự động hóa.</p></div><div className="roadmap-grid">{courses.map(course => {
      const locked = !course.unlocked;
      return <article className={`roadmap-card ${locked ? "locked" : ""}`} key={course.id}><div className="roadmap-art"><span>{course.level.toUpperCase()}</span>{locked ? <LockKeyhole /> : course.progress === 100 ? <Check /> : <Sparkles />}<b>{course.title.split(" ").slice(0, 2).join(" ")}</b></div><div className="roadmap-body"><div><span>{course.lessonCount} bài học</span><b>{course.progress}%</b></div><h3>{course.title}</h3><p>{course.description}</p><div className="progress-track"><span style={{ width: `${course.progress}%` }} /></div>{locked ? <Link href="/hoc-vien/kich-hoat">Kích hoạt sản phẩm <ArrowUpRight /></Link> : <Link href={`/hoc-vien/khoa-hoc/${course.slug}`}>{course.progress ? "Tiếp tục học" : "Bắt đầu học"} <ArrowUpRight /></Link>}</div></article>;
    })}</div>{courses.length === 0 && <div className="activation-result error"><div><b>Chưa tải được lộ trình.</b><span>Vui lòng thử lại hoặc liên hệ hỗ trợ.</span></div></div>}</section>
    <section className="student-section student-resources" id="san-pham"><div className="student-section-head"><div><span>02 / QUYỀN TRUY CẬP</span><h2>Sản phẩm của tôi</h2></div></div><div className="resource-grid">{data?.products.map(product => <article key={product.id}><BookOpen /><div><h3>{product.name}</h3><p>Đã mở khóa · {product.expiresAt ? `Hết hạn ${new Intl.DateTimeFormat("vi-VN").format(new Date(product.expiresAt))}` : "Truy cập không thời hạn"}</p></div><Link href="#roadmap">Xem khóa học</Link></article>)}{!data?.products.length && <article><BookOpen /><div><h3>Chưa có sản phẩm</h3><p>Nhập mã kích hoạt được gửi sau khi thanh toán.</p></div><Link href="/hoc-vien/kich-hoat">Kích hoạt</Link></article>}</div></section>
  </StudentShell>;
}
