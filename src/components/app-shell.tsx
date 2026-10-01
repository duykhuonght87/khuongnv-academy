"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Gauge, LogOut, Settings } from "lucide-react";
import { Brand } from "./brand";

export function AppShell({ children, active = "dashboard" }: { children: React.ReactNode; active?: string }) {
  const router = useRouter();
  async function signOut() {
    const { createClient } = await import("@/lib/supabase/client");
    await createClient()?.auth.signOut();
    router.replace("/login");
    router.refresh();
  }
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
          <button type="button" onClick={signOut}><LogOut /> Đăng xuất</button>
        </div>
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
