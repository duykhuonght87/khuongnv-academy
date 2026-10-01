import Link from "next/link";
import { BookOpen, Gauge, LogOut, Settings } from "lucide-react";
import { Brand } from "./brand";

export function AppShell({ children, active = "dashboard" }: { children: React.ReactNode; active?: string }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Brand />
        <nav aria-label="Điều hướng học viên">
          <Link className={active === "dashboard" ? "active" : ""} href="/dashboard"><Gauge /> Tổng quan</Link>
          <Link className={active === "courses" ? "active" : ""} href="/dashboard#khoa-hoc"><BookOpen /> Khóa học</Link>
        </nav>
        <div className="sidebar-bottom">
          <Link href="/dashboard"><Settings /> Tài khoản</Link>
          <Link href="/login"><LogOut /> Đăng xuất</Link>
        </div>
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
