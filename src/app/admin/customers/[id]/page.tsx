import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, ShoppingBag } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AdminHeader, StatusPill } from "@/components/admin-ui";
import { customers, formatVnd, orders } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Admin · Chi tiết khách hàng" };

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = customers.find(item => item.id === id);
  if (!customer) notFound();
  const history = orders.filter(order => order.customerId === customer.id);
  return <AdminShell active="/admin/customers">
    <Link className="back-row" href="/admin/customers"><ArrowLeft /> Danh sách khách hàng</Link>
    <AdminHeader eyebrow="HỒ SƠ KHÁCH HÀNG" title={customer.name} description={`Tham gia từ ${customer.joined} · Nguồn ${customer.source}`} action={<button className="button button-primary">Chỉnh sửa hồ sơ</button>} />
    <section className="customer-detail-grid">
      <article className="admin-card profile-card"><div className="profile-avatar">{customer.name.split(" ").map(word => word[0]).slice(-2).join("")}</div><h2>{customer.name}</h2><span className="status-pill success">Đang hoạt động</span><div className="profile-contact"><p><Mail /> {customer.email}</p><p><Phone /> {customer.phone}</p></div><div className="profile-stats"><div><span>Tổng chi tiêu</span><b>{formatVnd(customer.spent)}</b></div><div><span>Sản phẩm</span><b>{customer.products}</b></div><div><span>Tiến độ học</span><b>{customer.progress}%</b></div></div></article>
      <article className="admin-card access-card"><div className="admin-card-head"><div><span>QUYỀN TRUY CẬP</span><h2>Sản phẩm đã mua</h2></div></div><div className="access-list"><div><ShoppingBag /><span><b>Landing Page bằng ChatGPT</b><small>Mở ngày 01/10/2026</small></span><StatusPill status="Hoàn thành" /></div><div><ShoppingBag /><span><b>Đóng gói chuyên môn</b><small>Mở ngày 01/10/2026</small></span><StatusPill status="Đang học" /></div></div><div className="learning-progress"><div><span>Tiến độ học tổng thể</span><b>{customer.progress}%</b></div><div className="progress-track"><span style={{ width: `${customer.progress}%` }} /></div></div></article>
    </section>
    <section className="admin-card"><div className="admin-card-head"><div><span>LỊCH SỬ</span><h2>Đơn hàng</h2></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Mã đơn</th><th>Sản phẩm</th><th>Giá trị</th><th>Trạng thái</th><th>Thời gian</th></tr></thead><tbody>{history.length ? history.map(order => <tr key={order.id}><td><b>{order.id}</b></td><td>{order.product}</td><td>{formatVnd(order.amount)}</td><td><StatusPill status={order.status} /></td><td>{order.createdAt}</td></tr>) : <tr><td colSpan={5}>Chưa có đơn hàng.</td></tr>}</tbody></table></div></section>
  </AdminShell>;
}
