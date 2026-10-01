import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader } from "@/components/admin-ui";
import { getAdminOrders } from "@/lib/admin-queries";
import { OrdersManager } from "./orders-manager";

export const metadata: Metadata = { title: "Admin · Đơn hàng" };

export default async function OrdersPage() {
  return <AdminShell active="/admin/orders"><AdminHeader eyebrow="BÁN HÀNG / ĐƠN HÀNG" title="Đơn hàng" description="Tìm kiếm, lọc, xuất CSV và cập nhật trạng thái thanh toán." /><OrdersManager initialOrders={await getAdminOrders()} /></AdminShell>;
}
