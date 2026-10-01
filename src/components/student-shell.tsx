"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, CircleHelp, FileText, Gauge, KeyRound, LogOut, Map, Menu, Package, Settings, Users, X } from "lucide-react";
import { Brand } from "./brand";

const nav = [
  ["Dashboard", "/hoc-vien", Gauge], ["Khóa học", "/hoc-vien#roadmap", BookOpen], ["Lộ trình OPC", "/hoc-vien#roadmap", Map], ["Sản phẩm của tôi", "/hoc-vien#san-pham", Package], ["Tài liệu", "/hoc-vien#tai-lieu", FileText], ["Cộng đồng", "/hoc-vien#cong-dong", Users], ["Kích hoạt", "/hoc-vien/kich-hoat", KeyRound], ["Hỗ trợ", "/hoc-vien#ho-tro", CircleHelp], ["Tài khoản", "/hoc-vien#tai-khoan", Settings],
] as const;

export function StudentShell({ children, active = "/hoc-vien" }: { children: React.ReactNode; active?: string }) {
  const [open, setOpen] = useState(false);
  return <div className="student-layout">
    <header className="student-mobile-header"><Brand /><button onClick={() => setOpen(true)} aria-label="Mở menu"><Menu /></button></header>
    <aside className={`student-sidebar ${open ? "open" : ""}`}>
      <div className="student-sidebar-top"><Brand /><button onClick={() => setOpen(false)} aria-label="Đóng menu"><X /></button></div>
      <div className="student-profile"><span>NK</span><div><b>Nguyễn Văn Khương</b><small>Học viên</small></div></div>
      <nav aria-label="Điều hướng học viên">{nav.map(([label, href, Icon]) => <Link className={active === href ? "active" : ""} href={href} key={`${label}-${href}`} onClick={() => setOpen(false)}><Icon /> {label}</Link>)}</nav>
      <Link className="student-logout" href="/login"><LogOut /> Đăng xuất</Link>
    </aside>
    <main className="student-main">{children}</main>
  </div>;
}
