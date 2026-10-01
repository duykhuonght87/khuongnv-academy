import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Check, LockKeyhole, Play, Sparkles } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { roadmap } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Khu học viên" };

export default function StudentDashboardPage() {
  return <StudentShell>
    <header className="student-header"><div><span>KHƯƠNGNV ACADEMY / HỌC VIÊN</span><h1>Xin chào, Khương.</h1><p>Tiếp tục xây doanh nghiệp một người của bạn, từng level một.</p></div><Link className="button button-ghost" href="/hoc-vien/kich-hoat">Kích hoạt sản phẩm</Link></header>
    <section className="opc-overview">
      <div className="opc-copy"><span>LỘ TRÌNH OPC · 90 NGÀY</span><h2>Bạn đã đi được <em>37%</em> hành trình.</h2><div className="opc-progress"><div><i style={{ width: "37%" }} /></div><span>2 / 6 LEVEL</span></div><p>Hoàn thành Level 2 để mở khóa bài tập tạo sản phẩm số.</p></div>
      <div className="last-lesson"><span><Play /></span><div><small>BÀI HỌC GẦN NHẤT</small><h3>Đóng gói chuyên môn bằng ChatGPT</h3><p>Level 2 · Bài 05 · 18 phút</p><Link href="/hoc-vien/khoa-hoc/dong-goi-chuyen-mon">Tiếp tục học <ArrowUpRight /></Link></div></div>
    </section>
    <section className="student-section" id="roadmap"><div className="student-section-head"><div><span>01 / ROADMAP</span><h2>Lộ trình 6 Level</h2></div><p>Làm chủ ChatGPT → đóng gói → bán và tự động hóa.</p></div><div className="roadmap-grid">{roadmap.map(item => {
      const locked = item.status === "Chưa mở khóa";
      return <article className={`roadmap-card ${locked ? "locked" : ""}`} key={item.level}><div className="roadmap-art"><span>LEVEL {String(item.level).padStart(2, "0")}</span>{locked ? <LockKeyhole /> : item.progress === 100 ? <Check /> : <Sparkles />}<b>{item.title.split(" ").slice(0, 2).join(" ")}</b></div><div className="roadmap-body"><div><span>{item.lessons} bài học</span><b>{item.progress}%</b></div><h3>{item.title}</h3><p>{item.description}</p><div className="progress-track"><span style={{ width: `${item.progress}%` }} /></div>{locked ? <Link href="/#chuong-trinh">Xem sản phẩm <ArrowUpRight /></Link> : <Link href={`/hoc-vien/khoa-hoc/${item.slug}`}>{item.progress ? "Tiếp tục học" : "Bắt đầu học"} <ArrowUpRight /></Link>}</div></article>;
    })}</div></section>
    <section className="student-section student-resources" id="san-pham"><div className="student-section-head"><div><span>02 / QUYỀN TRUY CẬP</span><h2>Sản phẩm của tôi</h2></div></div><div className="resource-grid"><article><BookOpen /><div><h3>Landing Page bằng ChatGPT</h3><p>Đã mở khóa · Truy cập vĩnh viễn</p></div><Link href="/hoc-vien/khoa-hoc/landing-page-funnel">Mở khóa học</Link></article><article><BookOpen /><div><h3>Đóng gói chuyên môn</h3><p>Đã mở khóa · Đang học 50%</p></div><Link href="/hoc-vien/khoa-hoc/dong-goi-chuyen-mon">Học tiếp</Link></article></div></section>
  </StudentShell>;
}
