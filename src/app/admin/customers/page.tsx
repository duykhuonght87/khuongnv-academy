import type { Metadata } from "next";
import Link from "next/link";
import { Download, Filter, Search } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, RowMenu } from "@/components/admin-ui";
import { customers, formatVnd } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Admin · Khách hàng" };

export default function CustomersPage() {
  return <AdminShell active="/admin/customers">
    <AdminHeader eyebrow="CRM / KHÁCH HÀNG" title="Khách hàng" description="Tập trung hồ sơ, nguồn khách, sản phẩm và giá trị vòng đời." action={<button className="button button-ghost"><Download /> Xuất dữ liệu</button>} />
    <div className="table-toolbar"><label><Search /><input placeholder="Tìm theo tên, email, điện thoại..." /></label><button><Filter /> Bộ lọc</button><select aria-label="Lọc theo nguồn"><option>Tất cả nguồn</option><option>YouTube</option><option>Facebook</option><option>TikTok</option></select></div>
    <section className="admin-card"><div className="admin-table-wrap"><table className="admin-table customers-table"><thead><tr><th>Khách hàng</th><th>Điện thoại</th><th>Ngày đăng ký</th><th>Nguồn</th><th>Sản phẩm</th><th>Tổng chi tiêu</th><th>Hoạt động cuối</th><th /></tr></thead><tbody>{customers.map(customer => <tr key={customer.id}><td><Link className="customer-cell" href={`/admin/customers/${customer.id}`}><span>{customer.name.split(" ").map(word => word[0]).slice(-2).join("")}</span><div><b>{customer.name}</b><small>{customer.email}</small></div></Link></td><td>{customer.phone}</td><td>{customer.joined}</td><td><span className="source-chip">{customer.source}</span></td><td>{customer.products}</td><td><b>{formatVnd(customer.spent)}</b></td><td>{customer.lastActive}</td><td><RowMenu /></td></tr>)}</tbody></table></div><div className="table-footer"><span>Hiển thị 5 / 18 khách hàng</span><div><button disabled>Trước</button><button className="active">1</button><button>2</button><button>Sau</button></div></div></section>
  </AdminShell>;
}
