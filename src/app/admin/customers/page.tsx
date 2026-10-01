import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader } from "@/components/admin-ui";
import { getAdminCustomers } from "@/lib/academy-queries";
import { CustomersTable } from "./customers-table";

export const metadata: Metadata = { title: "Admin · Khách hàng" };

export default async function CustomersPage() {
  const customers = await getAdminCustomers();
  return <AdminShell active="/admin/customers"><AdminHeader eyebrow="CRM / KHÁCH HÀNG" title="Khách hàng" description="Dữ liệu hồ sơ, nguồn khách, sản phẩm và giá trị vòng đời từ Supabase." /><CustomersTable initialCustomers={customers} /></AdminShell>;
}
