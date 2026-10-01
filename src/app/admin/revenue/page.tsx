import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader } from "@/components/admin-ui";
import { getAdminOrders } from "@/lib/admin-queries";
import { RevenueDashboard } from "./revenue-dashboard";

export const metadata: Metadata = { title: "Admin · Doanh thu" };

export default async function RevenuePage() {
  return <AdminShell active="/admin/revenue"><AdminHeader eyebrow="TÀI CHÍNH / DOANH THU" title="Doanh thu" description="Phân tích dòng tiền theo thời gian và tải báo cáo CSV." /><RevenueDashboard orders={await getAdminOrders()} /></AdminShell>;
}
