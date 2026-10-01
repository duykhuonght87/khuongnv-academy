"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, BookOpen, Boxes, CircleDollarSign, GraduationCap, KeyRound, LayoutDashboard, LogOut, ReceiptText, Settings, Users } from "lucide-react";
import { Brand } from "./brand";
import { createClient } from "@/lib/supabase/client";

const nav = [
  ["Tổng quan", "/admin", LayoutDashboard],
  ["Khách hàng", "/admin/customers", Users],
  ["Học viên", "/admin/students", GraduationCap],
  ["Đơn hàng", "/admin/orders", ReceiptText],
  ["Doanh thu", "/admin/revenue", CircleDollarSign],
  ["Sản phẩm", "/admin/products", Boxes],
  ["Khóa học", "/admin/courses", BookOpen],
  ["Mã kích hoạt", "/admin/activation-codes", KeyRound],
  ["Cài đặt", "/admin/settings", Settings],
] as const;

export function AdminShell({ children, active = "/admin" }: { children: React.ReactNode; active?: string }) {
  const router = useRouter();
  async function signOut() {
    await createClient()?.auth.signOut();
    router.replace("/login");
    router.refresh();
  }
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Brand />
        <div className="admin-badge"><BarChart3 /><div><b>ADMIN CENTER</b><span>Điều hành hệ thống</span></div></div>
        <nav aria-label="Điều hướng quản trị">
          {nav.map(([label, href, Icon]) => <Link className={active === href ? "active" : ""} href={href} key={href}><Icon /> {label}</Link>)}
        </nav>
        <div className="admin-user"><span>KN</span><div><b>Nguyễn Văn Khương</b><small>Administrator</small></div><button type="button" aria-label="Đăng xuất quản trị" onClick={signOut}><LogOut /></button></div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
